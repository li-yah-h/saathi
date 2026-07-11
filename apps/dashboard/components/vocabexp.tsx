'use client'
import {LineChart,Line,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer} from 'recharts'
import {vocab} from '../lib/types'
export default function vocabexp({data}:{data:vocab[]}) 
{
  return(
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3"/>
        <XAxis dataKey="date"/>
        <YAxis/>
        <Tooltip/>
        <Line type="monotone" dataKey="unique_tiles" stroke="#16a34a" strokeWidth={2} dot={false}/>
      </LineChart>
    </ResponsiveContainer>
  )
}

