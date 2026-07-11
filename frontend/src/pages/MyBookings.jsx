import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import Loader from '../components/ui/Loader';
import EmptyState from '../components/ui/EmptyState';
import BookingCard from '../components/ui/BookingCard';

import { sendBookingEmail } from '../services/emailService';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await api.get('/bookings/my');
      setBookings(data);
    } catch (error) {
      toast.error('Failed to load your bookings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    if (action === 'cancel') {
      if (!window.confirm('Are you sure you want to cancel this booking?')) return;
      
      const booking = bookings.find(b => b._id === id);
      setActionLoadingId(id);
      
      try {
        await api.patch(`/bookings/${id}/cancel`);
        toast.success('Booking cancelled successfully');
        fetchBookings();
        
        // Notify owner
        sendBookingEmail(
          booking.owner.name,
          booking.owner.email || 'placeholder@example.com', // Optional if email not populated
          'Booking Cancelled',
          `Customer ${booking.customer?.name || 'A customer'} has cancelled their booking for ${booking.vehicle?.brand} ${booking.vehicle?.model}.`
        );
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to cancel booking');
      } finally {
        setActionLoadingId(null);
      }
    }
  };

  if (isLoading) return <div className="page-wrapper"><Loader /></div>;

  return (
    <div className="page-wrapper container">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>My Bookings</h1>
        <p style={{ color: '#4b5563', margin: 0 }}>View and manage your vehicle rental bookings.</p>
      </div>

      {bookings.length === 0 ? (
        <EmptyState 
          title="No bookings found" 
          message="You haven't booked any vehicles yet. Start exploring to find your perfect ride!"
          actionText="Explore Vehicles"
          onAction={() => window.location.href = '/explore'}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {bookings.map(booking => (
            <BookingCard 
              key={booking._id} 
              booking={booking} 
              isOwnerView={false} 
              onAction={handleAction}
              actionLoadingId={actionLoadingId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
