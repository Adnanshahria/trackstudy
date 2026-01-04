
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tnjnbdxoxvtsdgqbqawd.supabase.co';
const supabaseKey = 'sb_publishable_tnZ6d1wS1WmK4rTGIZ9Q7Q_uWMrJbXz';

export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        persistSession: true,
        storage: window.localStorage,
        autoRefreshToken: true,
        detectSessionInUrl: true
    }
});
