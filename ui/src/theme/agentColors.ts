export const AGENT_COLORS = {
    status: {
        idle: '#90CAF9',        // Light Blue
        processing: '#FFA726',  // Orange
        responding: '#66BB6A',  // Green
        error: '#EF5350',       // Red
        disabled: '#BDBDBD',    // Grey
    },

    messageType: {
        request: '#2196F3',     // Blue
        response: '#4CAF50',    // Green
        event: '#FF9800',       // Orange
        broadcast: '#9C27B0',   // Purple
    },

    agentType: {
        parent: {
            bg: '#E3F2FD',
            border: '#1976D2',
            text: '#0D47A1'
        },
        subAgent: {
            bg: '#F3E5F5',
            border: '#7B1FA2',
            text: '#4A148C'
        },
        reporting: {
            bg: '#FFF3E0',
            border: '#E65100',
            text: '#BF360C'
        }
    }
};
