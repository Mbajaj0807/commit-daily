// src/components/layout/BottomNavigation.jsx

import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Target, Wallet, User } from "lucide-react";
import "../../styles/bottom-navigation.css";

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      id: "home",
      label: "Home",
      icon: Home,
      path: "/dashboard",
    },
    {
      id: "money",
      label: "Money",
      icon: Wallet,
      path: "/money",
    },
    {
      id: "insights",
      label: "Insights",
      icon: Target,
      path: "/insights",
    },
    {
      id: "profile",
      label: "Profile",
      icon: User,
      path: "/profile",
    },
  ];

  return (
    <nav className="bottom-nav">
      <div className="bottom-nav-items">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.path;

          return (
            <button
              key={item.id}
              className={`bottom-nav-item ${active ? "active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              <div className="bottom-nav-icon">
                <Icon size={22} strokeWidth={2} />
              </div>
              <span className="bottom-nav-label">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
