// API base configuration
const API_BASE_URL = 'http://localhost:3000/api';

// Types for API responses
export interface DashboardStats {
  lessonsAvailable: number;
  lessonsCompleted: number;
  overallProgress: number;
}

// New lesson structure from GetLessons endpoint
export interface LessonFromAPI {
  lesson_id: string;
  lesson_name: string;
  lesson_category: string;
  score: number;
  lesson_exp_earned: number;
  completion_date: string | null;
  progress: 'Not Started' | 'In Progress' | 'Completed';
}

// Response structure from GetLessons endpoint
export interface LessonsResponse {
  data: LessonFromAPI[];
}

// New types for lesson detail endpoint
export interface ProblemOption {
  problem_option_id: string;
  problem_id: string;
  option: string;
}

export interface ProblemFromAPI {
  problem_id: string;
  question: string;
  reward_xp: string;
  order: number;
  options: ProblemOption[];
}

export interface LessonDetailResponse {
  data: {
    lesson_id: string;
    lesson_name: string;
    problems: ProblemFromAPI[];
    is_completed: boolean;
    best_score: number;
    attempts_count: number;
    last_attempted_at: string | null;
    completed_at: string | null;
  };
}

// Transformed types for UI
export interface LessonProblem {
  id: string;
  question: string;
  rewardXp: number;
  order: number;
  options: {
    id: string;
    text: string;
  }[];
}

export interface LessonDetail {
  id: string;
  name: string;
  problems: LessonProblem[];
  isCompleted: boolean;
  bestScore: number;
  attemptsCount: number;
  lastAttemptedAt: string | null;
  completedAt: string | null;
}

// Transformed lesson structure for UI components
export interface Lesson {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  totalExercises: number;
  completedExercises: number;
  isUnlocked: boolean;
  category: string;
  score: number;
  expEarned: number;
  completionDate: string | null;
  progress: 'Not Started' | 'In Progress' | 'Completed';
}

export interface DashboardData {
  stats: DashboardStats;
  lessons: Lesson[];
}

