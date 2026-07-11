import {GoogleGenerativeAI as AI} from '@google/generative-ai'
import {stat} from './types'
const ai=new AI(process.env.GEMINI_API_KEY as string)
export async function genreport(n:string,s:stat)
{
  const m=ai.getGenerativeModel({model:'gemini-1.5-flash'})
  const p=`Write a short clinical IEP progress summary for a child named ${n} using an AAC device. Total events: ${s.totalEvents}. Average response latency: ${s.avgLatencyMs}ms. Unique vocabulary tiles used: ${s.uniqueTilesUsed}. Keep it factual, plain text, three paragraphs, no markdown.`
  const r=await m.generateContent(p)
  return r.response.text()
}