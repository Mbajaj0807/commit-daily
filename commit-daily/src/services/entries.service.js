// src/services/entries.service.js

import api from './api';

const entriesService = {
  // Get all entries
  getEntries: async (limit = 90) => {
    try {
      const response = await api.get(`/entries?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch entries' };
    }
  },

  // Get today's entry
  getTodayEntry: async () => {
    try {
      const response = await api.get('/entries/today');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch today\'s entry' };
    }
  },

  // Add or update daily entry
  addDayUpdate: async (entryData) => {
    try {
      const response = await api.post('/entries/add-day-update', entryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to save entry' };
    }
  },

  // Get streaks
  getStreaks: async () => {
    try {
      const response = await api.get('/entries/streaks');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch streaks' };
    }
  },
};

export default entriesService;