import React, { useState } from 'react';
import Toggle from '../common/Toggle';
import IconButton from '../common/IconButton';
import '../../styles/goals.css';

const GoalItem = ({ goal, onToggle, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleToggle = () => {
    onToggle(goal._id, goal.isActive);
  };

  const handleDelete = () => {
    onDelete(goal._id);
  };

  const formatGoalDetails = () => {
    if (goal.type === 'boolean') {
      return `${goal.category} • Boolean`;
    } else if (goal.type === 'numeric') {
      return `${goal.category} • ${goal.targetValue} ${goal.unit}`;
    }
    return goal.category;
  };

  return (
    <div className={`goal-item ${!goal.isActive ? 'inactive' : ''}`}>
      <div className="goal-info">
        <div className="goal-icon">{goal.icon || '🎯'}</div>
        <div className="goal-details">
          <h3>{goal.name}</h3>
          <div className="goal-meta">{formatGoalDetails()}</div>
        </div>
      </div>

      <div className="goal-actions">
        <IconButton
          icon="✏️"
          onClick={() => setIsEditing(true)}
          title="Edit"
          variant="ghost"
        />
        <IconButton
          icon="🗑️"
          onClick={handleDelete}
          title="Remove"
          variant="ghost"
        />
        <Toggle
          checked={goal.isActive}
          onChange={handleToggle}
        />
      </div>
    </div>
  );
};

export default GoalItem;