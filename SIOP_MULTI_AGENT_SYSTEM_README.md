# S&OP Multi-Agent System Architecture
## Enterprise Sales & Operations Planning Platform

---

## Table of Contents
1. [System Overview](#system-overview)
2. [Architecture Design](#architecture-design)
3. [Agent Specifications](#agent-specifications)
4. [Database Schema](#database-schema)
5. [MCP Server Configuration](#mcp-server-configuration)
6. [API Endpoints](#api-endpoints)
7. [React UI Components](#react-ui-components)
8. [Implementation Roadmap](#implementation-roadmap)
9. [Technology Stack](#technology-stack)

---

## System Overview

This is a comprehensive S&OP (Sales and Operations Planning) system using a multi-agent architecture with MCP (Model Context Protocol) servers facilitating communication between specialized AI agents.

### Core Principles
- **Hub-and-Spoke Architecture**: Central MCP hub coordinates all agent communications
- **Agent Specialization**: Each agent has a specific domain focus
- **Event-Driven Communication**: Agents communicate through events and message queues
- **Real-time Analytics**: Continuous monitoring and reporting
- **Scalable Design**: Microservices-based with independent agent deployment

---

## Architecture Design

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     React Frontend (UI)                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │Dashboard │ │Analytics │ │Scenarios │ │  Admin   │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
└───────────────────────────┬─────────────────────────────────┘
                            │ REST/GraphQL API
┌───────────────────────────┴─────────────────────────────────┐
│                    API Gateway / Load Balancer              │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────┴─────────────────────────────────┐
│                   Central MCP Hub Server                     │
│  ┌────────────────────────────────────────────────────┐     │
│  │  Message Router & Event Bus                        │     │
│  │  - Agent Registry                                   │     │
│  │  - Message Queue (Redis/RabbitMQ)                  │     │
│  │  - Event Store                                      │     │
│  └────────────────────────────────────────────────────┘     │
└─────────────┬────────────────────────────────────────────────┘
              │
    ┌─────────┼─────────┬─────────┬─────────┬─────────┐
    │         │         │         │         │         │
┌───▼───┐ ┌──▼───┐ ┌──▼───┐ ┌──▼───┐ ┌──▼────┐ ┌────▼────┐
│Sales  │ │Inven-│ │Opera-│ │Plan- │ │Report-│ │Database │
│Agent  │ │tory  │ │tions │ │ning  │ │ing    │ │ Cluster │
│+ Subs │ │Agent │ │Agent │ │Agent │ │Agents │ │         │
└───────┘ └──────┘ └──────┘ └──────┘ └───────┘ └─────────┘
```

### Communication Flow

```
User Action → React UI → API Gateway → MCP Hub → Relevant Agent(s)
                                           ↓
                                    Event Broadcast
                                           ↓
                              All Subscribed Agents
                                           ↓
                                    Process & Respond
                                           ↓
                                    Update Database
                                           ↓
                              MCP Hub → API → UI Update
```

---

## Agent Specifications

### 1. SALES AGENT (Parent)
**Role**: Demand creation and forecasting coordinator  
**MCP Server ID**: `sales-agent-mcp`  
**Port**: 3001

#### Sub-Agents:

##### 1.1 Demand Forecasting Sub-Agent
```yaml
name: demand-forecasting-agent
type: sub-agent
parent: sales-agent
responsibilities:
  - Analyze historical sales data
  - Generate demand forecasts
  - Identify seasonal patterns
  - Machine learning model training
mcp_capabilities:
  - read_sales_history
  - generate_forecast
  - update_forecast_model
  - publish_forecast_event
database_tables:
  - sales_history
  - demand_forecasts
  - forecast_models
  - seasonal_patterns
```

**Prompt Template**:
```
You are a Demand Forecasting AI Agent specializing in predictive analytics for sales operations.

Your responsibilities:
1. Analyze historical sales data from the past 24 months
2. Identify trends, seasonality, and anomalies
3. Generate statistical forecasts using time-series analysis
4. Apply machine learning models (ARIMA, Prophet, LSTM)
5. Provide confidence intervals for all predictions
6. Alert when demand patterns deviate significantly

Input data format: {sales_history_json}
Output format: {forecast_json_schema}

Always consider: market trends, promotional impacts, external factors
```

##### 1.2 Market Intelligence Sub-Agent
```yaml
name: market-intelligence-agent
type: sub-agent
parent: sales-agent
responsibilities:
  - Monitor market trends
  - Analyze customer insights
  - Track competitor activities
  - External data integration
mcp_capabilities:
  - fetch_market_data
  - analyze_customer_sentiment
  - track_competitors
  - generate_insights_report
database_tables:
  - market_trends
  - customer_insights
  - competitor_analysis
  - external_data_sources
```

**Prompt Template**:
```
You are a Market Intelligence AI Agent focused on competitive and customer analysis.

Your responsibilities:
1. Monitor market trends from multiple data sources
2. Analyze customer feedback and sentiment
3. Track competitor pricing and product launches
4. Identify market opportunities and threats
5. Generate actionable insights for sales strategy

Input sources: {market_data_feeds, customer_feedback, competitor_intel}
Analysis framework: SWOT, Porter's Five Forces, Customer Journey Mapping
Output: Structured intelligence reports with recommendations
```

##### 1.3 Promotional Planning Sub-Agent
```yaml
name: promotional-planning-agent
type: sub-agent
parent: sales-agent
responsibilities:
  - Plan marketing campaigns
  - Optimize promotional strategies
  - Track campaign effectiveness
  - Budget allocation
mcp_capabilities:
  - create_promotion_plan
  - calculate_roi
  - optimize_campaign
  - track_performance
database_tables:
  - promotions
  - campaigns
  - campaign_performance
  - marketing_budget
```

##### 1.4 Sales Pipeline Management Sub-Agent
```yaml
name: sales-pipeline-agent
type: sub-agent
parent: sales-agent
responsibilities:
  - Track sales opportunities
  - Manage lead scoring
  - Forecast deal closure
  - Pipeline health monitoring
mcp_capabilities:
  - update_pipeline
  - score_leads
  - forecast_closures
  - generate_pipeline_report
database_tables:
  - sales_opportunities
  - leads
  - deal_stages
  - pipeline_metrics
```

---

### 2. INVENTORY AGENT (Parent)
**Role**: Supply chain optimization and inventory management  
**MCP Server ID**: `inventory-agent-mcp`  
**Port**: 3002

#### Sub-Agents:

##### 2.1 Inventory Optimization Sub-Agent
```yaml
name: inventory-optimization-agent
type: sub-agent
parent: inventory-agent
responsibilities:
  - Optimize stock levels
  - Calculate safety stocks
  - Minimize carrying costs
  - Prevent stockouts
mcp_capabilities:
  - calculate_optimal_inventory
  - determine_safety_stock
  - optimize_reorder_points
  - balance_cost_service
database_tables:
  - inventory_levels
  - reorder_points
  - safety_stocks
  - optimization_parameters
```

**Prompt Template**:
```
You are an Inventory Optimization AI Agent specializing in supply chain efficiency.

Your responsibilities:
1. Calculate optimal inventory levels using EOQ and JIT principles
2. Determine safety stock based on demand variability and lead times
3. Set reorder points to minimize stockouts while reducing carrying costs
4. Balance service levels with inventory investment
5. Consider seasonality and promotional impacts

Input: {demand_forecast, lead_times, costs, service_level_targets}
Optimization constraints: {budget, warehouse_capacity, supplier_reliability}
Output: {optimal_inventory_policy, reorder_recommendations}
```

##### 2.2 Inventory Control Sub-Agent
```yaml
name: inventory-control-agent
type: sub-agent
parent: inventory-agent
responsibilities:
  - Monitor inventory accuracy
  - Track stock movements
  - Identify discrepancies
  - Audit inventory records
mcp_capabilities:
  - track_inventory_movements
  - validate_stock_counts
  - flag_discrepancies
  - generate_audit_reports
database_tables:
  - inventory_transactions
  - stock_counts
  - discrepancies
  - audit_logs
```

##### 2.3 Excess & Obsolete Management Sub-Agent
```yaml
name: excess-obsolete-agent
type: sub-agent
parent: inventory-agent
responsibilities:
  - Identify slow-moving inventory
  - Manage obsolete stock
  - Recommend clearance actions
  - Calculate write-offs
mcp_capabilities:
  - identify_slow_movers
  - calculate_obsolescence_risk
  - recommend_clearance
  - process_writeoffs
database_tables:
  - slow_moving_items
  - obsolete_inventory
  - clearance_actions
  - inventory_writeoffs
```

##### 2.4 Supplier Collaboration Sub-Agent
```yaml
name: supplier-collaboration-agent
type: sub-agent
parent: inventory-agent
responsibilities:
  - Coordinate with suppliers
  - Share demand forecasts
  - Manage vendor relationships
  - Track supplier performance
mcp_capabilities:
  - share_forecast_with_supplier
  - track_supplier_performance
  - manage_vendor_scorecards
  - coordinate_replenishment
database_tables:
  - suppliers
  - supplier_performance
  - vendor_scorecards
  - collaboration_events
```

---

### 3. OPERATIONS AGENT (Parent)
**Role**: Production and resource planning management  
**MCP Server ID**: `operations-agent-mcp`  
**Port**: 3003

#### Sub-Agents:

##### 3.1 Capacity Planning Sub-Agent
```yaml
name: capacity-planning-agent
type: sub-agent
parent: operations-agent
responsibilities:
  - Analyze production capacity
  - Identify constraints
  - Optimize resource utilization
  - Plan capacity expansions
mcp_capabilities:
  - calculate_capacity
  - identify_bottlenecks
  - optimize_utilization
  - plan_expansions
database_tables:
  - production_capacity
  - capacity_constraints
  - utilization_metrics
  - expansion_plans
```

**Prompt Template**:
```
You are a Capacity Planning AI Agent specializing in production optimization.

Your responsibilities:
1. Analyze current production capacity across all resources
2. Identify bottlenecks and constraints in the production process
3. Calculate optimal capacity utilization to meet demand
4. Recommend capacity adjustments (overtime, shifts, equipment)
5. Plan long-term capacity expansions based on demand growth

Input: {demand_forecast, current_capacity, resource_constraints}
Constraints: {budget, labor_availability, equipment_capabilities}
Output: {capacity_plan, bottleneck_analysis, expansion_recommendations}
```

##### 3.2 Production Scheduling Sub-Agent
```yaml
name: production-scheduling-agent
type: sub-agent
parent: operations-agent
responsibilities:
  - Create production schedules
  - Optimize manufacturing sequence
  - Balance efficiency and flexibility
  - Minimize changeover times
mcp_capabilities:
  - generate_production_schedule
  - optimize_sequence
  - balance_workload
  - minimize_changeovers
database_tables:
  - production_schedules
  - manufacturing_orders
  - changeover_times
  - schedule_constraints
```

##### 3.3 Resource Allocation Sub-Agent
```yaml
name: resource-allocation-agent
type: sub-agent
parent: operations-agent
responsibilities:
  - Allocate labor and equipment
  - Optimize resource utilization
  - Manage resource conflicts
  - Track resource efficiency
mcp_capabilities:
  - allocate_resources
  - resolve_conflicts
  - track_utilization
  - optimize_assignments
database_tables:
  - resources
  - resource_assignments
  - utilization_tracking
  - resource_conflicts
```

##### 3.4 Supplier Coordination Sub-Agent
```yaml
name: ops-supplier-coordination-agent
type: sub-agent
parent: operations-agent
responsibilities:
  - Coordinate material deliveries
  - Ensure supplier readiness
  - Manage lead times
  - Track inbound logistics
mcp_capabilities:
  - coordinate_deliveries
  - track_supplier_readiness
  - manage_lead_times
  - monitor_inbound_logistics
database_tables:
  - material_deliveries
  - supplier_readiness
  - lead_time_tracking
  - inbound_shipments
```

---

### 4. PLANNING AGENT (Parent)
**Role**: S&OP process integration and alignment  
**MCP Server ID**: `planning-agent-mcp`  
**Port**: 3004

#### Sub-Agents:

##### 4.1 S&OP Facilitation Sub-Agent
```yaml
name: siop-facilitation-agent
type: sub-agent
parent: planning-agent
responsibilities:
  - Facilitate S&OP meetings
  - Coordinate cross-functional planning
  - Document decisions
  - Track action items
mcp_capabilities:
  - prepare_siop_agenda
  - facilitate_collaboration
  - document_decisions
  - track_action_items
database_tables:
  - siop_meetings
  - meeting_agendas
  - decisions_log
  - action_items
```

**Prompt Template**:
```
You are an S&OP Facilitation AI Agent specializing in cross-functional coordination.

Your responsibilities:
1. Prepare comprehensive S&OP meeting agendas with relevant data
2. Integrate inputs from Sales, Operations, and Inventory teams
3. Identify conflicts between demand and supply plans
4. Facilitate consensus-building on integrated plans
5. Document decisions and assign action items with owners
6. Track follow-through on commitments

Input: {demand_plan, supply_plan, inventory_position, financial_targets}
Facilitation framework: Consensus-building, conflict resolution, data-driven decisions
Output: {integrated_plan, decision_log, action_items, meeting_minutes}
```

##### 4.2 Scenario Planning Sub-Agent
```yaml
name: scenario-planning-agent
type: sub-agent
parent: planning-agent
responsibilities:
  - Model what-if scenarios
  - Assess risk and opportunities
  - Compare alternative plans
  - Recommend optimal scenarios
mcp_capabilities:
  - create_scenario
  - run_simulation
  - compare_scenarios
  - recommend_optimal_plan
database_tables:
  - scenarios
  - scenario_parameters
  - simulation_results
  - scenario_comparisons
```

##### 4.3 Financial Alignment Sub-Agent
```yaml
name: financial-alignment-agent
type: sub-agent
parent: planning-agent
responsibilities:
  - Align plans with budget
  - Reconcile operational and financial plans
  - Track P&L impact
  - Monitor financial KPIs
mcp_capabilities:
  - reconcile_plans
  - calculate_financial_impact
  - track_budget_variance
  - monitor_financial_kpis
database_tables:
  - financial_plans
  - budget_allocations
  - pl_impact
  - financial_kpis
```

##### 4.4 KPI Monitoring Sub-Agent
```yaml
name: kpi-monitoring-agent
type: sub-agent
parent: planning-agent
responsibilities:
  - Monitor key performance indicators
  - Track plan vs. actual
  - Alert on variances
  - Generate performance reports
mcp_capabilities:
  - monitor_kpis
  - calculate_variances
  - trigger_alerts
  - generate_performance_reports
database_tables:
  - kpis
  - kpi_targets
  - actual_performance
  - variance_alerts
```

---

### 5. REPORTING AGENTS (System Level)
**Role**: Analytics, insights, and executive reporting  
**MCP Server ID**: `reporting-agents-mcp`  
**Port**: 3005

#### Reporting Agents:

##### 5.1 Executive Dashboard Agent
```yaml
name: executive-dashboard-agent
type: reporting-agent
responsibilities:
  - Generate high-level reports
  - Provide decision-making insights
  - Summarize key metrics
  - Create executive summaries
mcp_capabilities:
  - generate_executive_summary
  - create_dashboard_data
  - highlight_critical_issues
  - provide_recommendations
database_tables:
  - executive_reports
  - dashboard_metrics
  - critical_issues
  - executive_insights
```

**Prompt Template**:
```
You are an Executive Dashboard AI Agent specializing in strategic insights.

Your responsibilities:
1. Synthesize data from all S&OP agents into executive summaries
2. Highlight critical issues requiring leadership attention
3. Provide clear, actionable recommendations
4. Present data in intuitive visualizations
5. Track progress on strategic initiatives

Input: {aggregated_metrics, variance_analysis, scenario_results}
Audience: C-level executives and senior leadership
Output format: Executive dashboard with KPIs, trends, alerts, recommendations
Communication style: Concise, strategic, action-oriented
```

##### 5.2 Performance Analytics Agent
```yaml
name: performance-analytics-agent
type: reporting-agent
responsibilities:
  - Track KPIs across S&OP
  - Analyze performance trends
  - Identify improvement areas
  - Generate detailed analytics
mcp_capabilities:
  - track_all_kpis
  - analyze_trends
  - identify_opportunities
  - generate_detailed_reports
database_tables:
  - performance_metrics
  - trend_analysis
  - improvement_opportunities
  - detailed_analytics
```

##### 5.3 Variance Analysis Agent
```yaml
name: variance-analysis-agent
type: reporting-agent
responsibilities:
  - Compare plan vs. actual
  - Identify variances
  - Root cause analysis
  - Recommend corrective actions
mcp_capabilities:
  - calculate_variances
  - perform_root_cause_analysis
  - recommend_corrections
  - track_improvement
database_tables:
  - plan_vs_actual
  - variances
  - root_causes
  - corrective_actions
```

##### 5.4 Scenario Insights Agent
```yaml
name: scenario-insights-agent
type: reporting-agent
responsibilities:
  - Analyze scenario outcomes
  - Assess risks and opportunities
  - Provide strategic recommendations
  - Communicate insights
mcp_capabilities:
  - analyze_scenario_results
  - assess_risks
  - identify_opportunities
  - generate_insights
database_tables:
  - scenario_analysis
  - risk_assessments
  - opportunities
  - strategic_insights
```

---

## Database Schema

### Core Tables

#### 1. Agents Registry Table
```sql
CREATE TABLE agents (
    agent_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_name VARCHAR(100) NOT NULL UNIQUE,
    agent_type ENUM('parent', 'sub-agent', 'reporting') NOT NULL,
    parent_agent_id UUID REFERENCES agents(agent_id),
    mcp_server_url VARCHAR(255) NOT NULL,
    status ENUM('active', 'inactive', 'maintenance') DEFAULT 'active',
    capabilities JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_agents_type ON agents(agent_type);
CREATE INDEX idx_agents_parent ON agents(parent_agent_id);
```

#### 2. Messages & Events Table
```sql
CREATE TABLE agent_messages (
    message_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    from_agent_id UUID REFERENCES agents(agent_id),
    to_agent_id UUID REFERENCES agents(agent_id),
    message_type ENUM('request', 'response', 'event', 'broadcast'),
    priority ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
    payload JSONB NOT NULL,
    status ENUM('pending', 'delivered', 'processed', 'failed'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP
);

CREATE INDEX idx_messages_status ON agent_messages(status);
CREATE INDEX idx_messages_created ON agent_messages(created_at);
CREATE INDEX idx_messages_type ON agent_messages(message_type);
```

#### 3. Sales History Table
```sql
CREATE TABLE sales_history (
    sale_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL,
    customer_id UUID,
    sale_date DATE NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    region VARCHAR(50),
    channel VARCHAR(50),
    promotion_id UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sales_date ON sales_history(sale_date);
CREATE INDEX idx_sales_product ON sales_history(product_id);
```

#### 4. Demand Forecasts Table
```sql
CREATE TABLE demand_forecasts (
    forecast_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL,
    forecast_date DATE NOT NULL,
    forecast_quantity INTEGER NOT NULL,
    confidence_level DECIMAL(5,2),
    lower_bound INTEGER,
    upper_bound INTEGER,
    forecast_model VARCHAR(50),
    agent_id UUID REFERENCES agents(agent_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, forecast_date, forecast_model)
);

CREATE INDEX idx_forecast_date ON demand_forecasts(forecast_date);
CREATE INDEX idx_forecast_product ON demand_forecasts(product_id);
```

#### 5. Inventory Levels Table
```sql
CREATE TABLE inventory_levels (
    inventory_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL,
    warehouse_id UUID NOT NULL,
    quantity_on_hand INTEGER NOT NULL,
    quantity_reserved INTEGER DEFAULT 0,
    quantity_available INTEGER GENERATED ALWAYS AS (quantity_on_hand - quantity_reserved) STORED,
    reorder_point INTEGER,
    safety_stock INTEGER,
    last_count_date DATE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, warehouse_id)
);

CREATE INDEX idx_inventory_product ON inventory_levels(product_id);
CREATE INDEX idx_inventory_warehouse ON inventory_levels(warehouse_id);
```

#### 6. Production Schedules Table
```sql
CREATE TABLE production_schedules (
    schedule_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL,
    production_line_id UUID NOT NULL,
    scheduled_start TIMESTAMP NOT NULL,
    scheduled_end TIMESTAMP NOT NULL,
    planned_quantity INTEGER NOT NULL,
    actual_quantity INTEGER,
    status ENUM('planned', 'in_progress', 'completed', 'cancelled'),
    agent_id UUID REFERENCES agents(agent_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_schedule_dates ON production_schedules(scheduled_start, scheduled_end);
CREATE INDEX idx_schedule_status ON production_schedules(status);
```

#### 7. S&OP Scenarios Table
```sql
CREATE TABLE scenarios (
    scenario_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scenario_name VARCHAR(200) NOT NULL,
    description TEXT,
    parameters JSONB NOT NULL,
    results JSONB,
    financial_impact JSONB,
    created_by UUID,
    status ENUM('draft', 'running', 'completed', 'archived'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

CREATE INDEX idx_scenario_status ON scenarios(status);
CREATE INDEX idx_scenario_created ON scenarios(created_at);
```

#### 8. KPIs Table
```sql
CREATE TABLE kpis (
    kpi_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kpi_name VARCHAR(100) NOT NULL,
    kpi_category VARCHAR(50),
    target_value DECIMAL(12,2),
    actual_value DECIMAL(12,2),
    measurement_date DATE NOT NULL,
    agent_id UUID REFERENCES agents(agent_id),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_kpi_date ON kpis(measurement_date);
CREATE INDEX idx_kpi_name ON kpis(kpi_name);
```

### Complete Schema Migration Script

```sql
-- Additional supporting tables

CREATE TABLE products (
    product_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_code VARCHAR(50) UNIQUE NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    category VARCHAR(100),
    unit_of_measure VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE warehouses (
    warehouse_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    warehouse_code VARCHAR(50) UNIQUE NOT NULL,
    warehouse_name VARCHAR(200) NOT NULL,
    location VARCHAR(200),
    capacity INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE suppliers (
    supplier_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_code VARCHAR(50) UNIQUE NOT NULL,
    supplier_name VARCHAR(200) NOT NULL,
    contact_info JSONB,
    performance_rating DECIMAL(3,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE promotions (
    promotion_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    promotion_name VARCHAR(200) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    discount_percentage DECIMAL(5,2),
    target_products JSONB,
    budget DECIMAL(12,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## MCP Server Configuration

### Central MCP Hub Server

```typescript
// mcp-hub-server/config.ts

export const MCPHubConfig = {
  port: 3000,
  host: '0.0.0.0',
  
  agents: [
    {
      id: 'sales-agent',
      type: 'parent',
      mcpUrl: 'http://localhost:3001',
      subAgents: [
        'demand-forecasting-agent',
        'market-intelligence-agent',
        'promotional-planning-agent',
        'sales-pipeline-agent'
      ]
    },
    {
      id: 'inventory-agent',
      type: 'parent',
      mcpUrl: 'http://localhost:3002',
      subAgents: [
        'inventory-optimization-agent',
        'inventory-control-agent',
        'excess-obsolete-agent',
        'supplier-collaboration-agent'
      ]
    },
    {
      id: 'operations-agent',
      type: 'parent',
      mcpUrl: 'http://localhost:3003',
      subAgents: [
        'capacity-planning-agent',
        'production-scheduling-agent',
        'resource-allocation-agent',
        'ops-supplier-coordination-agent'
      ]
    },
    {
      id: 'planning-agent',
      type: 'parent',
      mcpUrl: 'http://localhost:3004',
      subAgents: [
        'siop-facilitation-agent',
        'scenario-planning-agent',
        'financial-alignment-agent',
        'kpi-monitoring-agent'
      ]
    },
    {
      id: 'reporting-agents',
      type: 'system',
      mcpUrl: 'http://localhost:3005',
      subAgents: [
        'executive-dashboard-agent',
        'performance-analytics-agent',
        'variance-analysis-agent',
        'scenario-insights-agent'
      ]
    }
  ],
  
  messageQueue: {
    type: 'redis',
    host: 'localhost',
    port: 6379
  },
  
  database: {
    host: 'localhost',
    port: 5432,
    database: 'siop_system',
    user: 'siop_user',
    password: process.env.DB_PASSWORD
  }
};
```

### MCP Hub Server Implementation

```typescript
// mcp-hub-server/server.ts

import express from 'express';
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import Redis from 'ioredis';
import { Pool } from 'pg';

class MCPHubServer {
  private app: express.Application;
  private httpServer: any;
  private io: SocketServer;
  private redis: Redis;
  private dbPool: Pool;
  private agentRegistry: Map<string, AgentConnection>;

  constructor() {
    this.app = express();
    this.httpServer = createServer(this.app);
    this.io = new SocketServer(this.httpServer, {
      cors: { origin: '*' }
    });
    this.redis = new Redis();
    this.dbPool = new Pool(MCPHubConfig.database);
    this.agentRegistry = new Map();
    
    this.setupMiddleware();
    this.setupRoutes();
    this.setupWebSocketHandlers();
    this.initializeAgents();
  }

  private setupMiddleware() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private setupRoutes() {
    // Agent registration
    this.app.post('/api/agents/register', async (req, res) => {
      const { agentId, mcpUrl, capabilities } = req.body;
      await this.registerAgent(agentId, mcpUrl, capabilities);
      res.json({ success: true, agentId });
    });

    // Message routing
    this.app.post('/api/messages/send', async (req, res) => {
      const { fromAgent, toAgent, messageType, payload } = req.body;
      const messageId = await this.routeMessage(fromAgent, toAgent, messageType, payload);
      res.json({ success: true, messageId });
    });

    // Event broadcasting
    this.app.post('/api/events/broadcast', async (req, res) => {
      const { eventType, payload, targetAgents } = req.body;
      await this.broadcastEvent(eventType, payload, targetAgents);
      res.json({ success: true });
    });

    // Health check
    this.app.get('/api/health', (req, res) => {
      res.json({ status: 'healthy', agents: this.agentRegistry.size });
    });
  }

  private setupWebSocketHandlers() {
    this.io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      socket.on('agent:register', async (data) => {
        await this.handleAgentRegistration(socket, data);
      });

      socket.on('message:send', async (data) => {
        await this.handleMessageSend(socket, data);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
        this.handleAgentDisconnect(socket);
      });
    });
  }

  private async registerAgent(agentId: string, mcpUrl: string, capabilities: any) {
    const query = `
      INSERT INTO agents (agent_name, mcp_server_url, capabilities, status)
      VALUES ($1, $2, $3, 'active')
      ON CONFLICT (agent_name) 
      DO UPDATE SET mcp_server_url = $2, capabilities = $3, updated_at = CURRENT_TIMESTAMP
      RETURNING agent_id
    `;
    
    const result = await this.dbPool.query(query, [agentId, mcpUrl, JSON.stringify(capabilities)]);
    return result.rows[0].agent_id;
  }

  private async routeMessage(
    fromAgent: string, 
    toAgent: string, 
    messageType: string, 
    payload: any
  ): Promise<string> {
    const messageId = crypto.randomUUID();
    
    // Store message in database
    await this.dbPool.query(`
      INSERT INTO agent_messages 
      (message_id, from_agent_id, to_agent_id, message_type, payload, status)
      VALUES ($1, 
        (SELECT agent_id FROM agents WHERE agent_name = $2),
        (SELECT agent_id FROM agents WHERE agent_name = $3),
        $4, $5, 'pending')
    `, [messageId, fromAgent, toAgent, messageType, JSON.stringify(payload)]);

    // Publish to Redis for real-time delivery
    await this.redis.publish(`agent:${toAgent}`, JSON.stringify({
      messageId,
      fromAgent,
      messageType,
      payload,
      timestamp: new Date().toISOString()
    }));

    return messageId;
  }

  private async broadcastEvent(eventType: string, payload: any, targetAgents?: string[]) {
    const agents = targetAgents || Array.from(this.agentRegistry.keys());
    
    for (const agentId of agents) {
      await this.routeMessage('mcp-hub', agentId, 'event', {
        eventType,
        ...payload
      });
    }
  }

  public start(port: number = 3000) {
    this.httpServer.listen(port, () => {
      console.log(`MCP Hub Server running on port ${port}`);
    });
  }
}

export default MCPHubServer;
```

### Individual Agent MCP Server Template

```typescript
// agents/base-agent-mcp-server.ts

import express from 'express';
import Redis from 'ioredis';
import { Pool } from 'pg';
import Anthropic from '@anthropic-ai/sdk';

export abstract class BaseAgentMCPServer {
  protected app: express.Application;
  protected redis: Redis;
  protected dbPool: Pool;
  protected anthropic: Anthropic;
  protected agentName: string;
  protected port: number;

  constructor(agentName: string, port: number) {
    this.agentName = agentName;
    this.port = port;
    this.app = express();
    this.redis = new Redis();
    this.dbPool = new Pool({
      host: 'localhost',
      port: 5432,
      database: 'siop_system'
    });
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });

    this.setupMiddleware();
    this.setupRoutes();
    this.subscribeToMessages();
  }

  protected setupMiddleware() {
    this.app.use(express.json());
  }

  protected setupRoutes() {
    // Process request endpoint
    this.app.post('/api/process', async (req, res) => {
      const { requestType, payload } = req.body;
      const result = await this.processRequest(requestType, payload);
      res.json(result);
    });

    // Health check
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
    await fetch('http://localhost:3000/api/messages/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fromAgent: this.agentName,
        toAgent,
        messageType,
        payload
      })
    });
  }

  protected async callClaude(prompt: string, systemPrompt: string): Promise<string> {
    const message = await this.anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: 'user', content: prompt }]
    });

    return message.content[0].type === 'text' ? message.content[0].text : '';
  }

  // Abstract methods to be implemented by specific agents
  protected abstract processRequest(requestType: string, payload: any): Promise<any>;
  protected abstract handleIncomingMessage(message: any): Promise<void>;
  protected abstract getSystemPrompt(): string;

  public start() {
    this.app.listen(this.port, () => {
      console.log(`${this.agentName} MCP Server running on port ${this.port}`);
    });
  }
}
```

---

## API Endpoints

### REST API Documentation

#### Base URL: `http://localhost:3000/api`

#### Agent Management

```
POST   /agents/register          - Register a new agent
GET    /agents                   - List all agents
GET    /agents/:agentId          - Get agent details
PUT    /agents/:agentId/status   - Update agent status
DELETE /agents/:agentId          - Deactivate agent
```

#### Messaging

```
POST   /messages/send            - Send message to agent
GET    /messages/:messageId      - Get message status
GET    /messages/agent/:agentId  - Get agent's messages
```

#### Demand Forecasting

```
POST   /forecasts/generate       - Generate demand forecast
GET    /forecasts/:productId     - Get product forecast
PUT    /forecasts/:forecastId    - Update forecast
GET    /forecasts/accuracy       - Get forecast accuracy metrics
```

#### Inventory Management

```
GET    /inventory/levels         - Get inventory levels
POST   /inventory/optimize       - Run inventory optimization
GET    /inventory/slow-movers    - Identify slow-moving items
POST   /inventory/reorder        - Create reorder recommendations
```

#### Production Planning

```
POST   /production/schedule      - Create production schedule
GET    /production/capacity      - Get capacity analysis
PUT    /production/schedule/:id  - Update schedule
GET    /production/utilization   - Get resource utilization
```

#### S&OP Scenarios

```
POST   /scenarios/create         - Create new scenario
POST   /scenarios/:id/run        - Run scenario simulation
GET    /scenarios/:id/results    - Get scenario results
GET    /scenarios/compare        - Compare multiple scenarios
```

#### Reporting & Analytics

```
GET    /reports/executive        - Executive dashboard data
GET    /reports/kpis             - All KPIs summary
GET    /reports/variances        - Plan vs actual variances
GET    /reports/performance      - Performance analytics
```

---

## React UI Components

### Project Structure

```
siop-frontend/
├── src/
│   ├── components/
│   │   ├── agents/
│   │   │   ├── AgentCard.tsx
│   │   │   ├── AgentStatus.tsx
│   │   │   └── AgentMessaging.tsx
│   │   ├── dashboard/
│   │   │   ├── ExecutiveDashboard.tsx
│   │   │   ├── KPIWidget.tsx
│   │   │   └── MetricsChart.tsx
│   │   ├── forecasting/
│   │   │   ├── DemandForecastView.tsx
│   │   │   ├── ForecastChart.tsx
│   │   │   └── ForecastAccuracy.tsx
│   │   ├── inventory/
│   │   │   ├── InventoryLevels.tsx
│   │   │   ├── OptimizationResults.tsx
│   │   │   └── SlowMoversTable.tsx
│   │   ├── production/
│   │   │   ├── ProductionSchedule.tsx
│   │   │   ├── CapacityPlanner.tsx
│   │   │   └── ResourceGantt.tsx
│   │   ├── scenarios/
│   │   │   ├── ScenarioBuilder.tsx
│   │   │   ├── ScenarioComparison.tsx
│   │   │   └── SimulationResults.tsx
│   │   └── shared/
│   │       ├── Layout.tsx
│   │       ├── Navigation.tsx
│   │       └── Loading.tsx
│   ├── hooks/
│   │   ├── useAgents.ts
│   │   ├── useForecast.ts
│   │   ├── useInventory.ts
│   │   └── useWebSocket.ts
│   ├── services/
│   │   ├── api.ts
│   │   ├── websocket.ts
│   │   └── agents.ts
│   ├── types/
│   │   ├── agent.types.ts
│   │   ├── forecast.types.ts
│   │   └── siop.types.ts
│   ├── App.tsx
│   └── index.tsx
├── package.json
└── tsconfig.json
```

### Key React Components

#### 1. Executive Dashboard Component

```typescript
// components/dashboard/ExecutiveDashboard.tsx

import React, { useEffect, useState } from 'react';
import { Card, Grid, Typography, Alert } from '@mui/material';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useDashboard } from '../../hooks/useDashboard';

interface DashboardMetrics {
  demandForecast: number;
  inventoryLevel: number;
  capacityUtilization: number;
  forecastAccuracy: number;
  criticalAlerts: Array<{
    type: string;
    message: string;
    severity: 'high' | 'medium' | 'low';
  }>;
}

export const ExecutiveDashboard: React.FC = () => {
  const { metrics, loading, error } = useDashboard();
  const [realtimeData, setRealtimeData] = useState<any[]>([]);

  useEffect(() => {
    // WebSocket connection for real-time updates
    const ws = new WebSocket('ws://localhost:3000/ws/dashboard');
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setRealtimeData(prev => [...prev.slice(-20), data]);
    };

    return () => ws.close();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <div className="executive-dashboard">
      <Typography variant="h4" gutterBottom>
        S&OP Executive Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* KPI Cards */}
        <Grid item xs={12} md={3}>
          <Card className="kpi-card">
            <Typography variant="h6">Demand Forecast</Typography>
            <Typography variant="h3">{metrics.demandForecast.toLocaleString()}</Typography>
            <Typography variant="body2" color="textSecondary">Units (Next 30 Days)</Typography>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card className="kpi-card">
            <Typography variant="h6">Inventory Health</Typography>
            <Typography variant="h3">{metrics.inventoryLevel}%</Typography>
            <Typography variant="body2" color="textSecondary">Optimal Range: 85-95%</Typography>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card className="kpi-card">
            <Typography variant="h6">Capacity Utilization</Typography>
            <Typography variant="h3">{metrics.capacityUtilization}%</Typography>
            <Typography variant="body2" color="textSecondary">Target: 80-90%</Typography>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card className="kpi-card">
            <Typography variant="h6">Forecast Accuracy</Typography>
            <Typography variant="h3">{metrics.forecastAccuracy}%</Typography>
            <Typography variant="body2" color="textSecondary">Last 90 Days</Typography>
          </Card>
        </Grid>

        {/* Critical Alerts */}
        <Grid item xs={12}>
          <Card>
            <Typography variant="h6">Critical Alerts</Typography>
            {metrics.criticalAlerts.map((alert, idx) => (
              <Alert key={idx} severity={alert.severity === 'high' ? 'error' : 'warning'}>
                {alert.message}
              </Alert>
            ))}
          </Card>
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={6}>
          <Card>
            <Typography variant="h6">Demand vs Supply Trend</Typography>
            <LineChart width={500} height={300} data={realtimeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="demand" stroke="#8884d8" />
              <Line type="monotone" dataKey="supply" stroke="#82ca9d" />
            </LineChart>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <Typography variant="h6">Capacity Utilization by Line</Typography>
            <BarChart width={500} height={300} data={metrics.capacityByLine}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="line" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="utilization" fill="#8884d8" />
            </BarChart>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};
```

#### 2. Agent Status Monitor Component

```typescript
// components/agents/AgentStatusMonitor.tsx

import React, { useEffect, useState } from 'react';
import { Card, Chip, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { useAgents } from '../../hooks/useAgents';

interface AgentStatus {
  agentId: string;
  agentName: string;
  status: 'active' | 'inactive' | 'error';
  lastHeartbeat: string;
  messagesProcessed: number;
  subAgents?: AgentStatus[];
}

export const AgentStatusMonitor: React.FC = () => {
  const { agents, subscribeToUpdates } = useAgents();

  useEffect(() => {
    const unsubscribe = subscribeToUpdates((update) => {
      console.log('Agent update:', update);
    });

    return () => unsubscribe();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'default';
      case 'error': return 'error';
      default: return 'default';
    }
  };

  return (
    <Card>
      <Typography variant="h6">Agent Status Monitor</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Agent Name</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Last Heartbeat</TableCell>
            <TableCell>Messages Processed</TableCell>
            <TableCell>Sub-Agents</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {agents.map((agent) => (
            <React.Fragment key={agent.agentId}>
              <TableRow>
                <TableCell>{agent.agentName}</TableCell>
                <TableCell>
                  <Chip 
                    label={agent.status} 
                    color={getStatusColor(agent.status)} 
                    size="small"
                  />
                </TableCell>
                <TableCell>{new Date(agent.lastHeartbeat).toLocaleString()}</TableCell>
                <TableCell>{agent.messagesProcessed}</TableCell>
                <TableCell>{agent.subAgents?.length || 0} sub-agents</TableCell>
              </TableRow>
              {agent.subAgents?.map((subAgent) => (
                <TableRow key={subAgent.agentId} style={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell style={{ paddingLeft: '40px' }}>↳ {subAgent.agentName}</TableCell>
                  <TableCell>
                    <Chip 
                      label={subAgent.status} 
                      color={getStatusColor(subAgent.status)} 
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{new Date(subAgent.lastHeartbeat).toLocaleString()}</TableCell>
                  <TableCell>{subAgent.messagesProcessed}</TableCell>
                  <TableCell>-</TableCell>
                </TableRow>
              ))}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};
```

#### 3. Scenario Builder Component

```typescript
// components/scenarios/ScenarioBuilder.tsx

import React, { useState } from 'react';
import { 
  Card, Button, TextField, FormControl, InputLabel, 
  Select, MenuItem, Slider, Typography 
} from '@mui/material';
import { useScenarios } from '../../hooks/useScenarios';

interface ScenarioParameters {
  name: string;
  demandChange: number;
  capacityChange: number;
  inventoryPolicy: 'aggressive' | 'moderate' | 'conservative';
  timeHorizon: number;
}

export const ScenarioBuilder: React.FC = () => {
  const { createScenario, runSimulation } = useScenarios();
  const [parameters, setParameters] = useState<ScenarioParameters>({
    name: '',
    demandChange: 0,
    capacityChange: 0,
    inventoryPolicy: 'moderate',
    timeHorizon: 12
  });

  const handleCreate = async () => {
    const scenarioId = await createScenario(parameters);
    await runSimulation(scenarioId);
  };

  return (
    <Card className="scenario-builder">
      <Typography variant="h6">Create New Scenario</Typography>
      
      <TextField
        label="Scenario Name"
        value={parameters.name}
        onChange={(e) => setParameters({ ...parameters, name: e.target.value })}
        fullWidth
        margin="normal"
      />

      <Typography gutterBottom>Demand Change: {parameters.demandChange}%</Typography>
      <Slider
        value={parameters.demandChange}
        onChange={(_, value) => setParameters({ ...parameters, demandChange: value as number })}
        min={-50}
        max={50}
        marks
        valueLabelDisplay="auto"
      />

      <Typography gutterBottom>Capacity Change: {parameters.capacityChange}%</Typography>
      <Slider
        value={parameters.capacityChange}
        onChange={(_, value) => setParameters({ ...parameters, capacityChange: value as number })}
        min={-30}
        max={30}
        marks
        valueLabelDisplay="auto"
      />

      <FormControl fullWidth margin="normal">
        <InputLabel>Inventory Policy</InputLabel>
        <Select
          value={parameters.inventoryPolicy}
          onChange={(e) => setParameters({ 
            ...parameters, 
            inventoryPolicy: e.target.value as any 
          })}
        >
          <MenuItem value="aggressive">Aggressive (Low Stock)</MenuItem>
          <MenuItem value="moderate">Moderate (Balanced)</MenuItem>
          <MenuItem value="conservative">Conservative (High Safety Stock)</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="Time Horizon (Months)"
        type="number"
        value={parameters.timeHorizon}
        onChange={(e) => setParameters({ 
          ...parameters, 
          timeHorizon: parseInt(e.target.value) 
        })}
        fullWidth
        margin="normal"
      />

      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleCreate}
        disabled={!parameters.name}
      >
        Create & Run Scenario
      </Button>
    </Card>
  );
};
```

#### 4. Custom Hooks

```typescript
// hooks/useAgents.ts

import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

interface Agent {
  agentId: string;
  agentName: string;
  status: string;
  lastHeartbeat: string;
  messagesProcessed: number;
}

export const useAgents = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io('http://localhost:3000');
    setSocket(newSocket);

    // Fetch initial agents
    fetch('http://localhost:3000/api/agents')
      .then(res => res.json())
      .then(data => setAgents(data));

    return () => {
      newSocket.close();
    };
  }, []);

  const subscribeToUpdates = (callback: (update: any) => void) => {
    if (!socket) return () => {};

    socket.on('agent:update', callback);
    return () => socket.off('agent:update', callback);
  };

  const sendMessage = async (toAgent: string, messageType: string, payload: any) => {
    const response = await fetch('http://localhost:3000/api/messages/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fromAgent: 'ui-client',
        toAgent,
        messageType,
        payload
      })
    });
    return response.json();
  };

  return { agents, subscribeToUpdates, sendMessage };
};
```

---

## Implementation Roadmap

### Phase 1: Foundation (Weeks 1-2)
- [ ] Set up PostgreSQL database with complete schema
- [ ] Implement MCP Hub Server core functionality
- [ ] Create base agent MCP server template
- [ ] Set up Redis for message queue
- [ ] Configure development environment

### Phase 2: Core Agents (Weeks 3-5)
- [ ] Implement Sales Agent and 4 sub-agents
- [ ] Implement Inventory Agent and 4 sub-agents
- [ ] Implement Operations Agent and 4 sub-agents
- [ ] Test inter-agent communication
- [ ] Set up logging and monitoring

### Phase 3: Planning & Reporting (Weeks 6-7)
- [ ] Implement Planning Agent and 4 sub-agents
- [ ] Implement all 4 Reporting Agents
- [ ] Create event broadcasting system
- [ ] Build agent orchestration workflows

### Phase 4: API Development (Week 8)
- [ ] Build REST API endpoints
- [ ] Implement GraphQL API (optional)
- [ ] Create API documentation
- [ ] Add authentication and authorization

### Phase 5: Frontend Development (Weeks 9-11)
- [ ] Set up React application structure
- [ ] Build Executive Dashboard
- [ ] Create Agent Status Monitor
- [ ] Implement Scenario Builder
- [ ] Build Forecasting UI
- [ ] Create Inventory Management UI
- [ ] Develop Production Planning UI

### Phase 6: Integration & Testing (Weeks 12-13)
- [ ] End-to-end testing
- [ ] Performance optimization
- [ ] Load testing
- [ ] Security audit
- [ ] Bug fixes

### Phase 7: Deployment (Week 14)
- [ ] Set up production environment
- [ ] Deploy database
- [ ] Deploy MCP Hub and agents
- [ ] Deploy frontend
- [ ] Configure monitoring and alerts
- [ ] Create backup and recovery procedures

---

## Technology Stack

### Backend
- **Runtime**: Node.js 20+ / TypeScript
- **MCP Framework**: Custom implementation with Socket.IO
- **Database**: PostgreSQL 15+
- **Message Queue**: Redis 7+
- **API Framework**: Express.js
- **AI Integration**: Anthropic Claude API

### Frontend
- **Framework**: React 18+ with TypeScript
- **UI Library**: Material-UI (MUI)
- **State Management**: React Query + Zustand
- **Charts**: Recharts
- **WebSocket**: Socket.IO Client

### Infrastructure
- **Container**: Docker + Docker Compose
- **Orchestration**: Kubernetes (production)
- **CI/CD**: GitHub Actions
- **Monitoring**: Prometheus + Grafana
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)

### Development Tools
- **Code Editor**: VSCode with extensions
- **API Testing**: Postman / Insomnia
- **Database Tool**: DBeaver / pgAdmin
- **Version Control**: Git + GitHub

---

## Docker Compose Configuration

```yaml
# docker-compose.yml

version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: siop_system
      POSTGRES_USER: siop_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./schema.sql:/docker-entrypoint-initdb.d/schema.sql

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  mcp-hub:
    build: ./mcp-hub-server
    ports:
      - "3000:3000"
    environment:
      - DB_HOST=postgres
      - DB_PORT=5432
      - REDIS_HOST=redis
      - REDIS_PORT=6379
    depends_on:
      - postgres
      - redis

  sales-agent:
    build: ./agents/sales-agent
    ports:
      - "3001:3001"
    environment:
      - MCP_HUB_URL=http://mcp-hub:3000
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
    depends_on:
      - mcp-hub

  inventory-agent:
    build: ./agents/inventory-agent
    ports:
      - "3002:3002"
    environment:
      - MCP_HUB_URL=http://mcp-hub:3000
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
    depends_on:
      - mcp-hub

  operations-agent:
    build: ./agents/operations-agent
    ports:
      - "3003:3003"
    environment:
      - MCP_HUB_URL=http://mcp-hub:3000
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
    depends_on:
      - mcp-hub

  planning-agent:
    build: ./agents/planning-agent
    ports:
      - "3004:3004"
    environment:
      - MCP_HUB_URL=http://mcp-hub:3000
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
    depends_on:
      - mcp-hub

  reporting-agents:
    build: ./agents/reporting-agents
    ports:
      - "3005:3005"
    environment:
      - MCP_HUB_URL=http://mcp-hub:3000
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
    depends_on:
      - mcp-hub

  frontend:
    build: ./siop-frontend
    ports:
      - "3006:3006"
    environment:
      - REACT_APP_API_URL=http://localhost:3000
    depends_on:
      - mcp-hub

volumes:
  postgres_data:
  redis_data:
```

---

## Environment Variables

```bash
# .env

# Database
DB_PASSWORD=your_secure_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=siop_system
DB_USER=siop_user

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Anthropic API
ANTHROPIC_API_KEY=your_anthropic_api_key

# MCP Hub
MCP_HUB_PORT=3000
MCP_HUB_HOST=0.0.0.0

# Agent Ports
SALES_AGENT_PORT=3001
INVENTORY_AGENT_PORT=3002
OPERATIONS_AGENT_PORT=3003
PLANNING_AGENT_PORT=3004
REPORTING_AGENTS_PORT=3005

# Frontend
REACT_APP_API_URL=http://localhost:3000
FRONTEND_PORT=3006

# Security
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret

# Logging
LOG_LEVEL=info
```

---

## Getting Started

### Prerequisites
```bash
# Install Node.js 20+
node --version

# Install PostgreSQL 15+
psql --version

# Install Redis 7+
redis-server --version

# Install Docker & Docker Compose
docker --version
docker-compose --version
```

### Quick Start with Docker Compose
```bash
# Clone the repository
git clone <repository-url>
cd siop-multi-agent-system

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Access the application
open http://localhost:3006
```

### Manual Setup
```bash
# Install dependencies for all components
npm run install:all

# Set up database
npm run db:setup

# Start MCP Hub
cd mcp-hub-server && npm run dev

# Start agents (in separate terminals)
cd agents/sales-agent && npm run dev
cd agents/inventory-agent && npm run dev
cd agents/operations-agent && npm run dev
cd agents/planning-agent && npm run dev
cd agents/reporting-agents && npm run dev

# Start frontend
cd siop-frontend && npm start
```

---

## Next Steps

1. **Review and customize** agent prompts based on your specific business needs
2. **Configure database** with your actual product, warehouse, and supplier data
3. **Set up monitoring** and alerting for production readiness
4. **Train agents** with historical data for better forecasting
5. **Customize UI** to match your branding and workflows
6. **Integrate** with existing ERP/WMS systems via API
7. **Test thoroughly** with real scenarios before production deployment

---

## Support & Resources

- **Documentation**: [Full API Docs](./docs/api.md)
- **Architecture Diagrams**: [System Design](./docs/architecture.md)
- **Development Guide**: [Contributing](./CONTRIBUTING.md)
- **MCP Protocol**: [Anthropic MCP Docs](https://docs.anthropic.com/mcp)

---

## License

MIT License - See LICENSE file for details

---

**Built with ❤️ for modern S&OP operations**

---

## Contributors

- **Google Antigravity in VS Code**: Lead AI Developer and Architect for this project, specialized in multi-agent orchestration and UI polish.
