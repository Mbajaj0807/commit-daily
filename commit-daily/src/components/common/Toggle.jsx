// src/components/common/Toggle.jsx

import React from 'react';
import '../../styles/goals.css';

const Toggle = ({ checked, onChange, disabled = false }) => {
  return (
    <label className="toggle-switch">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      <span className="toggle-slider"></span>
    </label>
  );
};

export default Toggle;