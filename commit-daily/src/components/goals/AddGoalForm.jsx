import React, { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import '../../styles/goals.css';

const GOAL_TYPES = [
  { value: 'boolean', label: 'Boolean (Yes/No)' },
  { value: 'numeric', label: 'Numeric' }
];

const CATEGORIES = [
  'Wellness',
  'Learning',
  'Fitness',
  'Discipline',
  'Productivity',
  'Health',
  'Work',
  'Social'
];

const ICONS = [
  { value: '💧', label: 'Water' },
  { value: '📚', label: 'Book' },
  { value: '💪', label: 'Exercise' },
  { value: '🧘', label: 'Meditation' },
  { value: '📱', label: 'Screen' },
  { value: '🥗', label: 'Food' },
  { value: '😴', label: 'Sleep' },
  { value: '💰', label: 'Money' },
  { value: '❤️', label: 'Heart' },
  { value: '⭐', label: 'Star' },
  { value: '🔥', label: 'Fire' },
  { value: '🧠', label: 'Brain' },
  { value: '🎯', label: 'Target' },
  { value: '🏋️', label: 'Gym' }
];

const AddGoalForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'boolean',
    targetValue: '',
    unit: '',
    category: '',
    icon: '🎯'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Goal name is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (formData.type === 'numeric') {
      if (!formData.targetValue || formData.targetValue <= 0) {
        newErrors.targetValue = 'Target value must be greater than 0';
      }
      if (!formData.unit.trim()) {
        newErrors.unit = 'Unit is required for numeric goals';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare data according to API format
      const goalData = {
        name: formData.name.trim(),
        type: formData.type,
        category: formData.category,
        icon: formData.icon
      };

      // Add targetValue and unit for numeric goals
      if (formData.type === 'numeric') {
        goalData.targetValue = parseFloat(formData.targetValue);
        goalData.unit = formData.unit.trim();
      } else {
        // For boolean goals, set targetValue to null
        goalData.targetValue = null;
        goalData.unit = '';
      }

      await onSubmit(goalData);
    } catch (error) {
      console.error('Error submitting goal:', error);
      setErrors({ submit: error.message || 'Failed to create goal' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-goal-form">
      <h2>Add New Rule</h2>
      <p className="form-subtitle">Define a new personal standard.</p>

      <form onSubmit={handleSubmit}>
        {/* Goal Name */}
        <div className="form-group">
          <label htmlFor="goalName">Goal Name</label>
          <Input
            id="goalName"
            type="text"
            placeholder="e.g., Read a book daily"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            error={errors.name}
          />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>

        {/* Type Selector */}
        <div className="form-group">
          <label htmlFor="goalType">Type</label>
          <select
            id="goalType"
            className="form-select"
            value={formData.type}
            onChange={(e) => handleChange('type', e.target.value)}
          >
            {GOAL_TYPES.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Conditional: Target Value and Unit for Numeric Goals */}
        {formData.type === 'numeric' && (
          <>
            <div className="form-group">
              <label htmlFor="targetValue">Target Value</label>
              <Input
                id="targetValue"
                type="number"
                step="0.1"
                placeholder="e.g., 3"
                value={formData.targetValue}
                onChange={(e) => handleChange('targetValue', e.target.value)}
                error={errors.targetValue}
              />
              {errors.targetValue && <span className="error-text">{errors.targetValue}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="unit">Unit</label>
              <Input
                id="unit"
                type="text"
                placeholder="e.g., liters, hours, pages"
                value={formData.unit}
                onChange={(e) => handleChange('unit', e.target.value)}
                error={errors.unit}
              />
              {errors.unit && <span className="error-text">{errors.unit}</span>}
            </div>
          </>
        )}

        {/* Category */}
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <Input
            id="category"
            type="text"
            placeholder="e.g., Wellness, Learning"
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
            list="category-suggestions"
            error={errors.category}
          />
          <datalist id="category-suggestions">
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat} />
            ))}
          </datalist>
          {errors.category && <span className="error-text">{errors.category}</span>}
        </div>

        {/* Icon Selector */}
        <div className="form-group">
          <label>Icon (Lucide name)</label>
          <div className="icon-grid">
            {ICONS.map(icon => (
              <button
                key={icon.value}
                type="button"
                className={`icon-button ${formData.icon === icon.value ? 'selected' : ''}`}
                onClick={() => handleChange('icon', icon.value)}
                title={icon.label}
              >
                {icon.value}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div className="error-message">{errors.submit}</div>
        )}

        {/* Action Buttons */}
        <div className="form-actions">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Rule'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddGoalForm;