import express from "express";
import { protect } from "../middleware/auth.js";
import Expense from "../models/Expense.js";

const router = express.Router();

/**
 * @route   POST /api/finance/addexpense
 * @desc    Add a new expense
 * @access  Private
 */
router.post("/addexpense", protect, async (req, res) => {
  try {
    const { name, date, amount, category, note } = req.body;

    if (!date || amount === undefined) {
      return res.status(400).json({
        success: false,
        message: "Name Date and amount are required"
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than 0"
      });
    }

    const expense = await Expense.create({
      userId: req.user._id,
      name,
      date,
      amount,
      category,
      note
    });

    res.status(201).json({
      success: true,
      data: expense
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @route   GET /api/finance/expenses
 * @desc    Get expenses by date range
 * @access  Private
 * @query   start=YYYY-MM-DD&end=YYYY-MM-DD
 */
router.get("/expenses", protect, async (req, res) => {
  try {
    const { start, end } = req.query;

    if (!start || !end) {
      return res.status(400).json({
        success: false,
        message: "Start and end dates are required"
      });
    }

    const expenses = await Expense.find({
      userId: req.user._id,
      date: { $gte: start, $lte: end }
    }).sort({ date: -1 });

    const sum = expenses.reduce((acc, curr) => acc + curr.amount, 0);

    res.json({
      success: true,
      data: expenses,sum
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @route   GET /api/finance/today
 * @desc    Get today's total spending
 * @access  Private
 */
router.get("/today", protect, async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const result = await Expense.aggregate([
      {
        $match: {
          userId: req.user._id,
          date: today
        }
      },
      {
        $group: {
          _id: "$date",
          totalSpent: { $sum: "$amount" }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        date: today,
        totalSpent: result[0]?.totalSpent || 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @route   GET /api/finance/monthly
 * @desc    Get monthly finance summary
 * @access  Private
 * @query   month=MM&year=YYYY
 */
router.get("/monthly", protect, async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({
        success: false,
        message: "Month and year are required"
      });
    }

    const startDate = `${year}-${month.padStart(2, "0")}-01`;
    const endDate = `${year}-${month.padStart(2, "0")}-31`;

    const expenses = await Expense.aggregate([
      {
        $match: {
          userId: req.user._id,
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            date: "$date",
            category: "$category"
          },
          amount: { $sum: "$amount" }
        }
      }
    ]);

    let totalSpent = 0;
    const byCategory = {};
    const daily = {};

    expenses.forEach((e) => {
      totalSpent += e.amount;

      byCategory[e._id.category] =
        (byCategory[e._id.category] || 0) + e.amount;

      daily[e._id.date] = (daily[e._id.date] || 0) + e.amount;
    });

    res.json({
      success: true,
      data: {
        totalSpent,
        avgDailySpend: totalSpent / Object.keys(daily).length || 0,
        byCategory,
        daily: Object.entries(daily).map(([date, amount]) => ({
          date,
          amount
        }))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @route   DELETE /api/finance/:id
 * @desc    Delete an expense
 * @access  Private
 */
router.delete("/:id", protect, async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found"
      });
    }

    res.json({
      success: true
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
