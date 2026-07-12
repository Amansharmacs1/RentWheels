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

const BookingRequests = () => {
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
      const { data } = await api.get(`/bookings/owner?page=${page}&limit=5`);
      setBookings(data.bookings || []);
      setTotalPages(data.pages || 1);
    } catch (error) {
      toast.error('Failed to load booking requests');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    let confirmMessage = '';
    switch(action) {
      case 'accept': confirmMessage = 'Are you sure you want to accept this booking?'; break;
      case 'reject': confirmMessage = 'Are you sure you want to reject this booking?'; break;
      case 'payment': confirmMessage = 'Confirm that you have received the offline payment?'; break;
      case 'complete': confirmMessage = 'Mark this booking as completed?'; break;
      default: return;
    }

    if (!window.confirm(confirmMessage)) return;
    
    const booking = bookings.find(b => b._id === id);
    setActionLoadingId(id);
    
    try {
      await api.patch(`/bookings/${id}/${action}`);
      toast.success(`Booking ${action}ed successfully`);
      if (bookings.length === 1 && page > 1) setPage(page - 1);
      else fetchBookings();

      // Send email to customer based on action
      let subject = '';
      let message = '';
      const vehicleName = `${booking.vehicle?.brand} ${booking.vehicle?.model}`;

      if (action === 'accept') {
        subject = 'Booking Accepted!';
        message = `Good news! Your booking for ${vehicleName} has been accepted. Please arrange offline payment with the owner during pickup.`;
      } else if (action === 'reject') {
        subject = 'Booking Rejected';
        message = `Unfortunately, your booking for ${vehicleName} was rejected by the owner.`;
      } else if (action === 'payment') {
        subject = 'Payment Received';
        message = `The owner has confirmed receipt of your offline payment for ${vehicleName}. Your booking is now Active!`;
      } else if (action === 'complete') {
        subject = 'Booking Completed';
        message = `Your booking for ${vehicleName} has been marked as completed. Thank you for using RentWheels!`;
      }

      if (subject) {
        sendBookingEmail(
          booking.customer.name,
          booking.customer.email,
          subject,
          message
        );
      }

    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${action} booking`);
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="page-wrapper container page-enter page-enter-active">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>Booking Requests</h1>
        <p style={{ color: '#4b5563', margin: 0 }}>Manage booking requests for your vehicles.</p>
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
          title="No booking requests yet" 
          description="When customers book your vehicles, their requests will appear here."
        />
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {bookings.map(booking => (
              <BookingCard 
                key={booking._id} 
                booking={booking} 
                isOwnerView={true} 
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

export default BookingRequests;
