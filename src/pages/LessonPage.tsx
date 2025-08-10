import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LessonInterface from '../components/LessonInterface';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/apiService';

const LessonPage: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLessonComplete = async (score: number, xpEarned: number) => {
    console.log(`Lesson completed with score: ${score}%, XP earned: ${xpEarned}`);
    
    // Update lesson progress via API
    try {
      if (lessonId) {
        // Calculate completed exercises based on score
        const completedExercises = Math.floor((score / 100) * 10); // Assuming 10 exercises per lesson
        await apiService.updateLessonProgress(lessonId, completedExercises);
      }
    } catch (error) {
      console.warn('Failed to update lesson progress:', error);
    }

    // Navigate back to dashboard after a delay
    setTimeout(() => {
      navigate('/dashboard');
    }, 3000);
  };

  const handleExitLesson = () => {
    navigate('/dashboard');
  };

  if (!lessonId) {
    return (
      <div>
        <h2>Lesson not found</h2>
        <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
      </div>
    );
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <LessonInterface
      lessonId={lessonId}
      onComplete={handleLessonComplete}
      onExit={handleExitLesson}
    />
  );
};

export default LessonPage;
