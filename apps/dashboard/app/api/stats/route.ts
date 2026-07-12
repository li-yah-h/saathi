import {NextRequest,NextResponse} from 'next/server'
import {getstat} from '../../../lib/aggreg'
import {requireAdmin} from '../../../lib/requireAdmin'
const UUID_RE=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
export async function GET(r:NextRequest)
{
  const auth=await requireAdmin()
  if(!auth.authorized)
  {
    return NextResponse.json({error:auth.message},{status:auth.status})
  }
  try
  {
    const userId=r.nextUrl.searchParams.get('userId')
    if(!userId||!UUID_RE.test(userId))
    {
      return NextResponse.json({error:'A valid userId is required.'},{status:400})
    }
    const stats=await getstat(userId)
    return NextResponse.json({stats})
  }
  catch(e)
  {
    console.error('Failed to fetch stats:',e)
    return NextResponse.json({error:'Unable to fetch stats at the moment.'},{status:500})
  }
}
