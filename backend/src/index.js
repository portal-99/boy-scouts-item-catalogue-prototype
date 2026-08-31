const express = require('express')
const cors = require('cors')
const cookieSession = require('cookie-session')
const dotenv = require('dotenv')
const { PrismaClient } = require('@prisma/client')

dotenv.config()
const prisma = new PrismaClient()
const app = express()
app.use(cors({ origin: true, credentials: true }))
app.use(express.json())
app.use(cookieSession({ name: 'bsic.sess', keys: [process.env.SESSION_SECRET || 'dev-secret'], maxAge: 24 * 60 * 60 * 1000 }))

// simple auth: enter access code
app.post('/api/auth/login', async (req, res) =>{
  const { accessCode } = req.body
  if(!accessCode) return res.status(400).json({ error: 'accessCode required' })
  if(accessCode !== process.env.ADMIN_ACCESS_CODE){
    return res.status(401).json({ error: 'invalid access code' })
  }
  // set session
  req.session.isAdmin = true
  res.json({ ok: true })
})

function requireAuth(req,res,next){
  if(req.session && req.session.isAdmin){
    return next()
  }
  return res.status(401).json({ error:'not authenticated' })
}

// items
app.get('/api/items', requireAuth, async (req,res) =>{
  const items = await prisma.item.findMany()
  res.json(items)
})

// checkout (very simple prototype)
app.post('/api/checkout', requireAuth, async (req,res) =>{
  const { items, enteredBy, responsibleName, dueAt } = req.body
  if(!items || items.length === 0) return res.status(400).json({ error: 'no items' })
  if(!dueAt) return res.status(400).json({ error: 'dueAt required' })

  // create a transaction
  const tx = await prisma.transaction.create({ data: { enteredBy } })

  for(const it of items){
    // basic check
    const item = await prisma.item.findUnique({ where: { id: it.id } })
    if(!item) return res.status(404).json({ error: 'item not found' })
    if(item.status !== 'available') return res.status(400).json({ error: `item ${item.name} not available` })

    // reduce available quantity
    let newAvail = item.availableQuantity - (it.quantity || 1)
    if(newAvail < 0) return res.status(400).json({ error: 'insufficient quantity' })

    await prisma.item.update({ where: { id: item.id }, data: { availableQuantity: newAvail, status: newAvail === 0 ? 'checked_out' : 'checked_out' } })

    await prisma.transactionItem.create({ data: { transactionId: tx.id, itemId: item.id, quantity: it.quantity || 1, dueAt: new Date(dueAt) } })
  }

  res.json({ ok:true, transactionId: tx.id })
})

app.get('/api/health', (req,res) => res.json({ ok:true }))

const port = process.env.PORT || 4000
app.listen(port, () => console.log('Backend running on', port))
