// services/financeAggregates.js

export function computeMoneyAggregates(expenses, options = {}) {
  const dailyMap = {};
  const categoryMap = {};
  let totalSpent = 0;
  let maxSingleExpense = 0;
  let noteCount = 0;

  // Silent spends
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

  // FIXED: Calculate average based on ALL days in cycle, not just spending days
  let avgDailySpend = 0;
  let actualDaysInCycle = days.length;

  if (options.monthlyBudget && options.pocketMoneyDay) {
    const now = new Date();
    let cycleStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      options.pocketMoneyDay
    );
    if (cycleStart > now) {
      cycleStart.setMonth(cycleStart.getMonth() - 1);
    }
    actualDaysInCycle = Math.max(
      Math.floor((now - cycleStart) / (1000 * 60 * 60 * 24)) + 1,
      1
    );
    avgDailySpend = actualDaysInCycle > 0 ? totalSpent / actualDaysInCycle : 0;
  } else {
    // Fallback to old logic if budget options not provided
    avgDailySpend = days.length > 0 ? totalSpent / days.length : 0;
  }

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

  /* ---------------- Budget Insights ---------------- */

  let budgetInsights = null;

  if (
    options.monthlyBudget &&
    options.pocketMoneyDay
  ) {
    const now = new Date();

    // Compute current cycle start date
    let cycleStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      options.pocketMoneyDay
    );

    // If pocket money day hasn't arrived yet this month
    if (cycleStart > now) {
      cycleStart.setMonth(cycleStart.getMonth() - 1);
    }

    const daysPassed = Math.max(
      Math.floor((now - cycleStart) / (1000 * 60 * 60 * 24)) + 1,
      1
    );

    const cycleLength = 30; // logical cycle
    const remainingDays = Math.max(cycleLength - daysPassed, 0);

    const remainingBudget =
      options.monthlyBudget - totalSpent;

    const budgetUsedPercent = options.monthlyBudget
      ? Math.round((totalSpent / options.monthlyBudget) * 100)
      : 0;

    const safeDailySpend =
      remainingDays > 0
        ? Math.round(remainingBudget / remainingDays)
        : 0;

    budgetInsights = {
      monthlyBudget: options.monthlyBudget,
      totalSpent,
      remainingBudget,
      budgetUsedPercent,
      daysPassed,
      remainingDays,
      safeDailySpend,
      isOverBudget: remainingBudget < 0,
    };
  }

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

    // Silent spending
    silentSpends: {
      count: silentSpendCount,
      totalAmount: silentSpendTotal,
    },

    // Projection
    projectionSpend,

    // Heatmap
    spendHeatmap,

    // Budget insights
    budgetInsights,
  };
}