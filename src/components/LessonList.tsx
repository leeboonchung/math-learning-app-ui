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

interface Lesson {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  totalExercises: number;
  completedExercises: number;
  isUnlocked: boolean;
  category: string;
}

const mockLessons: Lesson[] = [
  {
    id: '1',
    title: 'Basic Addition',
    description: 'Learn to add single-digit numbers',
    difficulty: 'Beginner',
    totalExercises: 10,
    completedExercises: 7,
    isUnlocked: true,
    category: 'Arithmetic'
  },
  {
    id: '2',
    title: 'Basic Subtraction',
    description: 'Master subtraction with small numbers',
    difficulty: 'Beginner',
    totalExercises: 10,
    completedExercises: 10,
    isUnlocked: true,
    category: 'Arithmetic'
  },
  {
    id: '3',
    title: 'Multiplication Tables',
    description: 'Memorize multiplication tables 1-12',
    difficulty: 'Intermediate',
    totalExercises: 15,
    completedExercises: 3,
    isUnlocked: true,
    category: 'Arithmetic'
  },
  {
    id: '4',
    title: 'Division Basics',
    description: 'Introduction to division concepts',
    difficulty: 'Intermediate',
    totalExercises: 12,
    completedExercises: 0,
    isUnlocked: false,
    category: 'Arithmetic'
  },
  {
    id: '5',
    title: 'Fractions',
    description: 'Understanding parts of a whole',
    difficulty: 'Advanced',
    totalExercises: 20,
    completedExercises: 0,
    isUnlocked: false,
    category: 'Numbers'
  }
];

const LessonList: React.FC = () => {
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
      // Navigate to lesson or start lesson logic here
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" gutterBottom sx={{ 
        fontWeight: 'bold', 
        color: '#1976d2',
        fontSize: { xs: '1.75rem', sm: '2.125rem' },
        textAlign: { xs: 'center', sm: 'left' },
        px: { xs: 1, sm: 3 }
      }}>
        Your Learning Path
      </Typography>
      <Typography variant="subtitle1" gutterBottom sx={{ 
        color: 'text.secondary', 
        mb: { xs: 2, sm: 3 },
        textAlign: { xs: 'center', sm: 'left' },
        px: { xs: 1, sm: 3 },
        fontSize: { xs: '0.9rem', sm: '1rem' }
      }}>
        Complete lessons to unlock new challenges and track your progress
      </Typography>

      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { 
          xs: '1fr', 
          sm: 'repeat(2, 1fr)', 
          lg: 'repeat(3, 1fr)' 
        }, 
        gap: { xs: 2, sm: 3 },
        px: { xs: 0, sm: 3 }
      }}>
        {mockLessons.map((lesson) => (
          <Card
            key={lesson.id}
              sx={{
                height: '100%',
                cursor: lesson.isUnlocked ? 'pointer' : 'not-allowed',
                opacity: lesson.isUnlocked ? 1 : 0.6,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': lesson.isUnlocked ? {
                  transform: { xs: 'none', sm: 'translateY(-4px)' },
                  boxShadow: 4
                } : {}
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
                </Box>

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
