import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function Login(){
  const [code, setCode] = useState('')
  const [err, setErr] = useState(null)
  const nav = useNavigate()

  async function submit(e){
    e.preventDefault()
    try{
      const res = await axios.post('/api/auth/login', { accessCode: code })
      nav('/inventory')
    }catch(err){
      setErr(err.response?.data?.error || 'Login failed')
    }
  }

  return (
    <div style={{padding:20,color:'#ddd',background:'#111',minHeight:'100vh'}}>
      <h1>Boy Scouts Item Catalogue (Prototype)</h1>
      <form onSubmit={submit} style={{maxWidth:400}}>
        <label>Admin Access Code</label>
        <input value={code} onChange={e=>setCode(e.target.value)} style={{width:'100%',padding:8,marginTop:8}} />
        <button style={{marginTop:12,padding:'8px 12px'}}>Enter</button>
        {err && <div style={{color:'salmon',marginTop:8}}>{err}</div>}
      </form>
    </div>
  )
}
