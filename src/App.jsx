import { useEffect, useState } from 'react'

const API_URL = ''

function App() {
  const [tasks, setTasks] = useState([])
  const [replies, setReplies] = useState([])
  const [view, setView] = useState('login')
  const [isLogged, setIsLogged] = useState(false)
  const [filter, setFilter] = useState('Todos')
  const [selectedTask, setSelectedTask] = useState(null)
  const [message, setMessage] = useState('')
  const [reply, setReply] = useState('')

  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  const [registerName, setRegisterName] = useState('')
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerConfirmEmail, setRegisterConfirmEmail] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')

  const [forgotEmail, setForgotEmail] = useState('')

  const [customer, setCustomer] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [department, setDepartment] = useState('Suporte Técnico')
  const [ticketType, setTicketType] = useState('Aberto')
  const [priority, setPriority] = useState('Média')

  async function loadTasks() {
    try {
      const response = await fetch(`${API_URL}/tasks`)
      const data = await response.json()
      setTasks(data)
    } catch (error) {
      setMessage('Erro ao carregar chamados. Verifique se o backend está rodando.')
    }
  }

  function login() {
    const savedUsers = JSON.parse(localStorage.getItem('fiberops_users')) || []

    const adminLogin =
      loginEmail === 'admin@fiberops.com' &&
      loginPassword === '123456'

    const registeredUser = savedUsers.find(
      user => user.email === loginEmail && user.password === loginPassword
    )

    if (adminLogin || registeredUser) {
      setIsLogged(true)
      setView('admin')
      setMessage('')
      setLoginEmail('')
      setLoginPassword('')
    } else {
      setMessage('E-mail ou senha inválidos.')
    }
  }

  function registerUser() {
    if (!registerName || !registerEmail || !registerConfirmEmail || !registerPassword) {
      setMessage('Preencha todos os campos para registrar.')
      return
    }

    if (registerEmail !== registerConfirmEmail) {
      setMessage('Os e-mails não coincidem.')
      return
    }

    const savedUsers = JSON.parse(localStorage.getItem('fiberops_users')) || []

    const userExists = savedUsers.some(user => user.email === registerEmail)

    if (userExists) {
      setMessage('Este e-mail já está cadastrado.')
      return
    }

    const newUser = {
      name: registerName,
      email: registerEmail,
      password: registerPassword
    }

    localStorage.setItem('fiberops_users', JSON.stringify([...savedUsers, newUser]))

    setRegisterName('')
    setRegisterEmail('')
    setRegisterConfirmEmail('')
    setRegisterPassword('')
    setMessage('Conta criada com sucesso. Agora faça login.')
    setView('login')
  }

  function recoverPassword() {
    if (!forgotEmail) {
      setMessage('Informe seu e-mail para recuperar a senha.')
      return
    }

    setMessage('Recuperação simulada: procure o administrador do sistema para redefinir sua senha.')
    setForgotEmail('')
    setView('login')
  }

  async function addTask(isGuest = false) {
    if (!customer || !title || !description) {
      setMessage('Preencha todos os campos para abrir o chamado.')
      return
    }

    await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer,
        title,
        description,
        priority,
        department,
        type: ticketType
      })
    })

    setCustomer('')
    setGuestEmail('')
    setTitle('')
    setDescription('')
    setPriority('Média')
    setDepartment('Suporte Técnico')
    setTicketType('Aberto')

    await loadTasks()

    if (isGuest) {
      setMessage('Ticket enviado como convidado com sucesso.')
      setView('login')
    } else {
      setMessage('Solicitação aberta com sucesso.')
      setView('admin')
    }
  }

  async function updateStatus(id, status) {
    await fetch(`${API_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    })

    await loadTasks()
  }

  async function deleteTask(id) {
    await fetch(`${API_URL}/tasks/${id}`, { method: 'DELETE' })
    await loadTasks()
  }

  async function sendReply() {
    if (!selectedTask || !reply) {
      setMessage('Digite uma resposta antes de enviar.')
      return
    }

    const newReply = {
      id: Date.now(),
      taskId: selectedTask.id,
      customer: selectedTask.customer,
      title: selectedTask.title,
      content: reply,
      createdAt: new Date().toLocaleString('pt-BR')
    }

    const updatedReplies = [newReply, ...replies]
    setReplies(updatedReplies)
    localStorage.setItem('fiberops_replies', JSON.stringify(updatedReplies))

    await updateStatus(selectedTask.id, 'Finalizado')

    setReply('')
    setSelectedTask(null)
    setMessage('Resposta enviada e chamado marcado como finalizado.')
    setView('responses')
  }

  function logout() {
    setIsLogged(false)
    setView('login')
    setMessage('Logout realizado com sucesso.')
  }

  useEffect(() => {
    loadTasks()

    const savedReplies = localStorage.getItem('fiberops_replies')
    if (savedReplies) {
      setReplies(JSON.parse(savedReplies))
    }
  }, [])

  const openTickets = tasks.filter(task => !task.status || task.status === 'Aberto').length
  const progressTickets = tasks.filter(task => task.status === 'Em andamento').length
  const resolvedTickets = tasks.filter(task => task.status === 'Finalizado').length

  const filteredTasks = tasks.filter(task => {
    const status = task.status || 'Aberto'
    if (filter === 'Todos') return true
    return status === filter
  })

  if (!isLogged) {
    return (
      <div style={styles.publicPage}>
        <header style={styles.publicTopbar}>
          <button style={styles.publicMenuButton} onClick={() => setView('login')}>🔒 Entrar</button>
          <button style={styles.publicMenuButton} onClick={() => setView('register')}>↪ Registrar</button>
          <button style={styles.publicMenuButton} onClick={() => setView('forgot')}>🔐 Esqueceu a senha</button>
          <button style={styles.publicMenuButton} onClick={() => setView('guest')}>➕ Enviar ticket como convidado</button>
        </header>

        {message && <div style={styles.publicMessage}>{message}</div>}

        {view !== 'guest' && (
          <h1 style={styles.publicTitle}>SISTEMA DE SUPORTE</h1>
        )}

        {view === 'login' && (
          <section style={styles.authBox}>
            <h2 style={styles.authTitle}>Entrar</h2>

            <input
              value={loginEmail}
              onChange={e => setLoginEmail(e.target.value)}
              placeholder="E-mail"
              style={styles.authInput}
            />

            <input
              value={loginPassword}
              onChange={e => setLoginPassword(e.target.value)}
              type="password"
              placeholder="Senha"
              style={styles.authInput}
            />

            <button onClick={login} style={styles.authButton}>Entrar</button>

            <div style={styles.authLinks}>
              <button onClick={() => setView('register')} style={styles.linkButton}>Registrar</button>
              <button onClick={() => setView('forgot')} style={styles.linkButton}>Esqueceu a senha</button>
            </div>

            <p style={styles.hint}>Login de teste: admin@fiberops.com / 123456</p>
          </section>
        )}

        {view === 'register' && (
          <section style={styles.authBox}>
            <h2 style={styles.authTitle}>Criar nova Conta</h2>

            <input value={registerName} onChange={e => setRegisterName(e.target.value)} placeholder="Nome" style={styles.authInput} />
            <input value={registerEmail} onChange={e => setRegisterEmail(e.target.value)} placeholder="E-mail" style={styles.authInput} />
            <input value={registerConfirmEmail} onChange={e => setRegisterConfirmEmail(e.target.value)} placeholder="Repetir e-mail" style={styles.authInput} />
            <input value={registerPassword} onChange={e => setRegisterPassword(e.target.value)} type="password" placeholder="Senha" style={styles.authInput} />

            <button onClick={registerUser} style={styles.authButton}>Registrar</button>

            <div style={styles.authLinks}>
              <button onClick={() => setView('login')} style={styles.linkButton}>Entrar</button>
              <button onClick={() => setView('forgot')} style={styles.linkButton}>Esqueceu a senha</button>
            </div>
          </section>
        )}

        {view === 'forgot' && (
          <section style={styles.authBox}>
            <h2 style={styles.authTitle}>Recuperar senha</h2>

            <input
              value={forgotEmail}
              onChange={e => setForgotEmail(e.target.value)}
              placeholder="Informe seu e-mail"
              style={styles.authInput}
            />

            <button onClick={recoverPassword} style={styles.authButton}>Recuperar senha</button>

            <div style={styles.authLinks}>
              <button onClick={() => setView('login')} style={styles.linkButton}>Voltar para entrar</button>
            </div>
          </section>
        )}

        {view === 'guest' && (
          <section style={styles.guestArea}>
            <h1 style={styles.guestTitle}>Enviar ticket como convidado</h1>

            <div style={styles.guestGrid}>
              <FormField label="Nome">
                <input value={customer} onChange={e => setCustomer(e.target.value)} placeholder="Nome" style={styles.input} />
              </FormField>

              <FormField label="E-mail">
                <input value={guestEmail} onChange={e => setGuestEmail(e.target.value)} placeholder="E-mail" style={styles.input} />
              </FormField>

              <FormField label="Título">
                <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Título" style={styles.input} />
              </FormField>

              <FormField label="Departamento">
                <select value={department} onChange={e => setDepartment(e.target.value)} style={styles.input}>
                  <option>Suporte Técnico</option>
                  <option>Financeiro</option>
                  <option>Comercial</option>
                </select>
              </FormField>

              <FormField label="Tipo do Ticket">
                <select value={ticketType} onChange={e => setTicketType(e.target.value)} style={styles.input}>
                  <option>Aberto</option>
                  <option>Dúvida</option>
                  <option>Problema Técnico</option>
                </select>
              </FormField>

              <FormField label="Prioridade">
                <select value={priority} onChange={e => setPriority(e.target.value)} style={styles.input}>
                  <option>Alta</option>
                  <option>Média</option>
                  <option>Baixa</option>
                </select>
              </FormField>
            </div>

            <FormField label="Mensagem">
              <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Descreva sua solicitação" style={styles.guestTextarea} />
            </FormField>

            <button onClick={() => addTask(true)} style={styles.guestButton}>Enviar</button>
          </section>
        )}
      </div>
    )
  }

  return (
    <div style={styles.dashboard}>
      <aside style={styles.sidebar}>
        <div style={styles.logo}>SISTEMA DE SUPORTE</div>

        <MenuItem active={view === 'admin'} icon="🏠" title="Painel de controle" subtitle={`${tasks.length} chamados`} onClick={() => setView('admin')} />
        <MenuItem active={view === 'client'} icon="💬" title="Abrir chamado" subtitle="registrar solicitação" onClick={() => setView('client')} />
        <MenuItem active={view === 'reply'} icon="✉️" title="Responder chamado" subtitle="ver chamados abertos" onClick={() => setView('reply')} />
        <MenuItem active={view === 'responses'} icon="🗨️" title="Respostas" subtitle={`${replies.length} respostas`} onClick={() => setView('responses')} />
      </aside>

      <main style={styles.content}>
        <header style={styles.topbar}>
          <p style={styles.loginText}>Logado como Admin</p>
          <button onClick={logout} style={styles.logout}>logout</button>
        </header>

        {message && <div style={styles.message}>{message}</div>}

        {(view === 'admin' || view === 'reply') && (
          <>
            <h1 style={styles.title}>🏠 Painel de controle</h1>

            <section style={styles.cards}>
              <Card title="ABERTOS" value={openTickets} background="#2abc9c" />
              <Card title="EM ANDAMENTO" value={progressTickets} background="#3498db" />
              <Card title="FINALIZADOS" value={resolvedTickets} background="#8e44ad" />
              <Card title="TOTAL" value={tasks.length} background="#2c3e50" />
            </section>

            <section style={styles.ticketsArea}>
              <div style={styles.ticketHeader}>
                <h2 style={styles.sectionTitle}>Chamados atuais</h2>
                <button onClick={() => setView('client')} style={styles.newTicketButton}>Novo chamado</button>
              </div>

              <div style={styles.filters}>
                <button onClick={() => setFilter('Todos')} style={filterButton(filter === 'Todos')}>Todos</button>
                <button onClick={() => setFilter('Aberto')} style={filterButton(filter === 'Aberto')}>Aberto</button>
                <button onClick={() => setFilter('Em andamento')} style={filterButton(filter === 'Em andamento')}>Em andamento</button>
                <button onClick={() => setFilter('Finalizado')} style={filterButton(filter === 'Finalizado')}>Finalizado</button>
              </div>

              {filteredTasks.length === 0 ? (
                <div style={styles.emptyBox}>Nenhum chamado encontrado nesta categoria.</div>
              ) : (
                <div style={styles.ticketGrid}>
                  {filteredTasks.map(task => (
                    <div key={task.id} style={styles.ticketCard}>
                      <div style={styles.ticketTop}>
                        <span style={styles.ticketId}>#{task.id}</span>
                        <StatusBadge text={task.status || 'Aberto'} />
                      </div>

                      <h3 style={styles.ticketTitle}>{task.title}</h3>
                      <p style={styles.ticketDescription}>{task.description}</p>

                      <p><strong>Cliente:</strong> {task.customer}</p>
                      <p><strong>Prioridade:</strong> <PriorityBadge text={task.priority} /></p>

                      <div style={styles.ticketActions}>
                        <button onClick={() => setSelectedTask(task)} style={styles.viewButton}>Exibir / Responder</button>
                        <button onClick={() => updateStatus(task.id, 'Em andamento')} style={styles.purpleButton}>Andamento</button>
                        <button onClick={() => updateStatus(task.id, 'Finalizado')} style={styles.greenButton}>Finalizar</button>
                        <button onClick={() => deleteTask(task.id)} style={styles.redButton}>Excluir</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        {view === 'responses' && (
          <section>
            <h1 style={styles.title}>🗨️ Respostas</h1>

            <section style={styles.responseBox}>
              <h2 style={styles.sectionTitle}>Chamados respondidos</h2>

              {replies.length === 0 ? (
                <div style={styles.emptyBox}>Nenhuma resposta enviada ainda.</div>
              ) : (
                <div style={styles.responseTable}>
                  <div style={styles.responseHead}>
                    <strong>CLIENTE</strong>
                    <strong>TÍTULO</strong>
                    <strong>CONTEÚDO</strong>
                    <strong>CREATED AT</strong>
                    <strong>ESTADO</strong>
                  </div>

                  {replies.map(item => (
                    <div key={item.id} style={styles.responseRow}>
                      <span>{item.customer}</span>
                      <span>{item.title}</span>
                      <span>{item.content}</span>
                      <span>{item.createdAt}</span>
                      <span style={styles.finishedBadge}>Respondido</span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </section>
        )}

        {view === 'client' && (
          <section style={styles.formArea}>
            <h1 style={styles.title}>💬 Abrir chamado técnico</h1>

            <FormField label="Nome do cliente">
              <input value={customer} onChange={e => setCustomer(e.target.value)} placeholder="Ex: João Silva" style={styles.input} />
            </FormField>

            <FormField label="Título do problema">
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex: Internet sem conexão" style={styles.input} />
            </FormField>

            <FormField label="Descrição">
              <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Descreva o problema" style={styles.textarea} />
            </FormField>

            <FormField label="Prioridade">
              <select value={priority} onChange={e => setPriority(e.target.value)} style={styles.input}>
                <option>Alta</option>
                <option>Média</option>
                <option>Baixa</option>
              </select>
            </FormField>

            <button onClick={() => addTask(false)} style={styles.submitButton}>Abrir solicitação</button>
          </section>
        )}

        {selectedTask && (
          <div style={styles.modalOverlay}>
            <div style={styles.modal}>
              <div style={styles.modalHeader}>
                <strong>Exibir ticket</strong>
                <button onClick={() => setSelectedTask(null)} style={styles.closeButton}>×</button>
              </div>

              <div style={styles.modalSectionTitle}>Detalhes</div>

              <div style={styles.detailsBox}>
                <DetailRow label="Assinar para..." value={<span style={styles.grayTag}>Admin</span>} />
                <DetailRow label="Cliente" value={<span style={styles.redTag}>{selectedTask.customer}</span>} />
                <DetailRow label="Departamento" value="Suporte Técnico" />
                <DetailRow label="Tipo" value="Aberto" />
                <DetailRow label="Prioridade" value={selectedTask.priority} />
                <DetailRow label="Status" value={selectedTask.status || 'Aberto'} />
                <DetailRow label="Título" value={selectedTask.title} />
                <DetailRow label="Mensagem" value={selectedTask.description} />
              </div>

              <div style={styles.infoBox}>
                Mensagem: depois de sua resposta, o ticket será automaticamente marcado como finalizado.
              </div>

              <div style={styles.replyBox}>
                <h2 style={styles.replyTitle}>Responder chamado</h2>

                <label style={styles.label}>Título</label>
                <input value={`Responder a: ${selectedTask.title}`} readOnly style={styles.modalInput} />

                <label style={styles.label}>Mensagem</label>
                <textarea value={reply} onChange={e => setReply(e.target.value)} placeholder="Digite a resposta para o cliente..." style={styles.replyTextarea} />

                <div style={styles.modalActions}>
                  <button onClick={() => setSelectedTask(null)} style={styles.cancelButton}>Cancelar</button>
                  <button onClick={sendReply} style={styles.sendButton}>Enviar resposta</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

function MenuItem({ active, icon, title, subtitle, onClick }) {
  return (
    <button onClick={onClick} style={{ ...styles.menuItem, ...(active ? styles.menuActive : {}) }}>
      <span style={styles.menuIcon}>{icon}</span>
      <div>
        <strong>{title}</strong>
        <p style={{ ...styles.menuSubtitle, ...(active ? styles.menuSubtitleActive : {}) }}>{subtitle}</p>
      </div>
    </button>
  )
}

function Card({ title, value, background }) {
  return (
    <div style={{ ...styles.card, backgroundColor: background }}>
      <h3 style={styles.cardTitle}>{title}</h3>
      <h2 style={styles.cardValue}>{value}</h2>
      <p style={styles.cardText}>Número de chamados</p>
    </div>
  )
}

function FormField({ label, children }) {
  return (
    <div style={styles.formField}>
      <label style={styles.label}>{label}</label>
      {children}
    </div>
  )
}

function DetailRow({ label, value }) {
  return (
    <div style={styles.detailRow}>
      <div>{label}</div>
      <div>{value}</div>
    </div>
  )
}

function PriorityBadge({ text }) {
  const style = text === 'Alta' ? styles.highBadge : text === 'Baixa' ? styles.lowBadge : styles.mediumBadge
  return <span style={style}>{text}</span>
}

function StatusBadge({ text }) {
  const style = text === 'Finalizado' ? styles.finishedBadge : text === 'Em andamento' ? styles.progressBadge : styles.openBadge
  return <span style={style}>{text}</span>
}

const filterButton = active => ({
  border: 'none',
  backgroundColor: active ? '#2c3e50' : 'white',
  color: active ? 'white' : '#333',
  padding: '10px 14px',
  cursor: 'pointer'
})

function button(backgroundColor) {
  return {
    border: 'none',
    color: 'white',
    backgroundColor,
    padding: '8px 10px',
    cursor: 'pointer'
  }
}

function badge(backgroundColor) {
  return {
    backgroundColor,
    color: 'white',
    padding: '6px 8px',
    fontSize: '12px',
    display: 'inline-block'
  }
}

const styles = {
  publicPage: {
    minHeight: '100vh',
    backgroundColor: '#eef2f7',
    fontFamily: 'Arial, sans-serif',
    color: '#222'
  },
  publicTopbar: {
    height: '48px',
    backgroundColor: 'white',
    borderBottom: '1px solid #ddd',
    display: 'flex',
    alignItems: 'center',
    gap: '25px',
    padding: '0 40px'
  },
  publicMenuButton: {
    border: 'none',
    backgroundColor: 'transparent',
    color: '#2c3e50',
    cursor: 'pointer',
    fontSize: '14px'
  },
  publicTitle: {
    textAlign: 'center',
    margin: '45px 0 30px',
    fontSize: '34px',
    fontWeight: 'normal'
  },
  publicMessage: {
    maxWidth: '700px',
    margin: '20px auto 0',
    backgroundColor: '#d9edf7',
    color: '#31708f',
    padding: '14px',
    border: '1px solid #bce8f1'
  },
  authBox: {
    width: '480px',
    backgroundColor: 'white',
    margin: '0 auto',
    padding: '60px',
    boxSizing: 'border-box'
  },
  authTitle: {
    textAlign: 'center',
    fontWeight: 'normal',
    marginBottom: '30px'
  },
  authInput: {
    width: '100%',
    padding: '15px',
    marginBottom: '15px',
    border: '1px solid #ddd',
    boxSizing: 'border-box',
    fontSize: '14px'
  },
  authButton: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#2c3e50',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  authLinks: {
    marginTop: '16px',
    display: 'flex',
    justifyContent: 'space-between'
  },
  linkButton: {
    border: 'none',
    backgroundColor: 'transparent',
    color: '#286090',
    cursor: 'pointer'
  },
  hint: {
    marginTop: '20px',
    fontSize: '12px',
    color: '#666',
    textAlign: 'center'
  },
  guestArea: {
    maxWidth: '960px',
    margin: '35px auto',
    padding: '0 20px'
  },
  guestTitle: {
    fontWeight: 'normal',
    marginBottom: '25px'
  },
  guestGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px 25px'
  },
  guestTextarea: {
    width: '100%',
    height: '280px',
    padding: '12px',
    border: '1px solid #3d83b9',
    boxSizing: 'border-box',
    resize: 'none',
    backgroundColor: 'white'
  },
  guestButton: {
    marginTop: '12px',
    backgroundColor: '#5cb85c',
    color: 'white',
    border: 'none',
    padding: '10px 22px',
    cursor: 'pointer'
  },
  dashboard: {
    minHeight: '100vh',
    backgroundColor: '#eef2f7',
    fontFamily: 'Arial, sans-serif',
    display: 'flex',
    color: '#333'
  },
  sidebar: {
    width: '230px',
    backgroundColor: '#f2f2f2',
    borderRight: '1px solid #ccc',
    flexShrink: 0
  },
  logo: {
    backgroundColor: '#34495e',
    color: 'white',
    padding: '12px',
    fontWeight: 'bold',
    fontSize: '14px'
  },
  menuItem: {
    width: '100%',
    display: 'flex',
    gap: '12px',
    padding: '13px 12px',
    border: 'none',
    borderBottom: '1px solid #ccc',
    backgroundColor: 'transparent',
    color: '#333',
    textAlign: 'left',
    cursor: 'pointer'
  },
  menuActive: {
    backgroundColor: '#2c3e50',
    color: 'white'
  },
  menuIcon: {
    fontSize: '26px',
    width: '32px'
  },
  menuSubtitle: {
    margin: '4px 0 0',
    fontSize: '12px',
    color: '#555'
  },
  menuSubtitleActive: {
    backgroundColor: '#e74c3c',
    color: 'white',
    padding: '3px 6px',
    display: 'inline-block'
  },
  content: {
    flex: 1,
    padding: '0 20px 35px',
    overflowX: 'hidden'
  },
  topbar: {
    height: '38px',
    backgroundColor: 'white',
    borderBottom: '1px solid #ddd',
    display: 'flex',
    alignItems: 'center',
    padding: '0 15px',
    fontSize: '13px'
  },
  loginText: {
    margin: 0
  },
  logout: {
    marginLeft: 'auto',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#34495e',
    cursor: 'pointer'
  },
  message: {
    backgroundColor: '#d1fae5',
    color: '#065f46',
    padding: '14px',
    marginTop: '18px',
    fontWeight: 'bold'
  },
  title: {
    fontSize: '28px',
    fontWeight: 'normal',
    margin: '22px 0',
    color: '#333'
  },
  cards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
    gap: '22px',
    marginBottom: '30px'
  },
  card: {
    color: 'white',
    padding: '16px',
    minHeight: '115px'
  },
  cardTitle: {
    fontSize: '13px',
    fontWeight: 'normal',
    margin: 0
  },
  cardValue: {
    fontSize: '30px',
    margin: '5px 0 15px',
    borderBottom: '1px solid rgba(255,255,255,0.7)',
    paddingBottom: '10px'
  },
  cardText: {
    fontSize: '12px',
    margin: 0
  },
  ticketsArea: {
    marginTop: '10px'
  },
  ticketHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '16px'
  },
  sectionTitle: {
    fontSize: '22px',
    fontWeight: 'normal',
    marginBottom: '15px'
  },
  newTicketButton: {
    border: 'none',
    backgroundColor: '#2c3e50',
    color: 'white',
    padding: '10px 14px',
    cursor: 'pointer'
  },
  filters: {
    display: 'flex',
    gap: '8px',
    marginBottom: '18px',
    flexWrap: 'wrap'
  },
  emptyBox: {
    backgroundColor: 'white',
    padding: '20px',
    border: '1px solid #ddd'
  },
  ticketGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '18px'
  },
  ticketCard: {
    backgroundColor: 'white',
    border: '1px solid #ddd',
    padding: '18px'
  },
  ticketTop: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  ticketId: {
    backgroundColor: '#34495e',
    color: 'white',
    padding: '5px 8px',
    fontSize: '12px'
  },
  ticketTitle: {
    color: '#2c3e50'
  },
  ticketDescription: {
    color: '#555',
    fontSize: '13px'
  },
  ticketActions: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '16px'
  },
  viewButton: button('#5dade2'),
  purpleButton: button('#8e44ad'),
  greenButton: button('#27ae60'),
  redButton: button('#d9534f'),
  responseBox: {
    backgroundColor: 'white',
    border: '1px solid #ddd',
    padding: '18px'
  },
  responseTable: {
    width: '100%',
    border: '1px solid #ddd'
  },
  responseHead: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 2fr 1fr 120px',
    backgroundColor: '#2f3b46',
    color: 'white',
    padding: '12px',
    fontSize: '12px'
  },
  responseRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 2fr 1fr 120px',
    padding: '12px',
    borderTop: '1px solid #ddd',
    fontSize: '13px',
    alignItems: 'center'
  },
  formArea: {
    maxWidth: '650px',
    backgroundColor: 'white',
    marginTop: '24px',
    padding: '28px',
    border: '1px solid #ddd'
  },
  formField: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '16px'
  },
  label: {
    fontWeight: 'bold',
    marginBottom: '6px',
    display: 'block'
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
    boxSizing: 'border-box',
    marginBottom: '14px'
  },
  textarea: {
    width: '100%',
    padding: '12px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
    height: '120px',
    resize: 'none',
    boxSizing: 'border-box'
  },
  submitButton: {
    width: '100%',
    padding: '14px',
    border: 'none',
    backgroundColor: '#2c3e50',
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.35)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '20px'
  },
  modal: {
    width: '100%',
    maxWidth: '900px',
    maxHeight: '90vh',
    backgroundColor: '#f7f9fc',
    boxShadow: '0 6px 18px rgba(0,0,0,0.35)',
    border: '1px solid #ccc',
    overflowY: 'auto'
  },
  modalHeader: {
    backgroundColor: '#3d83b9',
    color: 'white',
    padding: '16px 20px',
    display: 'flex',
    justifyContent: 'space-between'
  },
  closeButton: {
    border: 'none',
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: '24px',
    cursor: 'pointer'
  },
  modalSectionTitle: {
    backgroundColor: '#2f3b46',
    color: 'white',
    padding: '10px 18px',
    fontWeight: 'bold'
  },
  detailsBox: {
    backgroundColor: 'white',
    margin: '18px',
    border: '1px solid #ddd'
  },
  detailRow: {
    display: 'grid',
    gridTemplateColumns: '200px 1fr',
    borderBottom: '1px solid #ddd',
    padding: '12px',
    alignItems: 'center'
  },
  grayTag: {
    backgroundColor: '#777',
    color: 'white',
    padding: '7px 10px'
  },
  redTag: {
    backgroundColor: '#d9534f',
    color: 'white',
    padding: '7px 10px'
  },
  infoBox: {
    backgroundColor: '#d9edf7',
    color: '#31708f',
    padding: '15px',
    margin: '18px',
    border: '1px solid #bce8f1'
  },
  replyBox: {
    padding: '0 18px 18px'
  },
  replyTitle: {
    margin: '10px 0 15px',
    fontWeight: 'normal'
  },
  modalInput: {
    width: '100%',
    padding: '12px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
    boxSizing: 'border-box',
    marginBottom: '14px'
  },
  replyTextarea: {
    width: '100%',
    height: '130px',
    padding: '12px',
    border: '1px solid #3d83b9',
    boxSizing: 'border-box',
    resize: 'none'
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    paddingTop: '18px'
  },
  cancelButton: button('#ffffff'),
  sendButton: button('#3d83b9'),
  highBadge: badge('#d9534f'),
  mediumBadge: badge('#f0ad4e'),
  lowBadge: badge('#27ae60'),
  openBadge: badge('#5dade2'),
  progressBadge: badge('#f0ad4e'),
  finishedBadge: badge('#27ae60')
}

export default App