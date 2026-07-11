import {NextRequest,NextResponse} from 'next/server'
import {getstat as gs} from '../../../lib/aggreg'
export async function GET(r:NextRequest)
{
  try
  {
    const u=r.nextUrl.searchParams.get('userId')
    if(!u)
      return NextResponse.json({error:'userId is required.'},{status:400})
    const s=await gs(u)
    return NextResponse.json({stats:s})
  }
  catch(e)
  {
    console.error('Failed to fetch stats:',e)
    return NextResponse.json({error:'Unable to fetch stats at the moment.'},{status:500})
  }
}