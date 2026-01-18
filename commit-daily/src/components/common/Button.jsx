// src/components/common/Button.jsx

import React from 'react';
import '../../styles/auth.css';

const Button = ({ 
  children, 
  onClick, 
  type = 'button',
  variant = 'primary',
  disabled = false,
  fullWidth = false,
  loading = false
}) => {
  const getButtonClass = () => {
    let baseClass = 'auth-button';
    
    if (variant === 'secondary') {
      baseClass += ' button-secondary';
    } else if (variant === 'danger') {
      baseClass += ' button-danger';
    }
    
    return baseClass;
  };

  return (
    <button
      type={type}
      className={getButtonClass()}
      onClick={onClick}
      disabled={disabled || loading}
      style={{ width: fullWidth ? '100%' : 'auto' }}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
};

export default Button;