// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CommitmentPage from './pages/CommitmentPage';
import GoalsPage from './pages/GoalsPage';
import MoneyPage from './pages/MoneyPage';
import InsightsPage from './pages/InsightPage';
import authService from './services/auth.service';
import './styles/auth.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Public Route Component (redirect if already logged in)
const PublicRoute = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();
  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Default redirect */}
        <Route 
          path="/" 
          element={<Navigate to="/login" />} 
        />

        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/commitment"
          element={
            <ProtectedRoute>
              <CommitmentPage />
            </ProtectedRoute>
          }
        />

        {/* Goals Route - Now fully implemented */}
        <Route
          path="/goals"
          element={
            <ProtectedRoute>
              <GoalsPage />
            </ProtectedRoute>
          }
        />
        {/* Insights Route - Now fully implemented */}
        <Route
          path="/insights"
          element={
            <ProtectedRoute>
              <InsightsPage />
            </ProtectedRoute>
          }
        />
        {/* Money Route - Now fully implemented */}
        <Route
          path="/money"
          element={
            <ProtectedRoute>
              <MoneyPage />
            </ProtectedRoute>
          }
        />

        {/* Profile Route - Placeholder with logout */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <div style={{ padding: '20px', textAlign: 'center' }}>
                <h1>Profile</h1>
                <p>Coming soon...</p>
                <button 
                  onClick={() => {
                    authService.logout();
                    window.location.href = '/login';
                  }}
                  style={{
                    padding: '12px 24px',
                    background: '#ff3b30',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    marginTop: '20px'
                  }}
                >
                  Logout
                </button>
                <button 
                  onClick={() => window.history.back()}
                  style={{
                    padding: '12px 24px',
                    background: '#007AFF',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    marginTop: '10px',
                    marginLeft: '10px'
                  }}
                >
                  Go Back
                </button>
              </div>
            </ProtectedRoute>
          }
        />

        {/* 404 Route */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;