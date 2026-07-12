export type UserRole='user'|'admin'
export interface Profile
{
  id:string
  role:UserRole
  name:string
  created_at:string
}
export interface Tile
{
  id:string
  label:string
  image_url:string|null
  audio_url:string|null
  is_dynamic_slot:boolean
  is_locked:boolean
  position:number|null
  embedding:number[]|null
  created_by:string|null
  created_at:string
}
export interface AACEvent
{
  id:string
  tile_id:string
  user_id:string
  latency_ms:number
  source:'static'|'dynamic'
  created_at:string
}
export interface Report
{
  id:string
  user_id:string
  generated_by:string
  summary:string
  period_start:string
  period_end:string
  created_at:string
}
export interface EventInsertPayload
{
  eventType:'INSERT'
  new:AACEvent
  schema:'public'
  table:'events'
}
export interface VocabExpansionPoint
{
  date:string
  unique_tiles_used:number
}
export interface LatencyPoint
{
  date:string
  avg_latency_ms:number
}
export interface EmbedTextResult
{
  embedding:number[]
}
export interface GenerateReportSummaryInput
{
  userName:string
  periodStart:string
  periodEnd:string
  vocabExpansion:VocabExpansionPoint[]
  latency:LatencyPoint[]
  topTiles:{label:string;count:number}[]
}
export interface GenerateReportSummaryResult
{
  summary:string
}