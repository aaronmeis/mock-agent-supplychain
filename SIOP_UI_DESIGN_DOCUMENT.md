# S&OP Multi-Agent System - Interactive UI Design Document
## Visual Agent Flow & Real-Time Demonstration Interface

---

## Table of Contents
1. [UI Overview & Philosophy](#ui-overview--philosophy)
2. [Main Dashboard Layout](#main-dashboard-layout)
3. [Agent Visualization Components](#agent-visualization-components)
4. [Data Flow Animation System](#data-flow-animation-system)
5. [Interactive Demo Scenarios](#interactive-demo-scenarios)
6. [Complete Component Specifications](#complete-component-specifications)
7. [Color Scheme & Visual Language](#color-scheme--visual-language)
8. [Implementation Guide](#implementation-guide)

---

## UI Overview & Philosophy

### Design Goals
- **Transparency**: Every agent interaction is visible in real-time
- **Educational**: Users can understand how the system processes requests
- **Interactive**: Click on any agent to see its details and current activity
- **Live Data Flow**: Animated lines showing message passing between agents
- **Demo-Ready**: Perfect for presentations and stakeholder demonstrations

### Key Features
1. **Real-time Agent Activity Monitor** - Live status of all 20 agents
2. **Message Flow Visualization** - Animated paths showing data movement
3. **Interactive Agent Cards** - Click to see details, logs, and responses
4. **Scenario Launcher** - Pre-built demos that showcase system capabilities
5. **Timeline View** - Historical view of agent interactions
6. **Response Inspector** - See exactly what each agent returns

---

## Main Dashboard Layout

### Full Screen Layout Structure

```
┌─────────────────────────────────────────────────────────────────────┐
│  HEADER: S&OP Multi-Agent System - Live Demonstration               │
│  [Scenario Selector ▼] [Start Demo] [Pause] [Reset] [Speed: 1x▼]  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────────────┐  ┌──────────────────────────────────────┐ │
│  │  CONTROL PANEL      │  │   AGENT VISUALIZATION CANVAS          │ │
│  │                     │  │                                       │ │
│  │  Quick Scenarios:   │  │        [Sales Agent Hub]             │ │
│  │  • Forecast Demand  │  │              ↓ ↓ ↓ ↓                │ │
│  │  • Optimize Stock   │  │         [4 Sub-Agents]               │ │
│  │  • Schedule Prod    │  │                                       │ │
│  │  • Run S&OP        │  │   [Inventory]   [Operations]          │ │
│  │                     │  │                                       │ │
│  │  Custom Input:      │  │        [Planning Agent]              │ │
│  │  [Text Box______]   │  │              ↓                       │ │
│  │  [Submit]          │  │         [Reporting Layer]             │ │
│  │                     │  │                                       │ │
│  │  Active Agents: 12  │  │   **ANIMATED MESSAGE FLOWS**         │ │
│  │  Messages: 47       │  │                                       │ │
│  └─────────────────────┘  └──────────────────────────────────────┘ │
│                                                                      │
├─────────────────────────────────────────────────────────────────────┤
│  ACTIVITY TIMELINE & MESSAGE LOG                                    │
│  [Timeline visualization showing message sequence]                  │
│  [Expandable message details with agent responses]                  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Agent Visualization Components

### 1. Interactive Agent Node Component

```typescript
// components/visualization/AgentNode.tsx

import React, { useState } from 'react';
import { 
  Card, 
  Avatar, 
  Badge, 
  Chip, 
  Tooltip,
  Collapse,
  IconButton,
  Typography,
  Box
} from '@mui/material';
import { 
  Circle as CircleIcon,
  ExpandMore as ExpandIcon,
  Memory as CpuIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface AgentNodeProps {
  agentId: string;
  agentName: string;
  agentType: 'parent' | 'sub-agent' | 'reporting';
  status: 'idle' | 'processing' | 'responding' | 'error';
  currentTask?: string;
  messageCount: number;
  subAgents?: string[];
  onClick?: () => void;
  position: { x: number; y: number };
}

export const AgentNode: React.FC<AgentNodeProps> = ({
  agentId,
  agentName,
  agentType,
  status,
  currentTask,
  messageCount,
  subAgents,
  onClick,
  position
}) => {
  const [expanded, setExpanded] = useState(false);

  const getStatusColor = () => {
    switch (status) {
      case 'idle': return '#90CAF9';      // Light Blue
      case 'processing': return '#FFA726'; // Orange - Actively thinking
      case 'responding': return '#66BB6A'; // Green - Sending response
      case 'error': return '#EF5350';      // Red
      default: return '#BDBDBD';
    }
  };

  const getAgentIcon = () => {
    if (agentType === 'parent') return '🎯';
    if (agentType === 'reporting') return '📊';
    return '🤖';
  };

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
      }}
      animate={{
        scale: status === 'processing' ? [1, 1.05, 1] : 1,
      }}
      transition={{
        duration: 1,
        repeat: status === 'processing' ? Infinity : 0,
      }}
    >
      <Card
        onClick={onClick}
        sx={{
          width: agentType === 'parent' ? 200 : 160,
          cursor: 'pointer',
          border: `3px solid ${getStatusColor()}`,
          boxShadow: status === 'processing' 
            ? `0 0 20px ${getStatusColor()}` 
            : '0 2px 8px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: `0 4px 20px ${getStatusColor()}`,
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Avatar
              sx={{
                bgcolor: getStatusColor(),
                width: 40,
                height: 40,
                fontSize: '1.5rem'
              }}
            >
              {getAgentIcon()}
            </Avatar>
            <Box sx={{ ml: 1, flex: 1 }}>
              <Typography variant="subtitle2" fontWeight="bold">
                {agentName}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {agentType}
              </Typography>
            </Box>
          </Box>

          {/* Status Indicator */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Badge
              badgeContent={messageCount}
              color="primary"
              max={99}
            >
              <CircleIcon 
                sx={{ 
                  color: getStatusColor(),
                  fontSize: 12,
                  animation: status === 'processing' ? 'pulse 1s infinite' : 'none'
                }} 
              />
            </Badge>
            <Typography variant="caption" fontWeight="medium">
              {status.toUpperCase()}
            </Typography>
          </Box>

          {/* Current Task */}
          {currentTask && (
            <Box 
              sx={{ 
                bgcolor: '#f5f5f5', 
                p: 1, 
                borderRadius: 1, 
                mb: 1 
              }}
            >
              <Typography 
                variant="caption" 
                sx={{ 
                  fontStyle: 'italic',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {currentTask}
              </Typography>
            </Box>
          )}

          {/* Sub-Agents Indicator */}
          {subAgents && subAgents.length > 0 && (
            <Box>
              <Chip
                size="small"
                label={`${subAgents.length} sub-agents`}
                onClick={(e) => {
                  e.stopPropagation();
                  setExpanded(!expanded);
                }}
                icon={<ExpandIcon />}
              />
              <Collapse in={expanded}>
                <Box sx={{ mt: 1, pl: 1 }}>
                  {subAgents.map((sub, idx) => (
                    <Typography key={idx} variant="caption" display="block">
                      • {sub}
                    </Typography>
                  ))}
                </Box>
              </Collapse>
            </Box>
          )}
        </Box>
      </Card>

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </motion.div>
  );
};
```

### 2. Message Flow Animation Component

```typescript
// components/visualization/MessageFlow.tsx

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Box, Typography, Chip } from '@mui/material';

interface MessageFlowProps {
  fromAgent: { x: number; y: number; name: string };
  toAgent: { x: number; y: number; name: string };
  message: {
    id: string;
    type: 'request' | 'response' | 'event';
    content: string;
    timestamp: string;
  };
  onComplete?: () => void;
}

export const MessageFlow: React.FC<MessageFlowProps> = ({
  fromAgent,
  toAgent,
  message,
  onComplete
}) => {
  const [pathD, setPathD] = useState('');

  useEffect(() => {
    // Calculate curved path between agents
    const startX = fromAgent.x + 100; // Center of agent node
    const startY = fromAgent.y + 50;
    const endX = toAgent.x + 100;
    const endY = toAgent.y + 50;

    // Create a curved path
    const midX = (startX + endX) / 2;
    const midY = (startY + endY) / 2 - 50; // Curve upward

    const path = `M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`;
    setPathD(path);
  }, [fromAgent, toAgent]);

  const getMessageColor = () => {
    switch (message.type) {
      case 'request': return '#2196F3';   // Blue
      case 'response': return '#4CAF50';  // Green
      case 'event': return '#FF9800';     // Orange
      default: return '#9E9E9E';
    }
  };

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    >
      {/* The path line */}
      <motion.path
        d={pathD}
        fill="none"
        stroke={getMessageColor()}
        strokeWidth="3"
        strokeDasharray="5,5"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        onAnimationComplete={onComplete}
      />

      {/* Animated dot traveling along the path */}
      <motion.circle
        r="8"
        fill={getMessageColor()}
        initial={{ offsetDistance: '0%', opacity: 0 }}
        animate={{ offsetDistance: '100%', opacity: [0, 1, 1, 0] }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        style={{
          offsetPath: `path('${pathD}')`,
        }}
      />

      {/* Message label */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ delay: 0.3 }}
      >
        <foreignObject
          x={(fromAgent.x + toAgent.x) / 2 - 60}
          y={(fromAgent.y + toAgent.y) / 2 - 80}
          width="120"
          height="40"
        >
          <Box
            sx={{
              bgcolor: 'white',
              border: `2px solid ${getMessageColor()}`,
              borderRadius: 2,
              p: 0.5,
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
          >
            <Typography variant="caption" fontWeight="bold" display="block">
              {message.type.toUpperCase()}
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                fontSize: '0.65rem',
                display: '-webkit-box',
                WebkitLineClamp: 1,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {message.content}
            </Typography>
          </Box>
        </foreignObject>
      </motion.g>
    </svg>
  );
};
```

### 3. Agent Canvas - Main Visualization Area

```typescript
// components/visualization/AgentCanvas.tsx

import React, { useState, useEffect } from 'react';
import { Box, Paper } from '@mui/material';
import { AgentNode } from './AgentNode';
import { MessageFlow } from './MessageFlow';
import { useAgentActivity } from '../../hooks/useAgentActivity';

interface AgentPosition {
  id: string;
  name: string;
  type: 'parent' | 'sub-agent' | 'reporting';
  x: number;
  y: number;
  subAgents?: string[];
}

export const AgentCanvas: React.FC = () => {
  const { agents, messages, activeFlows } = useAgentActivity();
  
  // Define agent positions for visualization
  const agentPositions: AgentPosition[] = [
    // Sales Agent Hub (Top Left)
    { id: 'sales-agent', name: 'Sales Agent', type: 'parent', x: 50, y: 50, subAgents: [] },
    { id: 'demand-forecasting', name: 'Demand Forecasting', type: 'sub-agent', x: 30, y: 180 },
    { id: 'market-intelligence', name: 'Market Intelligence', type: 'sub-agent', x: 150, y: 180 },
    { id: 'promotional-planning', name: 'Promotional Planning', type: 'sub-agent', x: 30, y: 280 },
    { id: 'sales-pipeline', name: 'Sales Pipeline', type: 'sub-agent', x: 150, y: 280 },

    // Inventory Agent Hub (Top Center)
    { id: 'inventory-agent', name: 'Inventory Agent', type: 'parent', x: 320, y: 50, subAgents: [] },
    { id: 'inventory-optimization', name: 'Inventory Optimization', type: 'sub-agent', x: 300, y: 180 },
    { id: 'inventory-control', name: 'Inventory Control', type: 'sub-agent', x: 420, y: 180 },
    { id: 'excess-obsolete', name: 'Excess & Obsolete', type: 'sub-agent', x: 300, y: 280 },
    { id: 'supplier-collab', name: 'Supplier Collaboration', type: 'sub-agent', x: 420, y: 280 },

    // Operations Agent Hub (Top Right)
    { id: 'operations-agent', name: 'Operations Agent', type: 'parent', x: 590, y: 50, subAgents: [] },
    { id: 'capacity-planning', name: 'Capacity Planning', type: 'sub-agent', x: 570, y: 180 },
    { id: 'production-scheduling', name: 'Production Scheduling', type: 'sub-agent', x: 690, y: 180 },
    { id: 'resource-allocation', name: 'Resource Allocation', type: 'sub-agent', x: 570, y: 280 },
    { id: 'supplier-coord', name: 'Supplier Coordination', type: 'sub-agent', x: 690, y: 280 },

    // Planning Agent Hub (Center)
    { id: 'planning-agent', name: 'Planning Agent', type: 'parent', x: 320, y: 420, subAgents: [] },
    { id: 'siop-facilitation', name: 'S&OP Facilitation', type: 'sub-agent', x: 250, y: 550 },
    { id: 'scenario-planning', name: 'Scenario Planning', type: 'sub-agent', x: 390, y: 550 },
    { id: 'financial-alignment', name: 'Financial Alignment', type: 'sub-agent', x: 250, y: 650 },
    { id: 'kpi-monitoring', name: 'KPI Monitoring', type: 'sub-agent', x: 390, y: 650 },

    // Reporting Layer (Bottom)
    { id: 'executive-dashboard', name: 'Executive Dashboard', type: 'reporting', x: 100, y: 800 },
    { id: 'performance-analytics', name: 'Performance Analytics', type: 'reporting', x: 280, y: 800 },
    { id: 'variance-analysis', name: 'Variance Analysis', type: 'reporting', x: 460, y: 800 },
    { id: 'scenario-insights', name: 'Scenario Insights', type: 'reporting', x: 640, y: 800 },
  ];

  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  const getAgentPosition = (agentId: string) => {
    return agentPositions.find(a => a.id === agentId);
  };

  return (
    <Paper 
      elevation={3}
      sx={{ 
        position: 'relative',
        width: '100%',
        height: '950px',
        overflow: 'auto',
        bgcolor: '#f8f9fa',
        backgroundImage: 'radial-gradient(circle, #e0e0e0 1px, transparent 1px)',
        backgroundSize: '30px 30px',
      }}
    >
      {/* Render all agent nodes */}
      {agentPositions.map((pos) => {
        const agentData = agents.find(a => a.id === pos.id);
        return (
          <AgentNode
            key={pos.id}
            agentId={pos.id}
            agentName={pos.name}
            agentType={pos.type}
            status={agentData?.status || 'idle'}
            currentTask={agentData?.currentTask}
            messageCount={agentData?.messageCount || 0}
            subAgents={pos.subAgents}
            position={{ x: pos.x, y: pos.y }}
            onClick={() => setSelectedAgent(pos.id)}
          />
        );
      })}

      {/* Render active message flows */}
      {activeFlows.map((flow) => {
        const fromPos = getAgentPosition(flow.fromAgent);
        const toPos = getAgentPosition(flow.toAgent);
        
        if (!fromPos || !toPos) return null;

        return (
          <MessageFlow
            key={flow.id}
            fromAgent={{ x: fromPos.x, y: fromPos.y, name: fromPos.name }}
            toAgent={{ x: toPos.x, y: toPos.y, name: toPos.name }}
            message={flow.message}
            onComplete={() => {
              // Handle flow completion
            }}
          />
        );
      })}
    </Paper>
  );
};
```

---

## Data Flow Animation System

### 4. Activity Timeline Component

```typescript
// components/timeline/ActivityTimeline.tsx

import React from 'react';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from '@mui/lab';
import {
  Paper,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
} from '@mui/material';
import {
  ExpandMore as ExpandIcon,
  Send as SendIcon,
  CallReceived as ReceiveIcon,
  Notifications as EventIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface TimelineEvent {
  id: string;
  timestamp: string;
  type: 'request' | 'response' | 'event';
  fromAgent: string;
  toAgent: string;
  message: string;
  payload?: any;
  duration?: number;
}

interface ActivityTimelineProps {
  events: TimelineEvent[];
  maxEvents?: number;
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({
  events,
  maxEvents = 20
}) => {
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'request': return <SendIcon />;
      case 'response': return <ReceiveIcon />;
      case 'event': return <EventIcon />;
      default: return <SendIcon />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'request': return 'primary';
      case 'response': return 'success';
      case 'event': return 'warning';
      default: return 'grey';
    }
  };

  const displayEvents = events.slice(0, maxEvents);

  return (
    <Paper elevation={2} sx={{ p: 2, maxHeight: '400px', overflow: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        Activity Timeline
        <Chip 
          label={`${events.length} events`} 
          size="small" 
          sx={{ ml: 2 }} 
        />
      </Typography>

      <Timeline>
        {displayEvents.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <TimelineItem>
              <TimelineOppositeContent color="textSecondary">
                <Typography variant="caption">
                  {new Date(event.timestamp).toLocaleTimeString()}
                </Typography>
                {event.duration && (
                  <Typography variant="caption" display="block">
                    {event.duration}ms
                  </Typography>
                )}
              </TimelineOppositeContent>

              <TimelineSeparator>
                <TimelineDot color={getEventColor(event.type)}>
                  {getEventIcon(event.type)}
                </TimelineDot>
                {index < displayEvents.length - 1 && <TimelineConnector />}
              </TimelineSeparator>

              <TimelineContent>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandIcon />}>
                    <Box>
                      <Typography variant="subtitle2">
                        {event.fromAgent} → {event.toAgent}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {event.message}
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box sx={{ bgcolor: '#f5f5f5', p: 1, borderRadius: 1 }}>
                      <Typography variant="caption" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                        {JSON.stringify(event.payload, null, 2)}
                      </Typography>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              </TimelineContent>
            </TimelineItem>
          </motion.div>
        ))}
      </Timeline>
    </Paper>
  );
};
```

---

## Interactive Demo Scenarios

### 5. Scenario Launcher Component

```typescript
// components/demo/ScenarioLauncher.tsx

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  Refresh as ResetIcon,
  TrendingUp as ForecastIcon,
  Inventory as InventoryIcon,
  Factory as ProductionIcon,
  Assessment as PlanningIcon,
} from '@mui/icons-material';

interface DemoScenario {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  estimatedDuration: string;
  agentsInvolved: string[];
  steps: ScenarioStep[];
}

interface ScenarioStep {
  agent: string;
  action: string;
  description: string;
  delay: number;
}

const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'demand-forecast',
    title: 'Generate Demand Forecast',
    description: 'Watch as Sales Agent analyzes historical data and generates a 30-day demand forecast',
    icon: <ForecastIcon />,
    estimatedDuration: '15 seconds',
    agentsInvolved: ['Sales Agent', 'Demand Forecasting', 'Market Intelligence', 'Executive Dashboard'],
    steps: [
      {
        agent: 'sales-agent',
        action: 'receive_request',
        description: 'User requests demand forecast for Product SKU-12345',
        delay: 500
      },
      {
        agent: 'demand-forecasting',
        action: 'fetch_history',
        description: 'Fetching 24 months of historical sales data',
        delay: 1500
      },
      {
        agent: 'market-intelligence',
        action: 'analyze_trends',
        description: 'Analyzing current market trends and seasonality',
        delay: 2000
      },
      {
        agent: 'demand-forecasting',
        action: 'generate_forecast',
        description: 'Running ARIMA and Prophet models to generate forecast',
        delay: 3000
      },
      {
        agent: 'sales-agent',
        action: 'aggregate_results',
        description: 'Aggregating results with confidence intervals',
        delay: 1000
      },
      {
        agent: 'executive-dashboard',
        action: 'update_display',
        description: 'Updating dashboard with new forecast data',
        delay: 500
      }
    ]
  },
  {
    id: 'inventory-optimization',
    title: 'Optimize Inventory Levels',
    description: 'See how Inventory Agent calculates optimal stock levels across warehouses',
    icon: <InventoryIcon />,
    estimatedDuration: '20 seconds',
    agentsInvolved: ['Inventory Agent', 'Inventory Optimization', 'Inventory Control', 'Supplier Collaboration'],
    steps: [
      {
        agent: 'inventory-agent',
        action: 'receive_request',
        description: 'Request to optimize inventory for 50 SKUs',
        delay: 500
      },
      {
        agent: 'inventory-control',
        action: 'check_current_levels',
        description: 'Checking current inventory levels across 3 warehouses',
        delay: 1500
      },
      {
        agent: 'demand-forecasting',
        action: 'provide_forecast',
        description: 'Providing demand forecast data to Inventory Agent',
        delay: 1000
      },
      {
        agent: 'inventory-optimization',
        action: 'calculate_optimal',
        description: 'Calculating EOQ and safety stock levels',
        delay: 3000
      },
      {
        agent: 'supplier-collab',
        action: 'check_lead_times',
        description: 'Verifying supplier lead times and reliability',
        delay: 1500
      },
      {
        agent: 'inventory-optimization',
        action: 'generate_recommendations',
        description: 'Generating reorder recommendations',
        delay: 2000
      },
      {
        agent: 'performance-analytics',
        action: 'update_metrics',
        description: 'Updating inventory KPIs',
        delay: 500
      }
    ]
  },
  {
    id: 'production-schedule',
    title: 'Create Production Schedule',
    description: 'Operations Agent creates an optimized production schedule balancing capacity and demand',
    icon: <ProductionIcon />,
    estimatedDuration: '18 seconds',
    agentsInvolved: ['Operations Agent', 'Capacity Planning', 'Production Scheduling', 'Resource Allocation'],
    steps: [
      {
        agent: 'operations-agent',
        action: 'receive_request',
        description: 'Request to schedule production for next 2 weeks',
        delay: 500
      },
      {
        agent: 'demand-forecasting',
        action: 'provide_requirements',
        description: 'Providing demand requirements to Operations',
        delay: 1000
      },
      {
        agent: 'capacity-planning',
        action: 'analyze_capacity',
        description: 'Analyzing available production capacity',
        delay: 2000
      },
      {
        agent: 'resource-allocation',
        action: 'check_resources',
        description: 'Checking labor and equipment availability',
        delay: 1500
      },
      {
        agent: 'production-scheduling',
        action: 'optimize_schedule',
        description: 'Creating optimal production sequence',
        delay: 3500
      },
      {
        agent: 'production-scheduling',
        action: 'minimize_changeovers',
        description: 'Minimizing changeover times',
        delay: 1500
      },
      {
        agent: 'operations-agent',
        action: 'finalize_schedule',
        description: 'Finalizing and publishing production schedule',
        delay: 1000
      }
    ]
  },
  {
    id: 'siop-meeting',
    title: 'Run S&OP Meeting Preparation',
    description: 'Planning Agent facilitates S&OP meeting by coordinating all functional areas',
    icon: <PlanningIcon />,
    estimatedDuration: '25 seconds',
    agentsInvolved: ['Planning Agent', 'All Sub-Agents', 'All Reporting Agents'],
    steps: [
      {
        agent: 'planning-agent',
        action: 'initiate_siop',
        description: 'Initiating S&OP meeting preparation',
        delay: 500
      },
      {
        agent: 'siop-facilitation',
        action: 'gather_inputs',
        description: 'Gathering inputs from Sales, Inventory, and Operations',
        delay: 1000
      },
      {
        agent: 'sales-agent',
        action: 'provide_demand_plan',
        description: 'Providing demand plan and forecast accuracy',
        delay: 1500
      },
      {
        agent: 'inventory-agent',
        action: 'provide_inventory_status',
        description: 'Providing inventory position and health metrics',
        delay: 1500
      },
      {
        agent: 'operations-agent',
        action: 'provide_capacity_plan',
        description: 'Providing capacity utilization and constraints',
        delay: 1500
      },
      {
        agent: 'scenario-planning',
        action: 'create_scenarios',
        description: 'Creating what-if scenarios for discussion',
        delay: 3000
      },
      {
        agent: 'financial-alignment',
        action: 'calculate_financial_impact',
        description: 'Calculating financial impact of plans',
        delay: 2500
      },
      {
        agent: 'kpi-monitoring',
        action: 'prepare_metrics',
        description: 'Preparing KPI dashboard for meeting',
        delay: 1500
      },
      {
        agent: 'executive-dashboard',
        action: 'generate_summary',
        description: 'Generating executive summary report',
        delay: 2000
      },
      {
        agent: 'variance-analysis',
        action: 'identify_gaps',
        description: 'Identifying plan vs actual variances',
        delay: 1500
      }
    ]
  }
];

export const ScenarioLauncher: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [speed, setSpeed] = useState(1);

  const handleRunScenario = (scenarioId: string) => {
    setSelectedScenario(scenarioId);
    setIsRunning(true);
    // Trigger scenario execution
    console.log('Running scenario:', scenarioId);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSelectedScenario('');
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Demo Control Panel
        </Typography>

        {/* Playback Controls */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Button
            variant="contained"
            color="success"
            startIcon={<PlayIcon />}
            disabled={!selectedScenario || isRunning}
            onClick={() => handleRunScenario(selectedScenario)}
          >
            Start
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<StopIcon />}
            disabled={!isRunning}
            onClick={handleStop}
          >
            Stop
          </Button>
          <Button
            variant="outlined"
            startIcon={<ResetIcon />}
            onClick={handleReset}
          >
            Reset
          </Button>
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel>Speed</InputLabel>
            <Select
              value={speed}
              label="Speed"
              onChange={(e) => setSpeed(e.target.value as number)}
            >
              <MenuItem value={0.5}>0.5x</MenuItem>
              <MenuItem value={1}>1x</MenuItem>
              <MenuItem value={2}>2x</MenuItem>
              <MenuItem value={5}>5x</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Pre-built Scenarios */}
        <Typography variant="subtitle2" gutterBottom>
          Quick Scenarios:
        </Typography>
        <List dense>
          {DEMO_SCENARIOS.map((scenario) => (
            <ListItem key={scenario.id} disablePadding>
              <ListItemButton
                selected={selectedScenario === scenario.id}
                onClick={() => setSelectedScenario(scenario.id)}
                sx={{
                  border: selectedScenario === scenario.id ? '2px solid #1976d2' : '1px solid #e0e0e0',
                  borderRadius: 1,
                  mb: 1,
                }}
              >
                <ListItemIcon>{scenario.icon}</ListItemIcon>
                <ListItemText
                  primary={scenario.title}
                  secondary={
                    <>
                      <Typography variant="caption" display="block">
                        {scenario.description}
                      </Typography>
                      <Chip
                        label={scenario.estimatedDuration}
                        size="small"
                        sx={{ mt: 0.5 }}
                      />
                    </>
                  }
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 2 }} />

        {/* Custom Input */}
        <Typography variant="subtitle2" gutterBottom>
          Custom Input:
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={3}
          placeholder="Enter custom request (e.g., 'Generate forecast for SKU-789 for next quarter')"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          sx={{ mb: 1 }}
        />
        <Button
          variant="outlined"
          fullWidth
          disabled={!customInput || isRunning}
          onClick={() => {
            // Handle custom input
            console.log('Custom input:', customInput);
          }}
        >
          Submit Custom Request
        </Button>

        <Divider sx={{ my: 2 }} />

        {/* System Status */}
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            System Status:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip label="Active Agents: 12/20" size="small" color="primary" />
            <Chip label="Messages: 47" size="small" />
            <Chip label="Uptime: 2h 34m" size="small" />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export { DEMO_SCENARIOS };
```

---

## Complete Component Specifications

### 6. Agent Detail Panel (Sidebar)

```typescript
// components/details/AgentDetailPanel.tsx

import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  Paper,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Close as CloseIcon,
  ExpandMore as ExpandIcon,
} from '@mui/icons-material';

interface AgentDetailPanelProps {
  open: boolean;
  agentId: string | null;
  onClose: () => void;
}

export const AgentDetailPanel: React.FC<AgentDetailPanelProps> = ({
  open,
  agentId,
  onClose
}) => {
  if (!agentId) return null;

  // Mock data - would come from API
  const agentDetails = {
    id: agentId,
    name: 'Demand Forecasting Agent',
    type: 'Sub-Agent',
    status: 'processing',
    uptime: '2h 45m',
    messagesProcessed: 127,
    averageResponseTime: '1.2s',
    currentTask: 'Generating demand forecast for SKU-12345 using ARIMA model',
    capabilities: [
      'Time-series analysis',
      'ARIMA modeling',
      'Prophet forecasting',
      'Confidence interval calculation',
      'Seasonality detection'
    ],
    recentMessages: [
      { id: '1', timestamp: '2024-01-29 14:32:15', type: 'request', content: 'Generate forecast for SKU-12345' },
      { id: '2', timestamp: '2024-01-29 14:32:18', type: 'response', content: 'Forecast generated: 1,250 units over 30 days' },
    ],
    performance: {
      accuracy: 94.5,
      processingSpeed: 87,
      reliability: 99.2
    },
    dependencies: ['Sales Agent', 'Database', 'Market Intelligence'],
    logs: [
      { timestamp: '14:32:15', level: 'INFO', message: 'Received forecast request for SKU-12345' },
      { timestamp: '14:32:16', level: 'INFO', message: 'Fetching historical data (24 months)' },
      { timestamp: '14:32:17', level: 'INFO', message: 'Running ARIMA(2,1,2) model' },
      { timestamp: '14:32:18', level: 'SUCCESS', message: 'Forecast complete with 95% confidence' },
    ]
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: 450,
          p: 2,
        }
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Agent Details</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Agent Info */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6">{agentDetails.name}</Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          {agentDetails.type} • ID: {agentDetails.id}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
          <Chip label={agentDetails.status} color="warning" size="small" />
          <Chip label={`Uptime: ${agentDetails.uptime}`} size="small" />
        </Box>
      </Paper>

      <Divider sx={{ my: 2 }} />

      {/* Current Task */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Current Task:
        </Typography>
        <Paper sx={{ p: 1.5, bgcolor: '#f5f5f5' }}>
          <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
            {agentDetails.currentTask}
          </Typography>
          <LinearProgress sx={{ mt: 1 }} />
        </Paper>
      </Box>

      {/* Performance Metrics */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Performance:
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption">Accuracy</Typography>
              <Typography variant="caption">{agentDetails.performance.accuracy}%</Typography>
            </Box>
            <LinearProgress variant="determinate" value={agentDetails.performance.accuracy} />
          </Box>
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption">Processing Speed</Typography>
              <Typography variant="caption">{agentDetails.performance.processingSpeed}%</Typography>
            </Box>
            <LinearProgress variant="determinate" value={agentDetails.performance.processingSpeed} />
          </Box>
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption">Reliability</Typography>
              <Typography variant="caption">{agentDetails.performance.reliability}%</Typography>
            </Box>
            <LinearProgress variant="determinate" value={agentDetails.performance.reliability} />
          </Box>
        </Box>
      </Box>

      {/* Statistics */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Statistics:
        </Typography>
        <List dense>
          <ListItem>
            <ListItemText
              primary="Messages Processed"
              secondary={agentDetails.messagesProcessed}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Avg Response Time"
              secondary={agentDetails.averageResponseTime}
            />
          </ListItem>
        </List>
      </Box>

      {/* Capabilities */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandIcon />}>
          <Typography variant="subtitle2">Capabilities</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {agentDetails.capabilities.map((cap, idx) => (
              <Chip key={idx} label={cap} size="small" />
            ))}
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Recent Messages */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandIcon />}>
          <Typography variant="subtitle2">Recent Messages</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List dense>
            {agentDetails.recentMessages.map((msg) => (
              <ListItem key={msg.id} sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                <Typography variant="caption" color="textSecondary">
                  {msg.timestamp} • {msg.type}
                </Typography>
                <Typography variant="body2">{msg.content}</Typography>
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>

      {/* Logs */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandIcon />}>
          <Typography variant="subtitle2">Activity Log</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
            {agentDetails.logs.map((log, idx) => (
              <Box key={idx} sx={{ mb: 1 }}>
                <Typography variant="caption" color="textSecondary">
                  {log.timestamp}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                  [{log.level}] {log.message}
                </Typography>
              </Box>
            ))}
          </Box>
        </AccordionDetails>
      </Accordion>
    </Drawer>
  );
};
```

### 7. Main Application Layout

```typescript
// App.tsx

import React, { useState } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Paper,
} from '@mui/material';
import { ScenarioLauncher } from './components/demo/ScenarioLauncher';
import { AgentCanvas } from './components/visualization/AgentCanvas';
import { ActivityTimeline } from './components/timeline/ActivityTimeline';
import { AgentDetailPanel } from './components/details/AgentDetailPanel';
import { SystemMetrics } from './components/metrics/SystemMetrics';

const App: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Header */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            S&OP Multi-Agent System - Live Demonstration
          </Typography>
          <SystemMetrics />
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth={false} sx={{ flexGrow: 1, py: 2 }}>
        <Grid container spacing={2} sx={{ height: '100%' }}>
          {/* Left Sidebar - Control Panel */}
          <Grid item xs={12} md={3}>
            <ScenarioLauncher />
          </Grid>

          {/* Center - Agent Visualization */}
          <Grid item xs={12} md={9}>
            <AgentCanvas />
          </Grid>

          {/* Bottom - Timeline */}
          <Grid item xs={12}>
            <ActivityTimeline events={[]} />
          </Grid>
        </Grid>
      </Container>

      {/* Right Sidebar - Agent Details */}
      <AgentDetailPanel
        open={!!selectedAgent}
        agentId={selectedAgent}
        onClose={() => setSelectedAgent(null)}
      />
    </Box>
  );
};

export default App;
```

---

## Color Scheme & Visual Language

### Agent Status Colors

```typescript
// theme/agentColors.ts

export const AGENT_COLORS = {
  status: {
    idle: '#90CAF9',        // Light Blue - Agent waiting
    processing: '#FFA726',  // Orange - Agent actively thinking
    responding: '#66BB6A',  // Green - Agent sending response
    error: '#EF5350',       // Red - Agent encountered error
    disabled: '#BDBDBD',    // Grey - Agent offline
  },
  
  messageType: {
    request: '#2196F3',     // Blue - Incoming request
    response: '#4CAF50',    // Green - Outgoing response
    event: '#FF9800',       // Orange - System event
    broadcast: '#9C27B0',   // Purple - Broadcast to multiple
  },

  agentType: {
    parent: {
      bg: '#E3F2FD',
      border: '#1976D2',
      text: '#0D47A1'
    },
    subAgent: {
      bg: '#F3E5F5',
      border: '#7B1FA2',
      text: '#4A148C'
    },
    reporting: {
      bg: '#FFF3E0',
      border: '#E65100',
      text: '#BF360C'
    }
  },

  performance: {
    excellent: '#4CAF50',   // > 90%
    good: '#8BC34A',        // 70-90%
    fair: '#FFC107',        // 50-70%
    poor: '#FF5722',        // < 50%
  }
};
```

### Animation Timings

```typescript
// theme/animations.ts

export const ANIMATION_TIMINGS = {
  messageFlight: 1500,      // ms - Time for message to travel between agents
  agentPulse: 1000,         // ms - Pulse animation when processing
  nodeExpand: 300,          // ms - Node expand/collapse
  fadeIn: 200,              // ms - Component fade in
  flowComplete: 500,        // ms - Delay before removing completed flow
};
```

---

## Implementation Guide

### Step 1: Set Up Project Structure

```bash
# Create React app with TypeScript
npx create-react-app siop-demo-ui --template typescript

cd siop-demo-ui

# Install dependencies
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/lab @mui/icons-material
npm install framer-motion
npm install socket.io-client
npm install recharts
npm install react-router-dom
```

### Step 2: Create Base Components

```
src/
├── components/
│   ├── visualization/
│   │   ├── AgentNode.tsx
│   │   ├── MessageFlow.tsx
│   │   └── AgentCanvas.tsx
│   ├── demo/
│   │   └── ScenarioLauncher.tsx
│   ├── timeline/
│   │   └── ActivityTimeline.tsx
│   ├── details/
│   │   └── AgentDetailPanel.tsx
│   └── metrics/
│       └── SystemMetrics.tsx
├── hooks/
│   ├── useAgentActivity.ts
│   ├── useWebSocket.ts
│   └── useScenario.ts
├── theme/
│   ├── agentColors.ts
│   ├── animations.ts
│   └── theme.ts
└── App.tsx
```

### Step 3: Implement WebSocket Connection

```typescript
// hooks/useAgentActivity.ts

import { useState, useEffect } from 'react';
import io from 'socket.io-client';

interface AgentActivity {
  id: string;
  status: 'idle' | 'processing' | 'responding' | 'error';
  currentTask?: string;
  messageCount: number;
}

interface MessageFlow {
  id: string;
  fromAgent: string;
  toAgent: string;
  message: {
    id: string;
    type: 'request' | 'response' | 'event';
    content: string;
    timestamp: string;
  };
}

export const useAgentActivity = () => {
  const [agents, setAgents] = useState<AgentActivity[]>([]);
  const [activeFlows, setActiveFlows] = useState<MessageFlow[]>([]);
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    const newSocket = io('http://localhost:3000');
    setSocket(newSocket);

    // Listen for agent status updates
    newSocket.on('agent:status', (data: AgentActivity) => {
      setAgents(prev => {
        const index = prev.findIndex(a => a.id === data.id);
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = data;
          return updated;
        }
        return [...prev, data];
      });
    });

    // Listen for new message flows
    newSocket.on('message:flow', (flow: MessageFlow) => {
      setActiveFlows(prev => [...prev, flow]);
      
      // Remove flow after animation completes
      setTimeout(() => {
        setActiveFlows(prev => prev.filter(f => f.id !== flow.id));
      }, 2000);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  return { agents, activeFlows, socket };
};
```

### Step 4: Connect to Backend API

```typescript
// services/api.ts

const API_BASE_URL = 'http://localhost:3000/api';

export const apiService = {
  // Launch a demo scenario
  launchScenario: async (scenarioId: string) => {
    const response = await fetch(`${API_BASE_URL}/demo/launch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scenarioId })
    });
    return response.json();
  },

  // Send custom request
  sendCustomRequest: async (request: string) => {
    const response = await fetch(`${API_BASE_URL}/requests/custom`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ request })
    });
    return response.json();
  },

  // Get agent details
  getAgentDetails: async (agentId: string) => {
    const response = await fetch(`${API_BASE_URL}/agents/${agentId}`);
    return response.json();
  },

  // Get activity timeline
  getActivityTimeline: async (limit: number = 50) => {
    const response = await fetch(`${API_BASE_URL}/activity/timeline?limit=${limit}`);
    return response.json();
  }
};
```

### Step 5: Backend Demo Endpoint

```typescript
// backend/routes/demo.ts

import express from 'express';
import { DEMO_SCENARIOS } from './scenarios';

const router = express.Router();

router.post('/launch', async (req, res) => {
  const { scenarioId } = req.body;
  const scenario = DEMO_SCENARIOS.find(s => s.id === scenarioId);

  if (!scenario) {
    return res.status(404).json({ error: 'Scenario not found' });
  }

  // Execute scenario steps with delays
  let stepIndex = 0;
  for (const step of scenario.steps) {
    setTimeout(async () => {
      // Update agent status
      await updateAgentStatus(step.agent, 'processing', step.description);

      // Emit WebSocket event
      io.emit('agent:status', {
        id: step.agent,
        status: 'processing',
        currentTask: step.description,
        messageCount: Math.floor(Math.random() * 100)
      });

      // Create message flow visualization
      if (stepIndex > 0) {
        const prevStep = scenario.steps[stepIndex - 1];
        io.emit('message:flow', {
          id: crypto.randomUUID(),
          fromAgent: prevStep.agent,
          toAgent: step.agent,
          message: {
            id: crypto.randomUUID(),
            type: 'request',
            content: step.description,
            timestamp: new Date().toISOString()
          }
        });
      }

      stepIndex++;
    }, calculateDelay(scenario.steps.slice(0, stepIndex)));
  }

  res.json({ success: true, scenarioId, estimatedDuration: scenario.estimatedDuration });
});

function calculateDelay(steps: any[]) {
  return steps.reduce((sum, step) => sum + step.delay, 0);
}

export default router;
```

---

## Usage Instructions for Demonstrations

### For Presenters:

1. **Start the Application**
   ```bash
   npm start
   ```

2. **Select a Pre-built Scenario**
   - Click on one of the quick scenarios in the left panel
   - Watch as the system highlights which agents are being called
   - Observe message flows between agents in real-time

3. **Adjust Playback Speed**
   - Use the speed selector (0.5x, 1x, 2x, 5x) to control demo pace
   - Slower for detailed walkthroughs
   - Faster for high-level overviews

4. **Interact with Agents**
   - Click on any agent node to see detailed information
   - View current task, performance metrics, and recent messages
   - Inspect logs to see exactly what the agent is doing

5. **View Activity Timeline**
   - Scroll through the bottom timeline to see message history
   - Expand any event to see the full payload
   - Track request/response patterns

6. **Try Custom Inputs**
   - Type a custom request in the text box
   - Watch as the system intelligently routes it to appropriate agents
   - See the complete data flow from input to output

### Key Demo Points to Highlight:

1. **Real-time Visibility** - Every agent interaction is visible
2. **Intelligent Routing** - MCP Hub routes messages to correct agents
3. **Parallel Processing** - Multiple agents work simultaneously
4. **Event-Driven** - Agents react to events and coordinate
5. **Transparent AI** - See exactly what each agent is thinking/doing

---

## Advanced Features

### 8. Heat Map View (Alternative Visualization)

```typescript
// components/visualization/HeatMapView.tsx

import React from 'react';
import { Box, Typography } from '@mui/material';

export const HeatMapView: React.FC = () => {
  // Shows activity level across all agents as a heat map
  // Darker colors = more active
  return (
    <Box>
      <Typography variant="h6">Agent Activity Heat Map</Typography>
      {/* Implementation details */}
    </Box>
  );
};
```

### 9. Network Graph View

```typescript
// components/visualization/NetworkGraphView.tsx

import React from 'react';
import { ForceGraph2D } from 'react-force-graph';

export const NetworkGraphView: React.FC = () => {
  // Shows agents as nodes in a force-directed graph
  // Edges represent communication patterns
  return <ForceGraph2D />;
};
```

---

## Conclusion

This UI design provides:

✅ **Complete visibility** into agent operations  
✅ **Real-time animations** showing data flow  
✅ **Interactive exploration** of agent details  
✅ **Pre-built demo scenarios** for presentations  
✅ **Professional visual design** with Material-UI  
✅ **Responsive layout** that works on all screens  
✅ **Educational value** for stakeholders  

The interface is perfect for demonstrations, training, and monitoring the S&OP multi-agent system in action!
