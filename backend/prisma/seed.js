const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main(){
  // create a sample org year
  const year = await prisma.organizationalYear.create({ data: { year: 2026, name: '2026 Troop' } })

  // people
  const pm1 = await prisma.person.create({ data: { fullName: 'Quartermaster' } })
  const pm2 = await prisma.person.create({ data: { fullName: 'John Smith' } })

  // items
  const stove = await prisma.item.create({ data: { name: 'Stove #4', identifier: 'STV-4', itemType: 'individual', quantity:1, availableQuantity:1 } })
  const tent = await prisma.item.create({ data: { name: 'Tent 21J', identifier: 'TENT-21J', itemType: 'individual', quantity:1, availableQuantity:1 } })
  const rope = await prisma.item.create({ data: { name: 'Rope', identifier: 'ROPE', itemType: 'bulk', quantity:8, availableQuantity:8 } })

  console.log('Seed complete')
}

main().catch(e => {
  console.error(e)
  process.exit(1)
}).finally(async () => {
  await prisma.$disconnect()
})
