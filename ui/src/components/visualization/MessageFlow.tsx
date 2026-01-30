import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Box, Typography } from '@mui/material';
import { AGENT_COLORS } from '../../theme/agentColors';

interface MessageFlowProps {
    fromPos: { x: number; y: number };
    toPos: { x: number; y: number };
    type: 'request' | 'response' | 'event';
    content: string;
    data?: any;
}

export const MessageFlow: React.FC<MessageFlowProps> = ({
    fromPos,
    toPos,
    type,
    content,
    data
}) => {
    const [pathD, setPathD] = useState('');

    useEffect(() => {
        const startX = fromPos.x;
        const startY = fromPos.y;
        const endX = toPos.x;
        const endY = toPos.y;

        const midX = Math.max(startX, endX) + 100;
        const midY = (startY + endY) / 2;

        setPathD(`M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`);
    }, [fromPos, toPos]);

    const color = AGENT_COLORS.messageType[type] || AGENT_COLORS.messageType.request;

    return (
        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 5 }}>
            <motion.path
                d={pathD}
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeDasharray="5,5"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5 }}
            />
            <motion.circle
                r="6"
                fill={color}
                initial={{ offsetDistance: '0%' }}
                animate={{ offsetDistance: '100%' }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                style={{ offsetPath: `path('${pathD}')` }}
            />
            <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <foreignObject x={Math.max(fromPos.x, toPos.x) + 20} y={(fromPos.y + toPos.y) / 2 - 40} width="180" height="100">
                    <Box sx={{
                        bgcolor: 'rgba(30, 41, 59, 0.95)',
                        backdropFilter: 'blur(4px)',
                        border: `1px solid ${color}`,
                        borderRadius: 2,
                        p: 1.5,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                        borderLeft: `4px solid ${color}`
                    }}>
                        <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'white', display: 'block', mb: 0.5 }}>
                            {content}
                        </Typography>
                        {data && (
                            <Typography variant="caption" sx={{
                                fontSize: '0.65rem',
                                color: '#94a3b8',
                                fontFamily: 'monospace',
                                display: 'block',
                                whiteSpace: 'normal',
                                wordBreak: 'break-all',
                                maxHeight: '45px',
                                overflow: 'hidden'
                            }}>
                                {JSON.stringify(data)}
                            </Typography>
                        )}
                    </Box>
                </foreignObject>
            </motion.g>
        </svg>
    );
};
