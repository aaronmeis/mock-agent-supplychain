import React from 'react';
import { Box, Paper } from '@mui/material';
import { AgentNode } from './AgentNode';
import { MessageFlow } from './MessageFlow';
import type { AgentActivity, MessageFlowData } from '../../types/siop.types';

interface AgentCanvasProps {
    agents: AgentActivity[];
    activeFlows: MessageFlowData[];
}

export const AgentCanvas: React.FC<AgentCanvasProps> = ({ agents, activeFlows }) => {
    const getAgentPos = (id: string) => agents.find(a => a.id === id)?.position || { x: 0, y: 0 };

    return (
        <Paper
            sx={{
                position: 'relative',
                width: '100%',
                height: '600px',
                bgcolor: '#f0f2f5',
                backgroundImage: 'radial-gradient(#d1d1d1 1px, transparent 1px)',
                backgroundSize: '40px 40px',
                overflow: 'hidden'
            }}
        >
            {agents.map(agent => (
                <AgentNode key={agent.id} {...agent} />
            ))}

            {activeFlows.map(flow => {
                const fromPos = getAgentPos(flow.fromAgent);
                const toPos = getAgentPos(flow.toAgent);
                return (
                    <MessageFlow
                        key={flow.id}
                        fromPos={fromPos}
                        toPos={toPos}
                        type={flow.message.type}
                        content={flow.message.content}
                    />
                );
            })}
        </Paper>
    );
};
