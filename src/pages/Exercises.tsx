import { useState } from 'react';
import { Box, Typography, Button, Paper, RadioGroup, FormControlLabel, Radio } from '@mui/material';

const mockExercises = [
  {
    question: 'What is 7 + 5?',
    options: ['10', '11', '12', '13'],
    answer: '12',
  },
  {
    question: 'What is 9 - 4?',
    options: ['3', '5', '6', '7'],
    answer: '5',
  },
  {
    question: 'What is 6 × 3?',
    options: ['18', '12', '9', '21'],
    answer: '18',
  },
];

const Exercises = () => {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = () => {
    if (selected === mockExercises[current].answer) {
      setFeedback('Correct!');
    } else {
      setFeedback('Try again!');
    }
  };

  const handleNext = () => {
    setCurrent((prev) => prev + 1);
    setSelected('');
    setFeedback('');
  };

  if (current >= mockExercises.length) {
    return (
      <Box 
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        sx={{ 
          px: { xs: 2, sm: 0 },
          backgroundColor: '#f5f5f5'
        }}
      >
        <Typography variant="h4" sx={{
          fontSize: { xs: '1.5rem', sm: '2.125rem' },
          mb: 2,
          textAlign: 'center'
        }}>
          Great job! You finished all exercises.
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => window.location.href = '/dashboard'}
          sx={{
            mt: 2,
            px: { xs: 3, sm: 4 },
            py: { xs: 1.5, sm: 2 }
          }}
        >
          Back to Dashboard
        </Button>
      </Box>
    );
  }

  const exercise = mockExercises[current];

  return (
    <Box 
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{ 
        px: { xs: 2, sm: 3 },
        py: { xs: 3, sm: 4 },
        backgroundColor: '#f5f5f5'
      }}
    >
      <Paper sx={{ 
        p: { xs: 3, sm: 4 }, 
        maxWidth: { xs: '100%', sm: 600 }, 
        width: '100%',
        borderRadius: 3,
        boxShadow: 3
      }}>
      <Typography variant="h5" gutterBottom sx={{
        fontSize: { xs: '1.3rem', sm: '1.5rem' }
      }}>
        Exercise {current + 1}
      </Typography>
      <Typography variant="h6" gutterBottom sx={{
        fontSize: { xs: '1.1rem', sm: '1.25rem' },
        mb: { xs: 2, sm: 3 }
      }}>
        {exercise.question}
      </Typography>
      <RadioGroup value={selected} onChange={e => setSelected(e.target.value)}>
        {exercise.options.map(opt => (
          <FormControlLabel 
            key={opt} 
            value={opt} 
            control={<Radio size={window.innerWidth < 600 ? 'small' : 'medium'} />} 
            label={<Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>{opt}</Typography>}
            sx={{ mb: { xs: 0.5, sm: 1 } }}
          />
        ))}
      </RadioGroup>
      {feedback && (
        <Typography 
          color={feedback === 'Correct!' ? 'success.main' : 'error.main'} 
          sx={{ 
            mt: 2,
            fontSize: { xs: '0.9rem', sm: '1rem' },
            fontWeight: 'bold'
          }}
        >
          {feedback}
        </Typography>
      )}
      <Box mt={3} display="flex" gap={2} flexDirection={{ xs: 'column', sm: 'row' }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleSubmit} 
          disabled={!selected || feedback === 'Correct!'}
          fullWidth={window.innerWidth < 600}
          sx={{
            py: { xs: 1.5, sm: 1 },
            fontSize: { xs: '0.9rem', sm: '1rem' }
          }}
        >
          Submit
        </Button>
        <Button 
          variant="outlined" 
          onClick={handleNext} 
          disabled={feedback !== 'Correct!'}
          fullWidth={window.innerWidth < 600}
          sx={{
            py: { xs: 1.5, sm: 1 },
            fontSize: { xs: '0.9rem', sm: '1rem' }
          }}
        >
          Next
        </Button>
      </Box>
    </Paper>
    </Box>
  );
};

export default Exercises;
