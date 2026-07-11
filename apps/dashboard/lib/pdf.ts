import {Document as D,Page as P,Text as T,View as V,StyleSheet as S,renderToBuffer as rb} from '@react-pdf/renderer'
import React from 'react'
import {stat} from './types'
const st=S.create({
  page:{padding:40,fontSize:12,fontFamily:'Helvetica'},
  title:{fontSize:18,marginBottom:20},
  sec:{marginBottom:12},
  lab:{fontWeight:700,marginBottom:4}
})
export function buildReportDocument(n:string,sum:string,s:stat)
{
  return React.createElement(D,null,
    React.createElement(P,{size:'A4',style:st.page},
      React.createElement(T,{style:st.title},`AAC Progress Report - ${n}`),
      React.createElement(V,{style:st.sec},React.createElement(T,{style:st.lab},'Summary'),React.createElement(T,null,sum)),
      React.createElement(V,{style:st.sec},React.createElement(T,{style:st.lab},'Total Events'),React.createElement(T,null,String(s.totalEvents))),
      React.createElement(V,{style:st.sec},React.createElement(T,{style:st.lab},'Average Latency (ms)'),React.createElement(T,null,String(s.avgLatencyMs))),
      React.createElement(V,{style:st.sec},React.createElement(T,{style:st.lab},'Unique Vocabulary Tiles Used'),React.createElement(T,null,String(s.uniqueTilesUsed)))))
}
export async function renderreport(n:string,sum:string,s:stat)
{
  const b=await rb(buildReportDocument(n,sum,s))
  return b
}
