// services/goalAggregates.js

export function computeGoalAggregates({ goals, entries, streaks }) {
  const activeGoals = goals.filter(g => g.isActive);
  const totalGoals = activeGoals.length;

  if (totalGoals === 0) {
    return {
      totalGoals: 0,
      activeGoals: 0,
      completionRate: 0,
      longestStreakGoal: null,
      weakestStreakGoal: null,
      last7DaysCompletion: [],
      last7DaysGoalProgress: [],
      disciplineTrend: "stable",
      goalWiseStats: [],
      monthlyStats: {
        totalDays: 0,
        goalsCompleted: 0,
        goalsAttempted: 0,
        perfectDays: 0,
        averageGoalsPerDay: 0
      },
      dailyGoalsCompleted: []
    };
  }

  let completedCount = 0;
  let possibleCount = 0;

  const goalCompletionMap = {};
  const goalAttemptsMap = {};
  const dailyCompletionMap = {};
  const dailyGoalsCountMap = {};

  // Per-goal tracking
  const goalLast7Days = {};
  activeGoals.forEach(goal => {
    goalLast7Days[goal._id] = {};
    goalCompletionMap[goal._id] = 0;
    goalAttemptsMap[goal._id] = 0;
  });

  // Process entries
  entries.forEach(entry => {
    let dayCompleted = 0;
    let dayPossible = 0;

    activeGoals.forEach(goal => {
      const goalId = goal._id.toString(); // Convert ObjectId to string
      
      // Handle both Map and Object for goalStatus
      const value = entry.goalStatus instanceof Map 
        ? entry.goalStatus.get(goalId)
        : entry.goalStatus?.[goalId];
      
      const hasValue = value !== undefined && value !== null;

      if (hasValue) {
        goalAttemptsMap[goal._id]++;
        dayPossible++;
        possibleCount++;
      }

      const isCompleted = 
        (goal.type === "boolean" && value === true) ||
        (goal.type === "numeric" && value >= goal.targetValue);

      if (isCompleted) {
        completedCount++;
        dayCompleted++;
        goalCompletionMap[goal._id]++;
      }

      // Track per goal for last 7 days
      goalLast7Days[goal._id][entry.date] = isCompleted ? 1 : 0;
    });

    if (dayPossible > 0) {
      dailyCompletionMap[entry.date] = Math.round(
        (dayCompleted / dayPossible) * 100
      );
      dailyGoalsCountMap[entry.date] = dayCompleted;
    }
  });

  const completionRate =
    possibleCount > 0 ? Math.round((completedCount / possibleCount) * 100) : 0;

  /* -------- Streak Analysis -------- */
  const goalStreaks = streaks.filter(s => s.goalId && s.goalId !== "overall");

  const sortedByBest = [...goalStreaks].sort((a, b) => b.bestStreak - a.bestStreak);
  const longestStreakGoal = sortedByBest[0] || null;

  const sortedByCurrent = [...goalStreaks].sort((a, b) => a.currentStreak - b.currentStreak);
  const weakestStreakGoal = sortedByCurrent[0] || null;

  /* -------- Last 7 Days Overall Completion -------- */
  const today = new Date();
  const last7DaysCompletion = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().split("T")[0];

    last7DaysCompletion.push({
      date: key,
      completion: dailyCompletionMap[key] || 0,
    });
  }

  /* -------- Last 7 Days Per Goal Progress -------- */
  const last7DaysGoalProgress = activeGoals.map(goal => {
    const progressData = [];
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().split("T")[0];
      
      progressData.push({
        date: key,
        completed: goalLast7Days[goal._id][key] || 0
      });
    }

    const completedInWeek = progressData.filter(p => p.completed === 1).length;

    return {
      goalId: goal._id,
      goalName: goal.name,
      goalEmoji: goal.emoji,
      progressData,
      weeklyCompletion: Math.round((completedInWeek / 7) * 100)
    };
  });

  /* -------- Goal-wise Stats -------- */
  const goalWiseStats = activeGoals.map(goal => {
    const attempts = goalAttemptsMap[goal._id] || 0;
    const completed = goalCompletionMap[goal._id] || 0;
    const rate = attempts > 0 ? Math.round((completed / attempts) * 100) : 0;

    const goalStreak = goalStreaks.find(s => s.goalId === goal._id);

    return {
      goalId: goal._id,
      goalName: goal.name,
      goalEmoji: goal.emoji,
      completionRate: rate,
      completed,
      attempts,
      currentStreak: goalStreak?.currentStreak || 0,
      bestStreak: goalStreak?.bestStreak || 0
    };
  });

  /* -------- Monthly Stats -------- */
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthlyEntries = entries.filter(entry => {
    const entryDate = new Date(entry.date);
    return entryDate.getMonth() === currentMonth && 
           entryDate.getFullYear() === currentYear;
  });

  let monthlyGoalsCompleted = 0;
  let monthlyGoalsAttempted = 0;
  let perfectDays = 0;

  monthlyEntries.forEach(entry => {
    let dayCompleted = 0;
    let dayTotal = 0;

    activeGoals.forEach(goal => {
      const goalId = goal._id.toString(); // Convert ObjectId to string
      
      // Handle both Map and Object for goalStatus
      const value = entry.goalStatus instanceof Map 
        ? entry.goalStatus.get(goalId)
        : entry.goalStatus?.[goalId];
      
      const hasValue = value !== undefined && value !== null;

      if (hasValue) {
        dayTotal++;
        monthlyGoalsAttempted++;
      }

      const isCompleted = 
        (goal.type === "boolean" && value === true) ||
        (goal.type === "numeric" && value >= goal.targetValue);

      if (isCompleted) {
        dayCompleted++;
        monthlyGoalsCompleted++;
      }
    });

    if (dayTotal > 0 && dayCompleted === dayTotal) {
      perfectDays++;
    }
  });

  const monthlyStats = {
    totalDays: monthlyEntries.length,
    goalsCompleted: monthlyGoalsCompleted,
    goalsAttempted: monthlyGoalsAttempted,
    perfectDays,
    averageGoalsPerDay: monthlyEntries.length > 0 
      ? (monthlyGoalsCompleted / monthlyEntries.length).toFixed(1)
      : 0,
    monthlyCompletionRate: monthlyGoalsAttempted > 0
      ? Math.round((monthlyGoalsCompleted / monthlyGoalsAttempted) * 100)
      : 0
  };

  /* -------- Daily Goals Completed (Chart Data) -------- */
  const dailyGoalsCompleted = [];
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().split("T")[0];

    dailyGoalsCompleted.push({
      date: key,
      count: dailyGoalsCountMap[key] || 0
    });
  }

  /* -------- Discipline Trend -------- */
  const values = Object.values(dailyCompletionMap);
  let disciplineTrend = "stable";

  if (values.length >= 3) {
    const recent = values.slice(-3);
    if (recent[2] > recent[0]) disciplineTrend = "improving";
    if (recent[2] < recent[0]) disciplineTrend = "declining";
  }

  return {
    totalGoals,
    activeGoals: activeGoals.length,
    completionRate,
    longestStreakGoal,
    weakestStreakGoal,
    last7DaysCompletion,
    last7DaysGoalProgress,
    disciplineTrend,
    goalWiseStats,
    monthlyStats,
    dailyGoalsCompleted
  };
}