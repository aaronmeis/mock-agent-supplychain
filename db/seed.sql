-- Seed Data for S&OP Agent System
-- This file provides initial data to make the UI look active immediately

-- 1. Insert some Mock Sales History
INSERT INTO sales_history (product_id, sale_date, quantity, unit_price, total_amount, region, channel)
VALUES 
(gen_random_uuid(), CURRENT_DATE - INTERVAL '30 days', 150, 45.00, 6750.00, 'North America', 'Direct'),
(gen_random_uuid(), CURRENT_DATE - INTERVAL '25 days', 200, 45.00, 9000.00, 'Europe', 'Retail'),
(gen_random_uuid(), CURRENT_DATE - INTERVAL '20 days', 180, 45.00, 8100.00, 'Asia', 'Online'),
(gen_random_uuid(), CURRENT_DATE - INTERVAL '15 days', 220, 45.00, 9900.00, 'North America', 'Direct'),
(gen_random_uuid(), CURRENT_DATE - INTERVAL '10 days', 190, 45.00, 8550.00, 'Europe', 'Retail'),
(gen_random_uuid(), CURRENT_DATE - INTERVAL '5 days', 250, 45.00, 11250.00, 'Asia', 'Online');

-- 2. Insert initial Agent state (Optional, will be updated by agents on startup)
-- Note: Agents usually register themselves via the Hub API

-- 3. Insert some initial Inventory Levels
INSERT INTO inventory_levels (product_id, warehouse_id, quantity_on_hand, quantity_reserved, reorder_point, safety_stock)
VALUES
(gen_random_uuid(), gen_random_uuid(), 5000, 200, 1000, 500),
(gen_random_uuid(), gen_random_uuid(), 3500, 150, 800, 400),
(gen_random_uuid(), gen_random_uuid(), 1200, 50, 1500, 750);

-- 4. Insert a sample S&OP Scenario
INSERT INTO scenarios (scenario_name, description, parameters, status)
VALUES
('Aggressive Q3 Growth', 'Modeling a 15% increase in demand across all regions for Q3', '{"demand_multiplier": 1.15, "regions": "all"}', 'completed');
