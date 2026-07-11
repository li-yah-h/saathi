import {createClient as cc} from '@supabase/supabase-js'
const u=process.env.NEXT_PUBLIC_SUPABASE_URL as string
const k=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
export const supabaseBrowser=cc(u,k)
