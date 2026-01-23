// src/services/quotes.service.js

import api from './api';

const quotesService = {
  // Get today's quote
  getTodayQuote: async () => {
    try {
      const response = await api.get('/quotes/today');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch quote' };
    }
  },

  // Generate/update daily quote (call after saving entry)
  updateQuote: async () => {
    try {
      const response = await api.post('/quotes/update');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update quote' };
    }
  },
};

export default quotesService;