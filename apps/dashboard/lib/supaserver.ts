import {createClient} from '@supabase/supabase-js'
const url=process.env.NEXT_PUBLIC_SUPABASE_URL as string
const serviceRoleKey=process.env.SUPABASE_SERVICE_ROLE_KEY as string
export function supaserver()
{
  return createClient(url,serviceRoleKey,{auth:{persistSession:false}})
}