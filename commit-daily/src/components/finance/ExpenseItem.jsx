import React from "react";
import "../../styles/finance.css";

const categoryEmojiMap = {
  Food: "🍔",
  Transport: "🚕",
  Entertainment: "🎬",
  Essentials: "🧾",
  Health: "💊",
  Shopping: "🛍️",
  Other: "💰",
};

const ExpenseItem = ({ expense }) => {
  const {
    name,
    amount,
    category = "Other",
    note = "",
  } = expense;

  const emoji = categoryEmojiMap[category] || "💰";

  return (
    <div className="expense-item">
      {/* Left: Emoji */}
      <div className="expense-item-icon">
        {emoji}
      </div>

      {/* Middle: Info */}
      <div className="expense-item-info">
        <div className="expense-item-title">
          {name || category}
        </div>
        <div className="expense-item-category">
          {category}
        </div>
        <div className="expense-item-category">
          {note}
        </div>
      </div>

      {/* Right: Amount */}
      <div className="expense-item-amount">
        ₹{amount}
      </div>
    </div>
  );
};

export default ExpenseItem;
