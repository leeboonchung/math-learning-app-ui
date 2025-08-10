import { Typography, Button, Box, Paper, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { School, TrendingUp, CheckCircle, Logout } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import LessonList from '../components/LessonList';
import { apiService, type DashboardData, mockDashboardData } from '../services/apiService';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try to fetch from API, fallback to mock data if it fails
        const data = await apiService.getDashboardData();
        setDashboardData(data);
      } catch (err) {
        console.warn('API not available, using mock data:', err);
        // Fallback to mock data if API is not available
        setDashboardData(mockDashboardData);
        setError('API not available - using demo data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!dashboardData) {
    return (
      <Box textAlign="center" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load dashboard data
        </Alert>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Box>
    );
  }

  const { stats } = dashboardData;
  
  return (
    <Box sx={{ 
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#f5f5f5'
    }}>
      {/* Header with User Info */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        p: { xs: 2, sm: 3 },
        backgroundColor: 'background.paper',
        boxShadow: 2,
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Welcome back, {user?.name || 'User'}!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user?.email}
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<Logout />}
          onClick={() => {
            logout();
            navigate('/login');
          }}
          sx={{ 
            borderRadius: 2,
            textTransform: 'none'
          }}
        >
          Logout
        </Button>
      </Box>

      {/* Main Content Area */}
      <Box sx={{ 
        flex: 1,
        p: { xs: 2, sm: 3, md: 4 },
        maxWidth: '100%',
        overflow: 'auto'
      }}>
        {/* API Status Alert */}
        {error && (
          <Alert severity="info" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
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
            backgroundColor: '#e3f2fd',
            borderRadius: 3,
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: 4
            }
          }}>
            <School sx={{ 
              fontSize: { xs: 40, sm: 48 }, 
              color: '#1976d2', 
              mb: 1 
            }} />
            <Typography variant="h3" sx={{ 
              fontWeight: 'bold', 
              color: '#1976d2',
              fontSize: { xs: '2rem', sm: '3rem' }
            }}>
              {stats.lessonsAvailable}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{
              fontSize: { xs: '0.875rem', sm: '1rem' },
              fontWeight: 500
            }}>
              Lessons Available
            </Typography>
          </Paper>
          <Paper sx={{ 
            p: { xs: 2, sm: 3 }, 
            textAlign: 'center', 
            backgroundColor: '#e8f5e8',
            borderRadius: 3,
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: 4
            }
          }}>
            <CheckCircle sx={{ 
              fontSize: { xs: 40, sm: 48 }, 
              color: '#4caf50', 
              mb: 1 
            }} />
            <Typography variant="h3" sx={{ 
              fontWeight: 'bold', 
              color: '#4caf50',
              fontSize: { xs: '2rem', sm: '3rem' }
            }}>
              {stats.lessonsCompleted}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{
              fontSize: { xs: '0.875rem', sm: '1rem' },
              fontWeight: 500
            }}>
              Lessons Completed
            </Typography>
          </Paper>
          <Paper sx={{ 
            p: { xs: 2, sm: 3 }, 
            textAlign: 'center', 
            backgroundColor: '#fff3e0',
            gridColumn: { xs: '1', sm: 'span 2', md: 'span 1' },
            borderRadius: 3,
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: 4
            }
          }}>
            <TrendingUp sx={{ 
              fontSize: { xs: 40, sm: 48 }, 
              color: '#ff9800', 
              mb: 1 
            }} />
            <Typography variant="h3" sx={{ 
              fontWeight: 'bold', 
              color: '#ff9800',
              fontSize: { xs: '2rem', sm: '3rem' }
            }}>
              {stats.overallProgress}%
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{
              fontSize: { xs: '0.875rem', sm: '1rem' },
              fontWeight: 500
            }}>
              Overall Progress
            </Typography>
          </Paper>
        </Box>

        {/* Lesson List */}
        <LessonList lessons={dashboardData.lessons} />
      
      </Box>
    </Box>
  );
};

export default Dashboard;
