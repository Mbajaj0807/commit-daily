// src/pages/LoginPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import authService from '../services/auth.service';
import '../styles/auth.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.login(formData.username, formData.password);
      // Redirect to dashboard on success
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-circles">
            <div className="auth-logo-circle"></div>
            <div className="auth-logo-circle small"></div>
            <div className="auth-logo-circle"></div>
          </div>
        </div>

        {/* Login Form */}
        <form className="auth-form" onSubmit={handleSubmit}>
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <Input
            label=""
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <Input
            label=""
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <Button
            type="submit"
            fullWidth
            loading={loading}
            disabled={!formData.username || !formData.password}
          >
            Login
          </Button>
        </form>

        {/* Register Link */}
        <div className="auth-footer">
          New here?{' '}
          <span className="auth-link" onClick={handleRegisterClick}>
            Create an account
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;