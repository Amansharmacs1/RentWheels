import React, { useState, useEffect } from 'react';
import Input from './Input';
import Button from './Button';
import Card from './Card';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

import { sendBookingEmail } from '../../services/emailService';

const BookingForm = ({ vehicle, user }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    pickupDate: '',
    pickupTime: '10:00',
    returnDate: '',
    returnTime: '10:00',
  });
  const [pricing, setPricing] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getTodayStr = () => new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (formData.pickupDate && formData.returnDate) {
      calculatePricing();
    } else {
      setPricing(null);
    }
  }, [formData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculatePricing = () => {
    const start = new Date(`${formData.pickupDate}T${formData.pickupTime}`);
    const end = new Date(`${formData.returnDate}T${formData.returnTime}`);
    const now = new Date();

    if (start < now || end <= start) {
      setPricing(null);
      return;
    }

    const diffMs = end - start;
    const diffHours = diffMs / (1000 * 60 * 60);
    const diffDays = Math.ceil(diffHours / 24);

    let rentalCost = 0;
    if (diffHours < 24) {
      rentalCost = Math.ceil(diffHours) * vehicle.pricePerHour;
    } else {
      rentalCost = diffDays * vehicle.pricePerDay;
    }

    setPricing({
      hours: Math.ceil(diffHours),
      days: diffDays,
      rentalCost,
      deposit: vehicle.securityDeposit,
      total: rentalCost + vehicle.securityDeposit
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to book this vehicle');
      navigate('/login');
      return;
    }

    if (user._id === vehicle.owner._id) {
      toast.error('You cannot book your own vehicle');
      return;
    }

    if (!pricing) {
      toast.error('Please select valid dates and times');
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading('Submitting booking request...');

    try {
      const response = await api.post('/bookings', {
        vehicle: vehicle._id,
        ...formData
      });
      
      const newBooking = response.data;
      
      toast.success('Booking request submitted successfully!', { id: loadingToast });
      
      // Notify Owner
      sendBookingEmail(
        newBooking.owner.name,
        newBooking.owner.email || 'placeholder@example.com',
        'New Booking Request',
        `${user.name} has requested to book your ${newBooking.vehicle.brand} ${newBooking.vehicle.model} from ${new Date(newBooking.pickupDate).toLocaleDateString()} to ${new Date(newBooking.returnDate).toLocaleDateString()}. Please check your dashboard to accept or reject.`
      );
      
      // Notify Customer (optional confirmation)
      sendBookingEmail(
        user.name,
        user.email,
        'Booking Request Submitted',
        `Your booking request for ${newBooking.vehicle.brand} ${newBooking.vehicle.model} has been submitted to the owner. You will be notified once they respond.`
      );
      navigate('/my-bookings');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit booking', { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <h3 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Book this Vehicle</h3>
      
      {!vehicle.availability ? (
        <div style={{ padding: '1rem', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '0.375rem', marginBottom: '1rem' }}>
          This vehicle is currently unavailable for booking.
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <Input 
              label="Pickup Date" 
              type="date" 
              name="pickupDate" 
              value={formData.pickupDate} 
              onChange={handleChange} 
              min={getTodayStr()}
              required 
            />
            <Input 
              label="Pickup Time" 
              type="time" 
              name="pickupTime" 
              value={formData.pickupTime} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <Input 
              label="Return Date" 
              type="date" 
              name="returnDate" 
              value={formData.returnDate} 
              onChange={handleChange} 
              min={formData.pickupDate || getTodayStr()}
              required 
            />
            <Input 
              label="Return Time" 
              type="time" 
              name="returnTime" 
              value={formData.returnTime} 
              onChange={handleChange} 
              required 
            />
          </div>

          {pricing && (
            <div style={{ backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '0.375rem', marginBottom: '1.5rem' }}>
              <h4 style={{ margin: '0 0 0.5rem 0' }}>Booking Summary</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span>Duration</span>
                <span>{pricing.hours < 24 ? `${pricing.hours} hours` : `${pricing.days} days`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span>Rental Cost</span>
                <span>₹{pricing.rentalCost}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span>Security Deposit</span>
                <span>₹{pricing.deposit}</span>
              </div>
              <hr style={{ margin: '0.5rem 0', borderColor: '#e5e7eb' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.1rem' }}>
                <span>Total Payable (Offline)</span>
                <span>₹{pricing.total}</span>
              </div>
            </div>
          )}

          {user && user._id === vehicle.owner._id ? (
             <Button variant="secondary" isFullWidth disabled>You own this vehicle</Button>
          ) : (
            <Button 
              type="submit" 
              variant="primary" 
              isFullWidth 
              disabled={isSubmitting || !pricing}
            >
              {isSubmitting ? 'Processing...' : 'Request Booking'}
            </Button>
          )}
        </form>
      )}
    </Card>
  );
};

export default BookingForm;
