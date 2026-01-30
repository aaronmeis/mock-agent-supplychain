# Contributing to the S&OP Multi-Agent System

Welcome! This project is a reference implementation for multi-agent supply chain orchestration. We welcome contributions that add new agent capabilities, improve optimization algorithms, or enhance the visualization.

## Architecture Guidelines

1.  **Agent Autonomy**: Never call another agent's API directly. Always use the **MCP Hub** message router or event bus.
2.  **Schema First**: If adding a new message type, update `SIOP_MULTI_AGENT_SYSTEM_README.md` first.
3.  **Stateless Logic**: Aim to keep agents stateless when possible, relying on the database or message payload for context.

## How to Add a New Agent

1.  **Create Directory**: Add a new folder in `/agents` (e.g., `logistics-agent`).
2.  **Extend BaseAgent**: Use the template in `agents/universal-agent/server.ts`.
3.  **Register with Hub**: Add the agent to the `INITIAL_AGENTS` list in `ui/src/App.tsx` and the database `init.sql`.
4.  **Define Sub-Agents**: If your agent needs sub-tasks, follow the parent/sub-agent pattern used by the Sales Agent.

## Development Workflow

1.  **Environment**: Copy `.env.example` to `.env` and add your API keys.
2.  **Dev Server**: We use Docker for orchestration. Run `./scripts/dev.ps1 up` (Windows) to start everything.
3.  **Testing**: Run `npm test` in the `mcp-hub` directory before submitting PRs.

## Style Guide

*   Use **TypeScript** for all backend logic.
*   Use **Material-UI** and **Vanilla CSS** for the frontend.
*   Follow the Prettier configuration for consistent formatting.

---
**Lead Architect**: Google Antigravity in VS Code
