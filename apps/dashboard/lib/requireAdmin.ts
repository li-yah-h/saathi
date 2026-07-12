import {getServerSupabase} from './supabaseServer'
import {supaserver} from './supaserver'
type AuthResult=
  |{authorized:true;userId:string}
  |{authorized:false;status:number;message:string}
export async function requireAdmin():Promise<AuthResult>
{
  const supabase=getServerSupabase()
  const {data:{user},error:authError}=await supabase.auth.getUser()
  if(authError||!user)
    return {authorized:false,status:401,message:'You must be logged in.'}
  const admin=supaserver()
  const {data:profile,error:profileError}=await admin
    .from('profiles')
    .select('role')
    .eq('id',user.id)
    .single()
  if(profileError||profile?.role!=='admin')
    return {authorized:false,status:403,message:'You are not authorized to view this data.'}
  return {authorized:true,userId:user.id}
}
