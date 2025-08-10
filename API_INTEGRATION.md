# API Integration Guide

## Base Configuration
- **Base URL**: `http://localhost:3000/api`  
- **Authentication**: Bearer token (stored in localStorage as 'auth_token')

## Authentication Endpoints

### POST /api/auth/login
Authenticates user credentials and returns access token.

**Request Body:**
```json
{
    "email": "string",
    "password": "string"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "user": {
    "id": "string",
    "name": "string", 
    "email": "string"
  },
  "token": "string"
}
```

**Response (Error - 401):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

## Protected API Endpoints

The Math Learning App expects your backend API to be available at `http://localhost:3000/api` with the following protected endpoints (require `Authorization: Bearer <token>` header):

### 1. GetLessons (GET /api/lessons) - **UNIFIED PRIMARY ENDPOINT**
Returns lesson data with progress and scoring information. This endpoint serves both dashboard and lesson list functionality.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `user_id` (optional): User ID to fetch lessons for specific user

**Example Request:**
```
GET /api/lessons?user_id=123
```

**Usage:**
- **Dashboard Data**: Frontend calculates stats (available, completed, progress) from lesson data
- **Lesson List**: Frontend uses lesson data directly for lesson list component
- **User-Specific**: When user_id provided, returns user-specific progress and scores

**Response:**
```json
{
  "data": [
    {
      "lesson_id": "f2c4fa20-767d-4971-8c10-355e34e2f870",
      "lesson_name": "Basic Arithmetic",
      "lesson_category": "Maths",
      "score": 85,
      "lesson_exp_earned": 150,
      "completion_date": null,
      "progress": "In Progress"
    },
    {
      "lesson_id": "57098328-5f8c-410a-b5fe-72f14b62f84e",
      "lesson_name": "Multiplication Mastery", 
      "lesson_category": "Maths",
      "score": 95,
      "lesson_exp_earned": 200,
      "completion_date": "2025-08-05",
      "progress": "Completed"
    }
  ]
}
```

**Progress Values:**
- `"Not Started"` - Lesson not begun
- `"In Progress"` - Lesson partially completed
- `"Completed"` - Lesson finished

### 2. Dashboard Data (GET /api/dashboard) - **DEPRECATED/FALLBACK ONLY**
Legacy endpoint that returns combined stats and lessons data. 

**⚠️ Note**: This endpoint is only used as a fallback if the primary `/api/lessons` endpoint fails. Frontend now calculates dashboard stats from lesson data rather than requiring a separate dashboard endpoint.

**Response:**
```json
{
  "stats": {
    "lessonsAvailable": 5,
    "lessonsCompleted": 2,
    "overallProgress": 67
  },
  "lessons": [
    {
      "id": "1",
      "title": "Basic Addition",
      "description": "Learn to add single-digit numbers",
      "difficulty": "Beginner",
      "totalExercises": 10,
      "completedExercises": 7,
      "isUnlocked": true,
      "category": "Arithmetic"
    }
  ]
}
```

### 2. User Stats Only (GET /api/user/stats)
Returns only user statistics.

**Response:**
```json
{
  "lessonsAvailable": 5,
  "lessonsCompleted": 2,
  "overallProgress": 67
}
```

### 3. Lessons Only (GET /api/lessons)
Returns only the lessons array.

**Response:**
```json
[
  {
    "id": "1",
    "title": "Basic Addition",
    "description": "Learn to add single-digit numbers",
    "difficulty": "Beginner",
    "totalExercises": 10,
    "completedExercises": 7,
    "isUnlocked": true,
    "category": "Arithmetic"
  }
]
```

### 4. Update Lesson Progress (PUT /api/lessons/:id/progress)
Updates progress for a specific lesson.

**Request Body:**
```json
{
  "completedExercises": 8
}
```

**Response:** 204 No Content or success message

## Fallback Behavior

If the API is not available, the app will:
1. Show a loading spinner initially
2. Fall back to mock data after the API call fails
3. Display an info alert saying "API not available - using demo data"
4. Continue functioning with demo data

## Testing Without Backend

The app will work immediately with mock data if no backend is running. To test API integration:

1. Start your backend server on `localhost:3000`
2. Implement the above endpoints
3. The app will automatically switch from mock data to real API data

## CORS Configuration

Make sure your backend allows requests from `http://localhost:5174` (or your Vite dev server port):

```javascript
// Express.js example
app.use(cors({
  origin: 'http://localhost:5174'
}));
```
