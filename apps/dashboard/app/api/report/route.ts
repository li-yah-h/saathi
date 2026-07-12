import {NextRequest,NextResponse} from 'next/server'
import {getstat} from '../../../lib/aggreg'
import {genreport} from '../../../lib/gemini'
export async function POST(r:NextRequest)
{
  try
  {
    const {userId,childName}=await r.json()
    if(!userId||!childName)
      return NextResponse.json({error:'Both userId and childName are required.'},{status:400})
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