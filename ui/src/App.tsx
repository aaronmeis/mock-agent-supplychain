import React, { useState } from 'react';
import { Box, AppBar, Toolbar, Typography, Container, Grid, ThemeProvider, createTheme, CssBaseline, Tooltip, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { WorkflowCanvas } from './components/visualization/WorkflowCanvas';
import { ScenarioLauncher } from './components/demo/ScenarioLauncher';
import { ReportDashboard } from './components/reporting/ReportDashboard';
import type { AgentActivity, MessageFlowData } from './types/siop.types';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#2196f3' },
    secondary: { main: '#66bb6a' },
    background: { default: '#0f172a', paper: '#1e293b' }
  },
});

const INITIAL_AGENTS: AgentActivity[] = [
  {
    id: 'sales-agent',
    name: 'Sales Agent',
    type: 'parent',
    status: 'idle',
    messageCount: 0,
    position: { x: 0, y: 0 },
    description: 'Coordinates demand forecasting and market intelligence. Orchestrates sales-related sub-agents.'
  },
  {
    id: 'demand-forecasting-agent',
    name: 'Demand Forecasting',
    type: 'sub-agent',
    status: 'idle',
    messageCount: 0,
    position: { x: 0, y: 0 },
    description: 'Uses statistical models (ARIMA/Prophet) to project future demand based on historical data.'
  },
  {
    id: 'inventory-agent',
    name: 'Inventory Agent',
    type: 'parent',
    status: 'idle',
    messageCount: 0,
    position: { x: 0, y: 0 },
    description: 'Monitors global stock levels and triggers optimization routines for replenishment.'
  },
  {
    id: 'inventory-optimization-agent',
    name: 'Inventory Optimization',
    type: 'sub-agent',
    status: 'idle',
    messageCount: 0,
    position: { x: 0, y: 0 },
    description: 'Calculates Economic Order Quantity (EOQ) and safety stock levels across all warehouses.'
  },
  {
    id: 'reporting-agent',
    name: 'Reporting Agent',
    type: 'reporting',
    status: 'idle',
    messageCount: 0,
    position: { x: 0, y: 0 },
    description: 'Consolidates data from all agents into executive-ready S&OP reports and dashboards.'
  },
];

