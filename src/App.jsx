import { useEffect, useState } from 'react'

function App() {
  const [tasks, setTasks] = useState([])
  const [view, setView] = useState('admin')
  const [message, setMessage] = useState('')

  const [customer, setCustomer] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('Média')

  async function loadTasks() {
    const response = await fetch('/tasks')
    const data = await response.json()
    setTasks(data)
  }

  async function addTask() {
    if (!customer || !title || !description) {
      setMessage('Preencha todos os campos para abrir o chamado.')
      return
    }

    await fetch('/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        customer,
        title,
        description,
        priority
      })
    })

    setCustomer('')
    setTitle('')
    setDescription('')
    setPriority('Média')

    setMessage('Solicitação aberta com sucesso!')

    await loadTasks()

    setView('admin')

    setTimeout(() => {
      setMessage('')
    }, 5000)
  }

  async function updateStatus(id, status) {
    await fetch(`/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status })
    })

    await loadTasks()
  }

  async function deleteTask(id) {
    await fetch(`/tasks/${id}`, {
      method: 'DELETE'
    })

    await loadTasks()
  }

  useEffect(() => {
    loadTasks()
  }, [])

  const openTickets = tasks.filter(
    task => task.status === 'Aberto'
  ).length

  const progressTickets = tasks.filter(
    task => task.status === 'Em andamento'
  ).length

  const resolvedTickets = tasks.filter(
    task => task.status === 'Finalizado'
  ).length

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#eef3f8',
        fontFamily: 'Arial, sans-serif',
        display: 'flex',
        color: '#1f2937'
      }}
    >
      <aside
        style={{
          width: '240px',
          backgroundColor: '#ffffff',
          padding: '24px',
          borderRight: '1px solid #dbe3ec'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: '#1d4ed8',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold'
            }}
          >
            FO
          </div>

          <h2 style={{ margin: 0 }}>FiberOps</h2>
        </div>

        <nav style={{ marginTop: '35px' }}>
          <button
            onClick={() => setView('admin')}
            style={menuButton(view === 'admin')}
          >
            Dashboard
          </button>

          <button
            onClick={() => setView('client')}
            style={menuButton(view === 'client')}
          >
            Abrir chamado
          </button>
        </nav>
      </aside>

      <main
        style={{
          flex: 1,
          padding: '32px'
        }}
      >
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '28px'
          }}
        >
          <div>
            <h1 style={{ margin: 0 }}>
              Central de suporte técnico
            </h1>

            <p
              style={{
                margin: '6px 0',
                color: '#6b7280'
              }}
            >
              Gerenciamento de chamados para operações de internet
            </p>
          </div>

          <button
            onClick={() => setView('client')}
            style={{
              padding: '12px 18px',
              border: 'none',
              borderRadius: '10px',
              backgroundColor: '#2563eb',
              color: 'white',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Novo chamado
          </button>
        </header>

        {message && (
          <div
            style={{
              backgroundColor: '#d1fae5',
              color: '#065f46',
              padding: '14px',
              borderRadius: '10px',
              marginBottom: '20px',
              fontWeight: 'bold'
            }}
          >
            {message}
          </div>
        )}

        {view === 'admin' && (
          <>
            <section
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '18px',
                marginBottom: '24px'
              }}
            >
              <StatCard
                title="Chamados abertos"
                value={openTickets}
                color="#f97316"
              />

              <StatCard
                title="Em andamento"
                value={progressTickets}
                color="#3b82f6"
              />

              <StatCard
                title="Finalizados"
                value={resolvedTickets}
                color="#10b981"
              />

              <StatCard
                title="Prazo médio"
                value="2-4d"
                color="#8b5cf6"
              />
            </section>

            <section
              style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '22px',
                boxShadow:
                  '0 8px 24px rgba(15, 23, 42, 0.08)'
              }}
            >
              <h2 style={{ marginTop: 0 }}>
                Chamados atuais
              </h2>

              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '14px'
                }}
              >
                <thead>
                  <tr
                    style={{
                      backgroundColor: '#f8fafc',
                      textAlign: 'left'
                    }}
                  >
                    <th style={thStyle}>ID</th>
                    <th style={thStyle}>Título</th>
                    <th style={thStyle}>Cliente</th>
                    <th style={thStyle}>Prioridade</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {tasks.map(task => (
                    <tr
                      key={task.id}
                      style={{
                        borderBottom:
                          '1px solid #e5e7eb'
                      }}
                    >
                      <td style={tdStyle}>
                        #{task.id}
                      </td>

                      <td style={tdStyle}>
                        <strong>{task.title}</strong>

                        <br />

                        <small
                          style={{
                            color: '#6b7280'
                          }}
                        >
                          {task.description}
                        </small>
                      </td>

                      <td style={tdStyle}>
                        {task.customer}
                      </td>

                      <td style={tdStyle}>
                        <Badge
                          text={task.priority}
                          type="priority"
                        />
                      </td>

                      <td style={tdStyle}>
                        <Badge
                          text={task.status}
                          type="status"
                        />
                      </td>

                      <td style={tdStyle}>
                        <button
                          onClick={() =>
                            updateStatus(
                              task.id,
                              'Em andamento'
                            )
                          }
                          style={actionButton('#f59e0b')}
                        >
                          Andamento
                        </button>

                        <button
                          onClick={() =>
                            updateStatus(
                              task.id,
                              'Finalizado'
                            )
                          }
                          style={actionButton('#10b981')}
                        >
                          Finalizar
                        </button>

                        <button
                          onClick={() =>
                            deleteTask(task.id)
                          }
                          style={actionButton('#ef4444')}
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {tasks.length === 0 && (
                <p
                  style={{
                    color: '#6b7280',
                    marginTop: '20px'
                  }}
                >
                  Nenhum chamado aberto no momento.
                </p>
              )}
            </section>
          </>
        )}

        {view === 'client' && (
          <section
            style={{
              maxWidth: '620px',
              backgroundColor: 'white',
              borderRadius: '18px',
              padding: '28px',
              boxShadow:
                '0 8px 24px rgba(15, 23, 42, 0.08)'
            }}
          >
            <h2 style={{ marginTop: 0 }}>
              Abrir chamado técnico
            </h2>

            <p style={{ color: '#6b7280' }}>
              Preencha as informações abaixo para
              registrar uma solicitação de suporte.
            </p>

            <FormField label="Nome do cliente">
              <input
                value={customer}
                onChange={(e) =>
                  setCustomer(e.target.value)
                }
                placeholder="Ex: João Silva"
                style={inputStyle}
              />
            </FormField>

            <FormField label="Título do problema">
              <input
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                placeholder="Ex: Internet sem conexão"
                style={inputStyle}
              />
            </FormField>

            <FormField label="Descrição">
              <textarea
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                placeholder="Descreva o problema"
                style={{
                  ...inputStyle,
                  height: '120px',
                  resize: 'none'
                }}
              />
            </FormField>

            <FormField label="Prioridade">
              <select
                value={priority}
                onChange={(e) =>
                  setPriority(e.target.value)
                }
                style={inputStyle}
              >
                <option>Alta</option>
                <option>Média</option>
                <option>Baixa</option>
              </select>
            </FormField>

            <button
              onClick={addTask}
              style={{
                marginTop: '10px',
                width: '100%',
                padding: '14px',
                border: 'none',
                borderRadius: '12px',
                backgroundColor: '#2563eb',
                color: 'white',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Abrir solicitação
            </button>
          </section>
        )}
      </main>
    </div>
  )
}

function FormField({ label, children }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '16px'
      }}
    >
      <label
        style={{
          fontWeight: 'bold',
          marginBottom: '6px',
          color: '#374151'
        }}
      >
        {label}
      </label>

      {children}
    </div>
  )
}

function StatCard({ title, value, color }) {
  return (
    <div
      style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '16px',
        boxShadow:
          '0 8px 24px rgba(15, 23, 42, 0.08)'
      }}
    >
      <div
        style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          backgroundColor: color,
          float: 'right'
        }}
      />

      <p
        style={{
          color: '#6b7280',
          margin: 0
        }}
      >
        {title}
      </p>

      <h2
        style={{
          fontSize: '34px',
          margin: '10px 0 0'
        }}
      >
        {value}
      </h2>
    </div>
  )
}

function Badge({ text, type }) {
  let backgroundColor = '#e5e7eb'
  let color = '#374151'

  if (type === 'priority') {
    if (text === 'Alta') {
      backgroundColor = '#fee2e2'
      color = '#991b1b'
    }

    if (text === 'Média') {
      backgroundColor = '#fef3c7'
      color = '#92400e'
    }

    if (text === 'Baixa') {
      backgroundColor = '#d1fae5'
      color = '#065f46'
    }
  }

  if (type === 'status') {
    if (text === 'Aberto') {
      backgroundColor = '#e0f2fe'
      color = '#075985'
    }

    if (text === 'Em andamento') {
      backgroundColor = '#fef3c7'
      color = '#92400e'
    }

    if (text === 'Finalizado') {
      backgroundColor = '#dcfce7'
      color = '#166534'
    }
  }

  return (
    <span
      style={{
        padding: '6px 10px',
        borderRadius: '999px',
        backgroundColor,
        color,
        fontWeight: 'bold',
        fontSize: '12px'
      }}
    >
      {text}
    </span>
  )
}

const menuButton = (active) => ({
  width: '100%',
  display: 'block',
  padding: '13px',
  marginBottom: '8px',
  borderRadius: '10px',
  border: 'none',
  textAlign: 'left',
  cursor: 'pointer',
  backgroundColor: active
    ? '#e8f0ff'
    : 'transparent',
  color: active ? '#1d4ed8' : '#374151',
  fontWeight: active ? 'bold' : 'normal'
})

const thStyle = {
  padding: '14px',
  color: '#6b7280',
  fontWeight: 'bold'
}

const tdStyle = {
  padding: '14px',
  verticalAlign: 'top'
}

const inputStyle = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '12px',
  border: '1px solid #d1d5db',
  borderRadius: '10px',
  fontSize: '14px'
}

const actionButton = (backgroundColor) => ({
  padding: '7px 10px',
  marginRight: '6px',
  border: 'none',
  borderRadius: '8px',
  backgroundColor,
  color: 'white',
  cursor: 'pointer',
  fontSize: '12px'
})

export default App