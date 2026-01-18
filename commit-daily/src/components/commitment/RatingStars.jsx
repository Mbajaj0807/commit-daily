// src/components/commitment/RatingStars.jsx

import React from 'react';
import { Star } from 'lucide-react';
import '../../styles/commitment.css';

const RatingStars = ({ value, onChange }) => {
  const stars = [1, 2, 3, 4, 5];

  const handleStarClick = (rating) => {
    onChange(rating);
  };

  return (
    <div className="rating-stars-container">
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          className="star-button"
          onClick={() => handleStarClick(star)}
          aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
        >
          <Star
            className={`star-icon ${value >= star ? 'filled' : ''}`}
            fill={value >= star ? '#FFD700' : 'none'}
            strokeWidth={2}
          />
        </button>
      ))}
    </div>
  );
};

export default RatingStars;