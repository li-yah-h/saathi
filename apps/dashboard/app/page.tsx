'use client'
import {useEffect,useState} from 'react'
import {useRouter} from 'next/navigation'
import {supabaseBrowser} from '../lib/supaclient'
import Notify from '../components/notify'
import Latency from '../components/latency'
import VocabularyExpansion from '../components/vocabexp'
import {stat} from '../lib/types'
export default function page()
{
  const router=useRouter()
  const [authorized,setAuthorized]=useState(false)
  const [checkingAccess,setCheckingAccess]=useState(true)
  const [userId,setUserId]=useState('')
  const [stats,setStats]=useState<stat|null>(null)
  const [loading,setLoading]=useState(false)
  useEffect(()=>{
    async function checkAccess()
    {
      const {data}=await supabaseBrowser.auth.getSession()
      const session=data.session
      if(!session)
      {
        router.push('/login')
        return
      }
      const {data:profile}=await supabaseBrowser
        .from('profiles')
        .select('role')
        .eq('id',session.user.id)
        .single()
      if(profile?.role!=='admin')
      {
        router.push('/login')
        return
      }
      setAuthorized(true)
      setCheckingAccess(false)
    }
    checkAccess()
  },[router])
  async function load()
  {
    if(!userId)
      return
    setLoading(true)
    const response=await fetch(`/api/stats?userId=${userId}`)
    const json=await response.json()
    setStats(json.stats)
    setLoading(false)
  }
  if(checkingAccess)
    return <div className="p-8">Checking access...</div>
  if(!authorized)
    return null
  return(
    <div className="p-8 max-w-5xl mx-auto">
      <Notify/>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="flex gap-3 mb-8">
        <input className="border rounded px-3 py-2 flex-1" placeholder="Enter child user ID" value={userId} onChange={(event)=>setUserId(event.target.value)}/>
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={load} disabled={loading}>{loading?'Loading...':'Load Stats'}</button>
      </div>
      {stats&&(
        <div className="grid gap-8">
          <div>
            <h2 className="text-lg font-semibold mb-2">Latency Trend</h2>
            <Latency data={stats.latencyTrend}/>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">Vocabulary Expansion</h2>
            <VocabularyExpansion data={stats.vocabTrend}/>
          </div>
        </div>
      )}
    </div>
  )
}