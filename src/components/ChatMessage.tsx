import { useEffect, useState } from 'react'
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
  const showCursor = isLast && (message.pending || message.streaming)
  const [visibleText, setVisibleText] = useState(
    message.streaming ? '' : message.content,
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
          ) : (
            <Text className="na-message-text" whiteSpace="pre-wrap">
              {visibleText || '...'}
              {showCursor ? <span className="na-cursor">_</span> : null}
            </Text>
          )}
        </Box>
      </Box>
    </Box>
  )
}
