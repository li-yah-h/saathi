'use client'
import {useState} from 'react'
import ReportPreview from '../../components/preview'
import {stat} from '../../lib/types'
export default function page()
{
  const [uid,setUid]=useState('')
  const [name,setName]=useState('')
  const [sum,setSum]=useState('')
  const [st,setSt]=useState<stat|null>(null)
  const [ld,setLd]=useState(false)
  const [er,setEr]=useState('')
  async function generate()
  {
    if(!uid||!name)
      return
    setLd(true)
    setEr('')
    try
    {
      const res=await fetch('/api/report',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({userId:uid,childName:name})
      })
      const js=await res.json()
      if(!res.ok)
        throw new Error(js.error||'Unable to generate the report.')
      setSum(js.summary)
      setSt(js.stats)
    }
    catch(e)
    {
      setEr(e instanceof Error?e.message:'Unable to generate the report.')
    }
    finally
    {
      setLd(false)
    }
  }
  function pdf()
  {
    window.open(`/api/pdf?userId=${uid}&childName=${encodeURIComponent(name)}`,'_blank')
  }
  return(
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Generate IEP Report</h1>
      <div className="flex flex-col gap-3 mb-6">
        <input className="border rounded px-3 py-2" placeholder="Child user ID" value={uid} onChange={(e)=>setUid(e.target.value)}/>
        <input className="border rounded px-3 py-2" placeholder="Child name" value={name} onChange={(e)=>setName(e.target.value)}/>
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={generate} disabled={ld}>{ld?'Generating...':'Generate Report'}</button>
        {er&&<p className="text-sm text-red-600">{er}</p>}
      </div>
      {sum&&st&&(
        <>
          <ReportPreview summary={sum} stats={st}/>
          <button className="mt-4 bg-gray-800 text-white px-4 py-2 rounded" onClick={pdf}>Download PDF</button>
        </>
      )}
    </div>)
}
