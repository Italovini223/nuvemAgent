import { Box, Card, Text } from '@nimbus-ds/components'

type ChatMessageProps = {
  message: {
    role: 'user' | 'assistant'
    content: string
    pending?: boolean
  }
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'
  const text = message.content
  const label = isUser ? 'Lojista' : 'IA Agent'

  return (
    <Box display="flex" justifyContent={isUser ? 'flex-end' : 'flex-start'}>
      <Card
        padding="base"
        backgroundColor={isUser ? 'primary-surface' : 'neutral-surface'}
        className={message.pending ? 'chat-bubble is-pending' : 'chat-bubble'}
        style={{ maxWidth: '72%', width: 'fit-content' }}
      >
        <Box display="flex" flexDirection="column" gap="1">
          <Text fontSize="caption" color="neutral-textLow">
            {label}
          </Text>
          {message.pending ? (
            <Text color="neutral-textLow">
              <span className="typing-dots">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </span>
            </Text>
          ) : (
            <Text
              color={isUser ? 'primary-textHigh' : 'neutral-textHigh'}
              whiteSpace="pre-wrap"
            >
              {text || '...'}
            </Text>
          )}
        </Box>
      </Card>
    </Box>
  )
}
