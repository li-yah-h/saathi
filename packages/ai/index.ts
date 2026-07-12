import {GoogleGenerativeAI as AI} from '@google/generative-ai'
import type{EmbedTextResult,GenerateReportSummaryInput,GenerateReportSummaryResult} from '@echovoice/shared-types'\
function getClient()
{
  if(!process.env.GEMINI_API_KEY)
    throw new Error('GEMINI_API_KEY is missing from the environment.')
  return new AI(process.env.GEMINI_API_KEY)
}
export async function embedText(text:string):Promise<EmbedTextResult>
{
  const ai=getClient()
  const m=ai.getGenerativeModel({model:'text-embedding-004'})
  const r=await m.embedContent({content:{role:'user',parts:[{text}]},outputDimensionality:384})
  return{embedding:r.embedding.values}
}
export async function generateReportSummary(i:GenerateReportSummaryInput):Promise<GenerateReportSummaryResult>
{
  const ai=getClient()
  const m=ai.getGenerativeModel({model:'gemini-1.5-flash'})
  const tt=i.topTiles.map((t)=>`${t.label} (${t.count} taps)`).join(', ')
  const al=i.latency.reduce((s,p)=>s+p.avg_latency_ms,0)/(i.latency.length||1)
  const vg=i.vocabExpansion.length>1?i.vocabExpansion[i.vocabExpansion.length-1].unique_tiles_used-i.vocabExpansion[0].unique_tiles_used:0
  const p=`You are assisting a Speech-Language Pathologist (SLP) in writing an IEP progress note. Write a single, plain-text paragraph (no markdown, no bullet points, no headers) summarizing this AAC user's communication activity for the reporting period ${i.periodStart} to ${i.periodEnd}.
Client name: ${i.userName}
Average selection latency: ${al.toFixed(0)} ms
Vocabulary expansion over the period: ${vg} new unique tiles
Most frequently used tiles: ${tt}
Write in a clinical but readable tone suitable for a parent/teacher
audience, noting progress and any areas to monitor. Return ONLY the
paragraph text, nothing else.
`.trim()
  const r=await m.generateContent(p)
  const sum=r.response.text().trim()
  return{summary:sum}
}