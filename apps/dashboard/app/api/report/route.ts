import {NextRequest,NextResponse} from 'next/server'
import {getstat} from '../../../lib/aggreg'
import {genreport} from '../../../lib/gemini'
import {requireAdmin} from '../../../lib/requireAdmin'
const UUID_RE=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
export async function POST(r:NextRequest)
{
  const auth=await requireAdmin()
  if(!auth.authorized)
  {
    return NextResponse.json({error:auth.message},{status:auth.status})
  }
  try
  {
    const {userId,childName}=await r.json()
    if(!userId||!UUID_RE.test(userId)||!childName)
    {
      return NextResponse.json({error:'A valid userId and childName are required.'},{status:400})
    }
    const stats=await getstat(userId)
    const summary=await genreport(childName,stats)
    return NextResponse.json({stats,summary})
  }
  catch(e)
  {
    console.error('Failed to generate report:',e)
    return NextResponse.json({error:'Unable to generate report at the moment.'},{status:500})
  }
}
