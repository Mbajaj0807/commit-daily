// src/components/goalsinsights/GoalsInsightsComponents.jsx

import React from "react";

/* ======================================
   Completion Ring (like Budget Ring)
====================================== */
export const CompletionRing = ({ completionRate, totalGoals, activeGoals }) => {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (completionRate / 100) * circumference;

  const getColor = () => {
    if (completionRate >= 80) return "#34C759";
    if (completionRate >= 50) return "#FFB020";
    return "#FF3B30";
  };

  return (
    <div className="mi-card">
      <div className="mi-title">Overall Performance</div>
      
      <div className="budget-ring-wrapper">
        <svg width="180" height="180" viewBox="0 0 180 180">
          {/* Background circle */}
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="transparent"
            stroke="#F0F0F0"
            strokeWidth="16"
          />
          {/* Progress circle */}
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="transparent"
            stroke={getColor()}
            strokeWidth="16"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 90 90)"
            style={{ transition: "stroke-dashoffset 0.5s ease" }}
          />
        </svg>

        <div className="budget-ring-center">
          <div className="budget-ring-percent" style={{ color: getColor() }}>
            {completionRate}%
          </div>
          <div className="budget-ring-label">Completion</div>
        </div>
      </div>

      <div className="budget-ring-stats">
        <div className="budget-ring-stat">
          <span className="budget-stat-label">Total Goals</span>
          <span className="budget-stat-value">{totalGoals}</span>
        </div>
        <div className="budget-ring-stat">
          <span className="budget-stat-label">Active Goals</span>
          <span className="budget-stat-value">{activeGoals}</span>
        </div>
      </div>
    </div>
  );
};

/* ======================================
   Performance Alert
====================================== */
export const PerformanceAlert = ({ insight }) => {
  const getSeverityClass = () => {
    if (insight.severity === "negative") return "budget-alert-danger";
    if (insight.severity === "warning") return "budget-alert-warning";
    return "budget-alert-success";
  };

  const getIcon = () => {
    if (insight.severity === "negative") return "🚨";
    if (insight.severity === "warning") return "⚠️";
    return "✅";
  };

  return (
    <div className={`budget-alert ${getSeverityClass()}`}>
      <div className="budget-alert-icon">{getIcon()}</div>
      <div className="budget-alert-content">
        <div className="budget-alert-title">{insight.title}</div>
        <div className="budget-alert-context">{insight.context}</div>
      </div>
    </div>
  );
};

/* ======================================
   Goal Stats Grid
====================================== */
export const GoalStatsGrid = ({ stats }) => {
  return (
    <div className="mi-stats-grid">
      {stats.map((stat) => (
        <div key={stat.id} className="mi-card">
          <div className="mi-title">{stat.title}</div>
          <div className="mi-value">{stat.value}</div>
          {stat.context && <div className="mi-context">{stat.context}</div>}
        </div>
      ))}
    </div>
  );
};

/* ======================================
   Best & Worst Habits
====================================== */
export const HabitHighlights = ({ best, worst }) => {
  return (
    <div className="habit-highlights-grid">
      {best && (
        <div className="mi-card habit-card-best">
          <div className="habit-emoji">💎</div>
          <div className="habit-label">Best Habit</div>
          <div className="habit-name">{best.value}</div>
          <div className="habit-streak">{best.context}</div>
        </div>
      )}
      
      {worst && (
        <div className="mi-card habit-card-worst">
          <div className="habit-emoji">🚨</div>
          <div className="habit-label">Needs Work</div>
          <div className="habit-name">{worst.value}</div>
          <div className="habit-streak">{worst.context}</div>
        </div>
      )}
    </div>
  );
};

/* ======================================
   7-Day Completion Bar Chart
====================================== */
export const CompletionBarChart = ({ data, title }) => {
  const maxValue = Math.max(...data.map(d => d.completion || d.count), 1);

  return (
    <div className="mi-card">
      <div className="mi-title">{title}</div>
      
      <div className="bar-chart">
        {data.map((d, i) => {
          const date = new Date(d.date);
          const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
          const value = d.completion || d.count;
          const height = (value / maxValue) * 100;
          
          return (
            <div key={i} className="bar-col">
              <div
                className="bar goals-bar"
                style={{ height: `${height}%` }}
              />
              <span className="bar-label">{dayName}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ======================================
   Goal Performance List
====================================== */
export const GoalPerformanceList = ({ goals }) => {
  const getColorClass = (rate) => {
    if (rate >= 80) return "goal-perf-high";
    if (rate >= 50) return "goal-perf-medium";
    return "goal-perf-low";
  };

  return (
    <div className="mi-card">
      <div className="mi-title">Goal Performance</div>
      
      <div className="goal-performance-list">
        {goals.map((goal) => (
          <div key={goal.goalId} className="goal-perf-item">
            <div className="goal-perf-header">
              <span className="goal-perf-name">{goal.goalName}</span>
              <span className={`goal-perf-badge ${getColorClass(goal.completionRate)}`}>
                {goal.completionRate}%
              </span>
            </div>
            
            <div className="goal-perf-stats">
              <span>{goal.completed}/{goal.attempts} completed</span>
              {goal.currentStreak > 0 && (
                <span className="goal-perf-streak">🔥 {goal.currentStreak} days</span>
              )}
            </div>
            
            <div className="goal-perf-bar">
              <div
                className={`goal-perf-fill ${getColorClass(goal.completionRate)}`}
                style={{ width: `${goal.completionRate}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ======================================
   Individual Goal Progress (Mini Bars)
====================================== */
export const IndividualGoalProgress = ({ goalProgress }) => {
  return (
    <div className="mi-card">
      <div className="mi-title">{goalProgress.goalName}</div>
      <div className="goal-week-label">{goalProgress.weeklyCompletion}% this week</div>
      
      <div className="goal-mini-bars">
        {goalProgress.progressData.map((d, i) => {
          const date = new Date(d.date);
          const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
          
          return (
            <div key={i} className="goal-mini-col">
              <div
                className={`goal-mini-bar ${d.completed ? 'completed' : 'incomplete'}`}
              />
              <span className="goal-mini-label">{dayName}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};