# S&OP Agent Orchestrator

**A reference implementation for mocking and understanding multi-agent orchestration in supply chain scenarios using MCP and Redis.**

This project serves as a comprehensive example for developers to explore the usage of AI agents and the Model Context Protocol (MCP) in complex planning environments. It demonstrates how to build a coordinated system of agents that can handle demand forecasting, inventory optimization, and integrated sales and operations planning (S&OP).

## Key Features
- **Multi-Agent Coordination**: Orchestrate parent agents, sub-agents, and reporting agents via a central MCP Hub.
- **Asynchronous Messaging**: High-performance agent communication using Redis Pub/Sub.
- **Real-Time Visualization**: A dynamic React-based UI that visualizes agent interactions and message flows on a canvas.
- **Supply Chain Scenarios**: Out-of-the-box support for demand forecasting, inventory optimization, and full S&OP cycles.
- **Automated Verification**: Built-in system testing triggered directly from the UI with detailed Jest output.

## System Architecture
The system consists of the following components:
- **MCP Hub**: The central registry and router for all agent communication.
- **Agents**: Specialized functional units (Sales, Inventory, Forecasting) implementing the MCP protocol.
- **Web UI**: A modern, glassmorphic dashboard for scenario execution and monitoring.
- **Infrastructure**: PostgreSQL for persistence and Redis for messaging, all managed via Docker.

## Getting Started
For detailed setup instructions, architecture deep-dives, and SDLC documentation, please refer to the [design folder](file:///c:/Users/learn/projects/mock-agent-supplychain/design).

- [Architecture Overview](file:///c:/Users/learn/projects/mock-agent-supplychain/design/architecture.md)
- [System Requirements](file:///c:/Users/learn/projects/mock-agent-supplychain/design/requirements.md)
- [Database Design](file:///c:/Users/learn/projects/mock-agent-supplychain/design/database_design.md)
- [Testing Strategy](file:///c:/Users/learn/projects/mock-agent-supplychain/design/testing_strategy.md)
- [SDLC Process](file:///c:/Users/learn/projects/mock-agent-supplychain/design/sdlc_process.md)

## Credits
This project was developed in collaboration with **Antigravity**, a powerful agentic AI coding assistant from the **Google DeepMind** team.

## License
MIT
