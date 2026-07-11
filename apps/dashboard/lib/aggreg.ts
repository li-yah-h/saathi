import {supaserver as ss} from './supaserver'
import {stat,latency,vocab} from './types'
export async function getstat(u:string):Promise<stat>
{
  const db=ss()
  const {data:d,error:e}=await db
    .from('events')
    .select('tile_id, latency_ms, created_at')
    .eq('user_id',u)
    .order('created_at',{ascending:true})
  if(e)
    throw e
  const r=d||[]
  const t=r.length
  const a=t===0?0:Math.round(r.reduce((s,x)=>s+(x.latency_ms||0),0)/t)
  const ut=new Set(r.map(x=>x.tile_id)).size
  const bd:Record<string,{
    latencySum:number
    count:number
    tiles:Set<string>
  }>={}
  for(const x of r)
  {
    const d=x.created_at.slice(0,10)
    if(!bd[d])
      bd[d]={latencySum:0,count:0,tiles:new Set()}
    bd[d].latencySum+=x.latency_ms||0
    bd[d].count++
    bd[d].tiles.add(x.tile_id)
  }
  const lt:latency[]=Object.entries(bd).map(([d,v])=>({date:d,avg_latency_ms:Math.round(v.latencySum/v.count)}))
  const vt:vocab[]=Object.entries(bd).map(([d,v])=>({date:d,unique_tiles:v.tiles.size}))
  return
  {
    totalEvents:t,
    avgLatencyMs:a,
    uniqueTilesUsed:ut,
    latencyTrend:lt,
    vocabTrend:vt
  }
}