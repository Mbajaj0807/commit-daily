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
    context: "Last 30 days",
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

  /* ---------------- NEW INSIGHTS ---------------- */

  // 1️⃣ Projection Insight
  insights.push({
    id: "projection_spend",
    domain: "money",
    type: "projection",
    title: "Projected monthly spend",
    value: `₹${agg.projectionSpend.projectedAmount}`,
    context: `Based on ₹${agg.projectionSpend.baseAmount}/day`,
    confidence: "medium",
  });

  // 2️⃣ Silent Spends
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

  // 3️⃣ Spend Heatmap (chart-ready insight)
  insights.push({
    id: "spend_heatmap",
    domain: "money",
    type: "visual",
    title: "Spending intensity by day",
    data: agg.spendHeatmap,
    confidence: "high",
  });

  // 4️⃣ Category Breakdown (pie-ready)
  insights.push({
    id: "category_breakdown",
    domain: "money",
    type: "visual",
    title: "Category-wise spending",
    data: agg.categoryBreakdown,
    confidence: "high",
  });

  // 5️⃣ 7-day Trend (bar-ready)
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
