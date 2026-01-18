// src/components/layout/BottomNavigation.jsx

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Target, User } from 'lucide-react';
import '../../styles/dashboard.css';

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      path: '/dashboard',
    },
    {
      id: 'goals',
      label: 'Goals',
      icon: Target,
      path: '/goals',
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      path: '/profile',
    },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleNavClick = (path) => {
    navigate(path);
  };

  return (
    <nav className="bottom-navigation">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
            onClick={() => handleNavClick(item.path)}
          >
            <Icon className="nav-icon" size={24} strokeWidth={2} />
            <span className="nav-label">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNavigation;