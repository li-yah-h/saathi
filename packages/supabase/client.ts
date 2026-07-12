import {createBrowserClient as bc} from '@supabase/ssr'
let c:ReturnType<typeof bc>|undefined
export function createClient()
{
  if(c)
    return c
  c=bc(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  return c
}