import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import '@nimbus-ds/styles/dist/index.css'
import { AppShell, ChatInput } from '@nimbus-ds/patterns'
import { Badge, Box, Button, Card, Checkbox, Popover, Skeleton, Text } from '@nimbus-ds/components'
import { Send, Wrench } from 'lucide-react'
import { connect, iAmReady } from '@tiendanube/nexo'
import { nexo } from './lib/nexo'
import { api } from './lib/api'
import { ChatMessage } from './components/ChatMessage'

type ChatMessageItem = {
  id: string
  role: 'user' | 'assistant'
  content: string
  pending?: boolean
}

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

function App() {
  const [isConnected, setIsConnected] = useState(false)
  const [input, setInput] = useState('')
  const bypassNexo = import.meta.env.VITE_BYPASS_NEXO === 'true'
  const [messages, setMessages] = useState<ChatMessageItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [skillsOpen, setSkillsOpen] = useState(false)

  const selectedCount = selectedSkills.length

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

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const trimmed = input.trim()

    if (!trimmed || isLoading) return

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
    }

    setMessages((current) => [...current, userMessage, pendingMessage])
    setInput('')
    setIsLoading(true)
    setError(null)

    try {
      const response = await api.post('/api/chat', {
        message: trimmed,
        ...(selectedSkills.length > 0 ? { toolsToLoad: selectedSkills } : {}),
      })

      const payload = response.data ?? {}
      const reply =
        payload.message ?? payload.text ?? payload.response ?? payload.content ?? ''

      const assistantMessage: ChatMessageItem = {
        id: pendingId,
        role: 'assistant',
        content: reply || 'Resposta recebida, mas sem conteudo para exibir.',
        pending: false,
      }

      setMessages((current) =>
        current.map((message) =>
          message.id === pendingId ? assistantMessage : message,
        ),
      )
    } catch (requestError) {
      console.error('Chat request failed', requestError)
      setMessages((current) =>
        current.filter((message) => message.id !== pendingId),
      )
      setError('Ocorreu um erro ao enviar a mensagem.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isConnected) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        backgroundColor="neutral-background"
      >
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
    <AppShell contentProperties={{ height: '100vh' }}>
      <AppShell.Header
        leftSlot={
          <Box display="flex" flexDirection="column">
            <Text fontSize="caption" color="neutral-textLow">
              Embedded App
            </Text>
            <Text fontWeight="bold" color="neutral-textHigh">
              Nuvemshop AI Assistant
            </Text>
          </Box>
        }
        rightSlot={
          <Text fontSize="caption" color="neutral-textLow">
            Conectado
          </Text>
        }
      />
      <AppShell.Body padding="4">
        <Box display="flex" flexDirection="column" gap="4" width="100%" maxWidth="1000px" marginLeft="auto" marginRight="auto">
          <Box
            display="flex"
            flexDirection="column"
            gap="3"
            padding="3"
            overflow="auto"
            backgroundColor="neutral-background"
            borderRadius="2"
            borderColor="neutral-surface"
            borderWidth="1"
            borderStyle="solid"
            style={{ flex: 1, minHeight: 0 }}
          >
            {messages.length === 0 ? (
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                style={{ flex: 1 }}
              >
                <Text color="neutral-textLow">
                  Envie uma mensagem para iniciar a conversa.
                </Text>
              </Box>
            ) : (
              messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))
            )}
          </Box>

          {error ? (
            <Card backgroundColor="danger-surface" padding="base">
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Text color="danger-textHigh">{error}</Text>
                <Button
                  appearance="danger"
                  size="small"
                  onClick={() => setError(null)}
                >
                  Fechar
                </Button>
              </Box>
            </Card>
          ) : null}

          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            flexWrap="wrap"
            gap="2"
          >
            <Popover
              position="bottom-start"
              visible={skillsOpen}
              onVisibility={setSkillsOpen}
              content={
                <Box
                  display="flex"
                  flexDirection="column"
                  gap="3"
                  padding="3"
                  style={{ width: '360px', maxWidth: '90vw' }}
                >
                  <Text fontWeight="bold" color="neutral-textHigh">
                    Selecionar Skills
                  </Text>
                  {SKILL_CATEGORIES.map((category) => (
                    <Box key={category.title} display="flex" flexDirection="column" gap="2">
                      <Text fontWeight="bold" color="neutral-textHigh">
                        {category.title}
                      </Text>
                      <Box display="flex" flexDirection="column" gap="1">
                        {category.skills.map((skill) => (
                          <Checkbox
                            key={skill.id}
                            name={skill.id}
                            label={skill.label}
                            checked={selectedSkills.includes(skill.id)}
                            onChange={() => toggleSkill(skill.id)}
                          />
                        ))}
                      </Box>
                    </Box>
                  ))}
                </Box>
              }
            >
              <Button type="button" appearance="neutral" size="small">
                <Box as="span" display="inline-flex" alignItems="center" gap="1">
                  <Wrench size={16} />
                  Ferramentas
                </Box>
              </Button>
            </Popover>

            <Box display="flex" alignItems="center" gap="2">
              <Text fontSize="caption" color="neutral-textLow">
                Selecionadas
              </Text>
              <Badge count={selectedCount} appearance="primary" />
              <Button
                type="button"
                appearance="transparent"
                size="small"
                disabled={selectedCount === 0}
                onClick={clearSelection}
              >
                Limpar Selecao
              </Button>
            </Box>
          </Box>

          <Box
            as="form"
            onSubmit={handleSubmit}
            display="flex"
            flexDirection="column"
            gap="2"
            className='here-im'
            style={{ maxWidth: '1000px', width: '100%', margin: '0 auto' }}
          >
            <ChatInput aiFocused={isLoading}>
              <ChatInput.Field
                id="chat-input"
                value={input}
                onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                  setInput(event.target.value)
                }
                placeholder="Escreva sua mensagem para o agente..."
                appearance="ai-generative"
                lines={2}
                maxLines={6}
                disabled={isLoading}
              />
              <ChatInput.Actions>
                <Text fontSize="caption" color="neutral-textLow">
                  Shift + Enter para quebrar linha
                </Text>
                <Button
                  type="submit"
                  appearance="primary"
                  disabled={!input.trim() || isLoading}
                >
                  <Box
                    as="span"
                    display="inline-flex"
                    alignItems="center"
                    gap="1"
                  >
                    <Send size={16} />
                    Enviar
                  </Box>
                </Button>
              </ChatInput.Actions>
            </ChatInput>
          </Box>
        </Box>
      </AppShell.Body>
    </AppShell>
  )
}

export default App
