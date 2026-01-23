// services/financeAggregates.js

export function computeMoneyAggregates(expenses) {
  const dailyMap = {};
  const categoryMap = {};
  let totalSpent = 0;
  let maxSingleExpense = 0;
  let noteCount = 0;

  // NEW
  let silentSpendCount = 0;
  let silentSpendTotal = 0;

  for (const exp of expenses) {
    totalSpent += exp.amount;
    maxSingleExpense = Math.max(maxSingleExpense, exp.amount);

    // Daily spend
    dailyMap[exp.date] = (dailyMap[exp.date] || 0) + exp.amount;

    // Category spend
    categoryMap[exp.category] =
      (categoryMap[exp.category] || 0) + exp.amount;

    if (exp.note && exp.note.trim()) {
      noteCount++;
    } else {
      silentSpendCount++;
      silentSpendTotal += exp.amount;
    }
  }

  const days = Object.keys(dailyMap);
  const dailyValues = Object.values(dailyMap);

  const avgDailySpend =
    days.length > 0 ? totalSpent / days.length : 0;

  const maxDailySpend = Math.max(...dailyValues, 0);
  const minDailySpend =
    dailyValues.length > 0 ? Math.min(...dailyValues) : 0;

  /* ---------------- Category Breakdown ---------------- */

  const categoryBreakdown = Object.entries(categoryMap).map(
    ([category, amount]) => ({
      category,
      amount,
      percent: totalSpent
        ? Math.round((amount / totalSpent) * 100)
        : 0,
    })
  );

  categoryBreakdown.sort((a, b) => b.amount - a.amount);

  const topCategory = categoryBreakdown[0] || null;

  /* ---------------- Last 7 Days Trend ---------------- */

  const today = new Date();
  const last7DaysTrend = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().split("T")[0];

    last7DaysTrend.push({
      date: key,
      amount: dailyMap[key] || 0,
    });
  }

  /* ---------------- Spend Heatmap ---------------- */

  const spendHeatmap = Object.entries(dailyMap).map(
    ([date, total]) => {
      let intensity = 1;
      if (total > avgDailySpend * 1.5) intensity = 3;
      else if (total > avgDailySpend) intensity = 2;

      return { date, total, intensity };
    }
  );

  /* ---------------- Projection ---------------- */

  const projectionSpend = {
    baseAmount: Math.round(avgDailySpend),
    projectedAmount: Math.round(avgDailySpend * 30),
  };

  return {
    totalSpent,
    avgDailySpend,
    maxDailySpend,
    minDailySpend,
    maxSingleExpense,
    totalTransactions: expenses.length,
    noteUsageRate:
      expenses.length > 0 ? noteCount / expenses.length : 0,

    // Existing
    categoryBreakdown,
    last7DaysTrend,
    topCategory,

    // NEW
    silentSpends: {
      count: silentSpendCount,
      totalAmount: silentSpendTotal,
    },
    projectionSpend,
    spendHeatmap,
  };
}
