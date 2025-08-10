import express from 'express';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Test authentication endpoint
app.post('/api/auth/login', (req, res) => {
  const { credentials } = req.body;
  
  if (!credentials || !credentials.email || !credentials.password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }

  // Simple test credentials
  if (credentials.email === 'demo_user@example.com' && credentials.password === 'demo_user') {
    return res.json({
      success: true,
      user: {
        id: '1',
        name: 'Demo User',
        email: 'demo_user@example.com'
      },
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test_token'
    });
  }

  // Accept any test credentials for demonstration
  if (credentials.email.includes('@') && credentials.password.length >= 4) {
    return res.json({
      success: true,
      user: {
        id: '2',
        name: credentials.email.split('@')[0],
        email: credentials.email
      },
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test_token_' + Date.now()
    });
  }

  return res.status(401).json({
    success: false,
    message: 'Invalid credentials'
  });
});

// Test protected dashboard endpoint
app.get('/api/dashboard', (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  res.json({
    stats: {
      lessonsAvailable: 5,
      lessonsCompleted: 2,
      overallProgress: 67
    },
    lessons: [
      {
        id: "1",
        title: "Basic Addition",
        description: "Learn the fundamentals of adding numbers",
        difficulty: "Beginner",
        totalExercises: 10,
        completedExercises: 8,
        isUnlocked: true,
        category: "Arithmetic",
        score: 85,
        expEarned: 150,
        completionDate: null,
        progress: "In Progress"
      },
      {
        id: "2", 
        title: "Multiplication Tables",
        description: "Master multiplication from 1 to 12",
        difficulty: "Intermediate",
        totalExercises: 12,
        completedExercises: 12,
        isUnlocked: true,
        category: "Arithmetic",
        score: 95,
        expEarned: 200,
        completionDate: "2025-08-05",
        progress: "Completed"
      },
      {
        id: "3",
        title: "Fractions Basics",
        description: "Understanding parts of a whole",
        difficulty: "Intermediate", 
        totalExercises: 15,
        completedExercises: 0,
        isUnlocked: false,
        category: "Fractions",
        score: 0,
        expEarned: 0,
        completionDate: null,
        progress: "Not Started"
      }
    ]
  });
});

// New GetLessons endpoint with the expected data structure
app.get('/api/lessons', (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  // Extract user_id from query parameters
  const userId = req.query.user_id;
  console.log(`Getting lessons for user_id: ${userId || 'not provided'}`);

  res.json({
    data: [
      {
        lesson_id: "f2c4fa20-767d-4971-8c10-355e34e2f870",
        lesson_name: "Basic Arithmetic",
        lesson_category: "Maths",
        score: 85,
        lesson_exp_earned: 150,
        completion_date: null,
        progress: "In Progress"
      },
      {
        lesson_id: "57098328-5f8c-410a-b5fe-72f14b62f84e",
        lesson_name: "Multiplication Mastery",
        lesson_category: "Maths",
        score: 95,
        lesson_exp_earned: 200,
        completion_date: "2025-08-05",
        progress: "Completed"
      },
      {
        lesson_id: "76a25ec9-68c6-4be1-a98a-624104a02499",
        lesson_name: "Division Basics",
        lesson_category: "Maths",
        score: 0,
        lesson_exp_earned: 0,
        completion_date: null,
        progress: "Not Started"
      },
      {
        lesson_id: "a1b2c3d4-e5f6-4789-9abc-def123456789",
        lesson_name: "Fractions Fundamentals",
        lesson_category: "Maths",
        score: 72,
        lesson_exp_earned: 120,
        completion_date: null,
        progress: "In Progress"
      },
      {
        lesson_id: "z9y8x7w6-v5u4-4321-8765-432109876543",
        lesson_name: "Advanced Algebra",
        lesson_category: "Maths",
        score: 0,
        lesson_exp_earned: 0,
        completion_date: null,
        progress: "Not Started"
      }
    ]
  });
});

