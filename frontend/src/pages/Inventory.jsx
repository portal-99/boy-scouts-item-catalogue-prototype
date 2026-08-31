import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function Inventory(){
  const [items, setItems] = useState([])
  const [err, setErr] = useState(null)

  useEffect(()=>{
    async function load(){
      try{
        const res = await axios.get('/api/items')
        setItems(res.data)
      }catch(e){
        setErr('Error loading items: ' + (e.response?.data?.error || e.message))
      }
    }
    load()
  },[])

  return (
    <div style={{padding:20,color:'#ddd',background:'#111',minHeight:'100vh'}}>
      <h1>Inventory</h1>
      {err && <div style={{color:'salmon'}}>{err}</div>}
      <table style={{width:'100%',borderCollapse:'collapse',marginTop:12}}>
        <thead>
          <tr style={{textAlign:'left'}}>
            <th>Name</th>
            <th>Identifier</th>
            <th>Type</th>
            <th>Quantity</th>
            <th>Available</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {items.map(it => (
            <tr key={it.id} style={{borderTop:'1px solid #222'}}>
              <td>{it.name}</td>
              <td>{it.identifier}</td>
              <td>{it.itemType}</td>
              <td>{it.quantity}</td>
              <td>{it.availableQuantity}</td>
              <td>{it.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
