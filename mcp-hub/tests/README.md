[← Back to Project Overview](../../README.md)

# MCP Hub Integration Tests

This directory contains integration tests for the MCP Hub server. These tests ensure that the Hub correctly handles agent registration, message routing, and health checks.

## Test Suite: `hub.test.ts`

The integration tests use **Jest** and **Supertest** to verify the following endpoints:

### Endpoints Tested
- **GET `/api/health`**: Verifies that the server is running and returns a healthy status.
- **POST `/api/agents/register`**: Verifies that new agents can be registered in the system.
  - Test case: Successful registration returns a 200 status and an `agentId`.
  - Test case: Failed registration (e.g., database error) returns a 500 status and an error message.

## Mocks and Dependencies

To ensure tests are isolated and don't require running infrastructure, the following are mocked:
- **ioredis**: Mocked to simulate Redis publishing and subscription.
- **pg (Postgres)**: Mocked to simulate database queries and errors.

## Running Tests

### Via Command Line
To run the tests manually from the `mcp-hub` directory:
```bash
npm test
```

### Via UI
System tests can be triggered directly from the Agent Orchestrator UI by clicking the **"Run System Tests"** button. This sends a request to the Hub server, which executes the tests and returns the results.

## Configuration
- Tests run with `NODE_ENV=test`.
- Jest is configured using `jest.config.js`.
- TypeScript support is provided by `ts-jest`.
