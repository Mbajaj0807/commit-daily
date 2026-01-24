// services/financeInsights.js

export function generateMoneyInsights(agg) {
  const insights = [];

  /* ---------------- Existing Insights ---------------- */

  insights.push({
    id: "total_spent",
    domain: "money",
    type: "stat",
    title: "Total spent",
    value: `₹${agg.totalSpent}`,
    context: "Current cycle",
    confidence: "high",
  });

  insights.push({
    id: "avg_daily_spend",
    domain: "money",
    type: "stat",
    title: "Average daily spend",
    value: `₹${Math.round(agg.avgDailySpend)}`,
    confidence: "high",
  });

  if (agg.topCategory) {
    insights.push({
      id: "top_category",
      domain: "money",
      type: "reflection",
      title: "Top spending category",
      value: agg.topCategory.category,
      context: `₹${agg.topCategory.amount} (${agg.topCategory.percent}%)`,
      confidence: "high",
    });

    if (agg.topCategory.percent >= 60) {
      insights.push({
        id: "category_dominance",
        domain: "money",
        type: "alert",
        title: "One category dominates your spending",
        context: `${agg.topCategory.category} accounts for ${agg.topCategory.percent}% of expenses`,
        severity: "negative",
        confidence: "high",
      });
    }
  }

  /* ---------------- Budget Insights (Priority) ---------------- */

  if (agg.budgetInsights) {
    const b = agg.budgetInsights;

    insights.push({
      id: "budget_usage",
      domain: "money",
      type: "stat",
      title: "Budget used",
      value: `${b.budgetUsedPercent}%`,
      context: `₹${b.totalSpent} of ₹${b.monthlyBudget}`,
      confidence: "high",
    });

    insights.push({
      id: "remaining_budget",
      domain: "money",
      type: "stat",
      title: "Remaining budget",
      value: `₹${b.remainingBudget}`,
      context: `${b.remainingDays} days left`,
      confidence: "high",
    });

    insights.push({
      id: "safe_daily_spend",
      domain: "money",
      type: "reflection",
      title: "Safe daily spend",
      value: `₹${b.safeDailySpend}`,
      context: "To stay within budget",
      confidence: "medium",
    });

    if (b.isOverBudget) {
      insights.push({
        id: "over_budget_alert",
        domain: "money",
        type: "alert",
        title: "You are over budget",
        context: `Exceeded budget by ₹${Math.abs(b.remainingBudget)}`,
        severity: "negative",
        confidence: "high",
      });
    } else if (b.budgetUsedPercent >= 80 && b.budgetUsedPercent < 100) {
      insights.push({
        id: "budget_warning",
        domain: "money",
        type: "alert",
        title: "Approaching budget limit",
        context: `${b.budgetUsedPercent}% of budget used with ${b.remainingDays} days remaining`,
        severity: "warning",
        confidence: "high",
      });
    }
  }

  /* ---------------- Existing Advanced Insights ---------------- */

  // Projection
  insights.push({
    id: "projection_spend",
    domain: "money",
    type: "projection",
    title: "Projected monthly spend",
    value: `₹${agg.projectionSpend.projectedAmount}`,
    context: `Based on ₹${agg.projectionSpend.baseAmount}/day`,
    confidence: "medium",
  });

  // Silent spending
  if (agg.silentSpends.count > 0) {
    insights.push({
      id: "silent_spends",
      domain: "money",
      type: "reflection",
      title: "Silent spending detected",
      context: `${agg.silentSpends.count} expenses without notes totaling ₹${agg.silentSpends.totalAmount}`,
      severity: "neutral",
      confidence: "medium",
    });
  }

  // Heatmap (visual)
  insights.push({
    id: "spend_heatmap",
    domain: "money",
    type: "visual",
    title: "Spending intensity by day",
    data: agg.spendHeatmap,
    confidence: "high",
  });

  // Category pie
  insights.push({
    id: "category_breakdown",
    domain: "money",
    type: "visual",
    title: "Category-wise spending",
    data: agg.categoryBreakdown,
    confidence: "high",
  });

  // 7-day bar
  insights.push({
    id: "last_7_days_trend",
    domain: "money",
    type: "visual",
    title: "Last 7 days spending trend",
    data: agg.last7DaysTrend,
    confidence: "high",
  });

  return insights;
}