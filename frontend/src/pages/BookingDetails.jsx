import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/ui/Loader';
import Card from '../components/ui/Card';
import StatusBadge from '../components/ui/StatusBadge';

const BookingDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const { data } = await api.get(`/bookings/${id}`);
        setBooking(data);
      } catch (error) {
        toast.error('Failed to load booking details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  if (isLoading) return <div className="page-wrapper"><Loader /></div>;
  if (!booking) return <div className="page-wrapper container" style={{ textAlign: 'center', padding: '4rem 0' }}>Booking not found</div>;

  const isOwnerView = user?._id === booking.owner._id;

  return (
    <div className="page-wrapper container">
      <div style={{ marginBottom: '1rem' }}>
        <Link to={isOwnerView ? "/booking-requests" : "/my-bookings"} style={{ color: 'var(--primary-color)' }}>
          ← Back to {isOwnerView ? 'Booking Requests' : 'My Bookings'}
        </Link>
      </div>

      <h1 style={{ marginBottom: '1.5rem' }}>Booking Details</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Card className="p-6">
            <h3>Vehicle Information</h3>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ width: '80px', height: '60px', borderRadius: '4px', overflow: 'hidden' }}>
                <img src={booking.vehicle.images[0]} alt={booking.vehicle.model} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <h4 style={{ margin: '0 0 0.25rem 0' }}>{booking.vehicle.brand} {booking.vehicle.model}</h4>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Reg No: {booking.vehicle.registrationNumber}</div>
              </div>
            </div>
            <Link to={`/vehicle/${booking.vehicle._id}`} style={{ color: 'var(--primary-color)', fontSize: '0.875rem', textDecoration: 'underline' }}>
              View Vehicle Listing
            </Link>
          </Card>

          <Card className="p-6">
            <h3>{isOwnerView ? 'Customer Information' : 'Owner Information'}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div><strong>Name:</strong> {isOwnerView ? booking.customer.name : booking.owner.name}</div>
              <div><strong>Email:</strong> {isOwnerView ? booking.customer.email : booking.owner.email}</div>
              <div><strong>Phone:</strong> {isOwnerView ? booking.customer.phone : booking.owner.phone}</div>
            </div>
          </Card>

          <Card className="p-6" style={{ backgroundColor: '#f9fafb' }}>
            <h3 style={{ color: '#0369a1' }}>Offline Payment Notice</h3>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#334155', lineHeight: '1.5' }}>
              RentWheels currently supports offline payments only. Please arrange the payment directly with the {isOwnerView ? 'customer' : 'owner'} during vehicle pickup.
              The owner will manually mark the payment as received here once it is settled.
            </p>
          </Card>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Card className="p-6">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0 }}>Status</h3>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <StatusBadge status={booking.bookingStatus} type="booking" />
                <StatusBadge status={booking.paymentStatus} type="payment" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Pickup</div>
                <strong>{new Date(booking.pickupDate).toLocaleDateString()}</strong><br/>
                {booking.pickupTime}
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Return</div>
                <strong>{new Date(booking.returnDate).toLocaleDateString()}</strong><br/>
                {booking.returnTime}
              </div>
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Pickup Address</div>
              <p style={{ margin: 0, lineHeight: 1.5 }}>{booking.vehicle.pickupAddress}</p>
            </div>

            <hr style={{ margin: '1.5rem 0', borderColor: '#e5e7eb' }} />

            <h3 style={{ marginBottom: '1rem' }}>Payment Summary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Rental Cost ({booking.rentalHours < 24 ? `${booking.rentalHours} hrs` : `${booking.rentalDays} days`})</span>
                <span>₹{booking.rentalCost}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Security Deposit (Refundable)</span>
                <span>₹{booking.securityDeposit}</span>
              </div>
              <hr style={{ margin: '0.5rem 0', borderColor: '#e5e7eb' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.25rem' }}>
                <span>Grand Total</span>
                <span>₹{booking.grandTotal}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
