// src/components/dashboard/GoalCompletionCard.jsx

import React from 'react';
import '../../styles/dashboard.css';

const GoalCompletionCard = ({ completed = 0, total = 0, loading = false }) => {
  return (
    <div className="goal-completion-card">
      <div className="goal-completion-info">
        <div className="goal-completion-label">Goals Completed Today</div>
        <div className="goal-completion-value">
          {loading ? '...' : (
            <span className="goal-completion-fraction">
              {completed}/{total}
            </span>
          )}
        </div>
      </div>
      <div className="goal-completion-icon">🎯</div>
    </div>
  );
};

export default GoalCompletionCard;