import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react'
import '@nimbus-ds/styles/dist/index.css'
import '@nimbus-ds/styles/dist/themes/dark.css'
import { ChatInput } from '@nimbus-ds/patterns'
import {
  Badge,
  Box,
  Button,
  Card,
  Checkbox,
  Popover,
  Skeleton,
  Text,
} from '@nimbus-ds/components'
import { ThemeProvider } from '@nimbus-ds/styles'
import { connect, iAmReady } from '@tiendanube/nexo'
import { nexo } from './lib/nexo'
import { api } from './lib/api'
import { ChatMessage } from './components/ChatMessage'

type ChatMessageItem = {
  id: string
  role: 'user' | 'assistant'
  content: string
  pending?: boolean
  streaming?: boolean
  logs?: string[]
}

const imgLogo = 'http://localhost:3845/assets/a10b1d1410c6f578a1e320ec6848e73449c6e426.svg'
const imgMenu = 'http://localhost:3845/assets/8bc4c71110f7f47033c9a41ac27e50d2270901f0.svg'
const imgNewChat = 'http://localhost:3845/assets/9fc80916e3ecae1580db89f517b035c0a4185a0d.svg'
const imgChatActive = 'http://localhost:3845/assets/369da6565857528ed4802339455d8f8cae70eae2.svg'
const imgChat = 'http://localhost:3845/assets/212a514b896fc2004e0a518c0f4dbf8c28ad9fa3.svg'
const imgSettings = 'http://localhost:3845/assets/14c4ff2b26a239fde2eaaaf96cfb8dda7829c336.svg'
const imgLogout = 'http://localhost:3845/assets/d46f51ff2774a3654444472c23749be656a27a7b.svg'
const imgTopbar = 'http://localhost:3845/assets/afe2f3744e329ea4a04044906bba7dadeeba9973.svg'
const imgHero = 'http://localhost:3845/assets/83915f77d5ddafb84da1d1d4ff95b9a58b82b009.svg'
const imgCard1 = 'http://localhost:3845/assets/7cc3f546b874f149cd95502fc7ef03c023c0dc72.svg'
const imgCard2 = 'http://localhost:3845/assets/25041fad805304457d6a366132ac4079d5913c4f.svg'
const imgCard3 = 'http://localhost:3845/assets/7d579221ab6130138310d04e8b11cf49f6923fd4.svg'
const imgCard4 = 'http://localhost:3845/assets/fa23b67b2eb1ad3917773b54f9fabd67c551f406.svg'
const imgAttach = 'http://localhost:3845/assets/f05471e84ce563f04f8106692922fa0882b74d71.svg'
const imgDots = 'http://localhost:3845/assets/6509586204cba743f36cd9705c243e9f01ab808a.svg'
const imgSend = 'http://localhost:3845/assets/a1ee3102a83e902b3b382a7bb75f9218bb53b0d6.svg'
const imgVoice = 'http://localhost:3845/assets/d856026255836a0667a7e0d0e7d6dacbf4c8bd6b.svg'
const imgTools = 'http://localhost:3845/assets/709a50260150e94ecab76e521a92eea1a214f1dc.svg'
const imgChevron = 'http://localhost:3845/assets/bd2545df32b7cea2202511f1e8660113bbb77d89.svg'

const SKILL_CATEGORIES = [
  {
    title: 'Produtos',
    skills: [
      { id: 'list_products', label: 'Listar Produtos' },
      { id: 'create_product', label: 'Criar Produto' },
      { id: 'update_product', label: 'Atualizar Produto' },
      { id: 'delete_product', label: 'Excluir Produto' },
      { id: 'update_product_stock_price', label: 'Atualizar Estoque e Preco' },
    ],
  },
  {
    title: 'Pedidos',
    skills: [
      { id: 'list_orders', label: 'Listar Pedidos' },
      { id: 'get_order', label: 'Ver Pedido' },
      { id: 'update_order', label: 'Atualizar Pedido' },
      { id: 'cancel_order', label: 'Cancelar Pedido' },
    ],
  },
  {
    title: 'Cupons',
    skills: [
      { id: 'list_coupons', label: 'Listar Cupons' },
      { id: 'create_coupon', label: 'Criar Cupom' },
    ],
  },
  {
    title: 'Categorias',
    skills: [
      { id: 'list_categories', label: 'Listar Categorias' },
      { id: 'create_category', label: 'Criar Categoria' },
    ],
  },
  {
    title: 'Clientes',
    skills: [
      { id: 'list_customers', label: 'Listar Clientes' },
      { id: 'get_customer', label: 'Ver Cliente' },
    ],
  },
]

