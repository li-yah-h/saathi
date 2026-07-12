import {supaserver} from './supaserver'
import {stat,latency,vocab} from './types'
export async function getstat(userId:string):Promise<stat>
{
  const database=supaserver()
  const {data,error}=await database
    .from('events')
    .select('tile_id, latency_ms, created_at')
    .eq('user_id',userId)
    .order('created_at',{ascending:true})
  if(error)
    throw error
  const records=data||[]
  const totalEvents=records.length
  const averageLatency=totalEvents===0?0:Math.round(records.reduce((sum,record)=>sum+(record.latency_ms||0),0)/totalEvents)
  const uniqueTilesUsed=new Set(records.map(record=>record.tile_id)).size
  const dailyData:Record<string,{
    latencySum:number
    count:number
    tiles:Set<string>
  }>={}
  for(const record of records)
  {
    const date=record.created_at.slice(0,10)
    if(!dailyData[date])
      dailyData[date]={latencySum:0,count:0,tiles:new Set()}
    dailyData[date].latencySum+=record.latency_ms||0
    dailyData[date].count++
    dailyData[date].tiles.add(record.tile_id)
  }
  const latencyTrend:latency[]=Object.entries(dailyData).map(([date,value])=>({date,avg_latency_ms:Math.round(value.latencySum/value.count)}))
  const vocabTrend:vocab[]=Object.entries(dailyData).map(([date,value])=>({date,unique_tiles:value.tiles.size}))
  return 
  {
    totalEvents,
    avgLatencyMs:averageLatency,
    uniqueTilesUsed,
    latencyTrend,
    vocabTrend
  }
}