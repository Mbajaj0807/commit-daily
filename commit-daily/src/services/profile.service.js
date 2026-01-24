// src/services/profile.service.js

import api from './api';

const profileService = {
  // Set pocket money day (1-31)
  setPocketMoneyDay: async (day) => {
    try {
      const response = await api.post('/profile/setpocketmoneydate', { day });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to set pocket money day' };
    }
  },

  // Get pocket money day
  getPocketMoneyDay: async () => {
    try {
      const response = await api.get('/profile/getpocketmoneydate');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch pocket money day' };
    }
  },

  // Set monthly budget
  setBudget: async (amount) => {
    try {
      const response = await api.post('/profile/setbudget', { amount });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to set budget' };
    }
  },

  // Get monthly budget
  getBudget: async () => {
    try {
      const response = await api.get('/profile/getbudget');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch budget' };
    }
  },
};

export default profileService;