const SKILL_OPTIONS = SKILL_CATEGORIES.flatMap((category) => category.skills)
const SKILL_LABELS = SKILL_OPTIONS.reduce<Record<string, string>>((acc, skill) => {
  acc[skill.id] = skill.label
  return acc
}, {})

const RECENT_CHATS = [
  {
    id: 'chat-1',
    title: 'Analise de produtos mais vendidos',
    time: '-1 dias atras',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M1.66699 15.833V2.5C1.66699 2.03976 2.03976 1.66699 2.5 1.66699C2.96024 1.66699 3.33301 2.03976 3.33301 2.5V15.833C3.33301 16.054 3.42087 16.2666 3.57715 16.4229C3.73343 16.5791 3.94598 16.667 4.16699 16.667H17.5C17.9602 16.667 18.333 17.0398 18.333 17.5C18.333 17.9602 17.9602 18.333 17.5 18.333H4.16699C3.50395 18.333 2.86728 18.0704 2.39844 17.6016C1.9296 17.1327 1.66699 16.496 1.66699 15.833Z" fill="#030213"/>
        <path d="M14.167 14.167V7.5C14.167 7.03976 14.5398 6.66699 15 6.66699C15.4602 6.66699 15.833 7.03976 15.833 7.5V14.167C15.8328 14.6271 15.4601 15 15 15C14.5399 15 14.1672 14.6271 14.167 14.167Z" fill="#030213"/>
        <path d="M10.0003 14.1667V4.16666C10.0003 3.70642 10.3731 3.33365 10.8333 3.33365C11.2936 3.33365 11.6663 3.70642 11.6663 4.16666V14.1667C11.6663 14.6269 11.2936 14.9997 10.8333 14.9997C10.3731 14.9997 10.0003 14.6269 10.0003 14.1667Z" fill="#030213"/>
        <path d="M5.83368 14.1667V11.6667C5.83368 11.2064 6.20645 10.8336 6.66669 10.8336C7.12692 10.8336 7.49969 11.2064 7.49969 11.6667V14.1667C7.49969 14.6269 7.12692 14.9997 6.66669 14.9997C6.20645 14.9997 5.83368 14.6269 5.83368 14.1667Z" fill="#030213"/>
      </svg>,
    active: true,
  },
  {
    id: 'chat-2',
    title: 'Criar campanha de desconto',
    time: 'Hoje',
    icon: imgChat,
  },
  {
    id: 'chat-3',
    title: 'Otimizar descricoes de produtos',
    time: '2 dias atras',
    icon: imgChat,
  },
  {
    id: 'chat-4',
    title: 'Relatorio de vendas do mes',
    time: '2 dias atras',
    icon: imgChat,
  },
]

const QUICK_CARDS = [
  {
    id: 'sales',
    title: 'Analise de Vendas',
    description: 'Analisar desempenho de produtos e identificar tendencias',
    icon: imgCard1,
  },
  {
    id: 'inventory',
    title: 'Gestao de Estoque',
    description: 'Verificar produtos com baixo estoque e sugerir reposicao',
    icon: imgCard2,
  },
  {
    id: 'support',
    title: 'Atendimento ao Cliente',
    description: 'Gerar respostas para duvidas frequentes de clientes',
    icon: imgCard3,
  },
  {
    id: 'conversion',
    title: 'Otimizacao de Conversao',
    description: 'Sugerir melhorias para aumentar vendas na loja',
    icon: imgCard4,
  },
]

