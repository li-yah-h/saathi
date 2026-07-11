import {createClient as cc} from '@supabase/supabase-js'
const u=process.env.NEXT_PUBLIC_SUPABASE_URL as string
const k=process.env.SUPABASE_SERVICE_ROLE_KEY as string
export function supaserver()
{
  return cc(u,k,{auth:{persistSession:false}})
}