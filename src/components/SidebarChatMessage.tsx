import { Box, Text } from '@nimbus-ds/components'


type SidebarChatMessageProps = {
  message: {
    id: string
    title: string
    time: string
    icon: React.ReactNode
    active?: boolean
  }
}

export function SidebarChatMessage({ message }: SidebarChatMessageProps) {
  return (
    <Box
      className={`na-chat-item${message.active ? ' is-active' : ''}`}
      display="flex"
      alignItems="center"
      padding="2"
      gap="2"
      cursor="pointer"
    >
      <Box flexShrink="0" data-theme="light">
        
      </Box>
      <Box flexGrow="1" overflow="hidden">
        <Text
          className="na-chat-title"
    
          
        >
          {message.title}
        </Text>
        <Text
          className="na-chat-time"
          color="neutral-textLow"
        >
          {message.time}
        </Text>
      </Box>
    </Box>
  )
}