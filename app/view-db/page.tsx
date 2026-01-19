'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Table {
  name: string
  label: string
  model: string
}

export default function ViewDBPage() {
  const [dbType, setDbType] = useState<'local' | 'production'>('local')
  const [tables, setTables] = useState<Table[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    loadTables()
  }, [dbType])

  const loadTables = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/view-db/tables')
      const data = await response.json()
      setTables(data.tables || [])
    } catch (error) {
      console.error('Error loading tables:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div
        style={{
          background: 'white',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div style={{ marginBottom: '2rem' }}>
          <h1
            style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
              color: '#333',
            }}
          >
            🗄️ Database Viewer
          </h1>
          <p style={{ color: '#666', marginBottom: '1.5rem' }}>
            Выберите тип базы данных и откройте таблицу для просмотра и редактирования
          </p>

          {/* Выбор БД */}
          <div style={{ marginBottom: '2rem' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '600',
                color: '#333',
              }}
            >
              Тип базы данных:
            </label>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => setDbType('local')}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  border: '2px solid',
                  borderColor: dbType === 'local' ? '#667eea' : '#e0e0e0',
                  background: dbType === 'local' ? '#667eea' : 'white',
                  color: dbType === 'local' ? 'white' : '#333',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.2s',
                }}
              >
                🏠 Локальная БД
              </button>
              <button
                onClick={() => setDbType('production')}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  border: '2px solid',
                  borderColor: dbType === 'production' ? '#667eea' : '#e0e0e0',
                  background: dbType === 'production' ? '#667eea' : 'white',
                  color: dbType === 'production' ? 'white' : '#333',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.2s',
                }}
              >
                🌐 Рабочая БД
              </button>
            </div>
            <p style={{ marginTop: '0.5rem', color: '#999', fontSize: '0.9rem' }}>
              Выбрано: {dbType === 'local' ? 'Локальная база данных' : 'Рабочая база данных'}
            </p>
          </div>
        </div>

        {/* Список таблиц */}
        <div>
          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              marginBottom: '1rem',
              color: '#333',
            }}
          >
            Таблицы ({tables.length})
          </h2>

          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>
              Загрузка таблиц...
            </div>
          ) : tables.length === 0 ? (
            <div
              style={{
                padding: '2rem',
                textAlign: 'center',
                color: '#999',
                background: '#f5f5f5',
                borderRadius: '8px',
              }}
            >
              Таблицы не найдены
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: '1rem',
              }}
            >
              {tables.map((table) => (
                <Link
                  key={table.name}
                  href={`/view-db/${table.name}?db=${dbType}`}
                  style={{
                    display: 'block',
                    padding: '1.5rem',
                    background: '#f9f9f9',
                    borderRadius: '8px',
                    border: '1px solid #e0e0e0',
                    textDecoration: 'none',
                    color: '#333',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f0f0f0'
                    e.currentTarget.style.borderColor = '#667eea'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#f9f9f9'
                    e.currentTarget.style.borderColor = '#e0e0e0'
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <div style={{ marginBottom: '0.5rem' }}>
                    <h3
                      style={{
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        marginBottom: '0.25rem',
                      }}
                    >
                      {table.label}
                    </h3>
                    <p
                      style={{
                        fontSize: '0.85rem',
                        color: '#999',
                        fontFamily: 'monospace',
                      }}
                    >
                      {table.name}
                    </p>
                  </div>
                  <div
                    style={{
                      marginTop: '1rem',
                      padding: '0.5rem',
                      background: '#667eea',
                      color: 'white',
                      borderRadius: '6px',
                      textAlign: 'center',
                      fontWeight: '600',
                      fontSize: '0.9rem',
                    }}
                  >
                    Открыть →
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #e0e0e0' }}>
          <Link
            href="/"
            style={{
              color: '#667eea',
              textDecoration: 'none',
              fontWeight: '600',
            }}
          >
            ← Назад на главную
          </Link>
        </div>
      </div>
    </div>
  )
}

