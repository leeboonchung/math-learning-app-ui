import { Typography, Button, Box, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { School, TrendingUp, CheckCircle } from '@mui/icons-material';
import LessonList from '../components/LessonList';

const Dashboard = () => {
  const navigate = useNavigate();
  
  return (
    <Box sx={{ width: '100%' }}>
      {/* Header Stats */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { 
          xs: '1fr', 
          sm: 'repeat(2, 1fr)', 
          md: 'repeat(3, 1fr)' 
        }, 
        gap: { xs: 2, sm: 3 }, 
        mb: { xs: 3, sm: 4 } 
      }}>
        <Paper sx={{ 
          p: { xs: 2, sm: 3 }, 
          textAlign: 'center', 
          backgroundColor: '#e3f2fd' 
        }}>
          <School sx={{ 
            fontSize: { xs: 32, sm: 40 }, 
            color: '#1976d2', 
            mb: 1 
          }} />
          <Typography variant="h4" sx={{ 
            fontWeight: 'bold', 
            color: '#1976d2',
            fontSize: { xs: '1.8rem', sm: '2.125rem' }
          }}>
            5
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{
            fontSize: { xs: '0.75rem', sm: '0.875rem' }
          }}>
            Lessons Available
          </Typography>
        </Paper>
        <Paper sx={{ 
          p: { xs: 2, sm: 3 }, 
          textAlign: 'center', 
          backgroundColor: '#e8f5e8' 
        }}>
          <CheckCircle sx={{ 
            fontSize: { xs: 32, sm: 40 }, 
            color: '#4caf50', 
            mb: 1 
          }} />
          <Typography variant="h4" sx={{ 
            fontWeight: 'bold', 
            color: '#4caf50',
            fontSize: { xs: '1.8rem', sm: '2.125rem' }
          }}>
            2
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{
            fontSize: { xs: '0.75rem', sm: '0.875rem' }
          }}>
            Lessons Completed
          </Typography>
        </Paper>
        <Paper sx={{ 
          p: { xs: 2, sm: 3 }, 
          textAlign: 'center', 
          backgroundColor: '#fff3e0',
          gridColumn: { xs: '1', sm: 'span 2', md: 'span 1' }
        }}>
          <TrendingUp sx={{ 
            fontSize: { xs: 32, sm: 40 }, 
            color: '#ff9800', 
            mb: 1 
          }} />
          <Typography variant="h4" sx={{ 
            fontWeight: 'bold', 
            color: '#ff9800',
            fontSize: { xs: '1.8rem', sm: '2.125rem' }
          }}>
            67%
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{
            fontSize: { xs: '0.75rem', sm: '0.875rem' }
          }}>
            Overall Progress
          </Typography>
        </Paper>
      </Box>

      {/* Lesson List */}
      <LessonList />
      
      {/* Quick Start Button */}
      <Box textAlign="center" sx={{ mt: { xs: 3, sm: 4 } }}>
        <Button 
          variant="contained" 
          color="primary" 
          sx={{ 
            mt: 3,
            px: { xs: 3, sm: 4 },
            py: { xs: 1.5, sm: 2 },
            fontSize: { xs: '0.9rem', sm: '1rem' },
            minWidth: { xs: '200px', sm: 'auto' }
          }} 
          onClick={() => navigate('/exercises')}
        >
          Start Practice Exercises
        </Button>
      </Box>
    </Box>
  );
};

export default Dashboard;
