import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  LinearProgress,
  Card,
  CardContent,
  IconButton,
  Chip,
  Zoom,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl
} from '@mui/material';
import {
  ArrowBack,
  ArrowForward,
  Star,
  TrendingUp
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { apiService, type LessonProblem } from '../services/apiService';
import { generateMixedProblems, lessonConfigs } from '../utils/problemGenerator';

// Generate UUID v4
const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Get current user ID from localStorage
const getCurrentUserId = (): string | null => {
  try {
    const savedUser = localStorage.getItem('mathapp_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      return user.id || null;
    }
  } catch (error) {
    console.error('Error getting user ID:', error);
  }
  return null;
};

// Types for lesson problems (updated for API structure)
export interface LessonData {
  id: string;
  title: string;
  description: string;
  problems: LessonProblem[];
  totalProblems: number;
  passingScore: number;
  isCompleted: boolean;
  bestScore: number;
}

interface LessonInterfaceProps {
  lessonId: string;
  onComplete: (score: number, xpEarned: number) => void;
  onExit: () => void;
}

const LessonInterface: React.FC<LessonInterfaceProps> = ({
  lessonId,
  onComplete,
  onExit
}) => {
  const navigate = useNavigate();
  
  // State management
  const [lessonData, setLessonData] = useState<LessonData | null>(null);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime] = useState(Date.now());
  const [finalResults, setFinalResults] = useState<{score: number; correctCount: number; xpEarned: number} | null>(null);

  // Fetch lesson data from API
  const fetchLessonData = async (lessonId: string) => {
    try {
      setLoading(true);
      
      const lessonDetail = await apiService.getLessonDetail(lessonId);
      
      const lessonData: LessonData = {
        id: lessonDetail.id,
        title: lessonDetail.name,
        description: `Learn ${lessonDetail.name}`,
        problems: lessonDetail.problems,
        totalProblems: lessonDetail.problems.length,
        passingScore: 70,
        isCompleted: lessonDetail.isCompleted,
        bestScore: lessonDetail.bestScore
      };
      
      setLessonData(lessonData);
      console.log(lessonData);
      setAnswers(new Array(lessonData.totalProblems).fill(null));
      
    } catch (err) {
      console.error('Failed to fetch lesson data:', err);
      
      // Fallback to generated problems
      const fallbackData = generateLessonData(lessonId);
      setLessonData(fallbackData);
      setAnswers(new Array(fallbackData.totalProblems).fill(null));
    } finally {
      setLoading(false);
    }
  };

  // Fallback lesson data generator for when API fails
  const generateLessonData = (lessonId: string): LessonData => {
    const lessonTypes = {
      'basic-arithmetic': {
        title: 'Basic Arithmetic',
        description: 'Master addition and subtraction with single-digit numbers',
        config: lessonConfigs['basic-arithmetic']
      },
      'multiplication-mastery': {
        title: 'Multiplication Mastery',
        description: 'Learn multiplication tables from 1 to 12',
        config: lessonConfigs['multiplication-mastery']
      },
      'division-basics': {
        title: 'Division Basics',
        description: 'Introduction to division concepts',
        config: lessonConfigs['division-basics']
      },
      'mixed-practice': {
        title: 'Mixed Practice',
        description: 'Practice all four operations together',
        config: lessonConfigs['mixed-practice']
      }
    };

    const lessonType = lessonTypes[lessonId as keyof typeof lessonTypes] || lessonTypes['basic-arithmetic'];
    const generatedProblems = generateMixedProblems(lessonType.config);
    
    // Convert to LessonProblem format with multiple choice options
    const problems: LessonProblem[] = generatedProblems.map((problem, index) => {
      const correctAnswer = problem.correctAnswer;
      const wrongAnswers = generateWrongAnswers(correctAnswer);
      const allOptions = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);
      
      return {
        id: problem.id,
        question: problem.question,
        rewardXp: 10,
        order: index + 1,
        options: allOptions.map((option, optIndex) => ({
          id: `${problem.id}-option-${optIndex}`,
          text: option.toString()
        }))
      };
    });

    return {
      id: lessonId,
      title: lessonType.title,
      description: lessonType.description,
      problems,
      totalProblems: problems.length,
      passingScore: 70,
      isCompleted: false,
      bestScore: 0
    };
  };

  // Generate wrong answer options
  const generateWrongAnswers = (correctAnswer: number): number[] => {
    const wrongAnswers: number[] = [];
    const range = Math.max(3, Math.floor(correctAnswer * 0.2));
    
    while (wrongAnswers.length < 3) {
      let wrongAnswer: number;
      if (Math.random() > 0.5) {
        wrongAnswer = correctAnswer + Math.floor(Math.random() * range) + 1;
      } else {
        wrongAnswer = Math.max(1, correctAnswer - Math.floor(Math.random() * range) - 1);
      }
      
      if (wrongAnswer !== correctAnswer && !wrongAnswers.includes(wrongAnswer)) {
        wrongAnswers.push(wrongAnswer);
      }
    }
    
    return wrongAnswers;
  };

  // Initialize lesson data
  useEffect(() => {
    fetchLessonData(lessonId);
  }, [lessonId]);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onExit();
      } else if (e.key === 'ArrowLeft') {
        handlePreviousProblem();
      } else if (e.key === 'ArrowRight') {
        handleNextProblem();
      } else if (['a', 'b', 'c', 'd', 'A', 'B', 'C', 'D'].includes(e.key)) {
        const optionIndex = e.key.toLowerCase().charCodeAt(0) - 97; // Convert a-d to 0-3
        const currentProblem = lessonData?.problems[currentProblemIndex];
        if (currentProblem && currentProblem.options[optionIndex]) {
          handleAnswerChange(currentProblem.options[optionIndex].id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentProblemIndex, lessonData?.problems, onExit]);

  // Handle answer selection for current question
  const handleAnswerChange = (optionId: string) => {
    const newAnswers = [...answers];
    newAnswers[currentProblemIndex] = optionId;
    setAnswers(newAnswers);
  };

  // Submit all answers to the API
  const handleSubmitAllAnswers = async () => {
    if (!lessonData) return;
    
    setSubmitting(true);
    try {
      // Generate unique submission ID
      const submissionId = generateUUID();
      
      // Get current user ID
      const userId = getCurrentUserId();
      
      // Prepare submission data
      const submissionData = {
        user_id: userId,
        lesson_id: lessonData.id,
        answers: answers.map((answer, index) => ({
          problem_id: lessonData.problems[index].id,
          selected_option_id: answer
        }))
      };

      console.log('Submitting with ID:', submissionId, 'for user:', userId || 'anonymous');

      // Call submission API
      const response = await apiService.submitLessonAnswers(submissionId, submissionData);
      
      console.log('Submission completed with ID:', response.submission_id);
      
      setFinalResults({
        score: response.score,
        correctCount: response.correctCount,
        xpEarned: response.xpEarned
      });
      
      setIsComplete(true);
      onComplete(response.score, response.xpEarned);
      
    } catch (error) {
      console.error('Failed to submit answers:', error);
      // Fallback to local calculation
      calculateLocalResults();
    } finally {
      setSubmitting(false);
    }
  };

  // Fallback local calculation if API fails
  const calculateLocalResults = () => {
    if (!lessonData) return;
    
    let correctCount = 0;
    answers.forEach((answer, index) => {
      if (!answer) return;
      const problem = lessonData.problems[index];
      const selectedOption = problem.options.find(opt => opt.id === answer);
      const correctAnswer = calculateCorrectAnswer(problem.question);
      if (selectedOption?.text === correctAnswer?.toString()) {
        correctCount++;
      }
    });
    
    const score = Math.round((correctCount / lessonData.totalProblems) * 100);
    const xpEarned = Math.floor(score * 2 + (timeSpent < 300 ? 50 : 0));
    
    setFinalResults({ score, correctCount, xpEarned });
    setIsComplete(true);
    onComplete(score, xpEarned);
  };

  // Helper function to calculate correct answer from question
  const calculateCorrectAnswer = (question: string): number | null => {
    // Extract numbers and operation from question
    const match = question.match(/(\d+)\s*([+\-×÷])\s*(\d+)/);
    if (!match) return null;
    
    const [, num1Str, operator, num2Str] = match;
    const num1 = parseInt(num1Str);
    const num2 = parseInt(num2Str);
    
    switch (operator) {
      case '+': return num1 + num2;
      case '-': return num1 - num2;
      case '×': case '*': return num1 * num2;
      case '÷': case '/': return Math.floor(num1 / num2);
      default: return null;
    }
  };

  const handleNextProblem = () => {
    if (currentProblemIndex < (lessonData?.totalProblems || 0) - 1) {
      setCurrentProblemIndex(currentProblemIndex + 1);
    }
  };

  const handlePreviousProblem = () => {
    if (currentProblemIndex > 0) {
      setCurrentProblemIndex(currentProblemIndex - 1);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Loading lesson...</Typography>
      </Box>
    );
  }

  if (!lessonData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Failed to load lesson data</Typography>
      </Box>
    );
  }

  const currentProblem = lessonData.problems[currentProblemIndex];
  const progress = ((currentProblemIndex + 1) / lessonData.totalProblems) * 100;

  if (isComplete) {
    return (
      <Box sx={{ 
        maxWidth: '100%',
        mx: 0,
        p: { xs: 2, sm: 3 },
        textAlign: 'center',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Zoom in={true}>
          <Card sx={{ 
            p: 3, 
            background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
            color: 'white',
            maxWidth: 600,
            width: '100%'
          }}>
            <CardContent>
              <Star sx={{ fontSize: 60, mb: 1 }} />
              <Typography variant="h4" gutterBottom>
                Lesson Complete!
              </Typography>
              <Typography variant="h6" gutterBottom>
                {lessonData.title}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 2 }}>
                <Box>
                  <Typography variant="h5">{finalResults?.score || 0}%</Typography>
                  <Typography variant="body2">Score</Typography>
                </Box>
                <Box>
                  <Typography variant="h5">{formatTime(timeSpent)}</Typography>
                  <Typography variant="body2">Time</Typography>
                </Box>
                <Box>
                  <Typography variant="h5">+{finalResults?.xpEarned || 0}</Typography>
                  <Typography variant="body2">XP Earned</Typography>
                </Box>
              </Box>
              <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button 
                  variant="contained" 
                  size="medium"
                  onClick={() => navigate('/dashboard')}
                  sx={{ 
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' }
                  }}
                >
                  Back to Dashboard
                </Button>
                <Button 
                  variant="outlined" 
                  size="medium"
                  onClick={() => window.location.reload()}
                  sx={{ 
                    borderColor: 'white',
                    color: 'white',
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
                  }}
                >
                  Try Again
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Zoom>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      maxWidth: '100%',
      mx: 0,
      p: { xs: 1, sm: 2 },
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <Paper sx={{ p: 1.5, mb: 2, backgroundColor: '#f8f9fa' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <IconButton onClick={onExit} sx={{ color: 'primary.main' }} size="small">
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" fontWeight="bold" sx={{ flex: 1, textAlign: 'center' }}>
            {lessonData.title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip 
              icon={<TrendingUp />} 
              label={`${Math.round(((answers.filter(a => a !== null).length) / (lessonData?.totalProblems || 1)) * 100)}%`}
              color="primary" 
              variant="outlined"
              size="small"
            />
            <Chip 
              label={formatTime(timeSpent)} 
              variant="outlined"
              size="small"
            />
          </Box>
        </Box>
        
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          sx={{ 
            height: 6, 
            borderRadius: 3,
            backgroundColor: 'rgba(0,0,0,0.1)',
            '& .MuiLinearProgress-bar': {
              borderRadius: 3,
              background: 'linear-gradient(90deg, #4CAF50 0%, #45a049 100%)'
            }
          }} 
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
          <Typography variant="caption" sx={{ textAlign: 'center' }}>
            Problem {currentProblemIndex + 1} of {lessonData.totalProblems}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
            Press A-D for options • ← → to navigate • ESC to exit
          </Typography>
        </Box>
      </Paper>

      {/* Main Problem Area */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Card sx={{ 
          p: { xs: 2, sm: 3 }, 
          textAlign: 'center',
          minHeight: 200,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
          boxShadow: 2
        }}>
          <Typography variant="h4" sx={{ 
            mb: 3, 
            fontWeight: 'bold',
            fontSize: { xs: '1.8rem', sm: '2.5rem' },
            color: 'primary.main'
          }}>
            {currentProblem.question}
          </Typography>
          
          {/* Multiple Choice Options */}
          <FormControl component="fieldset" sx={{ mb: 2, width: '100%' }}>
            <RadioGroup
              value={answers[currentProblemIndex] || ''}
              onChange={(e) => handleAnswerChange(e.target.value)}
              sx={{ 
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 1.5,
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {currentProblem.options.map((option, index) => (
                <FormControlLabel
                  key={option.id}
                  value={option.id}
                  control={<Radio size="small" />}
                  label={
                    <Typography variant="h6" sx={{ 
                      fontSize: { xs: '1rem', sm: '1.2rem' },
                      minWidth: '40px',
                      textAlign: 'center'
                    }}>
                      {String.fromCharCode(65 + index)}. {option.text}
                    </Typography>
                  }
                  sx={{
                    margin: 0,
                    padding: 1.5,
                    border: '2px solid',
                    borderColor: answers[currentProblemIndex] === option.id ? 'primary.main' : 'divider',
                    borderRadius: 2,
                    backgroundColor: answers[currentProblemIndex] === option.id ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                    transition: 'all 0.2s',
                    minWidth: { xs: '180px', sm: '200px' },
                    flex: { sm: 1 },
                    maxWidth: { sm: '200px' },
                    '&:hover': {
                      borderColor: 'primary.main',
                      backgroundColor: 'rgba(25, 118, 210, 0.04)'
                    }
                  }}
                />
              ))}
            </RadioGroup>
          </FormControl>

          {/* Submit button - only show when all questions are answered */}
          {answers.every(answer => answer !== null) && !isComplete && (
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="medium"
                onClick={handleSubmitAllAnswers}
                disabled={submitting}
                sx={{ minWidth: 120 }}
              >
                {submitting ? 'Submitting...' : 'Submit All Answers'}
              </Button>
            </Box>
          )}
        </Card>
      </Box>

      {/* Navigation */}
      <Paper sx={{ p: 1.5, mt: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={handlePreviousProblem}
            disabled={currentProblemIndex === 0}
            variant="outlined"
            size="small"
          >
            Previous
          </Button>
          
          <Typography variant="caption" color="text.secondary">
            {currentProblemIndex + 1} / {lessonData.totalProblems}
          </Typography>
          
          <Button
            endIcon={<ArrowForward />}
            onClick={handleNextProblem}
            disabled={currentProblemIndex === lessonData.totalProblems - 1}
            variant="outlined"
            size="small"
          >
            Next
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default LessonInterface;
