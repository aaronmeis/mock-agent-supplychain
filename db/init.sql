-- Agents Registry Table
CREATE TABLE agents (
    agent_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_name VARCHAR(100) NOT NULL UNIQUE,
    agent_type VARCHAR(20) NOT NULL, -- parent, sub-agent, reporting
    parent_agent_id UUID REFERENCES agents(agent_id),
    mcp_server_url VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'active', -- active, inactive, maintenance
    capabilities JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_agents_type ON agents(agent_type);
CREATE INDEX idx_agents_parent ON agents(parent_agent_id);

-- Messages & Events Table
CREATE TABLE agent_messages (
    message_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    from_agent_id UUID REFERENCES agents(agent_id),
    to_agent_id UUID REFERENCES agents(agent_id),
    message_type VARCHAR(20), -- request, response, event, broadcast
    priority VARCHAR(10) DEFAULT 'medium', -- low, medium, high, critical
    payload JSONB NOT NULL,
    status VARCHAR(20), -- pending, delivered, processed, failed
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP
);

CREATE INDEX idx_messages_status ON agent_messages(status);
CREATE INDEX idx_messages_created ON agent_messages(created_at);
CREATE INDEX idx_messages_type ON agent_messages(message_type);

-- Supporting Tables
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

CREATE TABLE inventory_levels (
    inventory_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(product_id),
    warehouse_id UUID REFERENCES warehouses(warehouse_id),
    quantity_on_hand INTEGER NOT NULL,
    quantity_reserved INTEGER DEFAULT 0,
    reorder_point INTEGER,
    safety_stock INTEGER,
    last_count_date DATE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, warehouse_id)
);

CREATE TABLE sales_history (
    sale_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(product_id),
    customer_id UUID,
    sale_date DATE NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    region VARCHAR(50),
    channel VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE demand_forecasts (
    forecast_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(product_id),
    forecast_date DATE NOT NULL,
    forecast_quantity INTEGER NOT NULL,
    confidence_level DECIMAL(5,2),
    lower_bound INTEGER,
    upper_bound INTEGER,
    forecast_model VARCHAR(50),
    agent_id UUID REFERENCES agents(agent_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE production_schedules (
    schedule_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(product_id),
    production_line_id UUID NOT NULL,
    scheduled_start TIMESTAMP NOT NULL,
    scheduled_end TIMESTAMP NOT NULL,
    planned_quantity INTEGER NOT NULL,
    actual_quantity INTEGER,
    status VARCHAR(20), -- planned, in_progress, completed, cancelled
    agent_id UUID REFERENCES agents(agent_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed some initial data
INSERT INTO products (product_code, product_name, category) VALUES 
('SKU-12345', 'High-Performance Hub', 'Core Components'),
('SKU-67890', 'Industrial Sensor A', 'Accessories'),
('SKU-11223', 'Precision Valve X', 'Valves');

INSERT INTO warehouses (warehouse_code, warehouse_name, location) VALUES 
('WH-001', 'Central Logistics Hub', 'Chicago, IL'),
('WH-002', 'East Coast Distribution', 'Newark, NJ');
