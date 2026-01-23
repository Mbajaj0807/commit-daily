import React, { useState, useEffect } from 'react';
import GoalItem from './GoalItem';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import AddGoalForm from './AddGoalForm';
// import Button from '../common/Button';
import  goalsService  from '../../services/goals.service';
import '../../styles/goals.css';

const GoalsManager = () => {
  const navigate = useNavigate();
  const [goals, setGoals] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const response = await goalsService.getAllGoals();
      setGoals(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching goals:', err);
      setError('Failed to load goals');
    } finally {
      setLoading(false);
    }
  };

  const handleAddGoal = async (goalData) => {
    try {
      const response = await goalsService.addGoal(goalData);
      setGoals(prev => [...prev, response.data]);
      setShowAddForm(false);
      setError(null);
    } catch (err) {
      console.error('Error adding goal:', err);
      throw new Error(err.response?.data?.message || 'Failed to add goal');
    }
  };

  const handleToggleGoal = async (goalId, currentStatus) => {
    try {
      await goalsService.updateGoal(goalId, { isActive: !currentStatus });
      setGoals(prev =>
        prev.map(goal =>
          goal._id === goalId ? { ...goal, isActive: !currentStatus } : goal
        )
      );
    } catch (err) {
      console.error('Error toggling goal:', err);
      setError('Failed to update goal');
    }
  };

  const handleDeleteGoal = async (goalId) => {
    if (!window.confirm('Are you sure you want to delete this goal?')) {
      return;
    }

    try {
      await goalsService.removeGoal(goalId);
      setGoals(prev => prev.filter(goal => goal._id !== goalId));
    } catch (err) {
      console.error('Error deleting goal:', err);
      setError('Failed to delete goal');
    }
  };

  const handleEditGoal = async (goalId, updatedData) => {
    try {
      const response = await goalsService.updateGoal(goalId, updatedData);
      setGoals(prev =>
        prev.map(goal => (goal._id === goalId ? response.data : goal))
      );
    } catch (err) {
      console.error('Error updating goal:', err);
      setError('Failed to update goal');
    }
  };

  if (loading) {
    return (
      <div className="goals-manager">
        <div className="loading">Loading goals...</div>
      </div>
    );
  }

  return (
    <div className="goals-manager">
      <div className="goals-header">
        
        <button className="back-button" onClick={() => navigate('/dashboard')}>
          <ChevronLeft size={24} />
          <h1>Your Rules</h1>
        </button>       
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      {showAddForm ? (
        <AddGoalForm
          onSubmit={handleAddGoal}
          onCancel={() => setShowAddForm(false)}
        />
      ) : (
        <>
          <div className="goals-list">
            {goals.length === 0 ? (
              <div className="goals-empty">
                <div className="goals-empty-icon">🎯</div>
                <h3>No goals yet</h3>
                <p>Start by adding your first goal</p>
              </div>
            ) : (
              goals.map(goal => (
                <GoalItem
                  key={goal._id}
                  goal={goal}
                  onToggle={handleToggleGoal}
                  onDelete={handleDeleteGoal}
                  onEdit={handleEditGoal}
                />
              ))
            )}
          </div>

          <button
            className="add-goal-button"
            onClick={() => setShowAddForm(true)}
          >
            <span>+</span>
            Add New Rule
          </button>
        </>
      )}
    </div>
  );
};

export default GoalsManager;