import request from 'supertest';
import { MCPHubServer } from '../server';

// Mock Redis
jest.mock('ioredis', () => {
    return jest.fn().mockImplementation(() => ({
        publish: jest.fn().mockResolvedValue(1),
        on: jest.fn(),
        duplicate: jest.fn().mockReturnThis(),
        subscribe: jest.fn().mockResolvedValue(1),
    }));
});

const mockQuery = jest.fn().mockResolvedValue({ rows: [{ agent_id: 'test-uuid' }] });

// Mock PG Pool
jest.mock('pg', () => {
    return {
        Pool: jest.fn().mockImplementation(() => ({
            query: mockQuery,
            on: jest.fn(),
            end: jest.fn(),
        })),
    };
});

describe('MCP Hub Server Integration Tests', () => {
    let server: MCPHubServer;

    beforeAll(() => {
        process.env.NODE_ENV = 'test';
        server = new MCPHubServer();
    });

    describe('GET /api/health', () => {
        it('should return 200 and healthy status', async () => {
            const response = await request(server.app).get('/api/health');
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ status: 'healthy' });
        });
    });

    describe('POST /api/agents/register', () => {
        it('should register a new agent and return an agentId', async () => {
            const agentData = {
                agentName: 'TestAgent',
                agentType: 'sub-agent',
                mcpUrl: 'http://localhost:4000',
                capabilities: { task: 'testing' },
            };

            const response = await request(server.app)
                .post('/api/agents/register')
                .send(agentData);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.agentId).toBe('test-uuid');
        });

        it('should return 500 if registration fails', async () => {
            // Mock failure for this specific test
            mockQuery.mockRejectedValueOnce(new Error('DB Error'));

            const response = await request(server.app)
                .post('/api/agents/register')
                .send({});

            expect(response.status).toBe(500);
            expect(response.body.success).toBe(false);
            expect(response.body.error).toBe('DB Error');
        });
    });
});
