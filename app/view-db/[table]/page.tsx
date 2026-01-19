'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'

interface Pagination {
  page: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
}

interface TableData {
  data: any[]
  pagination: Pagination
}

export default function TableViewPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const tableName = params.table as string
  const dbType = searchParams.get('db') || 'local'

  const [tableData, setTableData] = useState<TableData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<any>({})
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [createForm, setCreateForm] = useState<any>({})

  useEffect(() => {
    loadTableData()
  }, [tableName, currentPage])

  const loadTableData = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(
        `/api/view-db/${tableName}?page=${currentPage}&_t=${Date.now()}`,
        {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
          },
        }
      )
      if (!response.ok) {
        const errorData = await response.json()
        const errorMsg = errorData.details || errorData.error || 'Failed to load data'
        console.error('API Error:', errorData)
        throw new Error(errorMsg)
      }
      const data = await response.json()
      setTableData(data)
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to load table data'
      console.error('Error loading table data:', err)
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить эту запись?')) {
      return
    }

    try {
      const response = await fetch(`/api/view-db/${tableName}?id=${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Failed to delete')
      }
      loadTableData()
    } catch (err) {
      alert('Ошибка при удалении записи')
    }
  }

  const handleEdit = (record: any) => {
    setEditingId(record.id)
    setEditForm({ ...record })
  }

  const handleSaveEdit = async () => {
    try {
      const { id, ...data } = editForm
      const response = await fetch(`/api/view-db/${tableName}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...data }),
      })
      if (!response.ok) {
        throw new Error('Failed to update')
      }
      setEditingId(null)
      loadTableData()
    } catch (err) {
      alert('Ошибка при обновлении записи')
    }
  }

  const handleCreate = async () => {
    try {
      const response = await fetch(`/api/view-db/${tableName}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createForm),
      })
      if (!response.ok) {
        throw new Error('Failed to create')
      }
      setShowCreateForm(false)
      setCreateForm({})
      loadTableData()
    } catch (err) {
      alert('Ошибка при создании записи')
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Загрузка данных...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: '2rem' }}>
        <div
          style={{
            background: '#fee',
            padding: '1rem',
            borderRadius: '8px',
            color: '#c00',
          }}
        >
          <p>Ошибка: {error}</p>
          <Link href="/view-db" style={{ color: '#667eea' }}>
            ← Вернуться к списку таблиц
          </Link>
        </div>
      </div>
    )
  }

  if (!tableData) {
    return (
      <div style={{ padding: '2rem' }}>
        <div
          style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
        >
          <h1 style={{ marginBottom: '1rem' }}>Таблица: {tableName}</h1>
          {error ? (
            <div style={{ color: '#ef4444', marginBottom: '1rem' }}>
              <p><strong>Ошибка:</strong> {error}</p>
            </div>
          ) : (
            <p>Загрузка данных...</p>
          )}
          <Link href="/view-db" style={{ color: '#667eea' }}>
            ← Вернуться к списку таблиц
          </Link>
        </div>
      </div>
    )
  }

  if (tableData.data.length === 0) {
    return (
      <div style={{ padding: '2rem' }}>
        <div
          style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
        >
          <h1 style={{ marginBottom: '1rem' }}>Таблица: {tableName}</h1>
          <p>Таблица пуста (0 записей)</p>
          <div style={{ marginTop: '1rem' }}>
            <button
              onClick={() => setShowCreateForm(true)}
              style={{
                padding: '0.5rem 1rem',
                background: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
              }}
            >
              + Создать первую запись
            </button>
          </div>
          <Link href="/view-db" style={{ color: '#667eea', display: 'block', marginTop: '1rem' }}>
            ← Вернуться к списку таблиц
          </Link>
        </div>
      </div>
    )
  }

  const columns = Object.keys(tableData.data[0])

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      <div
        style={{
          background: 'white',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333' }}>
              📊 {tableName}
            </h1>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                style={{
                  padding: '0.5rem 1rem',
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600',
                }}
              >
                + Создать
              </button>
              <Link
                href="/view-db"
                style={{
                  padding: '0.5rem 1rem',
                  background: '#6b7280',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '6px',
                  fontWeight: '600',
                }}
              >
                ← Назад
              </Link>
            </div>
          </div>
          <p style={{ color: '#666' }}>
            БД: {dbType === 'local' ? 'Локальная' : 'Рабочая'} | Всего записей: {tableData.pagination.totalItems}
          </p>
        </div>

        {/* Форма создания */}
        {showCreateForm && (
          <div
            style={{
              marginBottom: '2rem',
              padding: '1.5rem',
              background: '#f0f9ff',
              borderRadius: '8px',
              border: '1px solid #bae6fd',
            }}
          >
            <h3 style={{ marginBottom: '1rem' }}>Создать новую запись</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              {columns.map((col) => {
                if (col === 'id' || col.endsWith('At')) return null
                return (
                  <div key={col}>
                    <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.9rem', fontWeight: '600' }}>
                      {col}:
                    </label>
                    <input
                      type="text"
                      value={createForm[col] || ''}
                      onChange={(e) => setCreateForm({ ...createForm, [col]: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                      }}
                      placeholder={col}
                    />
                  </div>
                )
              })}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={handleCreate}
                style={{
                  padding: '0.5rem 1rem',
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                Сохранить
              </button>
              <button
                onClick={() => {
                  setShowCreateForm(false)
                  setCreateForm({})
                }}
                style={{
                  padding: '0.5rem 1rem',
                  background: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                Отмена
              </button>
            </div>
          </div>
        )}

        {/* Таблица */}
        <div style={{ overflowX: 'auto', marginBottom: '2rem' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              background: 'white',
            }}
          >
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                {columns.map((col) => (
                  <th
                    key={col}
                    style={{
                      padding: '0.75rem',
                      textAlign: 'left',
                      borderBottom: '2px solid #e5e7eb',
                      fontWeight: '600',
                      color: '#374151',
                    }}
                  >
                    {col}
                  </th>
                ))}
                <th
                  style={{
                    padding: '0.75rem',
                    textAlign: 'center',
                    borderBottom: '2px solid #e5e7eb',
                    fontWeight: '600',
                    color: '#374151',
                  }}
                >
                  Действия
                </th>
              </tr>
            </thead>
            <tbody>
              {tableData.data.map((row, idx) => (
                <tr
                  key={row.id || idx}
                  style={{
                    borderBottom: '1px solid #e5e7eb',
                  }}
                >
                  {columns.map((col) => (
                    <td
                      key={col}
                      style={{
                        padding: '0.75rem',
                        fontSize: '0.9rem',
                        color: '#6b7280',
                      }}
                    >
                      {editingId === row.id && col !== 'id' && !col.endsWith('At') ? (
                        <input
                          type="text"
                          value={editForm[col] || ''}
                          onChange={(e) =>
                            setEditForm({ ...editForm, [col]: e.target.value })
                          }
                          style={{
                            width: '100%',
                            padding: '0.25rem',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                          }}
                        />
                      ) : (
                        <span>
                          {typeof row[col] === 'object'
                            ? JSON.stringify(row[col])
                            : String(row[col] || '')}
                        </span>
                      )}
                    </td>
                  ))}
                  <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                    {editingId === row.id ? (
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                        <button
                          onClick={handleSaveEdit}
                          style={{
                            padding: '0.25rem 0.5rem',
                            background: '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                          }}
                        >
                          ✓
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          style={{
                            padding: '0.25rem 0.5rem',
                            background: '#6b7280',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                        <button
                          onClick={() => handleEdit(row)}
                          style={{
                            padding: '0.25rem 0.5rem',
                            background: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                          }}
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(row.id)}
                          style={{
                            padding: '0.25rem 0.5rem',
                            background: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Пагинация */}
        {tableData.pagination.totalPages > 1 && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem',
            }}
          >
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              style={{
                padding: '0.5rem 1rem',
                background: currentPage === 1 ? '#e5e7eb' : '#667eea',
                color: currentPage === 1 ? '#9ca3af' : 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              }}
            >
              ← Назад
            </button>
            <span style={{ color: '#6b7280' }}>
              Страница {currentPage} из {tableData.pagination.totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((p) =>
                  Math.min(tableData.pagination.totalPages, p + 1)
                )
              }
              disabled={currentPage === tableData.pagination.totalPages}
              style={{
                padding: '0.5rem 1rem',
                background:
                  currentPage === tableData.pagination.totalPages
                    ? '#e5e7eb'
                    : '#667eea',
                color:
                  currentPage === tableData.pagination.totalPages
                    ? '#9ca3af'
                    : 'white',
                border: 'none',
                borderRadius: '6px',
                cursor:
                  currentPage === tableData.pagination.totalPages
                    ? 'not-allowed'
                    : 'pointer',
              }}
            >
              Вперед →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

