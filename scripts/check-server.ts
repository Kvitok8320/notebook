import { execSync } from 'child_process'

console.log('=== Диагностика сервера ===\n')

// Проверка Node.js
try {
  const nodeVersion = execSync('node --version', { encoding: 'utf-8' }).trim()
  console.log('✅ Node.js:', nodeVersion)
} catch (e) {
  console.log('❌ Node.js не найден')
}

// Проверка npm
try {
  const npmVersion = execSync('npm --version', { encoding: 'utf-8' }).trim()
  console.log('✅ npm:', npmVersion)
} catch (e) {
  console.log('❌ npm не найден')
}

// Проверка node_modules
const fs = require('fs')
if (fs.existsSync('node_modules')) {
  console.log('✅ node_modules существует')
} else {
  console.log('❌ node_modules НЕ существует - запустите: npm install')
}

// Проверка .env
if (fs.existsSync('.env')) {
  console.log('✅ .env файл существует')
  const envContent = fs.readFileSync('.env', 'utf-8')
  if (envContent.includes('DATABASE_URL')) {
    console.log('✅ DATABASE_URL найден в .env')
  } else {
    console.log('❌ DATABASE_URL НЕ найден в .env')
  }
} else {
  console.log('❌ .env файл НЕ существует')
}

// Проверка Prisma
try {
  execSync('npx prisma --version', { encoding: 'utf-8' })
  console.log('✅ Prisma установлен')
} catch (e) {
  console.log('❌ Prisma не установлен')
}

console.log('\n=== Попытка запуска сервера ===')
console.log('Запустите вручную: npm run dev')
console.log('И посмотрите ошибки в терминале')


