import React, { useState, useRef, useEffect } from 'react';
import '../../styles/emoji-picker.css';

const ExpenseEmojiPicker = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef(null);

  // Expense-focused categories
  const emojiCategories = {
    Food: ['🍔', '🍕', '🍜', '☕', '🍩', '🍺', '🥗', '🍟'],
    Travel: ['🚗', '🚌', '🚕', '✈️', '🚆', '🛵', '⛽'],
    Shopping: ['🛍️', '👕', '👟', '🎧', '📱', '🧾'],
    Bills: ['💡', '💧', '📱', '🏠', '📄', '💳'],
    Health: ['💊', '🩺', '🏥', '🧘', '💪'],
    Entertainment: ['🎬', '🎮', '🎵', '🍿', '🎟️'],
    Money: ['💰', '💸', '🪙', '📉', '📈'],
    Other: ['🧾', '📦', '🎁', '❓'],
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (emoji) => {
    onChange(emoji);
    setIsOpen(false);
  };

  return (
    <div className="emoji-picker-container" ref={pickerRef}>
      <button
        type="button"
        className="emoji-display-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="emoji-display">{value || '💸'}</span>
      </button>

      {isOpen && (
        <div className="emoji-picker-dropdown">
          <div className="emoji-picker-content">
            {Object.entries(emojiCategories).map(([category, emojis]) => (
              <div key={category} className="emoji-category">
                <div className="emoji-category-title">{category}</div>
                <div className="emoji-grid">
                  {emojis.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      className={`emoji-option ${
                        value === emoji ? 'selected' : ''
                      }`}
                      onClick={() => handleSelect(emoji)}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseEmojiPicker;
