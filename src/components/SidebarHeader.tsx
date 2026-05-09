import { Box, Text, Button } from '@nimbus-ds/components'
import { ChatIcon } from '@phosphor-icons/react'
import type { ReactNode } from 'react'

type SidebarHeaderProps = {
  menuIcon: ReactNode
  onMenuClick?: () => void
}

export function SidebarHeader({ menuIcon, onMenuClick }: SidebarHeaderProps) {
  return (
    <Box className="na-sidebar-header">
      <Box className="na-logo">
        <Box className="na-logo-icon">
          <ChatIcon  size={24}  />
        </Box>
        <Text className="na-logo-text">Nuvemshop AI</Text>
      </Box>
      <Button
        type="button"
        className="na-icon-button"
        appearance="transparent"
        onClick={onMenuClick}
      >
        {menuIcon}
      </Button>
    </Box>
  )
}