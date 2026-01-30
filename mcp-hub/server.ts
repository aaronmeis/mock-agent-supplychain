import express from 'express';
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import Redis from 'ioredis';
import { Pool } from 'pg';
import cors from 'cors';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { exec } from 'child_process';

dotenv.config();

const config = {
    port: parseInt(process.env.PORT || '3000'),
    db: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        user: process.env.DB_USER || 'siop_user',
        password: process.env.DB_PASSWORD || 'siop_password',
        database: process.env.DB_NAME || 'siop_system',
    },
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
    }
};

export class MCPHubServer {
    public app: express.Application;
    private httpServer: any;
    private io: SocketServer;
    private redis: Redis;
    private dbPool: Pool;

    constructor() {
        this.app = express();
        this.httpServer = createServer(this.app);
        this.io = new SocketServer(this.httpServer, {
            cors: { origin: '*' }
        });
        this.redis = new Redis(config.redis);
        this.dbPool = new Pool(config.db);

        this.setupMiddleware();
        this.setupRoutes();
        this.setupWebSocketHandlers();
    }

    private setupMiddleware() {
        this.app.use(cors());
        this.app.use(express.json());
    }

    private setupRoutes() {
        // Agent registration
        this.app.post('/api/agents/register', async (req, res) => {
            try {
                const { agentName, agentType, mcpUrl, capabilities, parentAgentId } = req.body;
                const query = `
          INSERT INTO agents (agent_name, agent_type, mcp_server_url, capabilities, parent_agent_id, status)
          VALUES ($1, $2, $3, $4, $5, 'active')
          ON CONFLICT (agent_name) 
          DO UPDATE SET mcp_server_url = $3, capabilities = $4, updated_at = CURRENT_TIMESTAMP
          RETURNING agent_id
        `;
                const result = await this.dbPool.query(query, [
                    agentName, agentType, mcpUrl, JSON.stringify(capabilities), parentAgentId || null
                ]);
                res.json({ success: true, agentId: result.rows[0].agent_id });
            } catch (error: any) {
                res.status(500).json({ success: false, error: error.message });
            }
        });

        // Message routing
        this.app.post('/api/messages/send', async (req, res) => {
            try {
                const { fromAgent, toAgent, messageType, payload } = req.body;
                const messageId = crypto.randomUUID();

                await this.dbPool.query(`
          INSERT INTO agent_messages 
          (message_id, from_agent_id, to_agent_id, message_type, payload, status)
          VALUES ($1, 
            (SELECT agent_id FROM agents WHERE agent_name = $2),
            (SELECT agent_id FROM agents WHERE agent_name = $3),
            $4, $5, 'pending')
        `, [messageId, fromAgent, toAgent, messageType, JSON.stringify(payload)]);

                await this.redis.publish(`agent:${toAgent}`, JSON.stringify({
                    messageId,
                    fromAgent,
                    messageType,
                    payload,
                    timestamp: new Date().toISOString()
                }));

                this.io.emit('message:flow', {
                    id: messageId,
                    fromAgent,
                    toAgent,
                    message: {
                        id: messageId,
                        type: messageType,
                        content: payload.content || 'No content',
                        timestamp: new Date().toISOString()
                    }
                });

                res.json({ success: true, messageId });
            } catch (error: any) {
                res.status(500).json({ success: false, error: error.message });
            }
        });

        this.app.get('/api/health', (req, res) => {
            res.json({ status: 'healthy' });
        });

        // Test Runner
        this.app.post('/api/tests/run', (req, res) => {
            console.log('Running system tests via UI request...');
            const cmd = process.platform === 'win32' ? 'npm.cmd test' : 'npm test';
            exec(cmd, (error, stdout, stderr) => {
                const fullOutput = stdout + (stderr ? '\n' + stderr : '');
                const results = {
                    success: !error,
                    output: fullOutput,
                    error: error ? error.message : null,
                    timestamp: new Date().toISOString()
                };
                res.json(results);
            });
        });
    }

    private setupWebSocketHandlers() {
        this.io.on('connection', (socket) => {
            socket.on('disconnect', () => {
            });
        });
    }

    public start() {
        this.httpServer.listen(config.port, '0.0.0.0', () => {
            console.log(`MCP Hub Server running on port ${config.port}`);
        });
    }
}

if (process.env.NODE_ENV !== 'test') {
    const server = new MCPHubServer();
    server.start();
}
