import express from "express";
import { protect } from "../middleware/auth.js";
import User from "../models/User.js";

const router = express.Router();

/* ======================================================
   SET POCKET MONEY DAY (Recurring, No Year)
   ====================================================== */

// @route   POST /api/profile/setpocketmoneydate
// @desc    Set recurring pocket money day (1–31)
// @access  Private
router.post("/setpocketmoneydate", protect, async (req, res) => {
  try {
    const { day } = req.body;

    if (!day || typeof day !== "number") {
      return res.status(400).json({
        success: false,
        message: "Pocket money day is required (number)",
      });
    }

    if (day < 1 || day > 31) {
      return res.status(400).json({
        success: false,
        message: "Pocket money day must be between 1 and 31",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { pocketMoneyDay: day },
      { new: true }
    );

    res.json({
      success: true,
      data: {
        pocketMoneyDay: user.pocketMoneyDay,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* ======================================================
   GET POCKET MONEY DAY
   ====================================================== */

// @route   GET /api/profile/getpocketmoneydate
// @desc    Get user's pocket money day
// @access  Private
router.get("/getpocketmoneydate", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("pocketMoneyDay");

    res.json({
      success: true,
      data: {
        pocketMoneyDay: user.pocketMoneyDay || null,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* ======================================================
   SET MONTHLY BUDGET
   ====================================================== */

// @route   POST /api/profile/setbudget
// @desc    Set monthly budget
// @access  Private
router.post("/setbudget", protect, async (req, res) => {
  try {
    const { amount } = req.body;

    if (typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Budget amount must be a positive number",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { monthlyBudget: amount },
      { new: true }
    );

    res.json({
      success: true,
      data: {
        monthlyBudget: user.monthlyBudget,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* ======================================================
   GET MONTHLY BUDGET
   ====================================================== */

// @route   GET /api/profile/getbudget
// @desc    Get user's monthly budget
// @access  Private
router.get("/getbudget", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("monthlyBudget");

    res.json({
      success: true,
      data: {
        monthlyBudget: user.monthlyBudget || null,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export default router;
