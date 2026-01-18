// src/components/commitment/GoalChecklistItem.jsx

import React from 'react';
import { Check } from 'lucide-react';
import '../../styles/commitment.css';

const GoalChecklistItem = ({ goal, value, onChange }) => {
  const handleCheckboxChange = () => {
    if (goal.type === 'boolean') {
      onChange(goal._id, !value);
    }
  };

  const handleNumericChange = (e) => {
    const numValue = parseFloat(e.target.value) || 0;
    onChange(goal._id, numValue);
  };

  const isBoolean = goal.type === 'boolean';
  const isChecked = isBoolean && value === true;

  return (
    <div className="goal-item">
      {isBoolean && (
        <div className="goal-checkbox-wrapper">
          <label className={`goal-checkbox ${isChecked ? 'checked' : ''}`}>
            <input
              type="checkbox"
              checked={isChecked}
              onChange={handleCheckboxChange}
            />
            {isChecked && <Check className="check-icon" />}
          </label>
        </div>
      )}

      <div className="goal-info">
        <span className="goal-icon">{goal.icon || '🎯'}</span>
        <div className="goal-details">
          <div className="goal-name">{goal.name}</div>
          {!isBoolean && (
            <div className="goal-meta">
              {goal.category} • {isBoolean ? 'Yes/No' : `Target: ${goal.targetValue} ${goal.unit}`}
            </div>
          )}
          {isBoolean && goal.category && (
            <div className="goal-meta">{goal.category} • Boolean</div>
          )}
        </div>
      </div>

      {!isBoolean && (
        <div className="goal-numeric-input-wrapper">
          <input
            type="number"
            className="goal-numeric-input"
            value={value || 0}
            onChange={handleNumericChange}
            min="0"
            step="0.1"
            placeholder="0"
          />
          <span className="goal-unit">{goal.unit}</span>
        </div>
      )}
    </div>
  );
};

export default GoalChecklistItem;