import {GoogleGenerativeAI} from '@google/generative-ai'
import type{EmbedTextResult,GenerateReportSummaryInput,GenerateReportSummaryResult} from '@saathi/stypes'
function getClient()
{
  if(!process.env.GEMINI_API_KEY)
    throw new Error('GEMINI_API_KEY is missing from the environment.')
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
}
export async function embedText(text:string):Promise<EmbedTextResult>
{
  const ai=getClient()
  const model=ai.getGenerativeModel({model:'text-embedding-004'})
  const response=await model.embedContent({content:{role:'user',parts:[{text}]},outputDimensionality:384})
  return{embedding:response.embedding.values}
}
export async function generateReportSummary(input:GenerateReportSummaryInput):Promise<GenerateReportSummaryResult>
{
  const ai=getClient()
  const model=ai.getGenerativeModel({model:'gemini-1.5-flash'})
  const topTiles=input.topTiles.map((tile)=>`${tile.label} (${tile.count} taps)`).join(', ')
  const averageLatency=input.latency.reduce((sum,point)=>sum+point.avg_latency_ms,0)/(input.latency.length||1)
  const vocabularyGrowth=input.vocabExpansion.length>1?input.vocabExpansion[input.vocabExpansion.length-1].unique_tiles_used-input.vocabExpansion[0].unique_tiles_used:0
  const prompt=`You are assisting a Speech-Language Pathologist (SLP) in writing an IEP progress note. Write a single, plain-text paragraph (no markdown, no bullet points, no headers) summarizing this AAC user's communication activity for the reporting period ${input.periodStart} to ${input.periodEnd}.
Client name: ${input.userName}
Average selection latency: ${averageLatency.toFixed(0)} ms
Vocabulary expansion over the period: ${vocabularyGrowth} new unique tiles
Most frequently used tiles: ${topTiles}
Write in a clinical but readable tone suitable for a parent/teacher
audience, noting progress and any areas to monitor. Return ONLY the
paragraph text, nothing else.
`.trim()
  const response=await model.generateContent(prompt)
  const summary=response.response.text().trim()
  return{summary}
}