import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Box,
  Chip,
  IconButton
} from '@mui/material';
import { PlayArrow, CheckCircle, Lock } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import type { Lesson } from '../services/apiService';
import { mockDashboardData } from '../services/apiService';

interface LessonListProps {
  lessons?: Lesson[];
}

const LessonList: React.FC<LessonListProps> = ({ lessons }) => {
  const navigate = useNavigate();
  
  // Use provided lessons or fallback to mock data
  const displayLessons = lessons || mockDashboardData.lessons;
  const getProgressPercentage = (completed: number, total: number): number => {
    return (completed / total) * 100;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'success';
      case 'Intermediate': return 'warning';
      case 'Advanced': return 'error';
      default: return 'default';
    }
  };

  const handleLessonClick = (lesson: Lesson) => {
    if (lesson.isUnlocked) {
      console.log(`Starting lesson: ${lesson.title}`);
      // Use the actual lesson ID from API
      navigate(`/lesson/${lesson.id}`);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" gutterBottom sx={{ 
        fontWeight: 'bold', 
        color: '#1976d2',
        fontSize: { xs: '2rem', sm: '2.5rem' },
        textAlign: 'center',
        mb: 2
      }}>
        Your Learning Path
      </Typography>
      <Typography variant="subtitle1" gutterBottom sx={{ 
        color: 'text.secondary', 
        mb: { xs: 3, sm: 4 },
        textAlign: 'center',
        fontSize: { xs: '1rem', sm: '1.1rem' },
        maxWidth: '600px',
        mx: 'auto'
      }}>
        Complete lessons to unlock new challenges and track your progress
      </Typography>

      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { 
          xs: '1fr', 
          sm: 'repeat(2, 1fr)', 
          lg: 'repeat(3, 1fr)',
          xl: 'repeat(4, 1fr)'
        }, 
        gap: { xs: 2, sm: 3, md: 4 },
        maxWidth: '1600px',
        mx: 'auto'
      }}>
        {displayLessons.map((lesson) => (
          <Card
            key={lesson.id}
              sx={{
                height: '100%',
                cursor: lesson.isUnlocked ? 'pointer' : 'not-allowed',
                opacity: lesson.isUnlocked ? 1 : 0.6,
                transition: 'transform 0.3s, box-shadow 0.3s',
                borderRadius: 3,
                '&:hover': lesson.isUnlocked ? {
                  transform: { xs: 'none', sm: 'translateY(-8px)' },
                  boxShadow: 8
                } : {},
                background: lesson.isUnlocked 
                  ? 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
                  : 'linear-gradient(135deg, #f5f5f5 0%, #e9ecef 100%)'
              }}
              onClick={() => handleLessonClick(lesson)}
            >
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  mb: { xs: 1.5, sm: 2 } 
                }}>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 'bold',
                    fontSize: { xs: '1.1rem', sm: '1.25rem' }
                  }}>
                    {lesson.title}
                  </Typography>
                  <IconButton
                    size="small"
                    disabled={!lesson.isUnlocked}
                    sx={{ 
                      color: lesson.completedExercises === lesson.totalExercises ? 'success.main' : 'primary.main',
                      minWidth: { xs: '32px', sm: '40px' },
                      minHeight: { xs: '32px', sm: '40px' }
                    }}
                  >
                    {!lesson.isUnlocked ? (
                      <Lock sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
                    ) : lesson.completedExercises === lesson.totalExercises ? (
                      <CheckCircle sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
                    ) : (
                      <PlayArrow sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
                    )}
                  </IconButton>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ 
                  mb: { xs: 1.5, sm: 2 },
                  fontSize: { xs: '0.8rem', sm: '0.875rem' }
                }}>
                  {lesson.description}
                </Typography>

                <Box sx={{ 
                  display: 'flex', 
                  gap: 1, 
                  mb: { xs: 1.5, sm: 2 },
                  flexWrap: 'wrap'
                }}>
                  <Chip
                    label={lesson.difficulty}
                    size="small"
                    color={getDifficultyColor(lesson.difficulty) as any}
                    variant="outlined"
                    sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                  />
                  <Chip
                    label={lesson.category}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                  />
                  <Chip
                    label={lesson.progress}
                    size="small"
                    color={lesson.progress === 'Completed' ? 'success' : lesson.progress === 'In Progress' ? 'warning' : 'default'}
                    sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                  />
                </Box>

                {/* Score and Experience Display */}
                {(lesson.score > 0 || lesson.expEarned > 0) && (
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    mb: { xs: 1, sm: 1.5 },
                    p: 1,
                    backgroundColor: 'rgba(25, 118, 210, 0.05)',
                    borderRadius: 2
                  }}>
                    <Typography variant="body2" sx={{ 
                      fontSize: { xs: '0.7rem', sm: '0.8rem' },
                      fontWeight: 'bold',
                      color: 'primary.main'
                    }}>
                      Score: {lesson.score}%
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      fontSize: { xs: '0.7rem', sm: '0.8rem' },
                      fontWeight: 'bold',
                      color: 'success.main'
                    }}>
                      +{lesson.expEarned} XP
                    </Typography>
                  </Box>
                )}

                <Box sx={{ mb: 1 }}>
                  <Typography variant="body2" color="text.secondary" sx={{
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                  }}>
                    Progress: {lesson.completedExercises}/{lesson.totalExercises} exercises
                  </Typography>
                </Box>

                <LinearProgress
                  variant="determinate"
                  value={getProgressPercentage(lesson.completedExercises, lesson.totalExercises)}
                  sx={{
                    height: { xs: 6, sm: 8 },
                    borderRadius: 4,
                    backgroundColor: 'rgba(0,0,0,0.1)',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                      backgroundColor: lesson.completedExercises === lesson.totalExercises
                        ? '#4caf50'
                        : '#1976d2'
                    }
                  }}
                />

                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    textAlign: 'right',
                    mt: 0.5,
                    fontWeight: 'bold',
                    color: lesson.completedExercises === lesson.totalExercises ? 'success.main' : 'primary.main',
                    fontSize: { xs: '0.7rem', sm: '0.75rem' }
                  }}
                >
                  {Math.round(getProgressPercentage(lesson.completedExercises, lesson.totalExercises))}% Complete
                </Typography>
              </CardContent>
            </Card>
        ))}
      </Box>
    </Box>
  );
};

export default LessonList;
