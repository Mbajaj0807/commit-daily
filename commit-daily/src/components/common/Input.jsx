// src/components/common/Input.jsx

import React from 'react';
import '../../styles/auth.css';

const Input = ({ 
  label, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  name,
  required = false,
  disabled = false,
  error
}) => {
  return (
    <div className="form-group">
      {label && (
        <label className="form-label" htmlFor={name}>
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        className="form-input"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
      />
      {error && (
        <span style={{ 
          fontSize: '12px', 
          color: '#FF3B30', 
          paddingLeft: '4px' 
        }}>
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;