// New lesson detail endpoint
app.get('/api/lessons/:lessonId', (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  const { lessonId } = req.params;
  
  // Sample lesson detail response
  res.json({
    data: {
      lesson_id: lessonId,
      lesson_name: "Basic Arithmetic",
      problems: [
        {
          problem_id: "44c30544-722e-4991-bf44-b16250475ee4",
          question: "What is 15 + 7?",
          reward_xp: "10",
          order: 1,
          options: [
            {
              problem_option_id: "8125e728-f195-43c9-9288-98561ce98160",
              problem_id: "44c30544-722e-4991-bf44-b16250475ee4",
              option: "20"
            },
            {
              problem_option_id: "87581298-f1c6-449d-a89b-53d764aaafff",
              problem_id: "44c30544-722e-4991-bf44-b16250475ee4",
              option: "22"
            },
            {
              problem_option_id: "cbd8950c-801e-47fb-9134-d63159c3ad36",
              problem_id: "44c30544-722e-4991-bf44-b16250475ee4",
              option: "23"
            },
            {
              problem_option_id: "e7dbd679-f6e9-4192-9f0e-c09e76976a13",
              problem_id: "44c30544-722e-4991-bf44-b16250475ee4",
              option: "21"
            }
          ]
        },
        {
          problem_id: "8d9e0595-a0a6-419a-b69f-df987b72f148",
          question: "What is 50 - 28?",
          reward_xp: "10",
          order: 2,
          options: [
            {
              problem_option_id: "9d108dfb-9a5d-469c-9443-0b578f6e7481",
              problem_id: "8d9e0595-a0a6-419a-b69f-df987b72f148",
              option: "18"
            },
            {
              problem_option_id: "ebeb5a83-a8cb-4ac6-a0e9-9052fcec5bc4",
              problem_id: "8d9e0595-a0a6-419a-b69f-df987b72f148",
              option: "22"
            },
            {
              problem_option_id: "f29213eb-effc-452f-b696-8e4c770fc3fe",
              problem_id: "8d9e0595-a0a6-419a-b69f-df987b72f148",
              option: "20"
            },
            {
              problem_option_id: "f8958f82-61fc-41f3-9900-a690a876ecbe",
              problem_id: "8d9e0595-a0a6-419a-b69f-df987b72f148",
              option: "24"
            }
          ]
        },
        {
          problem_id: "a2a2d6b3-ba18-48e2-8c81-49eab65b04c5",
          question: "What is 32 + 14?",
          reward_xp: "10",
          order: 3,
          options: [
            {
              problem_option_id: "20379b2a-763f-40df-86bf-c683331457dc",
              problem_id: "a2a2d6b3-ba18-48e2-8c81-49eab65b04c5",
              option: "48"
            },
            {
              problem_option_id: "4cee4809-23b9-4d39-b829-b88c29eb6e75",
              problem_id: "a2a2d6b3-ba18-48e2-8c81-49eab65b04c5",
              option: "50"
            },
            {
              problem_option_id: "5cecfe32-b919-4f47-847b-b5c2a4707efa",
              problem_id: "a2a2d6b3-ba18-48e2-8c81-49eab65b04c5",
              option: "44"
            },
            {
              problem_option_id: "bbdcbe9f-79ee-436b-ae9f-a5c4057f1cf2",
              problem_id: "a2a2d6b3-ba18-48e2-8c81-49eab65b04c5",
              option: "46"
            }
          ]
        },
        {
          problem_id: "c1691a25-05d6-4be3-9631-ca083a5c222e",
          question: "What is 100 - 75?",
          reward_xp: "10",
          order: 4,
          options: [
            {
              problem_option_id: "0660b4b5-1bfd-4002-b2a4-9af2e17b1310",
              problem_id: "c1691a25-05d6-4be3-9631-ca083a5c222e",
              option: "10"
            },
            {
              problem_option_id: "60982f47-c484-482a-872f-fa292d210d2d",
              problem_id: "c1691a25-05d6-4be3-9631-ca083a5c222e",
              option: "25"
            },
            {
              problem_option_id: "aa4115f0-5dd3-49ab-90ad-969ac74ddf9c",
              problem_id: "c1691a25-05d6-4be3-9631-ca083a5c222e",
              option: "20"
            },
            {
              problem_option_id: "c12b9382-b4a5-429e-ae48-bd5ee3a9e177",
              problem_id: "c1691a25-05d6-4be3-9631-ca083a5c222e",
              option: "15"
            }
          ]
        }
      ],
      is_completed: false,
      best_score: 0,
      attempts_count: 0,
      last_attempted_at: null,
      completed_at: null
    }
  });
});

