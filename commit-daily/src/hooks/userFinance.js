import { useState } from "react";
import financeService from "../services/finance.service";

export default function useFinance() {
  const [todaySpend, setTodaySpend] = useState(0);
  const [monthly, setMonthly] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchTodaySpend = async () => {
    const res = await financeService.getTodaySpend();
    setTodaySpend(res.data.totalSpent);
  };

  const addExpense = async (expense) => {
    await financeService.addExpense(expense);
    await fetchTodaySpend();
  };

  const fetchMonthlySummary = async (month, year) => {
    setLoading(true);
    const res = await financeService.getMonthlySummary(month, year);
    setMonthly(res.data);
    setLoading(false);
  };

  return {
    todaySpend,
    monthly,
    loading,
    addExpense,
    fetchTodaySpend,
    fetchMonthlySummary
  };
}
