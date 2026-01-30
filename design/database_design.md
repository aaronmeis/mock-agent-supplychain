[← Back to Project Overview](../README.md)

# Database Design

The S&OP Agent Orchestrator uses a PostgreSQL database to maintain the agent registry, message history, and core supply chain data.

## Schema Overview

The database is structured into three main areas:
1. **Agent Orchestration**: Managing agents and their communication.
2. **Supply Chain Master Data**: Products and warehouses.
3. **Planning & Operations Data**: Inventory levels, sales history, demand forecasts, and production schedules.

## 1. Agent Orchestration Tables

### `agents`
Stores the central registry of all agents in the system.
- `agent_id` (UUID, PK): Unique identifier.
- `agent_name` (VARCHAR): Unique name for the agent (e.g., 'sales-agent').
- `agent_type` (VARCHAR): The role of the agent (`parent`, `sub-agent`, `reporting`).
- `parent_agent_id` (UUID, FK): Optional link to a parent agent for hierarchical orchestration.
- `mcp_server_url` (VARCHAR): The endpoint for the agent's MCP server.
- `capabilities` (JSONB): Structured data describing what the agent can do.
- `status` (VARCHAR): Current operational status.

### `agent_messages`
Logs all communication between agents routed through the Hub.
- `message_id` (UUID, PK): Unique identifier.
- `from_agent_id` (UUID, FK): Originating agent.
- `to_agent_id` (UUID, FK): Recipient agent.
- `message_type` (VARCHAR): `request`, `response`, `event`, or `broadcast`.
- `payload` (JSONB): The actual message content.
- `status` (VARCHAR): Delivery status (`pending`, `delivered`, etc.).

## 2. Supply Chain Master Data

### `products`
The catalog of items being managed.
- `product_code` (VARCHAR): Unique SKU identifier.
- `product_name` (VARCHAR): Descriptive name.
- `category` (VARCHAR): Product group (e.g., Core Components, Accessories).

### `warehouses`
Storage locations in the supply chain network.
- `warehouse_code` (VARCHAR): Unique location code.
- `warehouse_name` (VARCHAR): Descriptive name.
- `capacity` (INTEGER): Maximum storage volume.

## 3. Planning & Operations Data

### `inventory_levels`
Real-time stock status across the network.
- `product_id`, `warehouse_id` (FKs): Composite unique key.
- `quantity_on_hand` (INTEGER): Physical stock.
- `reorder_point` (INTEGER): Threshold for replenishment.
- `safety_stock` (INTEGER): Buffer stock for demand variability.

### `sales_history`
Historical transactional data used for demand forecasting.
- `sale_date` (DATE): When the sale occurred.
- `quantity` (INTEGER): Units sold.
- `region`, `channel` (VARCHAR): Market segments.

### `demand_forecasts`
Output from forecasting agents.
- `forecast_date` (DATE): Target period for the forecast.
- `forecast_quantity` (INTEGER): Projected units.
- `confidence_level` (DECIMAL): Statistical certainty of the forecast.
- `agent_id` (UUID, FK): The agent that generated the forecast.

### `production_schedules`
Aligned manufacturing plans.
- `scheduled_start`, `scheduled_end` (TIMESTAMP): Time window.
- `planned_quantity` (INTEGER): Target output.
- `agent_id` (UUID, FK): The inventory or planning agent that requested the schedule.

## Relationship Diagram

```mermaid
erDiagram
    agents ||--o{ agents : "parent of"
    agents ||--o{ agent_messages : "from"
    agents ||--o{ agent_messages : "to"
    agents ||--o{ demand_forecasts : "generates"
    agents ||--o{ production_schedules : "triggers"
    
    products ||--o{ inventory_levels : "has"
    products ||--o{ sales_history : "records"
    products ||--o{ demand_forecasts : "forecasts"
    products ||--o{ production_schedules : "planned"
    
    warehouses ||--o{ inventory_levels : "contains"

    agents {
        uuid agent_id PK
        string agent_name
        string agent_type
        uuid parent_agent_id FK
        string mcp_server_url
        string status
        jsonb capabilities
    }

    agent_messages {
        uuid message_id PK
        uuid from_agent_id FK
        uuid to_agent_id FK
        string message_type
        string priority
        jsonb payload
        string status
    }

    products {
        uuid product_id PK
        string product_code
        string product_name
        string category
    }

    warehouses {
        uuid warehouse_id PK
        string warehouse_code
        string warehouse_name
        int capacity
    }

    inventory_levels {
        uuid inventory_id PK
        uuid product_id FK
        uuid warehouse_id FK
        int quantity_on_hand
        int reorder_point
        int safety_stock
    }

    sales_history {
        uuid sale_id PK
        uuid product_id FK
        date sale_date
        int quantity
        decimal total_amount
    }

    demand_forecasts {
        uuid forecast_id PK
        uuid product_id FK
        date forecast_date
        int forecast_quantity
        decimal confidence_level
        uuid agent_id FK
    }

    production_schedules {
        uuid schedule_id PK
        uuid product_id FK
        timestamp scheduled_start
        timestamp scheduled_end
        int planned_quantity
        uuid agent_id FK
    }
```
