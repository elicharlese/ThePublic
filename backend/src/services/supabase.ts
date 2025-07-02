import { createClient } from '@supabase/supabase-js';
import { logger } from '@/utils/logger';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Test connection
export const testSupabaseConnection = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.from('users').select('count').limit(1);
    
    if (error) {
      logger.error('Supabase connection test failed', { error: error.message });
      return false;
    }
    
    logger.info('Supabase connection successful');
    return true;
  } catch (error) {
    logger.error('Supabase connection test failed', { error: (error as Error).message });
    return false;
  }
};
