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

## Documentation Map

To help you navigate the system, here are links to all specialized documentation:

- **[Project Overview (Root)](README.md)**: This document.
- **[Requirements & Design](design/requirements.md)**: Detailed S&OP requirements and SDLC process.
- **[System Architecture](design/architecture.md)**: High-level design and component interaction.
- **[Database Schema](design/database_design.md)**: ER diagrams and table definitions.
- **[Architecture Deep-Dive](architecture/README.md)**: Low-level implementation details of the agent hub.
- **[MCP Hub Tests](mcp-hub/tests/README.md)**: How to run and interpret integration tests.
- **[UI Documentation](ui/README.md)**: Frontend architecture and state management.
- **[Legacy System Context](SIOP_MULTI_AGENT_SYSTEM_README.md)**: Original comprehensive documentation for the multi-agent system.

## Getting Started
For detailed setup instructions and deep-dives, please check the links above.

## Credits
This project was developed in collaboration with **Antigravity**, a powerful agentic AI coding assistant from the **Google DeepMind** team.

