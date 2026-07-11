import {NextRequest,NextResponse} from 'next/server'
import {getstat as gs} from '../../../lib/aggreg'
import {genreport as gr} from '../../../lib/gemini'
export async function POST(r:NextRequest)
{
  try
  {
    const {userId:u,childName:n}=await r.json()
    if(!u||!n)
      return NextResponse.json({error:'Both userId and childName are required.'},{status:400})
    const s=await gs(u)
    const m=await gr(n,s)
    return NextResponse.json({stats:s,summary:m})
  }
  catch(e)
  {
    console.error('Failed to generate report:',e)
    return NextResponse.json({error:'Unable to generate report at the moment.'},{status:500})
  }
}