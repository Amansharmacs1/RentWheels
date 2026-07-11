import React from 'react';

const RatingStars = ({ rating, setRating, readOnly = false, size = '1.2rem' }) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div style={{ display: 'flex', gap: '4px', cursor: readOnly ? 'default' : 'pointer' }}>
      {stars.map((star) => (
        <span
          key={star}
          onClick={() => !readOnly && setRating && setRating(star)}
          style={{
            fontSize: size,
            color: star <= rating ? '#fbbf24' : '#e5e7eb',
            transition: 'color 0.2s'
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default RatingStars;
