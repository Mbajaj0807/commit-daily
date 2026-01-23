import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

import ExpenseEmojiPicker from '../common/ExpenseEmoji';

import '../../styles/finance.css';

const AddExpenseForm = ({ onClose, onSubmit }) => {
  const [expenses, setExpenses] = useState([
    {
      name: '',
      amount: '',
      category: 'Food',
      note: '',
      emoji: '💸',
    },
  ]);

  const [loading, setLoading] = useState(false);

  const categories = [
    'Food',
    'Travel',
    'Shopping',
    'Bills',
    'Health',
    'Entertainment',
    'Other',
  ];

  const handleChange = (index, field, value) => {
    const updated = [...expenses];
    updated[index][field] = value;
    setExpenses(updated);
  };

  const addAnotherExpense = () => {
    setExpenses(prev => [
      ...prev,
      {
        name: '',
        amount: '',
        category: 'Food',
        note: '',
        emoji: '💸',
      },
    ]);
  };

  const removeExpense = (index) => {
    setExpenses(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    for (const exp of expenses) {
      if (!exp.name.trim()) {
        alert('Expense name is required');
        return;
      }
      if (!exp.amount || exp.amount <= 0) {
        alert('Enter a valid amount');
        return;
      }
    }

    setLoading(true);

    try {
      // IMPORTANT: one API call per expense
      for (const exp of expenses) {
        await onSubmit({
          name: exp.name.trim(),
          amount: Number(exp.amount),
          category: exp.category,
          note: exp.note.trim(),
          emoji: exp.emoji,
        });
      }

      onClose();
    } catch (err) {
      alert(err.message || 'Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">Add Expense</h2>
          <button className="modal-close-button" onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            {expenses.map((expense, index) => (
              <div key={index} className="expense-form-card">
                {/* Header */}
                <div className="expense-form-card-header">
                  <span>Expense {index + 1}</span>
                  {expenses.length > 1 && (
                    <button
                      type="button"
                      className="remove-expense-button"
                      onClick={() => removeExpense(index)}
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Name */}
                <div className="form-field">
                  <label className="form-field-label">Name</label>
                  <input
                    type="text"
                    className="form-text-input"
                    value={expense.name}
                    onChange={(e) =>
                      handleChange(index, 'name', e.target.value)
                    }
                  />
                </div>

                {/* Amount */}
                <div className="form-field">
                  <label className="form-field-label">Amount</label>
                  <input
                    type="number"
                    className="form-text-input"
                    value={expense.amount}
                    onChange={(e) =>
                      handleChange(index, 'amount', e.target.value)
                    }
                    min="0"
                  />
                </div>

                {/* Category */}
                <div className="form-field">
                  <label className="form-field-label">Category</label>
                  <select
                    className="category-select"
                    value={expense.category}
                    onChange={(e) =>
                      handleChange(index, 'category', e.target.value)
                    }
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Emoji */}
                <div className="form-field">
                  <label className="form-field-label">Emoji</label>
                  <ExpenseEmojiPicker
                  value={expense.emoji}
                  onChange={(emoji) => handleChange(index, 'emoji', emoji)}
                  />

                </div>

                {/* Note */}
                <div className="form-field">
                  <label className="form-field-label">Note (optional)</label>
                  <input
                    type="text"
                    className="form-text-input"
                    placeholder="Any extra detail"
                    value={expense.note}
                    onChange={(e) =>
                      handleChange(index, 'note', e.target.value)
                    }
                  />
                </div>
              </div>
            ))}

            {/* Add another */}
            <button
              type="button"
              className="add-another-expense-button"
              onClick={addAnotherExpense}
            >
              <Plus size={16} />
              Add another expense
            </button>

            {/* Submit */}
            <button
              type="submit"
              className="form-submit-button"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Expenses'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddExpenseForm;
