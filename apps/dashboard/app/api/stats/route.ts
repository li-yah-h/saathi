import {NextRequest,NextResponse} from 'next/server'
import {getstat} from '../../../lib/aggreg'
export async function GET(r:NextRequest)
{
  try
  {
    const userId=r.nextUrl.searchParams.get('userId')
    if(!userId)
      return NextResponse.json({error:'userId is required.'},{status:400})
    const stats=await getstat(userId)
    return NextResponse.json({stats})
  }
  catch(e)
  {
    console.error('Failed to fetch stats:',e)
    return NextResponse.json({error:'Unable to fetch stats at the moment.'},{status:500})
  }
}