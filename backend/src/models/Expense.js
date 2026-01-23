// models/Expense.js
import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    name: {
      type: String, 
      required: true,
      index: true
    },

    date: {
      type: String, // YYYY-MM-DD
      required: true,
      index: true
    },

    amount: {
      type: Number,
      required: true,
      min: 0
    },

    category: {
      type: String,
      enum: [
        "Food",
        "Transport",
        "Entertainment",
        "Essentials",
        "Health",
        "Shopping",
        "Other"
      ],
      default: "Other"
    },

    note: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Expense", ExpenseSchema);
