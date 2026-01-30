import express from 'express';
import Redis from 'ioredis';
import { Pool } from 'pg';
import cors from 'cors';

export abstract class BaseAgent {
    protected app: express.Application;
    protected redis: Redis;
    protected dbPool: Pool;
    protected agentName: string;
    protected agentType: string;
    protected port: number;
    protected hubUrl: string = 'http://mcp-hub:3000';

    constructor(agentName: string, agentType: string, port: number) {
        this.agentName = agentName;
        this.agentType = agentType;
        this.port = port;
        this.app = express();
        this.redis = new Redis({
            host: process.env.REDIS_HOST || 'localhost',
            port: 6379,
        });
        this.dbPool = new Pool({
            host: process.env.DB_HOST || 'localhost',
            port: 5432,
            user: process.env.DB_USER || 'siop_user',
            password: process.env.DB_PASSWORD || 'siop_password',
            database: process.env.DB_NAME || 'siop_system',
        });

        this.setupMiddleware();
        this.setupRoutes();
        this.subscribeToMessages();
    }

    protected setupMiddleware() {
        this.app.use(cors());
        this.app.use(express.json());
    }

    protected setupRoutes() {
        this.app.post('/api/process', async (req, res) => {
            const { requestType, payload } = req.body;
            const result = await this.processRequest(requestType, payload);
            res.json(result);
        });

        this.app.get('/api/health', (req, res) => {
            res.json({ status: 'healthy', agent: this.agentName });
        });
    }

    protected async subscribeToMessages() {
        const subscriber = this.redis.duplicate();
        await subscriber.subscribe(`agent:${this.agentName}`);

        subscriber.on('message', async (channel, message) => {
            const data = JSON.parse(message);
            await this.handleIncomingMessage(data);
        });
    }

    protected async sendToHub(toAgent: string, messageType: string, payload: any) {
        try {
            await fetch(`${this.hubUrl}/api/messages/send`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fromAgent: this.agentName,
                    toAgent,
                    messageType,
                    payload
                })
            });
        } catch (error) {
            console.error(`Error sending message to Hub:`, error);
        }
    }

    protected async registerWithHub(capabilities: string[], parentAgentId?: string) {
        try {
            await fetch(`${this.hubUrl}/api/agents/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    agentName: this.agentName,
                    agentType: this.agentType,
                    mcpUrl: `http://${this.agentName}:${this.port}`,
                    capabilities,
                    parentAgentId
                })
            });
        } catch (error) {
            console.error(`Error registering with Hub:`, error);
        }
    }

    protected abstract processRequest(requestType: string, payload: any): Promise<any>;
    protected abstract handleIncomingMessage(message: any): Promise<void>;

    public start() {
        this.app.listen(this.port, '0.0.0.0', () => {
            console.log(`${this.agentName} running on port ${this.port}`);
            this.registerWithHub([]);
        });
    }
}
