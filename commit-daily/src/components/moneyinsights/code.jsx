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
    <div className="insight-card">
      <h3 className="insight-section-title">Last 7 days spending trend</h3>

      <div className="bar-chart">
        {data.map((d) => (
          <div key={d.date} className="bar-col">
            <div
              className="bar"
              style={{ height: `${(d.amount / max) * 100}%` }}
            />
            <span className="bar-label">{d.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
};