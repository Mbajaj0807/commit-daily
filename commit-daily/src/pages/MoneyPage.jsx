import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import BottomNavigation from "../components/layout/BottomNavigation";
import ExpenseItem from "../components/finance/ExpenseItem";
import MoneyDateHeader from "../components/finance/MoneyDateHeader";
import financeService from "../services/finance.service";
import AddExpenseForm from "../components/finance/AddExpenseForm";

import "../styles/finance.css";

const MoneyPage = () => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddExpense, setShowAddExpense] = useState(false);

  useEffect(() => {
    fetchExpensesForDate(selectedDate);
  }, [selectedDate]);

  const fetchExpensesForDate = async (date) => {
    try {
      setLoading(true);
      setError("");

      const res = await financeService.getExpensesByRange(date, date);
      setExpenses(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch expenses:", err);
      setError("Failed to load expenses");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- Add Expense ---------------- */

  const handleAddExpense = async (expenseData) => {
    await financeService.addExpense({
      ...expenseData,
      date: selectedDate,
    });

    // refresh list
    fetchExpensesForDate(selectedDate);
  };

  /* ---------------- Date Navigation ---------------- */

  const goToPreviousDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d.toISOString().split("T")[0]);
  };

  const goToNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d.toISOString().split("T")[0]);
  };

  const openCalendar = () => {
    alert("Calendar / range picker coming next");
  };

  const formatDateLabel = () => {
    const today = new Date().toISOString().split("T")[0];
    if (selectedDate === today) return "Today";

    return new Date(selectedDate).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="money-page">
      {/* Header */}
      <div className="money-header">
        <h1 className="money-title">Money</h1>

        <button
          className="money-add-button"
          onClick={() => setShowAddExpense(true)}
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Date Selector */}
      <MoneyDateHeader
        dateLabel={formatDateLabel()}
        onPrevDay={goToPreviousDay}
        onNextDay={goToNextDay}
        onOpenCalendar={openCalendar}
      />

      {/* Expenses */}
      <div className="money-content">
        {loading ? (
          <div className="loading">Loading expenses...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : expenses.length === 0 ? (
          <div className="empty-expenses">
            <div className="empty-expenses-icon">💸</div>
            <div className="empty-expenses-text">
              No expenses logged for this day
            </div>
          </div>
        ) : (
          <div className="expense-list">
            {expenses.map((expense) => (
              <ExpenseItem key={expense._id} expense={expense} />
            ))}
          </div>
        )}
      </div>

      {/* Add Expense Modal */}
      {showAddExpense && (
        <AddExpenseForm
          onClose={() => setShowAddExpense(false)}
          onSubmit={handleAddExpense}
        />
      )}

      <BottomNavigation />
    </div>
  );
};

export default MoneyPage;
