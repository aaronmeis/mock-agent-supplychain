import { BaseAgent } from './base';

class UniversalAgent extends BaseAgent {
    constructor() {
        const name = process.env.AGENT_NAME || 'universal-agent';
        const type = process.env.AGENT_TYPE || 'sub-agent';
        const port = parseInt(process.env.AGENT_PORT || '3001');
        super(name, type, port);
    }

    protected async processRequest(requestType: string, payload: any): Promise<any> {
        console.log(`[${this.agentName}] Processing ${requestType}:`, payload);

        // Simulate thinking
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

        // Simple mock logic based on agent name
        if (this.agentName === 'demand-forecasting-agent') {
            return {
                forecast: [
                    { date: '2026-02-01', quantity: 1200 },
                    { date: '2026-02-15', quantity: 1350 },
                    { date: '2026-03-01', quantity: 1500 }
                ],
                confidence: 0.92
            };
        }

        if (this.agentName === 'inventory-optimization-agent') {
            return {
                optimalStock: 5000,
                safetyStock: 800,
                reorderPoint: 1200
            };
        }

        return {
            status: 'success',
            message: `Processed by ${this.agentName}`,
            timestamp: new Date().toISOString()
        };
    }

    protected async handleIncomingMessage(message: any): Promise<void> {
        const { fromAgent, messageType, payload } = message;
        console.log(`[${this.agentName}] Received ${messageType} from ${fromAgent}`);

        if (messageType === 'request') {
            const result = await this.processRequest(payload.action || 'generic', payload);
            await this.sendToHub(fromAgent, 'response', {
                originalMessageId: message.messageId,
                content: `Completed ${payload.action || 'task'}`,
                result
            });
        }
    }
}

const agent = new UniversalAgent();
agent.start();
