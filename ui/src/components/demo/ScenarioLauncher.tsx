import React from 'react';
import { Card, CardContent, Typography, Button, Divider, Box, Tooltip } from '@mui/material';
import { PlayArrow as PlayIcon, Terminal as TestIcon } from '@mui/icons-material';

interface Scenario {
    id: string;
    title: string;
    description: string;
}

const SCENARIOS: Scenario[] = [
    { id: 'forecast', title: 'Generate Demand Forecast', description: 'Sales Agent coordinates with sub-agents to forecast units.' },
    { id: 'inventory', title: 'Optimize Inventory', description: 'Inventory Agent balances stock across locations.' },
    { id: 'siop', title: 'Start S&OP Cycle', description: 'Planning Agent integrates all functional plans.' }
];

interface ScenarioLauncherProps {
    onRun: (id: string) => void;
    onRunTests: () => void;
    isRunning: boolean;
    isTesting: boolean;
}

export const ScenarioLauncher: React.FC<ScenarioLauncherProps> = ({ onRun, onRunTests, isRunning, isTesting }) => {
    return (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>Demo Scenarios</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                    {SCENARIOS.map(s => (
                        <Tooltip key={s.id} title={`Execute the ${s.title} scenario`} placement="right" arrow>
                            <Button
                                variant="outlined"
                                fullWidth
                                onClick={() => onRun(s.id)}
                                disabled={isRunning}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'flex-start',
                                    textAlign: 'left',
                                    p: 2,
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    bgcolor: 'rgba(255,255,255,0.02)',
                                    color: 'white',
                                    '&:hover': {
                                        bgcolor: 'rgba(100, 181, 246, 0.1)',
                                        borderColor: '#64b5f6',
                                        transform: 'translateY(-2px)'
                                    },
                                    transition: 'all 0.2s',
                                    textTransform: 'none'
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                                    <Box sx={{
                                        p: 1,
                                        borderRadius: 1,
                                        bgcolor: 'rgba(100, 181, 246, 0.1)',
                                        color: '#64b5f6',
                                        display: 'flex'
                                    }}>
                                        <PlayIcon fontSize="small" />
                                    </Box>
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{s.title}</Typography>
                                        <Typography variant="caption" sx={{ opacity: 0.6, display: 'block' }}>{s.description}</Typography>
                                    </Box>
                                </Box>
                            </Button>
                        </Tooltip>
                    ))}
                </Box>
                <Divider sx={{ my: 2 }} />
                <Tooltip title="Execute automated Jest tests in the MCP Hub" placement="right" arrow>
                    <Button
                        variant="contained"
                        fullWidth
                        onClick={onRunTests}
                        disabled={isRunning || isTesting}
                        startIcon={<TestIcon />}
                        sx={{
                            py: 1.5,
                            bgcolor: '#4caf50',
                            '&:hover': { bgcolor: '#43a047' },
                            fontWeight: 'bold',
                            textTransform: 'none'
                        }}
                    >
                        {isTesting ? 'Running Tests...' : 'Run System Tests'}
                    </Button>
                </Tooltip>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" color="textSecondary">
                        Click a scenario to watch the agent interactions in real-time.
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};