// Lesson submission endpoint
app.post('/api/lessons/:lessonId/submit', (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }
  
  const { lessonId } = req.params;
  const { submission_id, user_id, answers, time_spent } = req.body;
  
  console.log(`Submitting lesson ${lessonId} with submission ID: ${submission_id}, user_id: ${user_id || 'anonymous'}, and ${answers.length} answers`);
  
  // Simple calculation for demo - in real app this would check against correct answers in database
  const calculateAnswer = (question) => {
    const match = question.match(/(\d+)\s*([+\-×÷])\s*(\d+)/);
    if (!match) return null;
    
    const [, num1Str, operator, num2Str] = match;
    const num1 = parseInt(num1Str);
    const num2 = parseInt(num2Str);
    
    switch (operator) {
      case '+': return num1 + num2;
      case '-': return num1 - num2;
      case '×': return num1 * num2;
      case '÷': return Math.floor(num1 / num2);
      default: return null;
    }
  };
  
  // Mock lesson problems for calculation
  const lessonProblems = {
    'basic-arithmetic': [
      { id: "a1234567-1234-1234-1234-123456789abc", question: "What is 5 + 3?" },
      { id: "b2345678-2345-2345-2345-234567890bcd", question: "What is 12 - 4?" },
      { id: "c3456789-3456-3456-3456-345678901cde", question: "What is 7 + 2?" },
      { id: "d4567890-4567-4567-4567-456789012def", question: "What is 15 - 6?" },
      { id: "e5678901-5678-5678-5678-567890123eff", question: "What is 100 - 75?" }
    ]
  };
  
  const problems = lessonProblems[lessonId] || lessonProblems['basic-arithmetic'];
  
  let correctCount = 0;
  const results = answers.map((answer, index) => {
    const problem = problems[index];
    if (!problem) return null;
    
    const correctAnswer = calculateAnswer(problem.question);
    const selectedOptionText = getOptionTextById(answer.selected_option_id);
    const isCorrect = selectedOptionText === correctAnswer?.toString();
    
    if (isCorrect) correctCount++;
    
    return {
      problem_id: problem.id,
      is_correct: isCorrect,
      correct_answer: correctAnswer?.toString() || 'Unknown',
      selected_answer: selectedOptionText || 'No answer'
    };
  }).filter(Boolean);
  
  const score = Math.round((correctCount / answers.length) * 100);
  const baseXp = score * 2;
  const speedBonus = time_spent < 300 ? 50 : 0;
  const xpEarned = baseXp + speedBonus;
  
  // Helper function to get option text by ID (simplified for demo)
  function getOptionTextById(optionId) {
    const optionMapping = {
      // Basic arithmetic options
      "opt1": "8", "opt2": "7", "opt3": "9", "opt4": "6",
      "opt5": "8", "opt6": "7", "opt7": "6", "opt8": "9",
      "opt9": "9", "opt10": "8", "opt11": "10", "opt12": "7",
      "opt13": "9", "opt14": "8", "opt15": "10", "opt16": "7",
      "opt17": "25", "opt18": "20", "opt19": "15", "opt20": "30",
      // From the API structure
      "94c0e02b-2c9f-47b6-a0c1-1b3a5c8d4e6f": "8",
      "b1a3c5d7-e9f1-23a5-c7d9-e1f3a5c7d9e1": "7",
      "c2b4d6e8-f0a2-34b6-d8e0-f2a4b6d8e0f2": "9",
      "d3c5e7f9-a1b3-45c7-e9f1-a3b5c7e9f1a3": "6",
      "05a8c2d1-4e7b-4309-b5c8-2f1e9a7d6c3b": "8",
      "16b9d3e2-5f8c-5410-c6d9-3a2f0b8e7d4c": "7",
      "27c0e4f3-6a9d-6521-d7e0-4b3a1c9f8e5d": "6",
      "38d1f5a4-7b0e-7632-e8f1-5c4b2d0a9f6e": "9",
      "2a5d8f01-3c7e-4021-9b6a-1e4c7f0d2b5e": "9",
      "3b6e9a12-4d8f-5132-ac7b-2f5d8a1e3c6f": "8",
      "4c7f0b23-5e9a-6243-bd8c-3a6e9b2f4d7a": "10",
      "5d8a1c34-6f0b-7354-ce9d-4b7f0c3a5e8b": "7",
      "6e9b2d45-7a1c-8465-df0e-5c8a1d4b6f9c": "9",
      "7f0c3e56-8b2d-9576-ea1f-6d9b2e5c7a0d": "8",
      "8a1d4f67-9c3e-0687-fb2a-7e0c3f6d8b1e": "10",
      "9b2e5a78-0d4f-1798-ac3b-8f1d4a7e9c2f": "7",
      "0660b4b5-1bfd-4002-b2a4-9af2e17b1310": "10",
      "60982f47-c484-482a-872f-fa292d210d2d": "25",
      "aa4115f0-5dd3-49ab-90ad-969ac74ddf9c": "20",
      "c12b9382-b4a5-429e-ae48-bd5ee3a9e177": "15"
    };
    return optionMapping[optionId] || null;
  }
  
  res.json({
    submission_id,
    score,
    correctCount,
    xpEarned,
    results
  });
});

app.listen(port, () => {
  console.log(`Test auth server running at http://localhost:${port}`);
  console.log('Available endpoints:');
  console.log('  POST /api/auth/login');
  console.log('  GET /api/dashboard (requires Bearer token)');
  console.log('  GET /api/lessons (requires Bearer token) - New format');
  console.log('  GET /api/lessons/:lessonId (requires Bearer token) - Lesson detail with problems');
  console.log('  POST /api/lessons/:lessonId/submit (requires Bearer token) - Submit lesson answers');
});
