import {
  Box,
  Text,
  Button,
} from '@nimbus-ds/components'
import type { ReactElement } from 'react';

type QuickCardProps = {
    id: string;
    icon: ReactElement;
    title: string;
    description: string;
    mcp_prompt: string;
    onSelect?: (mcp_prompt: string) => void;
}

export function QuickCard({ id, icon, title, description, mcp_prompt, onSelect }: QuickCardProps) {
    function handleCardClick(){
        onSelect?.(mcp_prompt)
    }
    return (
        <Button key={id} className="na-feature-card" type="button" onClick={handleCardClick}>
            <Box className="na-feature-icon">
                {icon}
            </Box>
            <Box className="na-feature-content">
                <Text className="na-feature-title">{title}</Text>
                <Text className="na-feature-text">{description}</Text>
            </Box>
        </Button>
    )
}