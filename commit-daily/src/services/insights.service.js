
// src/services/insights.service.js

import api from './api';

const insightsService = {
  // Get goals insights
  getGoalsInsights: async () => {
    try {
      const response = await api.get('/insights/goals');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch goals insights' };
    }
  },

  // Get money insights (for future use)
  getMoneyInsights: async () => {
    try {
      const response = await api.get('/insights/money');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch money insights' };
    }
  },
};

export default insightsService;