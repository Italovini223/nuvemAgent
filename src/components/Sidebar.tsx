import { Box, Text, Button } from '@nimbus-ds/components'
import { SidebarHeader } from './SidebarHeader'
import { SidebarChatMessage } from './SidebarChatMessage'
import { SidebarFooter } from './SidebarFooter'
import type { ReactNode } from 'react'

type SidebarProps = {
  logoIcon: ReactNode
  menuIcon: ReactNode
  newChatIcon: ReactNode
  settingsIcon: ReactNode
  logoutIcon: ReactNode
  onMenuClick?: () => void
  onNewChatClick?: () => void
  onSettingsClick?: () => void
  onLogoutClick?: () => void
  recentChats: Array<{
    id: string
    title: string
    time: string
    icon: ReactNode
    active?: boolean
  }>
}

export function Sidebar({
  menuIcon,
  newChatIcon,
  settingsIcon,
  logoutIcon,
  onMenuClick,
  onNewChatClick,
  onSettingsClick,
  onLogoutClick,
  recentChats
}: SidebarProps) {
  return (
    <Box className="na-sidebar" display="flex" flexDirection="column">
      <SidebarHeader
        menuIcon={menuIcon}
        onMenuClick={onMenuClick}
      />

      <Box className="na-sidebar-content" display="flex" flexDirection="column" flex="1">
        <Button
          type="button"
          className="na-sidebar-button"
          appearance="primary"
          size="large"
          onClick={onNewChatClick}
        >
          {newChatIcon}
          <Text fontWeight="bold">Nova conversa</Text>
        </Button>

        <Box className="na-recent-chats" display="flex" flexDirection="column" gap="1" marginY="4">
          <Text className="na-recent-title" fontSize="caption" fontWeight="bold">
            Conversas Recentes
          </Text>
          <Box display="flex" flexDirection="column">
            {recentChats.map((chat) => (
              <SidebarChatMessage key={chat.id} message={chat} />
            ))}
          </Box>
        </Box>
      </Box>

      <SidebarFooter
        settingsIcon={settingsIcon}
        logoutIcon={logoutIcon}
        onSettingsClick={onSettingsClick}
        onLogoutClick={onLogoutClick}
      />
    </Box>
  )
}