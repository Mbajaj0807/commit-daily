// src/pages/RegisterPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import authService from '../services/auth.service';
import '../styles/auth.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError('');
  };

  const validateForm = () => {
    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      await authService.register(formData.username, formData.password);
      // Redirect to dashboard on success
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginClick = () => {
    navigate('/login');
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

        {/* Register Form */}
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

          <Input
            label=""
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <Button
            type="submit"
            fullWidth
            loading={loading}
            disabled={!formData.username || !formData.password || !formData.confirmPassword}
          >
            Register
          </Button>
        </form>

        {/* Login Link */}
        <div className="auth-footer">
          Already have an account?{' '}
          <span className="auth-link" onClick={handleLoginClick}>
            Login
          </span>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;