// API service class
class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('auth_token');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  private async fetchData<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          ...this.getAuthHeaders(),
          ...options.headers,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API fetch error:', error);
      throw error;
    }
  }

  // Transform API lesson data to UI format
  private transformLessonData(apiLesson: LessonFromAPI): Lesson {
    // Map progress to completion status
    const getCompletionInfo = (progress: string) => {
      switch (progress) {
        case 'Completed':
          return { completedExercises: 10, totalExercises: 10, isUnlocked: true };
        case 'In Progress':
          return { completedExercises: 5, totalExercises: 10, isUnlocked: true };
        default: // 'Not Started'
          return { completedExercises: 0, totalExercises: 10, isUnlocked: true };
      }
    };

    // Map category to difficulty (simple mapping, can be enhanced)
    const getDifficulty = (category: string): 'Beginner' | 'Intermediate' | 'Advanced' => {
      if (category.toLowerCase().includes('basic') || category.toLowerCase().includes('arithmetic')) {
        return 'Beginner';
      } else if (category.toLowerCase().includes('advanced') || category.toLowerCase().includes('fraction')) {
        return 'Advanced';
      }
      return 'Intermediate';
    };

    const completionInfo = getCompletionInfo(apiLesson.progress);
    
    return {
      id: apiLesson.lesson_id,
      title: apiLesson.lesson_name,
      description: `Learn ${apiLesson.lesson_name.toLowerCase()}`,
      difficulty: getDifficulty(apiLesson.lesson_name),
      category: apiLesson.lesson_category,
      score: apiLesson.score,
      expEarned: apiLesson.lesson_exp_earned,
      completionDate: apiLesson.completion_date,
      progress: apiLesson.progress,
      ...completionInfo
    };
  }

  // Get current user ID from localStorage
  private getCurrentUserId(): string | null {
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
  }

  // Get dashboard data (stats + lessons) - unified endpoint
  async getDashboardData(): Promise<DashboardData> {
    try {
      const userId = this.getCurrentUserId();
      
      // Use the same endpoint as getLessons with user_id parameter
      const endpoint = userId ? `/lessons?user_id=${userId}` : '/lessons';
      console.log(userId ? `Fetching dashboard data for user_id: ${userId}` : 'Fetching dashboard data for all users');
      
      const lessonsResponse = await this.fetchData<LessonsResponse>(endpoint);
      const transformedLessons = lessonsResponse.data.map(lesson => this.transformLessonData(lesson));
      
      // Calculate stats from lessons data
      const lessonsAvailable = transformedLessons.length;
      const lessonsCompleted = transformedLessons.filter(lesson => lesson.progress === 'Completed').length;
      const overallProgress = lessonsAvailable > 0 ? Math.round((lessonsCompleted / lessonsAvailable) * 100) : 0;

      const stats: DashboardStats = {
        lessonsAvailable,
        lessonsCompleted,
        overallProgress
      };

      return {
        stats,
        lessons: transformedLessons
      };
    } catch (error) {
      console.error('Failed to fetch dashboard data with user ID, trying fallback:', error);
      // Fallback to old dashboard endpoint if new structure fails
      try {
        return this.fetchData<DashboardData>('/dashboard');
      } catch (fallbackError) {
        console.error('Dashboard fallback also failed:', fallbackError);
        throw fallbackError;
      }
    }
  }

  // Get lessons only - now just calls getDashboardData and returns lessons
  async getLessons(): Promise<Lesson[]> {
    try {
      const dashboardData = await this.getDashboardData();
      return dashboardData.lessons;
    } catch (error) {
      console.error('Failed to fetch lessons:', error);
      throw error;
    }
  }

  // Get user stats only - calculated from lesson data
  async getUserStats(): Promise<DashboardStats> {
    try {
      const dashboardData = await this.getDashboardData();
      return dashboardData.stats;
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
      // Fallback to separate stats endpoint if available
      return this.fetchData<DashboardStats>('/user/stats');
    }
  }

  // Get lesson details with problems and options
  async getLessonDetail(lessonId: string): Promise<LessonDetail> {
    try {
      const response = await this.fetchData<LessonDetailResponse>(`/lessons/${lessonId}`);
      return this.transformLessonDetail(response.data);
    } catch (error) {
      console.error('Failed to fetch lesson detail:', error);
      throw error;
    }
  }

  // Transform lesson detail data
  private transformLessonDetail(apiData: LessonDetailResponse['data']): LessonDetail {
    const problems: LessonProblem[] = apiData.problems
      .sort((a, b) => a.order - b.order)
      .map(problem => ({
        id: problem.problem_id,
        question: problem.question,
        rewardXp: parseInt(problem.reward_xp, 10),
        order: problem.order,
        options: problem.options.map(option => ({
          id: option.problem_option_id,
          text: option.option
        }))
      }));

    return {
      id: apiData.lesson_id,
      name: apiData.lesson_name,
      problems,
      isCompleted: apiData.is_completed,
      bestScore: apiData.best_score,
      attemptsCount: apiData.attempts_count,
      lastAttemptedAt: apiData.last_attempted_at,
      completedAt: apiData.completed_at
    };
  }

  // Update lesson progress
  async updateLessonProgress(lessonId: string, completedExercises: number): Promise<void> {
    try {
      await this.fetchData(`/lessons/${lessonId}/progress`, {
        method: 'PUT',
        body: JSON.stringify({ completedExercises }),
      });
    } catch (error) {
      console.error('API update error:', error);
      throw error;
    }
  }

  // Submit lesson answers for scoring
  async submitLessonAnswers(submissionId: string,submissionData: {
    user_id: string | null;
    lesson_id: string;
    answers: Array<{
      problem_id: string;
      selected_option_id: string | null;
    }>;
  }): Promise<{
    submission_id: string;
    score: number;
    correctCount: number;
    xpEarned: number;
    results: Array<{
      problem_id: string;
      is_correct: boolean;
      correct_answer: string;
      selected_answer: string;
    }>;
  }> {
    try {
      const response = await this.fetchData<{
        submission_id: string;
        score: number;
        correctCount: number;
        xpEarned: number;
        results: Array<{
          problem_id: string;
          is_correct: boolean;
          correct_answer: string;
          selected_answer: string;
        }>;
      }>(`/lessons/${submissionId}/submit`, {
        method: 'POST',
        body: JSON.stringify(submissionData),
      });
      return response;
    } catch (error) {
      console.error('API submission error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Mock data fallback for development
export const mockDashboardData: DashboardData = {
  stats: {
    lessonsAvailable: 5,
    lessonsCompleted: 2,
    overallProgress: 67
  },
  lessons: [
    {
      id: '1',
      title: 'Basic Addition',
      description: 'Learn to add single-digit numbers',
      difficulty: 'Beginner',
      totalExercises: 10,
      completedExercises: 7,
      isUnlocked: true,
      category: 'Arithmetic',
      score: 85,
      expEarned: 150,
      completionDate: null,
      progress: 'In Progress'
    },
    {
      id: '2',
      title: 'Basic Subtraction',
      description: 'Master subtraction with small numbers',
      difficulty: 'Beginner',
      totalExercises: 10,
      completedExercises: 10,
      isUnlocked: true,
      category: 'Arithmetic',
      score: 95,
      expEarned: 200,
      completionDate: '2025-08-05',
      progress: 'Completed'
    },
    {
      id: '3',
      title: 'Multiplication Tables',
      description: 'Memorize multiplication tables 1-12',
      difficulty: 'Intermediate',
      totalExercises: 15,
      completedExercises: 3,
      isUnlocked: true,
      category: 'Arithmetic',
      score: 72,
      expEarned: 90,
      completionDate: null,
      progress: 'In Progress'
    },
    {
      id: '4',
      title: 'Division Basics',
      description: 'Introduction to division concepts',
      difficulty: 'Intermediate',
      totalExercises: 12,
      completedExercises: 0,
      isUnlocked: false,
      category: 'Arithmetic',
      score: 0,
      expEarned: 0,
      completionDate: null,
      progress: 'Not Started'
    },
    {
      id: '5',
      title: 'Fractions',
      description: 'Understanding parts of a whole',
      difficulty: 'Advanced',
      totalExercises: 20,
      completedExercises: 0,
      isUnlocked: false,
      category: 'Numbers',
      score: 0,
      expEarned: 0,
      completionDate: null,
      progress: 'Not Started'
    }
  ]
};
