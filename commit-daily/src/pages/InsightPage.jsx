// src/pages/InsightsPage.jsx

import React, { useEffect, useState } from "react";
import BottomNavigation from "../components/layout/BottomNavigation";
import "../styles/insights.css";

import {
  InsightStatCard,
  InsightMessageCard,
  CategoryDonut,
  WeeklySpendBar,
  BudgetRing,
  BudgetAlert,
} from "../components/moneyinsights/code";

import {
  CompletionRing,
  PerformanceAlert,
  GoalStatsGrid,
  HabitHighlights,
  // CompletionBarChart,
  GoalPerformanceList,
  IndividualGoalProgress,
} from "../components/goalInsights/goalInsightsComponent";

import insightsService from "../services/insights.service";

const InsightsPage = () => {
  const [activeTab, setActiveTab] = useState("money");
  const [loading, setLoading] = useState(true);
  const [moneyInsights, setMoneyInsights] = useState(null);
  const [goalsInsights, setGoalsInsights] = useState(null);

  /* ---------------- Fetch Insights ---------------- */
  useEffect(() => {
    if (activeTab === "money") {
      fetchMoneyInsights();
    } else if (activeTab === "goals") {
      fetchGoalsInsights();
    }
  }, [activeTab]);

  const fetchMoneyInsights = async () => {
    try {
      setLoading(true);
      const res = await insightsService.getMoneyInsights();

      const insightsArray = res.insights;
      const charts = res.charts;
      const meta = res.meta;

      // Helper to find insight by id
      const getInsight = (id) =>
        insightsArray.find((i) => i.id === id);

      setMoneyInsights({
        totalSpent: getInsight("total_spent")?.value,
        avgDaily: getInsight("avg_daily_spend")?.value,
        projection: getInsight("projection_spend")?.value,
        topCategory: {
          name: getInsight("top_category")?.value,
          amount: getInsight("top_category")?.context,
        },
        silentSpends: getInsight("silent_spends")?.context,
        categories: charts.categoryBreakdown || [],
        last7Days: charts.last7DaysTrend || [],
        
        // Budget insights
        budgetInsights: meta.budgetInsights || null,
        budgetUsage: getInsight("budget_usage"),
        remainingBudget: getInsight("remaining_budget"),
        safeDailySpend: getInsight("safe_daily_spend"),
        budgetAlert: getInsight("over_budget_alert") || getInsight("budget_warning"),
      });
    } catch (err) {
      console.error("Failed to load money insights", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchGoalsInsights = async () => {
    try {
      setLoading(true);
      const res = await insightsService.getGoalsInsights();
      console.log(res);

      setGoalsInsights(res);
    } catch (err) {
      console.error("Failed to load goals insights", err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- Render Goals Tab ---------------- */
  const renderGoalsTab = () => {
    if (loading || !goalsInsights) {
      return <div className="loading">Loading insights...</div>;
    }

    const { insights, charts, meta, goalWiseStats } = goalsInsights;

    // Get different types of insights
    const stats = insights.filter(i => i.type === "stat");
    const alerts = insights.filter(i => i.type === "alert" || i.type === "reflection");
    const best = insights.find(i => i.id === "strongest_goal");
    const worst = insights.find(i => i.id === "weakest_goal");

    return (
      <>
        {/* Completion Ring */}
        <CompletionRing
          completionRate={meta.completionRate}
          totalGoals={meta.totalGoals}
          activeGoals={meta.activeGoals}
        />

        {/* Performance Alerts */}
        {alerts.slice(0, 2).map((alert) => (
          <PerformanceAlert key={alert.id} insight={alert} />
        ))}

        {/* Stats Grid */}
        {stats.length > 0 && (
          <GoalStatsGrid stats={stats.slice(0, 4)} />
        )}

        {/* Best & Worst Habits */}
        {(best || worst) && (
          <HabitHighlights best={best} worst={worst} />
        )}

        {/* Last 7 Days Completion Chart
        {charts?.last7DaysCompletion && (
          <CompletionBarChart
            data={charts.last7DaysCompletion}
            title="Last 7 Days Completion %"
          />
        )} */}

        {/* Daily Goals Completed Chart
        {charts?.dailyGoalsCompleted && (
          <CompletionBarChart
            data={charts.dailyGoalsCompleted}
            title="Daily Goals Completed"
          />
        )} */}

        {/* Goal Performance List */}
        {goalWiseStats && goalWiseStats.length > 0 && (
          <GoalPerformanceList goals={goalWiseStats} />
        )}

        {/* Individual Goal Progress */}
        {charts?.last7DaysGoalProgress && charts.last7DaysGoalProgress.length > 0 && (
          <>
            {charts.last7DaysGoalProgress.map((goalProgress) => (
              <IndividualGoalProgress
                key={goalProgress.goalId}
                goalProgress={goalProgress}
              />
            ))}
          </>
        )}
      </>
    );
  };

  return (
    <div className="insights-page">
      {/* Header */}
      <div className="insights-header">
        <div>
          <h1 className="insights-title">Insights</h1>
          <p className="insights-subtitle">
            Patterns that shape your discipline
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="insights-tabs">
        <button
          className={`insights-tab ${activeTab === "goals" ? "active" : ""}`}
          onClick={() => setActiveTab("goals")}
        >
          Goals
        </button>

        <button
          className={`insights-tab ${activeTab === "money" ? "active" : ""}`}
          onClick={() => setActiveTab("money")}
        >
          Money
        </button>
      </div>

      {/* Content */}
      <div className="insights-content">
        {activeTab === "goals" && renderGoalsTab()}

        {activeTab === "money" && (
          <>
            {loading || !moneyInsights ? (
              <div className="loading">Loading insights...</div>
            ) : (
              <>
                {/* Budget Ring - Show first if budget is set */}
                {moneyInsights.budgetInsights && (
                  <BudgetRing data={moneyInsights.budgetInsights} />
                )}

                {/* Budget Alert */}
                {moneyInsights.budgetAlert && (
                  <BudgetAlert insight={moneyInsights.budgetAlert} />
                )}

                {/* Budget Stats Grid */}
                {moneyInsights.budgetInsights && (
                  <div className="mi-stats-grid">
                    <InsightStatCard
                      title="Remaining Budget"
                      value={moneyInsights.remainingBudget?.value}
                      context={moneyInsights.remainingBudget?.context}
                      icon="💰"
                    />
                    
                    <InsightStatCard
                      title="Safe Daily Spend"
                      value={moneyInsights.safeDailySpend?.value}
                      context={moneyInsights.safeDailySpend?.context}
                      icon="📅"
                    />
                  </div>
                )}

                <InsightStatCard
                  title="Total spent"
                  value={moneyInsights.totalSpent}
                  context="Current cycle"
                  icon="₹"
                />

                <InsightStatCard
                  title="Average daily spend"
                  value={moneyInsights.avgDaily}
                  context="Based on all cycle days"
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
          </>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default InsightsPage;