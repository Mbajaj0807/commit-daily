// src/components/commitment/GoalChecklist.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import GoalChecklistItem from './GoalChecklistItem';
import '../../styles/commitment.css';

const GoalChecklist = ({ goals, goalStatus, onChange }) => {
  const navigate = useNavigate();

  if (!goals || goals.length === 0) {
    return (
      <div className="empty-goals-state">
        <div className="empty-goals-icon">🎯</div>
        <div className="empty-goals-text">
          No active goals yet. Add some goals to get started!
        </div>
        <button 
          className="empty-goals-button"
          onClick={() => navigate('/goals')}
        >
          Add Goals
        </button>
      </div>
    );
  }

  // Filter only active goals
  const activeGoals = goals.filter(goal => goal.isActive);

  return (
    <div className="goals-checklist">
      {activeGoals.map((goal) => (
        <GoalChecklistItem
          key={goal._id}
          goal={goal}
          value={goalStatus[goal._id]}
          onChange={onChange}
        />
      ))}
    </div>
  );
};

export default GoalChecklist;