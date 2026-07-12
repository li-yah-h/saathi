import {createClient as sc} from '@supabase/supabase-js'
import {createServerClient as cc} from '@supabase/ssr'
import {cookies} from 'next/headers'
export function createServiceRoleClient()
{
  if(!process.env.SUPABASE_SERVICE_ROLE_KEY)
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is missing. Set it in .env.local (server-only, never NEXT_PUBLIC_).')
  return sc
    (process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth:
      {
        autoRefreshToken:false,
        persistSession:false
      }
    }
  )
}
export async function createServerComponentClient()
{
  const cs=await cookies()
  return cc(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies:
      {
        getAll()
        {
          return cs.getAll()
        },
        setAll(c)
        {
          try
          {
            c.forEach(({name,value,options})=>cs.set(name,value,options))
          }
          catch{}
        }
      }
    }
  )
}