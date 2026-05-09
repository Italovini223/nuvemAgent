import { Box, Button } from '@nimbus-ds/components'
import type { ReactNode } from 'react'

type SidebarFooterProps = {
  settingsIcon: ReactNode
  logoutIcon: ReactNode
  onSettingsClick?: () => void
  onLogoutClick?: () => void
}

export function SidebarFooter({ settingsIcon, logoutIcon, onSettingsClick, onLogoutClick }: SidebarFooterProps) {
  return (
    <Box className="na-sidebar-footer">
      <Button
        type="button"
        className="na-footer-button"
        appearance="transparent"
        onClick={onSettingsClick}
      >
        {settingsIcon}
        Configuracoes
      </Button>
      <Button
        type="button"
        className="na-footer-button"
        appearance="transparent"
        onClick={onLogoutClick}
      >
        {logoutIcon}
        Sair
      </Button>
    </Box>
  )
}