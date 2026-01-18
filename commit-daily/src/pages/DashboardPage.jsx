// src/pages/DashboardPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNavigation from '../components/layout/BottomNavigation';
import StreakCard from '../components/dashboard/StreakCard';
import GoalCompletionCard from '../components/dashboard/GoalCompletionCard';
import goalsService from '../services/goals.service';
import entriesService from '../services/entries.service';
import '../styles/dashboard.css';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentStreak, setCurrentStreak] = useState(0);
  const [goalsCompleted, setGoalsCompleted] = useState(0);
  const [totalGoals, setTotalGoals] = useState(0);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');

    try {
      // Fetch goals
      const goalsResponse = await goalsService.getGoals();
      const activeGoals = goalsResponse.data.filter(goal => goal.isActive);
      setTotalGoals(activeGoals.length);

      // Fetch today's entry to check completed goals
      const todayResponse = await entriesService.getTodayEntry();
      if (todayResponse.data.goalStatus) {
        const goalStatus = todayResponse.data.goalStatus;
        const completed = Object.entries(goalStatus).filter(([goalId, value]) => {
          const goal = activeGoals.find(g => g._id === goalId);
          if (!goal) return false;
          
          // For boolean goals, check if true
          if (goal.type === 'boolean') return value === true;
          
          // For numeric goals, check if met or exceeded target
          if (goal.type === 'numeric') return value >= goal.targetValue;
          
          return false;
        }).length;
        
        setGoalsCompleted(completed);
      } else {
        setGoalsCompleted(0);
      }

      // Fetch streaks
      const streaksResponse = await entriesService.getStreaks();
      const overallStreak = streaksResponse.data.find(
        streak => streak.goalId === 'overall'
      );
      setCurrentStreak(overallStreak?.currentStreak || 0);

    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateToday = () => {
    navigate('/commitment');
  };

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="error-container">
          <p>{error}</p>
          <button 
            className="error-retry-button"
            onClick={fetchDashboardData}
          >
            Retry
          </button>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {/* Header */}
      <div className="dashboard-header">
        <div className="dashboard-logo">
          <div className="dashboard-logo-icon">
            <div className="dashboard-logo-circles">
              <div className="dashboard-logo-circle"></div>
              <div className="dashboard-logo-circle small"></div>
              <div className="dashboard-logo-circle"></div>
            </div>
          </div>
          <span>Commit Daily</span>
        </div>
      </div>

      {/* Content */}
      <div className="dashboard-content">
        <h1 className="dashboard-title">
          Commit to yourself, daily.
        </h1>
        <p className="dashboard-subtitle">
          Small steps, consistent action, lasting change.
        </p>

        {/* Stats Cards */}
        <div className="stats-container">
          <StreakCard 
            currentStreak={currentStreak} 
            loading={loading}
          />
          <GoalCompletionCard
            completed={goalsCompleted}
            total={totalGoals}
            loading={loading}
          />
        </div>

        {/* Update Today Button */}
        <button 
          className="update-today-button"
          onClick={handleUpdateToday}
          disabled={loading}
        >
          UPDATE TODAY
        </button>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default DashboardPage;