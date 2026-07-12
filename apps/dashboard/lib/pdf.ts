import {Document,Page,Text,View,StyleSheet,renderToBuffer} from '@react-pdf/renderer'
import React from 'react'
import {stat} from './types'
const styles=StyleSheet.create({
  page:{padding:40,fontSize:12,fontFamily:'Helvetica'},
  title:{fontSize:18,marginBottom:20},
  section:{marginBottom:12},
  label:{fontWeight:700,marginBottom:4}
})
export function buildReportDocument(childName:string,summary:string,stats:stat)
{
  return React.createElement(Document,null,
    React.createElement(Page,{size:'A4',style:styles.page},
      React.createElement(Text,{style:styles.title},`AAC Progress Report - ${childName}`),
      React.createElement(View,{style:styles.section},React.createElement(Text,{style:styles.label},'Summary'),React.createElement(Text,null,summary)),
      React.createElement(View,{style:styles.section},React.createElement(Text,{style:styles.label},'Total Events'),React.createElement(Text,null,String(stats.totalEvents))),
      React.createElement(View,{style:styles.section},React.createElement(Text,{style:styles.label},'Average Latency (ms)'),React.createElement(Text,null,String(stats.avgLatencyMs))),
      React.createElement(View,{style:styles.section},React.createElement(Text,{style:styles.label},'Unique Vocabulary Tiles Used'),React.createElement(Text,null,String(stats.uniqueTilesUsed)))))
}
export async function renderreport(childName:string,summary:string,stats:stat)
{
  const buffer=await renderToBuffer(buildReportDocument(childName,summary,stats))
  return buffer
}