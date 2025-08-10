# Math Learning App (Duolingo Style)

A modern, engaging math learning app inspired by Duolingo. Built with React, TypeScript, Vite, and Material-UI.

## Features
- **Authentication System**: Real login/logout with JWT token management
- **Dashboard with Progress Tracking**: User stats and lesson progress loaded from API
- **Interactive Lesson Interface**: Full-featured lesson player with math problems
- **Dynamic Problem Generation**: Algorithmic math problem creation with multiple difficulty levels
- **Real-time Feedback**: Instant answer validation with hints and explanations
- **Progress Tracking**: Score calculation, XP earning, and completion tracking
- **Responsive Design**: Optimized for mobile (390px+) and full-screen desktop
- **Modern UI**: Material-UI components with custom theming and animations
- **API Integration**: RESTful backend integration with fallback to mock data

## Getting Started

### Install dependencies
```
npm install
```

### Start the development server
```
npm run dev
```

The app will be available at `http://localhost:5173` (or next available port).

### Authentication Testing

**Demo Credentials:**
- Email: `demo_user@example.com`
- Password: `demo_user`

### Lesson Interface Features

The app now includes a comprehensive lesson interface accessible via:
- **Direct URL**: `/lesson/{lessonId}` (e.g., `/lesson/basic-arithmetic`)
- **Dashboard Button**: "Try Demo Lesson" for quick access
- **Lesson Cards**: Click any unlocked lesson from the dashboard

**Available Lesson Types:**
- `basic-arithmetic` - Addition and subtraction practice
- `multiplication-mastery` - Multiplication tables 1-12
- `division-basics` - Introduction to division
- `mixed-practice` - Combined operations practice

**Lesson Features:**
- 🎯 **Interactive Problems**: Type answers with real-time validation
- 📊 **Progress Tracking**: Visual progress bar and completion percentage
- 💡 **Smart Hints**: Context-aware hints for each problem type
- ⏱️ **Timer & Scoring**: Track time spent and calculate final scores
- 🏆 **XP System**: Earn experience points based on performance
- 📱 **Mobile Optimized**: Touch-friendly interface for mobile devices

### Backend API Integration

The app integrates with a backend API at `http://localhost:3000/api` and now supports the new **GetLessons endpoint**:

**Primary Data Source:**
- `GET /api/lessons` - Returns lesson data with scores, experience points, and progress tracking

**Endpoint Response Format:**
```json
{
  "data": [
    {
      "lesson_id": "uuid",
      "lesson_name": "Lesson Title",
      "lesson_category": "Maths", 
      "score": 85,
      "lesson_exp_earned": 150,
      "completion_date": "2025-08-05" | null,
      "progress": "Not Started" | "In Progress" | "Completed"
    }
  ]
}
```

See [API_INTEGRATION.md](./API_INTEGRATION.md) for detailed endpoint specifications.

#### Quick API Testing
To test the full authentication flow, start the included test server:

```bash
# In a separate terminal
node test-auth-server.js
```

This starts a test API server on port 3000 with:
- POST `/api/auth/login` - Authentication endpoint
- GET `/api/dashboard` - Protected dashboard data (requires Bearer token)
- **GET `/api/lessons`** - **New lessons endpoint with score/progress data** (requires Bearer token)
To test with a mock backend server:

1. Install dependencies for mock server:
```bash
npm install express cors
```

2. Start the mock API server:
```bash
node mock-server.js
```

3. The app will automatically load data from the API instead of using mock data.

### Folder Structure
- `src/components` – Reusable UI components
- `src/pages` – App pages (Dashboard, Login, Exercises, etc.)
- `src/services` – API service and mock data
- `src/styles` – Custom styles and theme

## API Integration

The dashboard loads real-time data from your backend API:
- **Dashboard stats** (lessons available, completed, progress)
- **Lesson data** (title, description, progress, unlock status)
- **Progress updates** when users complete exercises

If the API is unavailable, the app gracefully falls back to demo data.

## To Do
- Implement authentication
- Add more exercise types
- Connect to backend (optional)

---

This project was bootstrapped with [Vite](https://vitejs.dev/) and uses [React](https://react.dev/) and [TypeScript](https://www.typescriptlang.org/).

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
