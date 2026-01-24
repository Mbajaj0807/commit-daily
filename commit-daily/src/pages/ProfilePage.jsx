// src/pages/ProfilePage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import BottomNavigation from '../components/layout/BottomNavigation';
import authService from '../services/auth.service';
import profileService from '../services/profile.service';
import '../styles/profile.css';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [showPocketMoneyModal, setShowPocketMoneyModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [pocketMoneyDay, setPocketMoneyDay] = useState('');
  const [budget, setBudget] = useState('');
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Display data
  const [savedPocketMoneyDay, setSavedPocketMoneyDay] = useState(null);
  const [savedBudget, setSavedBudget] = useState(null);
  const [nextPocketMoneyDate, setNextPocketMoneyDate] = useState('');

  const user = authService.getCurrentUser();

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    setDataLoading(true);
    try {
      // Fetch pocket money day
      try {
        const pocketMoneyResponse = await profileService.getPocketMoneyDay();
        if (pocketMoneyResponse.success && pocketMoneyResponse.data.pocketMoneyDay) {
          const day = pocketMoneyResponse.data.pocketMoneyDay;
          setSavedPocketMoneyDay(day);
          calculateNextPocketMoneyDate(day);
        }
      } catch (error) {
        console.error('Failed to fetch pocket money day:', error);
      }

      // Fetch budget
      try {
        const budgetResponse = await profileService.getBudget();
        console.log('Budget Response:', budgetResponse);
        if (budgetResponse.success && budgetResponse.data.monthlyBudget) {
          setSavedBudget(budgetResponse.data.monthlyBudget);
        }
      } catch (error) {
        console.error('Failed to fetch budget:', error);
      }
    } finally {
      setDataLoading(false);
    }
  };

  const calculateNextPocketMoneyDate = (day) => {
    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    let nextDate;
    
    if (currentDay < day) {
      // Next occurrence is this month
      nextDate = new Date(currentYear, currentMonth, day);
    } else {
      // Next occurrence is next month
      nextDate = new Date(currentYear, currentMonth + 1, day);
    }

    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    setNextPocketMoneyDate(nextDate.toLocaleDateString('en-US', options));
  };

  const getOrdinalSuffix = (day) => {
    if (day >= 11 && day <= 13) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  const handlePocketMoneySave = async () => {
    const dayNum = parseInt(pocketMoneyDay);
    
    if (!pocketMoneyDay || dayNum < 1 || dayNum > 31) {
      alert('Please enter a valid day (1-31)');
      return;
    }

    setLoading(true);
    try {
      const response = await profileService.setPocketMoneyDay(dayNum);
      console.log('Save Response:', response);
      setSavedPocketMoneyDay(dayNum);
      calculateNextPocketMoneyDate(dayNum);
      showSuccess('Pocket money day saved!');
      setShowPocketMoneyModal(false);
      setPocketMoneyDay('');
    } catch (error) {
      console.error('Save Error:', error);
      alert(error.message || 'Failed to save pocket money day');
    } finally {
      setLoading(false);
    }
  };

  const handleBudgetSave = async () => {
    const budgetNum = parseFloat(budget);
    
    if (!budget || budgetNum <= 0) {
      alert('Please enter a valid budget amount');
      return;
    }

    setLoading(true);
    try {
      const response = await profileService.setBudget(budgetNum);
      console.log('Save Budget Response:', response);
      setSavedBudget(budgetNum);
      showSuccess('Monthly budget saved!');
      setShowBudgetModal(false);
      setBudget('');
    } catch (error) {
      console.error('Save Budget Error:', error);
      alert(error.message || 'Failed to save budget');
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      authService.logout();
      navigate('/login');
    }
  };

  return (
    <div className="profile-page">
      {/* Success Message */}
      {successMessage && (
        <div className="profile-success-message">
          ✓ {successMessage}
        </div>
      )}

      {/* Header */}
      <div className="profile-header">
        <h1 className="profile-header-title">Profile</h1>
      </div>

      {/* Content */}
      <div className="profile-content">
        {/* Profile Info */}
        <div className="profile-info-section">
          <div className="profile-avatar-wrapper">
            <img
              src="https://i.pravatar.cc/300?img=12"
              alt="Profile"
              className="profile-avatar"
            />
            <div className="profile-avatar-edit">
              <span style={{ fontSize: '16px' }}>✏️</span>
            </div>
          </div>
          <h2 className="profile-name">{user?.username || 'User'}</h2>
          <p className="profile-email">
            {user?.username ? `${user.username.toLowerCase()}@example.com` : 'user@example.com'}
          </p>
        </div>

        {/* Settings List */}
        <div className="profile-settings-list">
          {/* Pocket Money */}
          <button
            className="profile-setting-item"
            onClick={() => setShowPocketMoneyModal(true)}
          >
            <div className="profile-setting-icon">💰</div>
            <div className="profile-setting-content">
              <div className="profile-setting-title">Pocket Money</div>
              {dataLoading ? (
                <div className="profile-setting-subtitle">Loading...</div>
              ) : savedPocketMoneyDay ? (
                <>
                  <div className="profile-setting-subtitle">
                    Day {savedPocketMoneyDay}{getOrdinalSuffix(savedPocketMoneyDay)} of every month
                  </div>
                  {nextPocketMoneyDate && (
                    <div className="profile-setting-next-date">
                      Next: {nextPocketMoneyDate}
                    </div>
                  )}
                </>
              ) : (
                <div className="profile-setting-subtitle">
                  Add pocket money date
                </div>
              )}
            </div>
          </button>

          {/* Monthly Budget */}
          <button
            className="profile-setting-item"
            onClick={() => setShowBudgetModal(true)}
          >
            <div className="profile-setting-icon">💳</div>
            <div className="profile-setting-content">
              <div className="profile-setting-title">Monthly Budget</div>
              {dataLoading ? (
                <div className="budget-subtitle">Loading...</div>
              ) : savedBudget ? (
                <div className="budget-subtitle">
                  ₹{savedBudget.toLocaleString()}/month
                </div>
              ) : (
                <div className="profile-setting-subtitle">
                  Set or update your budget
                </div>
              )}
            </div>
          </button>
        </div>

        {/* Logout */}
        <div className="profile-logout-section">
          <button className="profile-logout-button" onClick={handleLogout}>
            <div className="profile-logout-icon">
              <LogOut size={20} color="#FF3B30" />
            </div>
            <div className="profile-logout-title">Logout</div>
          </button>
        </div>
      </div>

      {/* Pocket Money Modal */}
      {showPocketMoneyModal && (
        <div className="profile-modal-overlay" onClick={() => setShowPocketMoneyModal(false)}>
          <div className="profile-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="profile-modal-header">
              <h3 className="profile-modal-title">Pocket Money Day</h3>
              <p className="profile-modal-subtitle">
                Set the day of month when you receive pocket money (1-31)
              </p>
            </div>

            <div className="profile-modal-body">
              <div className="profile-modal-input-group">
                <label className="profile-modal-label">Day of Month</label>
                <select
                  className="profile-modal-input"
                  value={pocketMoneyDay}
                  onChange={(e) => setPocketMoneyDay(e.target.value)}
                >
                  <option value="">Select day</option>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                    <option key={day} value={day}>
                      {day}{getOrdinalSuffix(day)} of every month
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="profile-modal-actions">
              <button
                className="profile-modal-button cancel"
                onClick={() => setShowPocketMoneyModal(false)}
              >
                Cancel
              </button>
              <button
                className="profile-modal-button save"
                onClick={handlePocketMoneySave}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Budget Modal */}
      {showBudgetModal && (
        <div className="profile-modal-overlay" onClick={() => setShowBudgetModal(false)}>
          <div className="profile-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="profile-modal-header">
              <h3 className="profile-modal-title">Monthly Budget</h3>
              <p className="profile-modal-subtitle">
                Set your monthly spending budget
              </p>
            </div>

            <div className="profile-modal-body">
              <div className="profile-modal-input-group">
                <label className="profile-modal-label">Budget Amount (₹)</label>
                <input
                  type="number"
                  className="profile-modal-input"
                  placeholder="e.g., 5000"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  min="0"
                  step="100"
                />
              </div>
            </div>

            <div className="profile-modal-actions">
              <button
                className="profile-modal-button cancel"
                onClick={() => setShowBudgetModal(false)}
              >
                Cancel
              </button>
              <button
                className="profile-modal-button save"
                onClick={handleBudgetSave}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default ProfilePage;