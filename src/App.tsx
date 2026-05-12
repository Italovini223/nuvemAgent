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
import { Sidebar } from './components/Sidebar'

import { QUICK_CARDS } from './utils/quickCards'

// Phosphor Icons
import {
  ChatCircleDotsIcon ,
  GearIcon ,
  SignOutIcon,
  PlusCircleIcon,
  ListIcon,
  SparkleIcon,
  PaperPlaneTiltIcon ,
  WrenchIcon,
  SunIcon,
  MoonIcon,
  ArticleIcon,
} from '@phosphor-icons/react'
import { QuickCard } from './components/QuickCard'
import { executePrompt, fetchPrompts, fetchPromptById } from './lib/prompts'
import type { PromptInfo } from './lib/prompts'


type ChatMessageItem = {
  id: string
  role: 'user' | 'assistant'
  content: string
  pending?: boolean
  streaming?: boolean
  logs?: string[]
}

// Phosphor Icons
const imgLogo = <ChatCircleDotsIcon  size={24} weight="fill" />
const imgMenu = <ListIcon size={24} />
const imgNewChat = <PlusCircleIcon size={24} />
const imgChat = <ChatCircleDotsIcon  size={24} />
const imgSettings = <GearIcon  size={24} />
const imgLogout = <SignOutIcon size={24} />


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
  {
    title: 'Blog',
    skills: [
      { id: 'get_blog', label: 'Recuperar detalhes do blog' },
      { id: 'list_blog_posts', label: 'Listar posts do blog' },
      { id: 'get_blog_post', label: 'Recuperar post do blog' },
      { id: 'create_blog_post', label: 'Criar post do blog' },
      { id: 'update_blog_post', label: 'Atualizar post do blog' },
      { id: 'delete_blog_post', label: 'Excluir post do blog' },
    ],
  },
  {
    title: 'Checkouts Abandonados',
    skills: [
      { id: 'list_abandoned_checkouts', label: 'Listar checkouts abandonados' },
      { id: 'get_abandoned_checkout', label: 'Recuperar checkout abandonado' },
      { id: 'add_coupon_to_abandoned_checkout', label: 'Aplicar cupom em checkout abandonado' },
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
  const [availablePrompts, setAvailablePrompts] = useState<PromptInfo[]>([])
  const [currentPrompt, setCurrentPrompt] = useState<PromptInfo | null>(null)
  const [loadingPrompts, setLoadingPrompts] = useState(false)

  const selectedCount = selectedSkills.length
  const selectedSkillLabels = useMemo(
    () => selectedSkills.map((skill) => SKILL_LABELS[skill] ?? skill),
    [selectedSkills],
  )
  const featureCards = useMemo(() => {
    if (availablePrompts && availablePrompts.length > 0) {
      return availablePrompts.map((p, i) => ({
        id: p.name ?? p.id ?? String(i),
        title: p.title ?? p.name ?? 'Prompt',
        description: p.description ?? '',
        mcp_prompt: p.name ?? p.id ?? '',
        icon: <ArticleIcon size={24} />,
      }))
    }
    return QUICK_CARDS.map((card, i) => ({
      id: String(i),
      title: card.title,
      description: card.description,
      mcp_prompt: card.mcp_prompt,
      icon: <card.icon size={24} />,
    }))
  }, [availablePrompts])

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
    document.documentElement.dataset.theme = themeMode
  }, [themeMode])

  useEffect(() => {
    let active = true
    setLoadingPrompts(true)
    fetchPrompts()
      .then((list) => {
        if (!active) return
        setAvailablePrompts(list)
      })
      .catch((err) => console.warn('Failed to load prompts', err))
      .finally(() => {
        if (active) setLoadingPrompts(false)
      })

    return () => {
      active = false
    }
  }, [])

  const handleQuickCardClick = async (mcp_prompt: string) => {
    setError(null)
    setIsLoading(true)
    const pendingId = crypto.randomUUID()
    const userMessage: ChatMessageItem = {
      id: crypto.randomUUID(),
      role: 'user',
      content: mcp_prompt,
    }
    const pendingMessage: ChatMessageItem = {
      id: pendingId,
      role: 'assistant',
      content: '',
      pending: true,
    }
    setMessages((current) => [...current, userMessage, pendingMessage])
    try {
      const prompt = await fetchPromptById(mcp_prompt)
      if (prompt) {
        setCurrentPrompt(prompt)
      }

      const result = await executePrompt(mcp_prompt)
      const payload = (result ?? {}) as Record<string, unknown>
      const reply =
        (payload.message as string) ??
        (payload.text as string) ??
        (payload.response as string) ??
        (payload.content as string) ??
        ''

      const assistantMessage: ChatMessageItem = {
        id: pendingId,
        role: 'assistant',
        content: reply || 'Resposta recebida, mas sem conteudo para exibir.',
        pending: false,
        streaming: true,
      }

      setMessages((current) =>
        current.map((message) =>
          message.id === pendingId ? assistantMessage : message,
        ),
      )
      setStreamingMessageId(pendingId)
    } catch (err) {
      console.error(err)
      setMessages((current) => current.filter((message) => message.id !== pendingId))
      setError('Erro ao executar prompt.')
    } finally {
      setIsLoading(false)
    }
  }

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
      const payloadBody = {
        message: trimmed,
        ...(requestSkills.length > 0 ? { toolsToLoad: requestSkills } : {}),
        ...(currentPrompt ? { mcpPrompt: currentPrompt.name ?? currentPrompt.id } : {}),
      }

      const response = await api.post('/api/chat', payloadBody)

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

  const handleNewChat = () => {
    setMessages([])
    setInput('')
    setError(null)
    setIsLoading(false)
    setStreamingMessageId(null)
  }

  const handleLogout = () => {
    // TODO: Implement logout logic
    console.log('Logout clicked')
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
        <Sidebar
          logoIcon={imgLogo}
          menuIcon={imgMenu}
          newChatIcon={imgNewChat}
          settingsIcon={imgSettings}
          logoutIcon={imgLogout}
          onMenuClick={() => console.log('Menu clicked')}
          onNewChatClick={handleNewChat}
          onSettingsClick={() => console.log('Settings clicked')}
          onLogoutClick={handleLogout}
          recentChats={RECENT_CHATS}
        />

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
              {themeMode === 'dark' ? <SunIcon size={20} /> : <MoonIcon size={20} />}
            </Button>
          </Box>

          <Box className="na-content">
            {messages.length === 0 ? (
              <Box className="na-content-inner">
                <Box className="na-hero">
                  <Box className="na-hero-icon" data-mode="light">
                    <SparkleIcon size={32} />
                  </Box>
                  <Text className="na-hero-title">Bem-vindo ao Nuvemshop AI</Text>
                  <Text className="na-hero-subtitle">
                    Seu assistente inteligente para otimizar vendas, gerenciar produtos e
                    melhorar a experiencia dos seus clientes na Nuvemshop.
                  </Text>
                </Box>

                      <Box className="na-feature-grid">
                        {featureCards.map((card) => (
                          <QuickCard
                            key={card.id}
                            id={card.id}
                            title={card.title}
                            description={card.description}
                            mcp_prompt={card.mcp_prompt}
                            icon={card.icon}
                            onSelect={handleQuickCardClick}
                          />
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
              {/* <Box className="na-input-actions">
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
              </Box> */}

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
                  <Box data-mode="light">
                    <PaperPlaneTiltIcon />
                  </Box>
                </Button>
              </Box>

              {/* <Button
                type="button"
                appearance="transparent"
                className="na-voice-button"
                disabled
              >
                <img src={imgVoice} alt="" />
              </Button> */}
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
                 <WrenchIcon size={20} />
                  Ferramentas
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

            <Text className="na-disclaimer" textAlign='center'>
              Nuvemshop AI pode cometer erros. Considere verificar informacoes importantes.
            </Text>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default App
