import React from 'react';
import { Box, Paper, Typography, Tooltip } from '@mui/material';
import { ArrowDownward as ArrowIcon } from '@mui/icons-material';

import { motion, AnimatePresence } from 'framer-motion';
import { AgentNode } from './AgentNode';
import { MessageFlow } from './MessageFlow';
import type { AgentActivity, MessageFlowData } from '../../types/siop.types';

interface WorkflowCanvasProps {
    agents: AgentActivity[];
    activeFlows: MessageFlowData[];
    flowType: 'forecast' | 'inventory' | 'siop' | null;
}

export const WorkflowCanvas: React.FC<WorkflowCanvasProps> = ({ agents, activeFlows, flowType }) => {
    const getFlowSteps = () => {
        if (flowType === 'forecast') {
            return [
                { id: 'sales-agent', label: 'Initiate Forecast', y: 80 },
                { id: 'demand-forecasting-agent', label: 'Statistical Analysis', y: 280 },
                { id: 'reporting-agent', label: 'Finalize Plan', y: 480 }
            ];
        }
        if (flowType === 'inventory') {
            return [
                { id: 'inventory-agent', label: 'Check Stock Levels', y: 80 },
                { id: 'inventory-optimization-agent', label: 'Run Optimization', y: 280 },
                { id: 'reporting-agent', label: 'Generate Replenishment', y: 480 }
            ];
        }
        if (flowType === 'siop') {
            return [
                { id: 'sales-agent', label: 'Demand Planning', y: 40 },
                { id: 'demand-forecasting-agent', label: 'Market Analysis', y: 190 },
                { id: 'inventory-agent', label: 'Supply Alignment', y: 340 },
                { id: 'inventory-optimization-agent', label: 'Stock Balancing', y: 490 },
                { id: 'reporting-agent', label: 'Executive Review', y: 640 }
            ];
        }
        return [];
    };

    const steps = getFlowSteps();
    const centerX = 400; // Assuming default width for centering

    // Create a mapping of agent ID to its current display position
    const agentPositions = steps.reduce((acc, step) => {
        acc[step.id] = { x: centerX - 100, y: step.y }; // -100 to center the 200px card
        return acc;
    }, {} as Record<string, { x: number; y: number }>);

    return (
        <Paper
            sx={{
                position: 'relative',
                width: '100%',
                height: '780px',
                bgcolor: '#0f172a',
                backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(30, 41, 59, 1) 0%, rgba(15, 23, 42, 1) 100%)',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: 4,
                boxShadow: 'inset 0 0 50px rgba(0,0,0,0.5)'
            }}
        >
            {steps.length > 0 ? (
                <>
                    {/* Static Arrows / Connectors */}
                    {steps.map((step, index) => (
                        index < steps.length - 1 && (
                            <Box
                                key={`arrow-${index}`}
                                sx={{
                                    position: 'absolute',
                                    left: centerX - 20,
                                    top: step.y + 110,
                                    color: 'rgba(255,255,255,0.05)',
                                    zIndex: 1
                                }}
                            >
                                <ArrowIcon sx={{ fontSize: 40 }} />
                            </Box>
                        )
                    ))}

                    {/* Agent Nodes */}
                    {steps.map((step) => {
                        const agent = agents.find(a => a.id === step.id);
                        if (!agent) return null;
                        return (
                            <Box key={step.id} sx={{ position: 'absolute', left: centerX - 100, top: step.y, zIndex: 10 }}>
                                <Tooltip title="This agent performs a specific step in the supply chain planning workflow." arrow>
                                    <Box>
                                        <AgentNode
                                            {...agent}
                                            position={{ x: 0, y: 0 }}
                                            isStatic={true}
                                        />
                                    </Box>
                                </Tooltip>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        position: 'absolute',
                                        top: -25,
                                        width: '100%',
                                        textAlign: 'center',
                                        color: agent.status === 'processing' ? '#64b5f6' : 'rgba(255,255,255,0.4)',
                                        fontWeight: 'bold',
                                        textTransform: 'uppercase',
                                        letterSpacing: 1
                                    }}
                                >
                                    {step.label}
                                </Typography>
                            </Box>
                        );
                    })}

                    {/* Animated Message Flows */}
                    <AnimatePresence>
                        {activeFlows.map(flow => {
                            const fromPos = agentPositions[flow.fromAgent];
                            const toPos = agentPositions[flow.toAgent];
                            if (!fromPos || !toPos) return null;

                            return (
                                <MessageFlow
                                    key={flow.id}
                                    fromPos={{
                                        x: centerX + 110,
                                        y: fromPos.y + 50
                                    }}
                                    toPos={{
                                        x: centerX + 110,
                                        y: toPos.y + 50
                                    }}
                                    type={flow.message.type}
                                    content={flow.message.content}
                                    data={flow.message.payload}
                                />
                            );
                        })}
                    </AnimatePresence>
                </>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', opacity: 0.3 }}>
                    <Typography variant="h4" fontWeight="bold" sx={{ mb: 1, letterSpacing: 4 }}>SIOP ORCHESTRATOR</Typography>
                    <Typography variant="body1">Select a scenario to begin the workflow</Typography>
                </Box>
            )}
        </Paper>
    );
};
