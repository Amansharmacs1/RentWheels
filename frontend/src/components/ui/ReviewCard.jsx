import React from 'react';
import RatingStars from './RatingStars';
import Card from './Card';

const ReviewCard = ({ review }) => {
  return (
    <Card style={{ padding: '1.5rem', marginBottom: '1rem', border: '1px solid #eee', boxShadow: 'none' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
            {review.customer?.name?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div>
            <h4 style={{ margin: 0 }}>{review.customer?.name || 'Anonymous'}</h4>
            <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>
              {new Date(review.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <RatingStars rating={review.rating} readOnly />
      </div>
      <h5 style={{ margin: '0.5rem 0', fontSize: '1.1rem' }}>{review.title}</h5>
      <p style={{ margin: 0, color: '#4b5563', lineHeight: '1.5' }}>{review.description}</p>
    </Card>
  );
};

export default ReviewCard;
