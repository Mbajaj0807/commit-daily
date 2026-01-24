// src/pages/CommitmentPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import RatingStars from '../components/commitment/RatingStars';
import GoalChecklist from '../components/commitment/GoalChecklist';
import goalsService from '../services/goals.service';
import entriesService from '../services/entries.service';
import quotesService from '../services/quotes.service';
import { Plus } from 'lucide-react';
import '../styles/commitment.css';
import { getTodayIST } from '../utils/date.';

const CommitmentPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [goals, setGoals] = useState([]);
  const [formData, setFormData] = useState({
    date: getTodayIST ,
    rating: 0,
    goalStatus: {},
    notes: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch goals
      const goalsResponse = await goalsService.getGoals();
      const activeGoals = goalsResponse.data.filter(goal => goal.isActive);
      setGoals(goalsResponse.data);

      // Fetch today's entry if it exists
      const todayResponse = await entriesService.getTodayEntry();
      
      if (todayResponse.data._id) {
        // Entry exists, populate form
        setFormData({
          date: todayResponse.data.date,
          rating: todayResponse.data.rating || 0,
          goalStatus: todayResponse.data.goalStatus || {},
          notes: todayResponse.data.notes || '',
        });
      } else {
        // No entry, initialize with empty goal status
        const initialGoalStatus = {};
        activeGoals.forEach(goal => {
          initialGoalStatus[goal._id] = goal.type === 'boolean' ? false : 0;
        });
        setFormData(prev => ({
          ...prev,
          goalStatus: initialGoalStatus,
        }));
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRatingChange = (rating) => {
    setFormData(prev => ({ ...prev, rating }));
  };
const handleAddGoal = () => {
    navigate('/goals');
  };
  const handleGoalStatusChange = (goalId, value) => {
    setFormData(prev => ({
      ...prev,
      goalStatus: {
        ...prev.goalStatus,
        [goalId]: value,
      },
    }));
  };

  const handleNotesChange = (e) => {
    setFormData(prev => ({ ...prev, notes: e.target.value }));
  };

  const calculateSuggestedRating = () => {
    const activeGoals = goals.filter(g => g.isActive);
    if (activeGoals.length === 0) return 0;

    let completedCount = 0;
    activeGoals.forEach(goal => {
      const value = formData.goalStatus[goal._id];
      if (goal.type === 'boolean' && value === true) {
        completedCount++;
      } else if (goal.type === 'numeric' && value >= goal.targetValue) {
        completedCount++;
      }
    });

    const completionRate = (completedCount / activeGoals.length) * 100;

    if (completionRate >= 90) return 5;
    if (completionRate >= 70) return 4;
    if (completionRate >= 50) return 3;
    if (completionRate >= 30) return 2;
    return 1;
  };

  const handleSave = async () => {
    // Validate notes
    if (!formData.notes.trim()) {
      alert('Please add notes about your day');
      return;
    }

    setSaving(true);
    try {
      const dataToSave = {
        date: formData.date,
        goalStatus: formData.goalStatus,
        rating: formData.rating || calculateSuggestedRating(),
        notes: formData.notes,
      };

      // Step 1: Save daily entry
      await entriesService.addDayUpdate(dataToSave);
      
      // Step 2: Update/generate daily quote
      try {
        await quotesService.updateQuote();
      } catch (quoteError) {
        console.error('Failed to update quote:', quoteError);
        // Don't fail the whole save if quote update fails
      }
      
      // Show success message
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      alert(error.message || 'Failed to save entry');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="commitment-page">
        <div className="loading-container">Loading...</div>
      </div>
    );
  }

  return (
    <div className="commitment-page">
      {/* Success Banner */}
      {showSuccess && (
        <div className="success-banner">
          ✓ Day saved successfully!
        </div>
      )}



      {/* Header */}
      <div className="commitment-header">
        <button className="back-button" onClick={() => navigate('/dashboard')}>
          <ChevronLeft size={24} />
        </button>
        <h1 className="commitment-header-title">Today's Commitment</h1>

        <div className="dashboard-header-actions">
          {/* Update Today Button */}
          <button
          className="update-today-header-button"
          onClick={handleAddGoal}
          disabled={loading}
          >
          <Plus size={20} color="#FFFFFF" strokeWidth={3} />
            </button>
        </div>
      </div>

      {/* Content */}
      <div className="commitment-content">
        {/* Date */}
        <div className="commitment-date">
          <div className="date-value">{formatDate(formData.date)}</div>
        </div>

        {/* Rating */}
        <div className="rating-section">
          <h2 className="section-title">Rate Your Day</h2>
          <RatingStars
            value={formData.rating}
            onChange={handleRatingChange}
          />
        </div>

        {/* Goals Checklist */}
        <div className="goals-checklist-section">
          <h2 className="section-title">Today's Goals Checklist</h2>
          <GoalChecklist
            goals={goals}
            goalStatus={formData.goalStatus}
            onChange={handleGoalStatusChange}
          />
        </div>

        {/* Notes */}
        <div className="notes-section">
          <label className="notes-label">
            Reflect on your successes, challenges, and insights...
          </label>
          <textarea
            className="notes-textarea"
            placeholder="What went well today? What challenges did you face? What did you learn?"
            value={formData.notes}
            onChange={handleNotesChange}
          />
        </div>

        {/* Save Button */}
        <button
          className="save-button"
          onClick={handleSave}
          disabled={saving || !formData.notes.trim()}
        >
          {saving ? 'SAVING...' : 'SAVE & CLOSE'}
        </button>
      </div>
    </div>
  );
};

export default CommitmentPage;