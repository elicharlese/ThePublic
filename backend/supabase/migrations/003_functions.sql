-- Database functions for ThePublic

-- Calculate node performance metrics
CREATE OR REPLACE FUNCTION calculate_node_performance(
  node_uuid UUID,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE
)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  WITH performance_data AS (
    SELECT 
      COUNT(*) as total_periods,
      AVG((performance_metrics->>'uptime_percentage')::numeric) as avg_uptime,
      SUM((performance_metrics->>'data_transferred')::bigint) as total_data,
      AVG((performance_metrics->>'response_time')::numeric) as avg_response_time,
      AVG((performance_metrics->>'users_served')::numeric) as avg_users
    FROM nodes 
    WHERE id = node_uuid
      AND updated_at BETWEEN start_date AND end_date
  )
  SELECT jsonb_build_object(
    'avg_uptime', COALESCE(avg_uptime, 0),
    'total_data_gb', COALESCE(total_data / 1073741824, 0),
    'avg_response_time_ms', COALESCE(avg_response_time, 0),
    'avg_users_served', COALESCE(avg_users, 0),
    'total_periods', COALESCE(total_periods, 0)
  ) INTO result
  FROM performance_data;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Calculate rewards for a node
CREATE OR REPLACE FUNCTION calculate_node_rewards(
  node_uuid UUID,
  period_start TIMESTAMP WITH TIME ZONE,
  period_end TIMESTAMP WITH TIME ZONE
)
RETURNS DECIMAL(20, 8) AS $$
DECLARE
  base_reward DECIMAL(20, 8) := 100;
  performance JSONB;
  total_reward DECIMAL(20, 8) := 0;
  uptime NUMERIC;
  data_gb NUMERIC;
  users_served NUMERIC;
BEGIN
  -- Get node performance for the period
  SELECT calculate_node_performance(node_uuid, period_start, period_end) INTO performance;
  
  -- Extract metrics
  uptime := (performance->>'avg_uptime')::numeric;
  data_gb := (performance->>'total_data_gb')::numeric;
  users_served := (performance->>'avg_users_served')::numeric;
  
  -- Base reward based on uptime
  total_reward := base_reward * uptime / 100;
  
  -- Data transfer bonus (1 token per GB)
  total_reward := total_reward + data_gb;
  
  -- User service bonus (10 tokens per user served)
  total_reward := total_reward + (users_served * 10);
  
  -- Reliability bonus for >95% uptime
  IF uptime > 95 THEN
    total_reward := total_reward + 50;
  END IF;
  
  -- Coverage bonus for new areas (to be implemented)
  -- total_reward := total_reward + coverage_bonus;
  
  RETURN GREATEST(total_reward, 0);
END;
$$ LANGUAGE plpgsql;

-- Get network statistics
CREATE OR REPLACE FUNCTION get_current_network_stats()
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  WITH stats AS (
    SELECT 
      COUNT(*) as total_nodes,
      COUNT(*) FILTER (WHERE status = 'active') as active_nodes,
      COUNT(DISTINCT owner_id) as total_operators,
      AVG((performance_metrics->>'uptime_percentage')::numeric) as avg_uptime,
      SUM((performance_metrics->>'data_transferred')::bigint) as total_data
    FROM nodes
  ),
  user_stats AS (
    SELECT COUNT(*) as total_users
    FROM users
  ),
  reward_stats AS (
    SELECT 
      COUNT(*) as total_rewards,
      SUM(amount) as total_distributed
    FROM rewards
    WHERE status = 'distributed'
  )
  SELECT jsonb_build_object(
    'total_nodes', COALESCE(s.total_nodes, 0),
    'active_nodes', COALESCE(s.active_nodes, 0),
    'total_operators', COALESCE(s.total_operators, 0),
    'total_users', COALESCE(u.total_users, 0),
    'avg_uptime', COALESCE(s.avg_uptime, 0),
    'total_data_gb', COALESCE(s.total_data / 1073741824, 0),
    'total_rewards', COALESCE(r.total_rewards, 0),
    'total_distributed', COALESCE(r.total_distributed, 0),
    'timestamp', NOW()
  ) INTO result
  FROM stats s, user_stats u, reward_stats r;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Auto-publish scheduled blog posts
CREATE OR REPLACE FUNCTION auto_publish_scheduled_posts()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.published_at IS NOT NULL AND NEW.published_at <= NOW() AND OLD.published = false THEN
    NEW.published = true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-publishing
CREATE TRIGGER auto_publish_posts
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION auto_publish_scheduled_posts();

-- Create materialized view for node performance summary
CREATE MATERIALIZED VIEW node_performance_summary AS
SELECT 
  n.id,
  n.name,
  n.node_id,
  n.status,
  n.location->>'city' as city,
  n.location->>'country' as country,
  n.owner_id,
  u.email as owner_email,
  COUNT(r.id) as total_rewards,
  SUM(r.amount) as total_earned,
  AVG((n.performance_metrics->>'uptime_percentage')::numeric) as avg_uptime,
  n.created_at,
  n.last_heartbeat
FROM nodes n
LEFT JOIN rewards r ON n.id = r.node_id AND r.status = 'distributed'
LEFT JOIN users u ON n.owner_id = u.id
GROUP BY n.id, n.name, n.node_id, n.status, n.location, n.owner_id, u.email, n.created_at, n.last_heartbeat;

-- Create index on materialized view
CREATE INDEX idx_node_performance_summary_status ON node_performance_summary(status);
CREATE INDEX idx_node_performance_summary_owner ON node_performance_summary(owner_id);

-- Function to refresh materialized view
CREATE OR REPLACE FUNCTION refresh_node_performance_summary()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY node_performance_summary;
END;
$$ LANGUAGE plpgsql;
