-- Row Level Security policies for ThePublic

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE network_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can read all users" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can register" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Nodes table policies
CREATE POLICY "Anyone can read active nodes" ON nodes
  FOR SELECT USING (status = 'active');

CREATE POLICY "Owners can read their nodes" ON nodes
  FOR SELECT USING (owner_id = auth.uid());

CREATE POLICY "Owners can manage their nodes" ON nodes
  FOR ALL USING (owner_id = auth.uid());

CREATE POLICY "Admins can manage all nodes" ON nodes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Rewards table policies
CREATE POLICY "Users can read own rewards" ON rewards
  FOR SELECT USING (owner_id = auth.uid());

CREATE POLICY "Admins can read all rewards" ON rewards
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "System can create rewards" ON rewards
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Network stats policies
CREATE POLICY "Anyone can read network stats" ON network_stats
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage network stats" ON network_stats
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Blog posts policies
CREATE POLICY "Anyone can read published posts" ON blog_posts
  FOR SELECT USING (published = true);

CREATE POLICY "Authors can read own posts" ON blog_posts
  FOR SELECT USING (author_id = auth.uid());

CREATE POLICY "Authors can manage own posts" ON blog_posts
  FOR ALL USING (author_id = auth.uid());

CREATE POLICY "Admins can manage all posts" ON blog_posts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Transactions table policies
CREATE POLICY "Users can read own transactions" ON transactions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create transactions" ON transactions
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can read all transactions" ON transactions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
