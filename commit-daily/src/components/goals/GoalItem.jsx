// src/components/goals/GoalItem.jsx

import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import Toggle from '../common/Toggle';
import '../../styles/goals.css';
import  goalsService  from '../../services/goals.service';

const GoalItem = ({ goal, onToggle, onEdit, onRemove }) => {
  const handleToggle = () => {
    onToggle(goal._id, !goal.isActive);
  };
  const handleDeleteGoal = async (goalId) => {
    if (!window.confirm('Are you sure you want to delete this goal?')) {
      return;
    }
    try {
      await goalsService.removeGoal(goalId);
    } catch (err) {
      console.error('Error deleting goal:', err);

    }
  };

  const getGoalMeta = () => {
    if (goal.type === 'boolean') {
      return `${goal.category || 'General'} • Boolean`;
    } else {
      return `${goal.category || 'General'} • Target: ${goal.targetValue} ${goal.unit}`;
    }
  };

  return (
    <div className="goal-card">
      <div className="goal-card-header">
        <div className="goal-card-main">
          <span className="goal-card-icon">{goal.icon || '🎯'}</span>
          <div className="goal-card-info">
            <div className="goal-card-name">{goal.name}</div>
            <div className="goal-card-meta">{getGoalMeta()}</div>
          </div>
        </div>
        <Toggle checked={goal.isActive} onChange={handleToggle} />
      </div>

      <div className="goal-card-actions">
        <button
          className="goal-action-button edit"
          onClick={() => onEdit(goal)}
        >
          <Edit2 size={16} />
          Edit
        </button>
        <button
          className="goal-action-button remove"
          onClick={() => handleDeleteGoal(goal._id)}
        >
          <Trash2 size={16} />
          Remove
        </button>
      </div>
    </div>
  );
};

export default GoalItem;