import { useEffect, useMemo, useState, type ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Box, Text } from '@nimbus-ds/components'
import { MermaidChart } from './MermaidChart'

type ChatMessageProps = {
  message: {
    role: 'user' | 'assistant'
    content: string
    pending?: boolean
    streaming?: boolean
    logs?: string[]
  }
  isLast: boolean
  themeMode: 'light' | 'dark'
  onStreamComplete?: (messageId: string) => void
}

export function ChatMessage({ message, isLast, themeMode, onStreamComplete }: ChatMessageProps) {
  const isUser = message.role === 'user'
  const showCursor = isLast && (message.pending || message.streaming)
  const [visibleText, setVisibleText] = useState(
    message.streaming ? '' : message.content,
  )
  const markdownComponents = useMemo(
    () => ({
      h3: ({ children }: { children?: ReactNode }) => (
        <Text className="na-md-h3" as="h3">
          {children}
        </Text>
      ),
      p: ({ children }: { children?: ReactNode }) => (
        <Text className="na-md-p" as="p">
          {children}
        </Text>
      ),
      ul: ({ children }: { children?: ReactNode }) => (
        <Box className="na-md-ul" as="ul">
          {children}
        </Box>
      ),
      ol: ({ children }: { children?: ReactNode }) => (
        <Box className="na-md-ol" as="ol">
          {children}
        </Box>
      ),
      li: ({ children }: { children?: ReactNode }) => (
        <Box className="na-md-li" as="li">
          {children}
        </Box>
      ),
      table: ({ children }: { children?: ReactNode }) => (
        <Box className="na-md-table-wrapper">
          <Box className="na-md-table" as="table">
            {children}
          </Box>
        </Box>
      ),
      th: ({ children }: { children?: ReactNode }) => (
        <Box className="na-md-th" as="th">
          {children}
        </Box>
      ),
      td: ({ children }: { children?: ReactNode }) => (
        <Box className="na-md-td" as="td">
          {children}
        </Box>
      ),
      code: ({
        inline,
        className,
        children,
      }: {
        inline?: boolean
        className?: string
        children?: ReactNode
      }) => {
        const raw = String(children ?? '').replace(/\n$/, '')
        const isMermaid = className?.includes('language-mermaid')
        if (!inline && isMermaid) {
          return <MermaidChart chart={raw} themeMode={themeMode} />
        }
        if (inline) {
          return <code className="na-md-code-inline">{raw}</code>
        }
        return (
          <Box className="na-md-pre" as="pre">
            <code className="na-md-code-block">{raw}</code>
          </Box>
        )
      },
    }),
    [themeMode],
  )

  useEffect(() => {
    if (!message.streaming) {
      setVisibleText(message.content)
      return
    }

    let currentIndex = 0
    let rafId = 0
    let timeoutId: number | null = null
    const text = message.content

    if (!text.length) {
      setVisibleText('')
      onStreamComplete?.(message.id)
      return
    }

    const step = () => {
      currentIndex += 1
      setVisibleText(text.slice(0, currentIndex))

      if (currentIndex < text.length) {
        timeoutId = window.setTimeout(() => {
          rafId = window.requestAnimationFrame(step)
        }, 14)
      } else {
        onStreamComplete?.(message.id)
      }
    }

    rafId = window.requestAnimationFrame(step)

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId)
      }
      window.cancelAnimationFrame(rafId)
    }
  }, [message.content, message.id, message.streaming, onStreamComplete])

  return (
    <Box display="flex" justifyContent={isUser ? 'flex-end' : 'flex-start'}>
      <Box
        className={`na-message${isUser ? ' is-user' : ' is-assistant'}${message.pending ? ' is-pending' : ''}`}
      >
        <Box display="flex" flexDirection="column" gap="1">
          <Text className="na-message-label">
            {isUser ? 'Lojista' : 'Nuvemshop AI'}
          </Text>
          {message.pending ? (
            <Text className="na-message-text">
              <span className="typing-dots">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </span>
              {showCursor ? <span className="na-cursor">_</span> : null}
            </Text>
          ) : isUser ? (
            <Text className="na-message-text" whiteSpace="pre-wrap">
              {visibleText || '...'}
              {showCursor ? <span className="na-cursor">_</span> : null}
            </Text>
          ) : (
            <Box className="na-message-text">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                {visibleText || '...'}
              </ReactMarkdown>
              {showCursor ? <span className="na-cursor">_</span> : null}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}
