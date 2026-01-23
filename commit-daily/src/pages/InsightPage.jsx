// src/pages/InsightsPage.jsx

import React, { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNavigation from "../components/layout/BottomNavigation";
import "../styles/insights.css";

import {
  InsightStatCard,
  InsightMessageCard,
  SpendHeatmap,
  CategoryDonut,
  WeeklySpendBar,
} from "../components/moneyinsights/code";

const InsightsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  
  const moneyInsights = {
    totalSpent: "₹4695",
    avgDaily: "₹2348",
    projection: "₹70425",
    topCategory: {
      name: "Food",
      amount: "₹2695 (57%)",
    },
    silentSpends: "3 expenses without notes",
    heatmap: [
      { date: "2026-01-22", total: 900, intensity: 1 },
      { date: "2026-01-23", total: 3795, intensity: 3 },
    ],
    categories: [
      { category: "Food", amount: 2695 },
      { category: "Shopping", amount: 2000 },
    ],
    last7Days: [
      { date: "Mon", amount: 100 },
      { date: "Tue", amount: 200 },
      { date: "Wed", amount: 500 },
      { date: "Thu", amount: 700 },
      { date: "Fri", amount: 900 },
      { date: "Sat", amount: 3795 },
      { date: "Sun", amount: 0 },
    ],
  };

  return (
    <div className="insights-page">
      {/* Header */}
      <div className="insights-header">
        <button
          className="insights-back-button"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft size={22} />
        </button>

        <div>
          <h1 className="insights-title">Insights</h1>
          <p className="insights-subtitle">
            Patterns that shape your discipline
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="insights-tabs">
        <button
          className={`insights-tab ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All
        </button>

        <button
          className={`insights-tab ${activeTab === 'goals' ? 'active' : ''}`}
          onClick={() => setActiveTab('goals')}
        >
          Goals
        </button>

        <button
          className={`insights-tab ${activeTab === 'money' ? 'active' : ''}`}
          onClick={() => setActiveTab('money')}
        >
          Money
        </button>
      </div>

      {/* Content */}
      <div className="insights-content">
        {activeTab === "all" && (
          <>
            <InsightCard
              title="Consistency"
              description="Your discipline trend over time"
              value="Stable"
            />
            <InsightCard
              title="Goals Focus"
              description="Most engaged category"
              value="Fitness"
            />
            <InsightCard
              title="Spending Awareness"
              description="Avg daily spend"
              value="₹240"
            />
          </>
        )}

        {activeTab === "goals" && (
          <>
            <InsightCard
              title="Completion Rate"
              description="Last 30 days"
              value="78%"
            />
            <InsightCard
              title="Most Skipped Goal"
              description="Needs attention"
              value="Reading"
            />
          </>
        )}

        {activeTab === "money" && (
          <>
            <InsightStatCard
              title="Total spent"
              value={moneyInsights.totalSpent}
              context="Last 30 days"
              icon="₹"
            />

            <InsightStatCard
              title="Average daily spend"
              value={moneyInsights.avgDaily}
              context="Based on recent habits"
              icon="📊"
            />

            <InsightStatCard
              title="Projected monthly spend"
              value={moneyInsights.projection}
              context="If current trend continues"
              icon="📈"
            />

            <InsightMessageCard
              title="Top spending category"
              highlight={moneyInsights.topCategory.name}
              description={moneyInsights.topCategory.amount}
            />

            <CategoryDonut data={moneyInsights.categories} />
            
            <WeeklySpendBar data={moneyInsights.last7Days} />
          </>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

const InsightCard = ({ title, description, value }) => {
  return (
    <div className="insight-card">
      <div className="insight-card-top">
        <span className="insight-card-title">{title}</span>
      </div>
      <div className="insight-card-value">{value}</div>
      <div className="insight-card-desc">{description}</div>
    </div>
  );
};

export default InsightsPage;