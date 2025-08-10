# Math Learning App UI

A modern, engaging math learning application inspired by Duolingo. Built with React, TypeScript, Vite, and Material-UI, featuring interactive lessons, progress tracking, and a comprehensive authentication system.

## 🚀 Quick Start

### Prerequisites
- **Node.js** (version 16 or higher)
- **npm** or **yarn**

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/leeboonchung/math-learning-app-ui.git
   cd math-learning-app-ui
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the local development environment template
   cp .env.local.example .env
   ```
   
   The `.env` file should contain:
   ```env
   # For local development (recommended)
   VITE_API_BASE_URL=http://localhost:3000
   ```

4. **Start the local API server** (Required for development)
   ```bash
   # In a separate terminal window
   node test-auth-server.js
   ```
   
   This starts a mock API server on port 3000 with authentication and lesson endpoints.

5. **Start the development server**
   ```bash
   npm run dev
   ```
   
   The app will be available at `http://localhost:5173` (or next available port).

### 🔑 Demo Authentication

**Test Credentials:**
- **Email**: `demo_user@example.com`
- **Password**: `demo_user`

Alternatively, you can use the "Guest Login" option for immediate access.

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── LessonInterface.tsx    # Main lesson player
│   ├── LessonList.tsx         # Dashboard lesson grid
│   └── ...
├── contexts/            # React contexts
│   └── AuthContext.tsx        # Authentication state management
├── pages/              # Page components
│   ├── Dashboard.tsx          # Main dashboard
│   ├── Login.tsx             # Authentication page
│   └── LessonPage.tsx        # Individual lesson view
├── services/           # API services
│   └── apiService.ts         # Centralized API calls
└── App.tsx            # Main application component
```

## ✨ Features

### 🔐 Authentication System
- **JWT Token Management**: Secure login/logout with token persistence
- **Guest Access**: Quick access without registration
- **Demo Account**: Pre-configured test credentials for evaluation

### 📊 Dashboard & Progress Tracking
- **Real-time Stats**: Lessons completed, overall progress, XP earned
- **Lesson Grid**: Visual lesson cards with progress indicators
- **API Integration**: Dynamic data loading with fallback support

### 🎓 Interactive Lesson Interface
- **Multiple Choice Questions**: Clean, touch-friendly interface
- **Batch Submission**: Review all answers before submitting
- **Progress Tracking**: Visual completion indicators
- **Scoring System**: Detailed scoring with XP rewards
- **User Identification**: Personalized submission tracking

### 🎨 Modern UI/UX
- **Material-UI Components**: Professional, accessible design
- **Responsive Layout**: Optimized for mobile (390px+) and desktop
- **Alphabet Labeling**: A-D answer options for clarity
- **Full-screen Optimization**: Maximized screen real estate usage

### 🔧 Technical Features
- **TypeScript**: Full type safety and IntelliSense support
- **Vite**: Fast development and optimized builds
- **Environment Configuration**: Easy switching between dev/production
- **CORS Handling**: Proper local development setup
- **Error Handling**: Comprehensive error boundaries and fallbacks

## 🛠️ Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🌐 API Integration

The application integrates with a backend API system:

### Local Development
- **Base URL**: `http://localhost:3000/api`
- **Test Server**: Included mock API server (`test-auth-server.js`)
- **No CORS Issues**: Configured for seamless localhost development

### Production
- **Base URL**: `https://math-learning-app-api.vercel.app/api`
- **Environment Variables**: Configured via `.env` file

### Available Endpoints
- `POST /api/auth/login` - User authentication
- `GET /api/lessons` - Lesson list with progress data
- `GET /api/lessons/:id` - Individual lesson details with problems
- `POST /api/lessons/:id/submit` - Submit lesson answers for scoring

## 🎯 Lesson System

### Available Lesson Types
- **Basic Arithmetic** - Addition and subtraction fundamentals
- **Multiplication Mastery** - Times tables and multiplication concepts
- **Division Basics** - Introduction to division operations
- **Mixed Practice** - Combined operations for comprehensive learning

### Lesson Features
- **Problem Sequencing**: Ordered questions with increasing complexity
- **Answer Options**: Multiple choice with alphabet labeling (A-D)
- **Submission System**: UUID-tracked submissions with user identification
- **Scoring Algorithm**: Performance-based scoring with detailed feedback
- **XP Rewards**: Experience points based on accuracy and completion

## 📱 Usage Instructions

### Getting Started
1. **Login** using demo credentials or guest access
2. **Navigate** to the dashboard to see available lessons
3. **Select** a lesson card to start learning
4. **Answer** questions using the multiple choice interface
5. **Review** your answers before final submission
6. **View** results and earned XP points

### Navigation
- **Dashboard**: Main hub with lesson overview and progress stats
- **Lesson Interface**: Full-screen lesson player with problem navigation
- **Profile Menu**: Access to logout and user information
- **Back Navigation**: Return to dashboard from any lesson

### Backend API Integration

The app integrates with a backend API configured via environment variables (default: production API at `https://math-learning-app-ui.vercel.app/api`) and now supports the new **GetLessons endpoint**:

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

## 🚀 Deployment

### Environment Configuration

**For Production Deployment:**
1. Set the environment variable in your deployment platform:
   ```env
   VITE_API_BASE_URL=https://math-learning-app-api.vercel.app
   ```

2. Build the application:
   ```bash
   npm run build
   ```

3. Deploy the `dist` folder to your hosting platform.

### Vercel Deployment
The project is configured for easy Vercel deployment:
1. Connect your GitHub repository to Vercel
2. Set the environment variable `VITE_API_BASE_URL` in Vercel dashboard
3. Deploy automatically on each push to main branch

## 🔧 Troubleshooting

### CORS Issues
**Problem:** Getting CORS errors when trying to connect to the API:
```
Access to fetch at 'https://...' from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Solution:**
1. **For Local Development**: Always use the local test server:
   ```bash
   # Make sure .env contains:
   VITE_API_BASE_URL=http://localhost:3000
   
   # Start the local API server:
   node test-auth-server.js
   ```

2. **Why this happens**: Production APIs don't allow localhost origins for security reasons.

### Environment Variables Not Loading
**Problem:** API calls failing or going to wrong endpoint.

**Solution:**
1. Ensure `.env` file exists in project root
2. Restart the development server after changing `.env`:
   ```bash
   # Stop the server (Ctrl+C) then restart:
   npm run dev
   ```
3. Verify environment variables are prefixed with `VITE_`

### Port Conflicts
**Problem:** Development server can't start due to port conflicts.

**Solution:**
- Vite automatically finds the next available port (5173, 5174, 5175, etc.)
- For the API server, ensure port 3000 is available or modify `test-auth-server.js`

### Authentication Issues
**Problem:** Login not working or getting authentication errors.

**Solution:**
1. Verify the local API server is running on port 3000
2. Check browser console for specific error messages
3. Use the demo credentials: `demo_user@example.com` / `demo_user`
4. Try the guest login option for immediate access

## 📄 Additional Documentation

- **API Integration**: See `API_INTEGRATION.md` for detailed endpoint specifications
- **Test Server**: The `test-auth-server.js` provides a complete mock backend
- **Environment Files**: Multiple environment templates available for different scenarios

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Live Demo**: [https://math-learning-app-ui.vercel.app](https://math-learning-app-ui.vercel.app)
**Repository**: [https://github.com/leeboonchung/math-learning-app-ui](https://github.com/leeboonchung/math-learning-app-ui)
