import { useEffect, useMemo, useState } from 'react'
import { Box, Text } from '@nimbus-ds/components'

type ChatMessageProps = {
  message: {
    role: 'user' | 'assistant'
    content: string
    pending?: boolean
    streaming?: boolean
    logs?: string[]
  }
  isLast: boolean
  onStreamComplete?: (messageId: string) => void
}

export function ChatMessage({ message, isLast, onStreamComplete }: ChatMessageProps) {
  const isUser = message.role === 'user'
  const prefix = isUser ? 'lojista ~ %' : 'nuvem-agent $'
  const logs = message.logs ?? []
  const showCursor = isLast && (message.pending || message.streaming)
  const [visibleText, setVisibleText] = useState(
    message.streaming ? '' : message.content,
  )

  const logLines = useMemo(
    () => logs.map((entry) => `> tool ${entry}`),
    [logs],
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
        padding="2"
        backgroundColor="neutral-background"
        borderWidth="1"
        borderStyle="solid"
        borderColor="neutral-surfaceHighlight"
        className={message.pending ? 'terminal-message is-pending' : 'terminal-message'}
        style={{ maxWidth: '76%', width: 'fit-content' }}
      >
        <Box display="flex" flexDirection="column" gap="1">
          <Text fontSize="caption" color="neutral-textLow" className="terminal-prefix">
            {prefix}
          </Text>
          {logLines.length > 0 ? (
            <Box display="flex" flexDirection="column" gap="1" className="terminal-logs">
              <Text fontSize="caption" color="neutral-textLow">
                logs de execucao
              </Text>
              {logLines.map((line, index) => (
                <Text
                  key={`${line}-${index}`}
                  fontSize="caption"
                  color="neutral-textLow"
                  className="terminal-log-line"
                  style={{ animationDelay: `${index * 120}ms` }}
                >
                  {line}
                </Text>
              ))}
            </Box>
          ) : null}
          {message.pending ? (
            <Text color="neutral-textLow">
              <span className="typing-dots">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </span>
              {showCursor ? <span className="terminal-cursor">_</span> : null}
            </Text>
          ) : (
            <Text
              color="neutral-textHigh"
              whiteSpace="pre-wrap"
              className="terminal-message-text"
            >
              {visibleText || '...'}
              {showCursor ? <span className="terminal-cursor">_</span> : null}
            </Text>
          )}
        </Box>
      </Box>
    </Box>
  )
}
