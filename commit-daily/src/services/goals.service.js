// src/services/goals.service.js

import api from './api';

const goalsService = {
  // Get all goals for authenticated user
  getGoals: async () => {
    try {
      const response = await api.get('/goals');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch goals' };
    }
  },

  // Alias for getGoals (in case it's called elsewhere)
  getAllGoals: async () => {
    try {
      const response = await api.get('/goals');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch goals' };
    }
  },

  // Add new goal
  addGoal: async (goalData) => {
    try {
      const response = await api.post('/goals/add-goal', goalData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to add goal' };
    }
  },

  // Update goal
  updateGoal: async (goalId, updates) => {
    try {
      const response = await api.patch(`/goals/${goalId}`, updates);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update goal' };
    }
  },

  // Remove goal
  removeGoal: async (goalId) => {
    try {
      const response = await api.delete(`/goals/remove-goal/${goalId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to remove goal' };
    }
  },
};

export default goalsService;