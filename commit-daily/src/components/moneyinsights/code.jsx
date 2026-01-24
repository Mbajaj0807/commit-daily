// src/components/moneyinsights/code.jsx

import React from "react";

/* ------------------------------
   Base Card Wrapper
-------------------------------- */
export const InsightCard = ({ children }) => {
  return (
    <div className="mi-card">
      {children}
    </div>
  );
};

const DONUT_COLORS = [
  "#7B61FF", // purple
  "#FFB020", // amber
  "#34C759", // green
  "#FF3B30", // red
  "#5AC8FA", // blue
  "#AF52DE", // violet
];

/* ------------------------------
   Stat Card (Total, Avg, Projection)
-------------------------------- */
export const InsightStatCard = ({
  title,
  value,
  context,
  icon,
}) => {
  return (
    <InsightCard>
      <div className="mi-stat-row">
        <div>
          <div className="mi-title">{title}</div>
          <div className="mi-value">{value}</div>
          {context && <div className="mi-context">{context}</div>}
        </div>

        {icon && <div className="mi-icon">{icon}</div>}
      </div>
    </InsightCard>
  );
};

/* ------------------------------
   Reflection / Alert Card
-------------------------------- */
export const InsightMessageCard = ({
  title,
  highlight,
  description,
}) => {
  return (
    <InsightCard>
      <div className="mi-title">{title}</div>
      <div className="mi-highlight">{highlight}</div>
      {description && (
        <div className="mi-context">{description}</div>
      )}
    </InsightCard>
  );
};

/* ------------------------------
   Budget Ring (Visual Progress)
-------------------------------- */
export const BudgetRing = ({ data }) => {
  const percent = data.budgetUsedPercent;
  
  // Determine color based on budget usage
  let ringColor = "#34C759"; // Green (safe)
  let bgColor = "#E8F5E9";
  
  if (percent >= 100) {
    ringColor = "#FF3B30"; // Red (over budget)
    bgColor = "#FFEBEE";
  } else if (percent >= 80) {
    ringColor = "#FFB020"; // Amber (warning)
    bgColor = "#FFF8E1";
  }
  
  const circumference = 2 * Math.PI * 70;
  const strokeDasharray = `${(Math.min(percent, 100) / 100) * circumference} ${circumference}`;

  return (
    <InsightCard>
      <h3 className="mi-title">Budget Overview</h3>
      
      <div className="budget-ring-wrapper">
        <svg width="180" height="180" viewBox="0 0 180 180">
          {/* Background circle */}
          <circle
            cx="90"
            cy="90"
            r="70"
            fill="transparent"
            stroke={bgColor}
            strokeWidth="20"
          />
          
          {/* Progress circle */}
          <circle
            cx="90"
            cy="90"
            r="70"
            fill="transparent"
            stroke={ringColor}
            strokeWidth="20"
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
            transform="rotate(-90 90 90)"
            style={{ transition: "stroke-dasharray 0.6s ease" }}
          />
        </svg>

        <div className="budget-ring-center">
          <div className="budget-ring-percent" style={{ color: ringColor }}>
            {percent}%
          </div>
          <div className="budget-ring-label">Used</div>
          {/* <div className="budget-ring-amount">
            ₹{data.totalSpent} / ₹{data.monthlyBudget}
          </div> */}
        </div>
      </div>

      <div className="budget-ring-stats">
        <div className="budget-ring-stat">
          <span className="budget-stat-label">Days Passed</span>
          <span className="budget-stat-value">{data.daysPassed}</span>
        </div>
        <div className="budget-ring-stat">
          <span className="budget-stat-label">Days Left</span>
          <span className="budget-stat-value">{data.remainingDays}</span>
        </div>
      </div>
    </InsightCard>
  );
};

/* ------------------------------
   Budget Alert (Over/Under/Warning)
-------------------------------- */
export const BudgetAlert = ({ insight }) => {
  if (!insight) return null;
  
  // Determine alert styling based on severity
  let alertClass = "budget-alert";
  let icon = "⚠️";
  
  if (insight.id === "over_budget_alert") {
    alertClass += " budget-alert-danger";
    icon = "🚨";
  } else if (insight.id === "budget_warning") {
    alertClass += " budget-alert-warning";
    icon = "⚠️";
  } else {
    alertClass += " budget-alert-success";
    icon = "✅";
  }

  return (
    <div className={alertClass}>
      <div className="budget-alert-icon">{icon}</div>
      <div className="budget-alert-content">
        <div className="budget-alert-title">{insight.title}</div>
        <div className="budget-alert-context">{insight.context}</div>
      </div>
    </div>
  );
};

/* ------------------------------
   Spending Heatmap (7-day)
-------------------------------- */
export const SpendHeatmap = ({ data }) => {
  const intensityColors = [
    "#F3F0FF",
    "#D6CCFF",
    "#A997FF",
    "#7B61FF",
  ];

  return (
    <div className="insight-card">
      <h3 className="insight-section-title">Spending intensity by day</h3>

      <div className="heatmap-row">
        {data.map((d) => (
          <div
            key={d.date}
            className="heatmap-cell"
            style={{
              backgroundColor: intensityColors[d.intensity],
            }}
            title={`₹${d.total}`}
          />
        ))}
      </div>
    </div>
  );
};

/* ------------------------------
   Category Donut (placeholder ring)
-------------------------------- */
export const CategoryDonut = ({ data }) => {
  const total = data.reduce((s, d) => s + d.amount, 0);
  let offset = 0;

  return (
    <div className="insight-card">
      <h3 className="insight-section-title">Category-wise spending</h3>

      <div className="donut-wrapper">
        <svg width="160" height="160" viewBox="0 0 160 160">
          {data.map((d, i) => {
            const percent = d.amount / total;
            const strokeDasharray = `${percent * 440} 440`;
            const strokeDashoffset = -offset * 440;
            offset += percent;

            return (
              <circle
                key={i}
                cx="80"
                cy="80"
                r="70"
                fill="transparent"
                stroke={DONUT_COLORS[i % DONUT_COLORS.length]}
                strokeWidth="16"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
              />
            );
          })}
        </svg>

        <div className="donut-center">
          ₹{total}
          <span>Total</span>
        </div>
      </div>

      <div className="donut-legend">
        {data.map((d, i) => (
          <div key={d.category} className="legend-row">
            <div
              className="legend-dot"
              style={{
                backgroundColor: DONUT_COLORS[i % DONUT_COLORS.length],
              }}
            />
            {d.category} — ₹{d.amount}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ------------------------------
   Weekly Bar Chart (simple bars)
-------------------------------- */
export const WeeklySpendBar = ({ data }) => {
  const max = Math.max(...data.map(d => d.amount), 1);

  return (
    <InsightCard>
      <h3 className="mi-title">Last 7 days spending trend</h3>

      <div className="bar-chart">
        {data.map((d) => {
          // Calculate height in pixels instead of percentage
          const heightPx = d.amount > 0 
            ? Math.max((d.amount / max) * 140, 8) 
            : 0;
          
          return (
            <div key={d.date} className="bar-col">
              <div
                className="bar"
                style={{ height: `${heightPx}px` }}
                title={`₹${d.amount}`}
              />
              <span className="bar-label">
                {new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' })}
              </span>
            </div>
          );
        })}
      </div>
    </InsightCard>
  );
};