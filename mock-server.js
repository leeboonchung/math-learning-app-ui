// Simple mock server for testing API integration
// Run with: node mock-server.js

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Enable CORS for frontend
app.use(cors({
  origin: 'http://localhost:5174'
}));

app.use(express.json());

// Mock data
const mockData = {
  stats: {
    lessonsAvailable: 8,
    lessonsCompleted: 3,
    overallProgress: 75
  },
  lessons: [
    {
      id: '1',
      title: 'Basic Addition',
      description: 'Learn to add single-digit numbers',
      difficulty: 'Beginner',
      totalExercises: 10,
      completedExercises: 10,
      isUnlocked: true,
      category: 'Arithmetic'
    },
    {
      id: '2',
      title: 'Basic Subtraction',
      description: 'Master subtraction with small numbers',
      difficulty: 'Beginner',
      totalExercises: 10,
      completedExercises: 8,
      isUnlocked: true,
      category: 'Arithmetic'
    },
    {
      id: '3',
      title: 'Multiplication Tables',
      description: 'Memorize multiplication tables 1-12',
      difficulty: 'Intermediate',
      totalExercises: 15,
      completedExercises: 5,
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
      isUnlocked: true,
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
    },
    {
      id: '6',
      title: 'Decimals',
      description: 'Working with decimal numbers',
      difficulty: 'Advanced',
      totalExercises: 18,
      completedExercises: 0,
      isUnlocked: false,
      category: 'Numbers'
    },
    {
      id: '7',
      title: 'Percentages',
      description: 'Calculate percentages and ratios',
      difficulty: 'Advanced',
      totalExercises: 15,
      completedExercises: 0,
      isUnlocked: false,
      category: 'Numbers'
    },
    {
      id: '8',
      title: 'Word Problems',
      description: 'Solve real-world math problems',
      difficulty: 'Advanced',
      totalExercises: 25,
      completedExercises: 0,
      isUnlocked: false,
      category: 'Problem Solving'
    }
  ]
};

// Routes
app.get('/api/dashboard', (req, res) => {
  console.log('📊 Dashboard data requested');
  res.json(mockData);
});

app.get('/api/user/stats', (req, res) => {
  console.log('📈 User stats requested');
  res.json(mockData.stats);
});

app.get('/api/lessons', (req, res) => {
  console.log('📚 Lessons requested');
  res.json(mockData.lessons);
});

app.put('/api/lessons/:id/progress', (req, res) => {
  const { id } = req.params;
  const { completedExercises } = req.body;
  
  console.log(`✏️ Updating lesson ${id} progress to ${completedExercises}`);
  
  // Find and update lesson
  const lesson = mockData.lessons.find(l => l.id === id);
  if (lesson) {
    lesson.completedExercises = completedExercises;
    
    // Recalculate stats
    const completed = mockData.lessons.filter(l => l.completedExercises === l.totalExercises).length;
    mockData.stats.lessonsCompleted = completed;
    
    const totalProgress = mockData.lessons.reduce((sum, l) => sum + (l.completedExercises / l.totalExercises), 0);
    mockData.stats.overallProgress = Math.round((totalProgress / mockData.lessons.length) * 100);
    
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Lesson not found' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Mock API server is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Mock API server running at http://localhost:${PORT}`);
  console.log(`📝 API endpoints available at http://localhost:${PORT}/api`);
  console.log('');
  console.log('Available endpoints:');
  console.log('  GET  /api/dashboard');
  console.log('  GET  /api/user/stats');
  console.log('  GET  /api/lessons');
  console.log('  PUT  /api/lessons/:id/progress');
  console.log('  GET  /api/health');
  console.log('');
  console.log('💡 To install dependencies: npm install express cors');
});

module.exports = app;
