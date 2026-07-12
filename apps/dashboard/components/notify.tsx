'use client'
import {useEffect} from 'react'
import toast from 'react-hot-toast'
import {supabaseBrowser} from '../lib/supaclient'
export default function Notify()
{
  useEffect(()=>
  {
    const channel=supabaseBrowser
      .channel('events-realtime')
      .on(
        'postgres_changes',
        {event:'INSERT',schema:'public',table:'events'},
        (payload)=>{toast(`Tile tapped: ${payload.new.tile_id}`)}
      )
      .subscribe()
    return()=>{supabaseBrowser.removeChannel(channel)}
  },[])
  return null
}