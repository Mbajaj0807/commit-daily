// src/components/dashboard/StreakCard.jsx

import React from 'react';
import '../../styles/dashboard.css';

const StreakCard = ({ currentStreak = 0, loading = false }) => {
  return (
    <div className="streak-card">
      <div className="streak-info">
        <div className="streak-label">Current Streak</div>
        <div className="streak-value">
          {loading ? '...' : currentStreak}
          <span className="streak-unit">Days</span>
        </div>
      </div>
      <div className="streak-icon">🔥</div>
    </div>
  );
};

export default StreakCard;