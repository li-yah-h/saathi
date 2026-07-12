'use client'
import {useEffect} from 'react'
import toast from 'react-hot-toast'
import {supabaseBrowser as sb} from '../lib/supaclient'
export default function notify()
{
  useEffect(()=>
  {
    const ch=sb
      .channel('events-realtime')
      .on(
        'postgres_changes',
        {event:'INSERT',schema:'public',table:'events'},
        (p)=>{toast(`Tile tapped: ${p.new.tile_id}`)}
      )
      .subscribe()
    return()=>{sb.removeChannel(ch)}
  },[])
  return null
}