function App() {
  const [isConnected, setIsConnected] = useState(false)
  const [input, setInput] = useState('')
  const bypassNexo = import.meta.env.VITE_BYPASS_NEXO === 'true'
  const [messages, setMessages] = useState<ChatMessageItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [skillsOpen, setSkillsOpen] = useState(false)
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light')
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null)

  const selectedCount = selectedSkills.length
  const selectedSkillLabels = useMemo(
    () => selectedSkills.map((skill) => SKILL_LABELS[skill] ?? skill),
    [selectedSkills],
  )

  const toggleSkill = (skillId: string) => {
    setSelectedSkills((current) =>
      current.includes(skillId)
        ? current.filter((item) => item !== skillId)
        : [...current, skillId],
    )
  }

  const clearSelection = () => {
    setSelectedSkills([])
  }

  useEffect(() => {
    if (bypassNexo) {
      setIsConnected(true)
      return undefined
    }

    let active = true

    connect(nexo)
      .then(() => {
        if (!active) return
        setIsConnected(true)
        iAmReady(nexo)
      })
      .catch(() => {
        if (!active) return
        setIsConnected(false)
      })

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    document.body.dataset.theme = themeMode
  }, [themeMode])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const trimmed = input.trim()

    if (!trimmed || isLoading) return

    const requestSkills = [...selectedSkills]
    const pendingId = crypto.randomUUID()
    const userMessage: ChatMessageItem = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmed,
    }

    const pendingMessage: ChatMessageItem = {
      id: pendingId,
      role: 'assistant',
      content: '',
      pending: true,
      logs: requestSkills,
    }

    setMessages((current) => [...current, userMessage, pendingMessage])
    setInput('')
    setIsLoading(true)
    setError(null)

    try {
      const response = await api.post('/api/chat', {
        message: trimmed,
        ...(requestSkills.length > 0 ? { toolsToLoad: requestSkills } : {}),
      })

      const payload = response.data ?? {}
      const reply =
        payload.message ?? payload.text ?? payload.response ?? payload.content ?? ''

      const assistantMessage: ChatMessageItem = {
        id: pendingId,
        role: 'assistant',
        content: reply || 'Resposta recebida, mas sem conteudo para exibir.',
        pending: false,
        streaming: true,
        logs: requestSkills,
      }

      setMessages((current) =>
        current.map((message) =>
          message.id === pendingId ? assistantMessage : message,
        ),
      )
      setStreamingMessageId(pendingId)
    } catch (requestError) {
      console.error('Chat request failed', requestError)
      setMessages((current) =>
        current.filter((message) => message.id !== pendingId),
      )
      setError('Ocorreu um erro ao enviar a mensagem.')
      setIsLoading(false)
    }
  }

  const handleStreamComplete = (messageId: string) => {
    if (streamingMessageId !== messageId) return
    setMessages((current) =>
      current.map((message) =>
        message.id === messageId ? { ...message, streaming: false } : message,
      ),
    )
    setStreamingMessageId(null)
    setIsLoading(false)
  }

  if (!isConnected) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh">
        <Card padding="base" style={{ width: '320px' }}>
          <Box display="flex" flexDirection="column" gap="3">
            <Skeleton width="100%" height="24px" borderRadius="8px" />
            <Skeleton width="100%" height="16px" borderRadius="8px" />
            <Skeleton width="80%" height="16px" borderRadius="8px" />
          </Box>
        </Card>
      </Box>
    )
  }

  return (
    <ThemeProvider theme={themeMode === 'dark' ? 'dark' : 'base'}>
      <Box className="na-app">
        <Box className="na-sidebar">
          <Box className="na-sidebar-header">
            <Box className="na-logo">
              <img src={imgLogo} alt="" className="na-logo-icon" />
              <Text className="na-logo-text">Nuvemshop AI</Text>
            </Box>
            <Button type="button" className="na-icon-button" appearance="transparent">
              <img src={imgMenu} alt="" />
            </Button>
          </Box>

          <Box className="na-sidebar-section">
            <Button type="button" className="na-new-chat" appearance="primary">
              <img src={imgNewChat} alt="" />
              Nova conversa
            </Button>
          </Box>

          <Box className="na-sidebar-list">
            {RECENT_CHATS.map((item) => (
              <ChatMessage key={item.id} message={item} isLast={false} />
            ))}
          </Box>

          <Box className="na-sidebar-footer">
            <Button type="button" className="na-footer-button" appearance="transparent">
              <img src={imgSettings} alt="" />
              Configuracoes
            </Button>
            <Button type="button" className="na-footer-button" appearance="transparent">
              <img src={imgLogout} alt="" />
              Sair
            </Button>
          </Box>
        </Box>

        <Box className="na-main">
          <Box className="na-topbar">
            <Text className="na-topbar-title">Nova Conversa</Text>
            <Button
              type="button"
              className="na-icon-button"
              appearance="transparent"
              onClick={() =>
                setThemeMode((current) => (current === 'dark' ? 'light' : 'dark'))
              }
            >
              <img src={imgTopbar} alt="" />
            </Button>
          </Box>

          <Box className="na-content">
            {messages.length === 0 ? (
              <Box className="na-content-inner">
                <Box className="na-hero">
                  <Box className="na-hero-icon">
                    <img src={imgHero} alt="" />
                  </Box>
                  <Text className="na-hero-title">Bem-vindo ao Nuvemshop AI</Text>
                  <Text className="na-hero-subtitle">
                    Seu assistente inteligente para otimizar vendas, gerenciar produtos e
                    melhorar a experiencia dos seus clientes na Nuvemshop.
                  </Text>
                </Box>

                <Box className="na-feature-grid">
                  {QUICK_CARDS.map((card) => (
                    <Box key={card.id} className="na-feature-card">
                      <Box className="na-feature-icon">
                        <img src={card.icon} alt="" />
                      </Box>
                      <Box className="na-feature-content">
                        <Text className="na-feature-title">{card.title}</Text>
                        <Text className="na-feature-text">{card.description}</Text>
                      </Box>
                    </Box>
                  ))}
                </Box>

                <Box className="na-stats">
                  <Box className="na-stat">
                    <Text className="na-stat-title">24/7</Text>
                    <Text className="na-stat-text">Disponivel sempre</Text>
                  </Box>
                  <Box className="na-stat">
                    <Text className="na-stat-title">100+</Text>
                    <Text className="na-stat-text">Tarefas automatizadas</Text>
                  </Box>
                  <Box className="na-stat">
                    <Text className="na-stat-title">Tempo Real</Text>
                    <Text className="na-stat-text">Analises instantaneas</Text>
                  </Box>
                </Box>
              </Box>
            ) : (
              <Box className="na-content-inner na-chat-thread">
                {messages.map((message, index) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    isLast={index === messages.length - 1}
                    onStreamComplete={handleStreamComplete}
                  />
                ))}
              </Box>
            )}
          </Box>

          {error ? (
            <Box className="na-error">
              <Text>{error}</Text>
              <Button type="button" appearance="transparent" onClick={() => setError(null)}>
                Fechar
              </Button>
            </Box>
          ) : null}

          <Box as="form" onSubmit={handleSubmit} className="na-input-area">
            <Box className="na-input-row">
              <Box className="na-input-actions">
                <Button
                  type="button"
                  appearance="transparent"
                  className="na-icon-button na-input-icon"
                >
                  <img src={imgAttach} alt="" />
                </Button>
                <Button
                  type="button"
                  appearance="transparent"
                  className="na-icon-button na-input-icon"
                >
                  <img src={imgDots} alt="" />
                </Button>
              </Box>

              <Box className="na-input-box">
                <ChatInput aiFocused={isLoading} className="na-chat-input">
                  <ChatInput.Field
                    id="chat-input"
                    value={input}
                    onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                      setInput(event.target.value)
                    }
                    placeholder="Mensagem para Nuvemshop AI..."
                    appearance="none"
                    lines={1}
                    maxLines={4}
                    disabled={isLoading}
                    className="na-chat-field"
                  />
                </ChatInput>
                <Button
                  type="submit"
                  appearance="transparent"
                  className="na-send-button"
                  disabled={!input.trim() || isLoading}
                >
                  <img src={imgSend} alt="" />
                </Button>
              </Box>

              <Button
                type="button"
                appearance="transparent"
                className="na-voice-button"
                disabled
              >
                <img src={imgVoice} alt="" />
              </Button>
            </Box>

            <Box className="na-tools-row">
              <Popover
                position="bottom-start"
                visible={skillsOpen}
                onVisibility={setSkillsOpen}
                content={
                  <Box className="na-tools-panel">
                    <Text className="na-tools-title">Selecionar Skills</Text>
                    {SKILL_CATEGORIES.map((category) => (
                      <Box key={category.title} className="na-tools-group">
                        <Text className="na-tools-group-title">{category.title}</Text>
                        <Box className="na-tools-list">
                          {category.skills.map((skill) => (
                            <Checkbox
                              key={skill.id}
                              name={skill.id}
                              label={skill.label}
                              checked={selectedSkills.includes(skill.id)}
                              onChange={() => toggleSkill(skill.id)}
                              className="na-tools-checkbox"
                            />
                          ))}
                        </Box>
                      </Box>
                    ))}
                  </Box>
                }
              >
                <Button type="button" appearance="transparent" className="na-tools-button">
                  <img src={imgTools} alt="" />
                  Ferramentas
                  <img src={imgChevron} alt="" />
                </Button>
              </Popover>

              <Box className="na-tools-meta">
                <Badge count={selectedCount} appearance="neutral" />
                <Button
                  type="button"
                  appearance="transparent"
                  disabled={selectedCount === 0}
                  onClick={clearSelection}
                >
                  Limpar Selecao
                </Button>
              </Box>
            </Box>

            <Text className="na-disclaimer">
              Nuvemshop AI pode cometer erros. Considere verificar informacoes importantes.
            </Text>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default App
