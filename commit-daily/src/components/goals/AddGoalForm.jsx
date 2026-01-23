// src/components/goals/AddGoalForm.jsx

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import EmojiPicker from '../common/EmojiPicker';
import '../../styles/goals.css';

const AddGoalForm = ({ onClose, onSubmit, editGoal = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'boolean',
    targetValue: '',
    unit: '',
    category: 'Fitness',
    icon: '🎯',
  });

  const [loading, setLoading] = useState(false);

  // These categories match the backend enum validation
  const categories = [
    'Fitness',
    'Health',
    'Study',
    'Discipline',
    'Work',
    'Social',
  ];

  useEffect(() => {
    if (editGoal) {
      setFormData({
        name: editGoal.name,
        type: editGoal.type,
        targetValue: editGoal.targetValue || '',
        unit: editGoal.unit || '',
        category: editGoal.category || 'Fitness',
        icon: editGoal.icon || '🎯',
      });
    }
  }, [editGoal]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      type,
      targetValue: type === 'boolean' ? '' : prev.targetValue,
      unit: type === 'boolean' ? '' : prev.unit,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      alert('Please enter a goal name');
      return;
    }

    if (formData.type === 'numeric') {
      if (!formData.targetValue || formData.targetValue <= 0) {
        alert('Please enter a valid target value');
        return;
      }
      if (!formData.unit.trim()) {
        alert('Please enter a unit (e.g., liters, minutes, km)');
        return;
      }
    }

    setLoading(true);

    try {
      const goalData = {
        name: formData.name.trim(),
        type: formData.type,
        targetValue: formData.type === 'numeric' ? parseFloat(formData.targetValue) : null,
        unit: formData.type === 'numeric' ? formData.unit.trim() : '',
        category: formData.category,
        icon: formData.icon,
      };

      await onSubmit(goalData);
      onClose();
    } catch (error) {
      alert(error.message || 'Failed to save goal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">
            {editGoal ? 'Edit Goal' : 'Add New Rule'}
          </h2>
          <button className="modal-close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            {/* Goal Name */}
            <div className="form-field">
              <label className="form-field-label">Goal Name</label>
              <input
                type="text"
                className="form-text-input"
                placeholder="e.g., Read a book daily"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                maxLength={50}
              />
              <div className="form-field-hint">Define a new personal standard.</div>
            </div>

            {/* Type Selector */}
            <div className="form-field">
              <label className="form-field-label">Type</label>
              <div className="type-selector">
                <div
                  className={`type-option ${formData.type === 'boolean' ? 'selected' : ''}`}
                  onClick={() => handleTypeChange('boolean')}
                >
                  <div className="type-option-label">Boolean (Yes/No)</div>
                  <div className="type-option-desc">Did it or didn't</div>
                </div>
                <div
                  className={`type-option ${formData.type === 'numeric' ? 'selected' : ''}`}
                  onClick={() => handleTypeChange('numeric')}
                >
                  <div className="type-option-label">Numeric</div>
                  <div className="type-option-desc">Track a number</div>
                </div>
              </div>
            </div>

            {/* Numeric Fields (only if numeric type) */}
            {formData.type === 'numeric' && (
              <div className="numeric-fields">
                <div className="form-field">
                  <label className="form-field-label">Target Value</label>
                  <input
                    type="number"
                    className="form-text-input"
                    placeholder="e.g., 3"
                    value={formData.targetValue}
                    onChange={(e) => handleChange('targetValue', e.target.value)}
                    min="0"
                    step="0.1"
                  />
                </div>
                <div className="form-field">
                  <label className="form-field-label">Unit</label>
                  <input
                    type="text"
                    className="form-text-input"
                    placeholder="e.g., liters"
                    value={formData.unit}
                    onChange={(e) => handleChange('unit', e.target.value)}
                    maxLength={20}
                  />
                </div>
              </div>
            )}

            {/* Category */}
            <div className="form-field">
              <label className="form-field-label">Category</label>
              <select
                className="category-select"
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <div className="form-field-hint">Choose the category that fits best</div>
            </div>

            {/* Icon - Emoji Picker */}
            <div className="form-field">
              <label className="form-field-label">Icon (Emoji)</label>
              <EmojiPicker
                value={formData.icon}
                onChange={(emoji) => handleChange('icon', emoji)}
              />
              <div className="form-field-hint">Click the emoji to choose from a list, or type your own</div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="form-submit-button"
              disabled={loading}
            >
              {loading ? 'Saving...' : editGoal ? 'Save Changes' : 'Save Rule'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddGoalForm;