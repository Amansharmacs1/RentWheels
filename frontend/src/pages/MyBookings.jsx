import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import Loader from '../components/ui/Loader';
import EmptyState from '../components/ui/EmptyState';
import BookingCard from '../components/ui/BookingCard';

import { sendBookingEmail } from '../services/emailService';
import Pagination from '../components/ui/Pagination';
import Skeleton from '../components/ui/Skeleton';
import Card from '../components/ui/Card';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchBookings();
  }, [page]);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get(`/bookings/my?page=${page}&limit=5`);
      setBookings(data.bookings || []);
      setTotalPages(data.pages || 1);
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
        if (bookings.length === 1 && page > 1) setPage(page - 1);
        else fetchBookings();
        
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

  return (
    <div className="page-wrapper container page-enter page-enter-active">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>My Bookings</h1>
        <p style={{ color: '#4b5563', margin: 0 }}>View and manage your vehicle rental bookings.</p>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {[1, 2, 3].map(i => (
            <Card key={i} className="glass-panel" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <Skeleton type="image" className="w-1/4" style={{ height: '100px' }} />
                <div style={{ flex: 1 }}>
                  <Skeleton type="title" />
                  <Skeleton type="text" count={2} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <EmptyState 
          title="No bookings found" 
          description="You haven't booked any vehicles yet. Start exploring to find your perfect ride!"
          actionText="Explore Vehicles"
          onAction={() => window.location.href = '/explore'}
        />
      ) : (
        <>
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
          <Pagination page={page} pages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
};

export default MyBookings;
