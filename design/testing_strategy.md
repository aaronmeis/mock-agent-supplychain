# Testing Strategy

This document outlines the multi-layered testing strategy employed to verify the reliability and correctness of the S&OP Agent Orchestrator.

## 1. Unit Testing
- **Scope**: Individual functions, components, or modules in isolation.
- **Tools**: Jest, React Testing Library.
- **Focus**: Logical correctness, edge cases, and UI component state.

## 2. Integration Testing
- **Scope**: Interaction between multiple components or services.
- **Tools**: Jest, Supertest.
- **Key Target**: The **MCP Hub** (see [Hub Tests README](file:///c:/Users/learn/projects/mock-agent-supplychain/mcp-hub/tests/README.md)).
- **Focus**: API endpoint behavior, database interactions, and Redis messaging logic.

## 3. System Testing (End-to-End)
- **Scope**: Testing the complete system flow from the user perspective.
- **Tools**: Automated via Hub API, triggered by the UI.
- **Focus**: Verifying that the UI, Hub, Agents, and Infrastructure work together seamlessly to execute S&OP scenarios.

## 4. Mocking Strategy
- Infrastructure dependencies (Redis, Postgres) are mocked during unit and localized integration tests to ensure speed and stability.
- Genuine service communication is verified during system-level tests within the Docker environment.

## 5. Continuous Verification
- Modern "Run System Tests" feature in the UI allows developer/user verification at any time.
- Detailed output (combined stdout/stderr) provides immediate clarity on any failures.
