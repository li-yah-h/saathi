'use client'
import {useState} from 'react'
import {useRouter} from 'next/navigation'
import {supabaseBrowser} from '../../lib/supaclient'
export default function Page()
{
  const router=useRouter()
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [errorMessage,setErrorMessage]=useState('')
  async function login()
  {
    const {error}=await supabaseBrowser.auth.signInWithPassword({email,password})
    if(error)
    {
      setErrorMessage(error.message)
      return
    }
    router.push('/')
  }
  return(
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm p-6 border rounded-lg shadow-sm">
        <h1 className="text-xl font-bold mb-4">Admin Login</h1>
        <input className="border rounded px-3 py-2 w-full mb-3" placeholder="Email" value={email} onChange={(event)=>setEmail(event.target.value)}/>
        <input type="password" className="border rounded px-3 py-2 w-full mb-3" placeholder="Password" value={password} onChange={(event)=>setPassword(event.target.value)}/>
        {errorMessage&&<div className="text-red-600 text-sm mb-3">{errorMessage}</div>}
        <button className="bg-blue-600 text-white px-4 py-2 rounded w-full" onClick={login}>Log In</button>
      </div>
    </div>)
}