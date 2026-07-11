import {NextRequest,NextResponse} from 'next/server'
import {getstat} from '../../../lib/aggreg'
import {genreport} from '../../../lib/gemini'
import {renderreport} from '../../../lib/pdf'
export async function GET(r:NextRequest)
{
  try
  {
    const u=r.nextUrl.searchParams.get('userId')
    const n=r.nextUrl.searchParams.get('childName')
    if(!u||!n)
    {
      return NextResponse.json({error:'Both userId and childName are required.'},{status:400})
    }
    const s=await getstat(u)
    const m=await genreport(n,s)
    const p=await renderreport(n,m,s)
    return new NextResponse(p,{headers:{'Content-Type':'application/pdf','Content-Disposition':`attachment; filename="${n}-report.pdf"`}})
  }
  catch(e)
  {
    console.error('Failed to generate report:',e)
    return NextResponse.json({error:'Unable to generate report at the moment.'},{status:500})
  }
}