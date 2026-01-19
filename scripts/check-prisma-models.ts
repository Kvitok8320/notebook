import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkModels() {
  console.log('Checking Prisma Client models...')
  console.log('\nAvailable properties on prisma:')
  console.log(Object.keys(prisma))
  
  console.log('\nModel names (lowercase):')
  const models = ['user', 'note', 'category', 'prompt', 'tag', 'vote']
  models.forEach(modelName => {
    const model = (prisma as any)[modelName]
    if (model) {
      console.log(`✅ ${modelName} - available`)
    } else {
      console.log(`❌ ${modelName} - NOT available`)
    }
  })
  
  await prisma.$disconnect()
}

checkModels().catch(console.error)

