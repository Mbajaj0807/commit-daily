// src/pages/DashboardPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Check, X } from 'lucide-react';
import BottomNavigation from '../components/layout/BottomNavigation';
import goalsService from '../services/goals.service';
import entriesService from '../services/entries.service';
import quotesService from '../services/quotes.service';
import financeService from '../services/finance.service';

import '../styles/dashboard.css';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentStreak, setCurrentStreak] = useState(0);
  const [todaySpend, setTodaySpend] = useState(0);
  const [goalsCompleted, setGoalsCompleted] = useState(0);
  const [totalGoals, setTotalGoals] = useState(0);
  const [goalsStatus, setGoalsStatus] = useState([]);
  const [quote, setQuote] = useState('');
  const [quoteLoading, setQuoteLoading] = useState(true);

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
      const goalStatusData = todayResponse.data.goalStatus || {};

      // Calculate completion and prepare status array
      let completed = 0;
      const statusArray = activeGoals.map(goal => {
        const value = goalStatusData[goal._id];
        let isCompleted = false;
        let statusText = '';
        let statusType = 'incomplete';

        if (goal.type === 'boolean') {
          isCompleted = value === true;
          statusText = isCompleted ? 'Done' : 'Not Done';
          statusType = isCompleted ? 'completed' : 'incomplete';
        } else if (goal.type === 'numeric') {
          const currentValue = value || 0;
          isCompleted = currentValue >= goal.targetValue;
          statusText = `${currentValue} / ${goal.targetValue} ${goal.unit}`;
          
          if (isCompleted) {
            statusType = 'completed';
          } else if (currentValue > 0) {
            statusType = 'partial';
          } else {
            statusType = 'incomplete';
          }
        }

        if (isCompleted) completed++;

        return {
          ...goal,
          currentValue: value,
          isCompleted,
          statusText,
          statusType,
        };
      });

      setGoalsCompleted(completed);
      setGoalsStatus(statusArray);

      // Fetch streaks
      const streaksResponse = await entriesService.getStreaks();
      const overallStreak = streaksResponse.data.find(
        streak => streak.goalId === 'overall'
      );
      setCurrentStreak(overallStreak?.currentStreak || 0);

      // Fetch today's spend
      const financeResponse = await financeService.getTodaySpend();
      console.log("SPENT:", financeResponse.data.data.totalSpent)
      setTodaySpend(financeResponse.data.data.totalSpent || 0);

      // Fetch today's quote
      fetchQuote();

    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchQuote = async () => {
    setQuoteLoading(true);
    try {
      const quoteResponse = await quotesService.getTodayQuote();
      setQuote(quoteResponse.quote || '');
    } catch (err) {
      console.error('Failed to fetch quote:', err);
      setQuote('');
    } finally {
      setQuoteLoading(false);
    }
  };

  const handleUpdateToday = () => {
    navigate('/commitment');
  };

  const handleAddGoals = () => {
    navigate('/goals');
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
        
        {/* Update Today Button - Top Right */}
        <div className="dashboard-header-actions">
  {/* Streak Pill */}
  {!loading && currentStreak > 0 && (
    <div className="streak-pill">
      🔥 {currentStreak}
    </div>
  )}

  {/* Update Today Button */}
  <button
    className="update-today-header-button"
    onClick={handleUpdateToday}
    disabled={loading}
  >
    <Plus size={20} color="#FFFFFF" strokeWidth={3} />
  </button>
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

        {/* AI Quote Section */}
        {quote && (
          <div className="quote-section">
            {/* <div className="quote-icon">💡</div> */}
            {quoteLoading ? (
              <div className="quote-loading">Loading your daily motivation...</div>
            ) : (
              <div className="quote-text">"{quote}"</div>
            )}
          </div>
        )}

        {/* Stats Grid - Side by Side Squares */}
        <div className="stats-grid">
  {/* Streak
  <div className="stat-card">
    <div className="stat-icon">🔥</div>
    <div className="stat-value">
      {loading ? '...' : currentStreak}
      <span className="stat-unit">Days</span>
    </div>
    <div className="stat-label">Current Streak</div>
  </div> */}

  {/* Goals */}
  <div className="stat-card">
    <div className="stat-icon">🎯</div>
    <div className="stat-value">
      {loading ? '...' : `${goalsCompleted}/${totalGoals}`}
    </div>
    <div className="stat-label">Goals Today</div>
  </div>

  {/* Finance */}
  <div className="stat-card">
    <div className="stat-icon">💰</div>
    <div className="stat-value">
      {loading ? '...' : `₹${todaySpend}`}
    </div>
    <div className="stat-label">Spent Today</div>
  </div>
</div>


        {/* Today's Goals Status */}
        <div className="goals-status-section">
          <div className="section-header">
            <h2 className="section-title">Today's Goals</h2>
          </div>

          {loading ? (
            <div className="loading-container">Loading goals...</div>
          ) : goalsStatus.length === 0 ? (
            <div className="empty-goals-dashboard">
              <div className="empty-goals-dashboard-icon">🎯</div>
              <div className="empty-goals-dashboard-text">
                No goals yet. Add some goals to start tracking!
              </div>
              <button 
                className="empty-goals-dashboard-button"
                onClick={handleAddGoals}
              >
                <Plus size={18} />
                Add Goals
              </button>
            </div>
          ) : (
            <div className="goals-list">
              {goalsStatus.map((goal) => (
                <div 
                  key={goal._id} 
                  className={`goal-status-card ${goal.statusType}`}
                >
                  <span className="goal-status-icon">{goal.icon || '🎯'}</span>
                  <div className="goal-status-info">
                    <div className="goal-status-name">{goal.name}</div>
                    <div className="goal-status-meta">{goal.category}</div>
                  </div>
                  <div className={`goal-status-badge ${goal.statusType}`}>
                    {goal.statusType === 'completed' && <Check size={14} />}
                    {goal.statusType === 'incomplete' && <X size={14} />}
                    {goal.statusText}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default DashboardPage;