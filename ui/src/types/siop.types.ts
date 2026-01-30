export interface AgentActivity {
    id: string;
    name: string;
    type: 'parent' | 'sub-agent' | 'reporting';
    status: 'idle' | 'processing' | 'responding' | 'error';
    description?: string;
    currentTask?: string;
    messageCount: number;
    position: { x: number; y: number };
}

export interface MessageFlowData {
    id: string;
    fromAgent: string;
    toAgent: string;
    message: {
        id: string;
        type: 'request' | 'response' | 'event';
        content: string;
        timestamp: string;
        payload?: any;
    };
}
