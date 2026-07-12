export interface profile
{
  id:string
  role:'user'|'admin'
  name:string
}
export interface tile
{
  id:string
  label:string
  image_url:string
  is_dynamic_slot:boolean
}
export interface event
{
  id:string
  tile_id:string
  user_id:string
  latency_ms:number
  source:string
  created_at:string
}
export interface latency
{
  date:string
  avg_latency_ms:number
}
export interface vocab
{
  date:string
  unique_tiles:number
}
export interface stat
{
  totalEvents:number
  avgLatencyMs:number
  uniqueTilesUsed:number
  latencyTrend:latency[]
  vocabTrend:vocab[]
}