// src/components/common/EmojiPicker.jsx

import React, { useState, useRef, useEffect } from 'react';
import '../../styles/emoji-picker.css';

const EmojiPicker = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef(null);

  // Organized emoji categories
  const emojiCategories = {
    'Fitness & Sports': ['💪', '🏋️', '🤸', '🏃', '🚴', '⚽', '🏀', '🎾', '🏊', '🧘'],
    'Health & Wellness': ['💧', '🍎', '🥗', '🧠', '❤️', '🫀', '🫁', '💊', '🩺', '😴'],
    'Study & Learning': ['📚', '📖', '✏️', '📝', '🎓', '🧑‍🎓', '👨‍🏫', '💡', '🔬', '🧪'],
    'Work & Productivity': ['💼', '💻', '⌨️', '📊', '📈', '📉', '🎯', '✅', '📋', '🗂️'],
    'Time & Planning': ['⏰', '⏲️', '⏱️', '🕐', '📅', '📆', '🗓️', '⌛', '⏳', '🔔'],
    'Food & Nutrition': ['🍎', '🥕', '🥦', '🥗', '🍇', '🍊', '🥑', '🫐', '🍓', '🥤'],
    'Mind & Focus': ['🧘', '🧠', '💭', '🎯', '🔍', '👁️', '🧑‍💻', '📖', '✨', '💫'],
    'Social & People': ['👥', '👫', '👬', '👭', '🤝', '💬', '📞', '👋', '🙏', '❤️'],
    'Goals & Achievement': ['🎯', '🏆', '🥇', '🥈', '🥉', '🎖️', '⭐', '✨', '🌟', '💎'],
    'Other': ['🔥', '💯', '✔️', '🎉', '🎊', '🚀', '⚡', '🌈', '🎨', '🎵'],
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
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

  const handleEmojiSelect = (emoji) => {
    onChange(emoji);
    setIsOpen(false);
  };

  return (
    <div className="emoji-picker-container" ref={pickerRef}>
      <div className="emoji-input-wrapper">
        <button
          type="button"
          className="emoji-display-button"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="emoji-display">{value || '🎯'}</span>
        </button>
        <input
          type="text"
          className="emoji-text-input"
          placeholder="Or type emoji"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={2}
        />
      </div>

      {isOpen && (
        <div className="emoji-picker-dropdown">
          <div className="emoji-picker-header">
            <span className="emoji-picker-title">Choose an emoji</span>
          </div>
          <div className="emoji-picker-content">
            {Object.entries(emojiCategories).map(([category, emojis]) => (
              <div key={category} className="emoji-category">
                <div className="emoji-category-title">{category}</div>
                <div className="emoji-grid">
                  {emojis.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      className={`emoji-option ${value === emoji ? 'selected' : ''}`}
                      onClick={() => handleEmojiSelect(emoji)}
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

export default EmojiPicker;