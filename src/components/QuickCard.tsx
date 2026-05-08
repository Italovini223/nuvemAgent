import {
  Box,
  Text,
} from '@nimbus-ds/components'
import type { ReactElement } from 'react';

type QuickCardProps = {
    id: string;
    icon: ReactElement;
    title: string;
    description: string;
}

export function QuickCard(card: QuickCardProps) {
    <Box key={card.id} className="na-feature-card">
        <Box className="na-feature-icon">
            {card.icon}
        </Box>
        <Box className="na-feature-content">
            <Text className="na-feature-title">{card.title}</Text>
            <Text className="na-feature-text">{card.description}</Text>
         </Box>
    </Box>
}