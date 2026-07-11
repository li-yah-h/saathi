'use client'
import {useState} from 'react'
import {useRouter as ur} from 'next/navigation'
import {supabaseBrowser as sb} from '../../lib/supaclient'
export default function Page()
{
  const r=ur()
  const [e,setE]=useState('')
  const [p,setP]=useState('')
  const [er,setEr]=useState('')
  async function login()
  {
    const {error}=await sb.auth.signInWithPassword({email:e,password:p})
    if(error)
    {
      setEr(error.message)
      return
    }
    r.push('/')
  }
  return(
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm p-6 border rounded-lg shadow-sm">
        <h1 className="text-xl font-bold mb-4">Admin Login</h1>
        <input className="border rounded px-3 py-2 w-full mb-3" placeholder="Email" value={e} onChange={(x)=>setE(x.target.value)}/>
        <input type="password" className="border rounded px-3 py-2 w-full mb-3" placeholder="Password" value={p} onChange={(x)=>setP(x.target.value)}/>
        {er&&<div className="text-red-600 text-sm mb-3">{er}</div>}
        <button className="bg-blue-600 text-white px-4 py-2 rounded w-full" onClick={login}>Log In</button>
      </div>
    </div>)
}