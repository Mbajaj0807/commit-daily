import api from "./api";

const financeService = {
  addExpense(data) {
    return api.post("/finance/addexpense", data);
  },

  getTodaySpend() {
    console.log("API TRIGGERED")
    return api.get("/finance/today");
  },

  getExpensesByRange(start, end) {
    return api.get(`/finance/expenses?start=${start}&end=${end}`);
  },

  getMonthlySummary(month, year) {
    return api.get(`/finance/monthly?month=${month}&year=${year}`);
  },

  deleteExpense(id) {
    return api.delete(`/finance/${id}`);
  }
};

export default financeService;