function App() {
  const [agents, setAgents] = useState<AgentActivity[]>(INITIAL_AGENTS);
  const [activeFlows, setActiveFlows] = useState<MessageFlowData[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [flowType, setFlowType] = useState<'forecast' | 'inventory' | 'siop' | null>(null);
  const [report, setReport] = useState<any>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; output: string; timestamp: string } | null>(null);
  const [showTestSnack, setShowTestSnack] = useState(false);
  const [showTestDialog, setShowTestDialog] = useState(false);

  const runScenario = async (id: string) => {
    setIsRunning(true);
    setReport(null);
    setFlowType(id as any);

    if (id === 'forecast') {
      const forecastData = { product: 'SKU-001', history: [100, 120, 115] };
      await simulateFlow('sales-agent', 'demand-forecasting-agent', 'request', 'Analyze History', forecastData);
      await updateAgentStatus('demand-forecasting-agent', 'processing', 'Running ARIMA...');
      await new Promise(r => setTimeout(r, 2000));

      const resultData = { forecast: [{ date: 'Feb', value: 145 }, { date: 'Mar', value: 160 }, { date: 'Apr', value: 155 }] };
      await simulateFlow('demand-forecasting-agent', 'sales-agent', 'response', 'Forecast Ready', resultData);
      await updateAgentStatus('demand-forecasting-agent', 'idle');

      await simulateFlow('sales-agent', 'reporting-agent', 'event', 'Publish Forecast', resultData);
      setReport({
        summary: 'Sales forecast indicates a 15% increase in demand for Q1 based on historical trends.',
        forecast: resultData.forecast
      });
    } else if (id === 'inventory') {
      const stockData = { warehouse: 'Main', currentStock: 450 };
      await simulateFlow('inventory-agent', 'inventory-optimization-agent', 'request', 'Optimize SKUs', stockData);
      await updateAgentStatus('inventory-optimization-agent', 'processing', 'Calculating EOQ...');
      await new Promise(r => setTimeout(r, 2000));

      const invResult = { inventory: [{ warehouse: 'Main', stock: 800, capacity: 1000 }, { warehouse: 'West', stock: 200, capacity: 500 }] };
      await simulateFlow('inventory-optimization-agent', 'inventory-agent', 'response', 'Optimization Complete', invResult);
      await updateAgentStatus('inventory-optimization-agent', 'idle');

      await simulateFlow('inventory-agent', 'reporting-agent', 'event', 'Publish Inv Plan', invResult);
      setReport({
        summary: 'Inventory optimization recommends increasing safety stock in Main warehouse by 200 units.',
        inventory: invResult.inventory
      });
    } else if (id === 'siop') {
      // Step 1: Demand Planning
      const forecastData = { product: 'GLOBAL-ALL', history: [5000, 5200, 5100] };
      await simulateFlow('sales-agent', 'demand-forecasting-agent', 'request', 'Generate Global Forecast', forecastData);
      await updateAgentStatus('demand-forecasting-agent', 'processing', 'Processing Global Demand...');
      await new Promise(r => setTimeout(r, 1500));
      const fullForecast = { forecast: [{ date: 'May', value: 5500 }, { date: 'Jun', value: 5800 }, { date: 'Jul', value: 6000 }] };
      await simulateFlow('demand-forecasting-agent', 'sales-agent', 'response', 'Global Forecast Ready', fullForecast);
      await updateAgentStatus('demand-forecasting-agent', 'idle');

      // Step 2: Supply Alignment
      await simulateFlow('sales-agent', 'inventory-agent', 'event', 'Align Supply to Demand', fullForecast);
      await simulateFlow('inventory-agent', 'inventory-optimization-agent', 'request', 'Optimize Global Stock', fullForecast);
      await updateAgentStatus('inventory-optimization-agent', 'processing', 'Aligning Supply chain...');
      await new Promise(r => setTimeout(r, 1500));
      const fullInv = { inventory: [{ warehouse: 'Global Cent', stock: 12000, capacity: 15000 }, { warehouse: 'Euro Hub', stock: 4500, capacity: 5000 }] };
      await simulateFlow('inventory-optimization-agent', 'inventory-agent', 'response', 'Supply Alignment Complete', fullInv);
      await updateAgentStatus('inventory-optimization-agent', 'idle');

      // Step 3: Executive Reporting
      const finalSOP = { ...fullForecast, ...fullInv, summary: 'Master S&OP Cycle Complete: Demand is projected to grow 12%. Supply chain has been aligned with optimized stock levels across global hubs.' };
      await simulateFlow('inventory-agent', 'reporting-agent', 'event', 'Finalize Executive Report', finalSOP);
      setReport(finalSOP);
    }
    setIsRunning(false);
  };

  const handleRunTests = async () => {
    setIsTesting(true);
    try {
      const response = await fetch('http://localhost:3000/api/tests/run', { method: 'POST' });
      const data = await response.json();
      setTestResult(data);
      setShowTestSnack(true);
    } catch (error) {
      console.error('Test run failed:', error);
      setTestResult({ success: false, output: 'Failed to reach Hub server', timestamp: new Date().toISOString() });
      setShowTestSnack(true);
    } finally {
      setIsTesting(false);
    }
  };

  const simulateFlow = async (from: string, to: string, type: any, content: string, payload?: any) => {
    const flowId = Math.random().toString(36).substr(2, 9);
    const newFlow: MessageFlowData = {
      id: flowId,
      fromAgent: from,
      toAgent: to,
      message: { id: flowId, type, content, timestamp: new Date().toISOString(), payload }
    };
    setActiveFlows(prev => [...prev, newFlow]);
    setTimeout(() => {
      setActiveFlows(prev => prev.filter(f => f.id !== flowId));
    }, 2000);
    await new Promise(r => setTimeout(r, 1000));
  };

  const updateAgentStatus = async (id: string, status: any, task?: string) => {
    setAgents(prev => prev.map(a => a.id === id ? { ...a, status, currentTask: task } : a));
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: '#0f172a',
        backgroundImage: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        color: 'white'
      }}>
        <AppBar position="static" elevation={0} sx={{ bgcolor: 'rgba(30, 41, 59, 0.5)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <Toolbar>
            <Tooltip title="Multi-Agent Orchestration Platform for Supply Chain Planning" placement="bottom" arrow>
              <Typography variant="h6" fontWeight="bold" sx={{ letterSpacing: 1, color: '#64b5f6', cursor: 'help' }}>
                S&OP <span style={{ color: 'white', fontWeight: '300' }}>AGENT ORCHESTRATOR</span>
              </Typography>
            </Tooltip>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} lg={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <ScenarioLauncher
                  onRun={runScenario}
                  onRunTests={handleRunTests}
                  isRunning={isRunning}
                  isTesting={isTesting}
                />
                <ReportDashboard data={report} />
              </Box>
            </Grid>
            <Grid item xs={12} lg={8}>
              <WorkflowCanvas agents={agents} activeFlows={activeFlows} flowType={flowType} />
            </Grid>
          </Grid>
        </Container>

        <Snackbar
          open={showTestSnack}
          autoHideDuration={6000}
          onClose={() => setShowTestSnack(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={() => setShowTestSnack(false)}
            severity={testResult?.success ? "success" : "error"}
            sx={{ width: '100%', boxShadow: 3 }}
          >
            {testResult?.success ? "System Tests Passed!" : "System Tests Failed!"}
            <Button color="inherit" size="small" onClick={() => setShowTestDialog(true)} sx={{ ml: 2 }}>
              View Output
            </Button>
          </Alert>
        </Snackbar>

        <Dialog
          open={showTestDialog}
          onClose={() => setShowTestDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ bgcolor: testResult?.success ? '#2e7d32' : '#d32f2f', color: 'white' }}>
            System Test Results - {testResult?.success ? 'PASSED' : 'FAILED'}
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <Box
              component="pre"
              sx={{
                p: 2,
                bgcolor: '#1e293b',
                color: '#e2e8f0',
                borderRadius: 1,
                overflow: 'auto',
                fontSize: '0.8rem',
                maxHeight: '400px',
                whiteSpace: 'pre-wrap',
                fontFamily: 'monospace'
              }}
            >
              {testResult?.output || 'No output captured'}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowTestDialog(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}

export default App;
