'use client'
import {stat} from '../lib/types'
export default function preview({summary,stats}:{summary:string;stats:stat})
{
  return(
    <div className="border rounded-lg p-6 bg-white shadow-sm">
      <h3 className="text-lg font-semibold mb-3">Generated Summary</h3>
      <p className="whitespace-pre-line text-sm text-gray-700 mb-4">{summary}</p>
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div>
          <div className="text-gray-500">Total Events</div>
          <div className="font-semibold">{stats.totalEvents}</div>
        </div>
        <div>
          <div className="text-gray-500">Avg Latency (ms)</div>
          <div className="font-semibold">{stats.avgLatencyMs}</div>
        </div>
        <div>
          <div className="text-gray-500">Unique Tiles</div>
          <div className="font-semibold">{stats.uniqueTilesUsed}</div>
        </div>
      </div>
    </div>
  )
}