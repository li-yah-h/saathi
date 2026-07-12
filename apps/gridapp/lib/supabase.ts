import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// Single browser-side client, shared across the app. RLS on `events` requires
// an authenticated `user` role session — see supabase/migrations/0001_init.sql.
export const supabaseBrowser = createClient(url, anonKey);
