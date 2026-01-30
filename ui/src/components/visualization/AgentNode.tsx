import React from 'react';
import { Card, Avatar, Badge, Typography, Box, Tooltip, Divider, Stack } from '@mui/material';
import { Circle as CircleIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { AGENT_COLORS } from '../../theme/agentColors';

interface AgentNodeProps {
    id: string;
    name: string;
    type: 'parent' | 'sub-agent' | 'reporting';
    status: 'idle' | 'processing' | 'responding' | 'error';
    currentTask?: string;
    messageCount: number;
    position: { x: number; y: number };
    isStatic?: boolean;
    description?: string;
}

export const AgentNode: React.FC<AgentNodeProps> = ({
    name,
    type,
    status,
    currentTask,
    messageCount,
    position,
    isStatic,
    description
}) => {
    const getStatusColor = () => AGENT_COLORS.status[status] || AGENT_COLORS.status.idle;

    const getAgentIcon = () => {
        if (type === 'parent') return '🎯';
        if (type === 'reporting') return '📊';
        return '🤖';
    };

    const renderTooltipDetail = () => (
        <Box sx={{ p: 1.5, maxWidth: 240 }}>
            <Typography variant="subtitle2" color="primary.main" fontWeight="bold" gutterBottom>
                {name.toUpperCase()}
            </Typography>
            <Typography variant="caption" sx={{
                color: 'rgba(255,255,255,0.7)',
                mb: 2,
                display: 'block',
                whiteSpace: 'normal',
                wordBreak: 'break-word',
                lineHeight: 1.4
            }}>
                {description || 'Autonomous agent performing specialized tasks within the S&OP workflow.'}
            </Typography>

            <Divider sx={{ my: 1, borderColor: 'rgba(255,255,255,0.1)' }} />

            <Stack spacing={1}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="textSecondary">Agent Role:</Typography>
                    <Typography variant="caption" sx={{ bgcolor: 'rgba(255,255,255,0.05)', px: 1, borderRadius: 1 }}>{type}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="textSecondary">Protocol:</Typography>
                    <Typography variant="caption">MCP v1.2</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="textSecondary">Capabilities:</Typography>
                    <Typography variant="caption" sx={{ color: 'secondary.main' }}>JSON, Analytics, SQL</Typography>
                </Box>
            </Stack>
        </Box>
    );

    return (
        <Tooltip title={renderTooltipDetail()} arrow placement="right" componentsProps={{
            tooltip: {
                sx: {
                    bgcolor: '#1e293b',
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                    p: 0,
                    maxWidth: 280, // Explicitly constrain tooltip width
                }
            }
        }}>
            <motion.div
                style={{
                    position: isStatic ? 'relative' : 'absolute',
                    left: isStatic ? 0 : position.x,
                    top: isStatic ? 0 : position.y,
                    zIndex: 10,
                    cursor: 'help'
                }}
                animate={{
                    scale: status === 'processing' ? [1, 1.05, 1] : 1,
                }}
                transition={{
                    duration: 1,
                    repeat: status === 'processing' ? Infinity : 0,
                }}
            >
                <Card
                    sx={{
                        width: type === 'parent' ? 200 : 160,
                        border: `3px solid ${getStatusColor()}`,
                        boxShadow: status === 'processing'
                            ? `0 0 20px ${getStatusColor()}`
                            : '0 2px 8px rgba(0,0,0,0.1)',
                    }}
                >
                    <Box sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Avatar sx={{ bgcolor: getStatusColor(), width: 32, height: 32 }}>
                                {getAgentIcon()}
                            </Avatar>
                            <Box sx={{ ml: 1 }}>
                                <Typography variant="body2" fontWeight="bold" noWrap sx={{ width: type === 'parent' ? 140 : 100 }}>
                                    {name}
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                    {type}
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Badge badgeContent={messageCount} color="primary">
                                <CircleIcon sx={{ color: getStatusColor(), fontSize: 10 }} />
                            </Badge>
                            <Typography variant="caption">{status.toUpperCase()}</Typography>
                        </Box>

                        {currentTask && (
                            <Typography variant="caption" sx={{ fontStyle: 'italic', display: 'block', mt: 1 }}>
                                {currentTask}
                            </Typography>
                        )}
                    </Box>
                </Card>
            </motion.div>
        </Tooltip>
    );
};
