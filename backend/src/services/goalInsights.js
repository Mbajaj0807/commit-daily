// services/goalInsights.js

export function generateGoalInsights(agg, goals) {
  const insights = [];

  /* -------- Overall Stats -------- */

  insights.push({
    id: "goal_completion_rate",
    domain: "goals",
    type: "stat",
    title: "Overall completion rate",
    value: `${agg.completionRate}%`,
    context: "All tracked goals",
    confidence: "high",
  });

  insights.push({
    id: "monthly_completion_rate",
    domain: "goals",
    type: "stat",
    title: "This month's performance",
    value: `${agg.monthlyStats.monthlyCompletionRate}%`,
    context: `${agg.monthlyStats.goalsCompleted}/${agg.monthlyStats.goalsAttempted} goals completed`,
    confidence: "high",
  });

  insights.push({
    id: "perfect_days",
    domain: "goals",
    type: "stat",
    title: "Perfect days",
    value: `${agg.monthlyStats.perfectDays}`,
    context: "All goals completed",
    confidence: "high",
  });

  insights.push({
    id: "average_goals_per_day",
    domain: "goals",
    type: "stat",
    title: "Average goals/day",
    value: `${agg.monthlyStats.averageGoalsPerDay}`,
    context: "This month",
    confidence: "high",
  });

  /* -------- Compliments / Insults based on Completion Rate -------- */

  if (agg.completionRate >= 90) {
    insights.push({
      id: "completion_compliment",
      domain: "goals",
      type: "reflection",
      title: "🔥 Absolute beast mode!",
      context: `${agg.completionRate}% completion rate. You're crushing it!`,
      severity: "positive",
      confidence: "high",
    });
  } else if (agg.completionRate >= 75) {
    insights.push({
      id: "completion_compliment",
      domain: "goals",
      type: "reflection",
      title: "💪 Strong consistency!",
      context: `${agg.completionRate}% completion. Keep this momentum going!`,
      severity: "positive",
      confidence: "high",
    });
  } else if (agg.completionRate >= 50) {
    insights.push({
      id: "completion_warning",
      domain: "goals",
      type: "alert",
      title: "⚠️ You can do better",
      context: `${agg.completionRate}% completion. Time to step up your game.`,
      severity: "warning",
      confidence: "high",
    });
  } else {
    insights.push({
      id: "completion_insult",
      domain: "goals",
      type: "alert",
      title: "😬 This is embarrassing",
      context: `${agg.completionRate}% completion rate? Are you even trying?`,
      severity: "negative",
      confidence: "high",
    });
  }

  /* -------- Monthly Performance Feedback -------- */

  if (agg.monthlyStats.perfectDays >= 5) {
    insights.push({
      id: "perfect_days_compliment",
      domain: "goals",
      type: "reflection",
      title: "⭐ Perfectionist vibes",
      context: `${agg.monthlyStats.perfectDays} perfect days this month! Legendary!`,
      severity: "positive",
      confidence: "high",
    });
  } else if (agg.monthlyStats.perfectDays === 0 && agg.monthlyStats.totalDays >= 7) {
    insights.push({
      id: "perfect_days_insult",
      domain: "goals",
      type: "alert",
      title: "😤 Not even one perfect day?",
      context: "Come on, you can do better than this.",
      severity: "negative",
      confidence: "high",
    });
  }

  /* -------- Discipline Trend -------- */

  if (agg.disciplineTrend === "improving") {
    insights.push({
      id: "discipline_trend",
      domain: "goals",
      type: "reflection",
      title: "📈 On the rise!",
      context: "Your consistency is improving. Keep it up!",
      severity: "positive",
      confidence: "medium",
    });
  } else if (agg.disciplineTrend === "declining") {
    insights.push({
      id: "discipline_trend",
      domain: "goals",
      type: "alert",
      title: "📉 Slipping away",
      context: "Your discipline is declining. Get back on track!",
      severity: "negative",
      confidence: "medium",
    });
  } else {
    insights.push({
      id: "discipline_trend",
      domain: "goals",
      type: "reflection",
      title: "➡️ Staying steady",
      context: "Consistency maintained. Can you push harder?",
      severity: "neutral",
      confidence: "medium",
    });
  }

  /* -------- Streak Analysis -------- */

  if (agg.longestStreakGoal) {
    const goalName = goals.find(g => g._id.toString() === agg.longestStreakGoal.goalId)?.name || "Unknown";
    
    if (agg.longestStreakGoal.bestStreak >= 7) {
      insights.push({
        id: "strongest_goal",
        domain: "goals",
        type: "reflection",
        title: "🏆 Champion habit",
        value: goalName,
        context: `${agg.longestStreakGoal.bestStreak} day streak! This is your superpower!`,
        severity: "positive",
        confidence: "high",
      });
    } else {
      insights.push({
        id: "strongest_goal",
        domain: "goals",
        type: "reflection",
        title: "💎 Best habit",
        value: goalName,
        context: `${agg.longestStreakGoal.bestStreak} day streak`,
        confidence: "high",
      });
    }
  }

  if (agg.weakestStreakGoal && agg.weakestStreakGoal.currentStreak < 3) {
    const goalName = goals.find(g => g._id.toString() === agg.weakestStreakGoal.goalId)?.name || "Unknown";
    
    insights.push({
      id: "weakest_goal",
      domain: "goals",
      type: "alert",
      title: "🚨 Wake up call",
      value: goalName,
      context: `Only ${agg.weakestStreakGoal.currentStreak} day streak. This needs work!`,
      severity: "negative",
      confidence: "medium",
    });
  }

  /* -------- Per-Goal Stats -------- */

  agg.goalWiseStats.forEach(goalStat => {
    const goal = goals.find(g => g._id.toString() === goalStat.goalId);
    if (!goal) return;

    let message = "";
    let severity = "neutral";

    if (goalStat.completionRate >= 90) {
      message = `${goalStat.goalEmoji} ${goalStat.goalName}: ${goalStat.completionRate}% - Absolutely killing it! 🔥`;
      severity = "positive";
    } else if (goalStat.completionRate >= 70) {
      message = `${goalStat.goalEmoji} ${goalStat.goalName}: ${goalStat.completionRate}% - Solid work! 💪`;
      severity = "positive";
    } else if (goalStat.completionRate >= 50) {
      message = `${goalStat.goalEmoji} ${goalStat.goalName}: ${goalStat.completionRate}% - Needs improvement ⚠️`;
      severity = "warning";
    } else {
      message = `${goalStat.goalEmoji} ${goalStat.goalName}: ${goalStat.completionRate}% - This is weak 😬`;
      severity = "negative";
    }

    insights.push({
      id: `goal_stat_${goalStat.goalId}`,
      domain: "goals",
      type: "reflection",
      title: `${goalStat.goalEmoji} ${goalStat.goalName}`,
      value: `${goalStat.completionRate}%`,
      context: `${goalStat.completed}/${goalStat.attempts} completed | ${goalStat.currentStreak}🔥 streak`,
      severity,
      confidence: "high",
    });
  });

  /* -------- Visual Charts -------- */

  insights.push({
    id: "last_7_days_goals",
    domain: "goals",
    type: "visual",
    title: "Last 7 days completion %",
    data: agg.last7DaysCompletion,
    confidence: "high",
  });

  insights.push({
    id: "daily_goals_completed",
    domain: "goals",
    type: "visual",
    title: "Daily goals completed",
    data: agg.dailyGoalsCompleted,
    confidence: "high",
  });

  // Per-goal 7-day progress
  agg.last7DaysGoalProgress.forEach(goalProgress => {
    insights.push({
      id: `goal_7day_${goalProgress.goalId}`,
      domain: "goals",
      type: "visual",
      title: `$${goalProgress.goalName} - Last 7 days`,
      data: goalProgress.progressData,
      context: `${goalProgress.weeklyCompletion}% this week`,
      confidence: "high",
    });
  });

  return insights;
}