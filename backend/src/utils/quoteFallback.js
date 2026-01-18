export function ruleBasedQuote(stats) {
  if (stats.currentStreak >= 7)
    return "Consistency is starting to feel natural — that’s progress.";

  if (stats.streakBrokenToday)
    return "A break doesn’t erase the effort you’ve already made.";

  return "Show up today. That’s enough.";
}
