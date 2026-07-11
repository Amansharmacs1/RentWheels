import React, { useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import RatingStars from './RatingStars';
import Input from './Input';
import Button from './Button';
import Card from './Card';

const ReviewForm = ({ bookingId, vehicleId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/reviews', {
        bookingId,
        vehicleId,
        rating,
        title,
        description
      });
      toast.success('Review submitted successfully!');
      if (onReviewSubmitted) onReviewSubmitted();
      
      setRating(0);
      setTitle('');
      setDescription('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card style={{ padding: '1.5rem', marginTop: '2rem' }}>
      <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Write a Review</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Rating</label>
          <RatingStars rating={rating} setRating={setRating} size="1.5rem" />
        </div>
        <Input
          label="Review Title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Great car and smooth process!"
          required
        />
        <div className="form-group" style={{ marginBottom: '1rem' }}>
          <label className="form-label">Review Description</label>
          <textarea
            className="form-input"
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Share details of your experience..."
            required
            style={{ width: '100%', resize: 'vertical' }}
          ></textarea>
        </div>
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </Button>
      </form>
    </Card>
  );
};

export default ReviewForm;
