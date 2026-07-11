'use client'
import {useEffect,useState} from 'react'
import {useRouter as ur} from 'next/navigation'
import {supabaseBrowser as sb} from '../lib/supaclient'
import notify as NL from '../components/notify'
import latency as LC from '../components/latency'
import vocabexp as VC from '../components/vocabexp'
import {stat} from '../lib/types'
export default function page()
{
  const r=ur()
  const [a,setA]=useState(false)
  const [c,setC]=useState(true)
  const [u,setU]=useState('')
  const [s,setS]=useState<stat|null>(null)
  const [l,setL]=useState(false)
  useEffect(()=>{
    async function chk()
    {
      const {data:d}=await sb.auth.getSession()
      const ss=d.session
      if(!ss)
      {
        r.push('/login')
        return
      }
      const {data:p}=await sb
        .from('profiles')
        .select('role')
        .eq('id',ss.user.id)
        .single()
      if(p?.role!=='admin')
      {
        r.push('/login')
        return
      }
      setA(true)
      setC(false)
    }
    chk()
  },[r])
  async function load()
  {
    if(!u)
      return
    setL(true)
    const res=await fetch(`/api/stats?userId=${u}`)
    const j=await res.json()
    setS(j.stats)
    setL(false)
  }
  if(c)
    return <div className="p-8">Checking access...</div>
  if(!a)
    return null
  return(
    <div className="p-8 max-w-5xl mx-auto">
      <NL/>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="flex gap-3 mb-8">
        <input className="border rounded px-3 py-2 flex-1" placeholder="Enter child user ID" value={u} onChange={(e)=>setU(e.target.value)}/>
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={load} disabled={l}>{l?'Loading...':'Load Stats'}</button>
      </div>
      {s&&(
        <div className="grid gap-8">
          <div>
            <h2 className="text-lg font-semibold mb-2">Latency Trend</h2>
            <LC data={s.latencyTrend}/>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">Vocabulary Expansion</h2>
            <VC data={s.vocabTrend}/>
          </div>
        </div>
      )}
    </div>
  )
}