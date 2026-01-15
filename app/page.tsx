import { prisma } from '@/lib/prisma'

async function getNotes() {
  try {
    const notes = await prisma.note.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })
    return notes
  } catch (error) {
    console.error('Error fetching notes:', error)
    return []
  }
}

export default async function Home() {
  const notes = await getNotes()

  return (
    <main style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div
        style={{
          background: 'white',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h1
          style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            color: '#333',
          }}
        >
          📓 Notebook App
        </h1>
        <p style={{ color: '#666', marginBottom: '2rem', fontSize: '1.1rem' }}>
          Next.js + Prisma + NeonDB (PostgreSQL)
        </p>

        {notes.length === 0 ? (
          <div
            style={{
              padding: '2rem',
              textAlign: 'center',
              color: '#999',
              background: '#f5f5f5',
              borderRadius: '8px',
            }}
          >
            <p>No notes found. Run the seed script to add sample data.</p>
            <code style={{ marginTop: '1rem', display: 'block' }}>
              npm run db:seed
            </code>
          </div>
        ) : (
          <div>
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                marginBottom: '1rem',
                color: '#333',
              }}
            >
              Notes ({notes.length})
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {notes.map((note) => (
                <div
                  key={note.id}
                  style={{
                    padding: '1.5rem',
                    background: '#f9f9f9',
                    borderRadius: '8px',
                    border: '1px solid #e0e0e0',
                  }}
                >
                  <h3
                    style={{
                      fontSize: '1.2rem',
                      fontWeight: '600',
                      marginBottom: '0.5rem',
                      color: '#333',
                    }}
                  >
                    {note.title}
                  </h3>
                  <p style={{ color: '#999', fontSize: '0.9rem' }}>
                    Created: {new Date(note.createdAt).toLocaleString()}
                  </p>
                  <p
                    style={{
                      color: '#666',
                      fontSize: '0.85rem',
                      fontFamily: 'monospace',
                      marginTop: '0.5rem',
                    }}
                  >
                    ID: {note.id}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div
          style={{
            marginTop: '2rem',
            padding: '1rem',
            background: '#e8f4f8',
            borderRadius: '8px',
            fontSize: '0.9rem',
            color: '#555',
          }}
        >
          <strong>✅ Status:</strong> Database connection is working!{' '}
          {notes.length > 0 && `Found ${notes.length} note(s).`}
        </div>
      </div>
    </main>
  )
}

