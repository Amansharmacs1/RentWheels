import React from 'react';
import Card from './Card';
import Button from './Button';
import StatusBadge from './StatusBadge';
import { Link } from 'react-router-dom';

const BookingCard = ({ booking, isOwnerView, onAction, actionLoadingId }) => {
  const { vehicle, customer, pickupDate, returnDate, grandTotal, bookingStatus, paymentStatus, _id } = booking;

  return (
    <Card className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg shadow-sm">
      <div style={{ width: '150px', height: '100px', flexShrink: 0, borderRadius: '8px', overflow: 'hidden' }}>
        <img 
          src={vehicle?.images?.[0] || 'https://via.placeholder.com/150'} 
          alt={`${vehicle?.brand} ${vehicle?.model}`} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem' }}>{vehicle?.brand} {vehicle?.model}</h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <StatusBadge status={bookingStatus} type="booking" />
              <StatusBadge status={paymentStatus} type="payment" />
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem', fontSize: '0.9rem', color: '#4b5563' }}>
            <div>
              <strong>Dates:</strong><br />
              {new Date(pickupDate).toLocaleDateString()} - {new Date(returnDate).toLocaleDateString()}
            </div>
            <div>
              <strong>Total Amount:</strong><br />
              <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#111827' }}>₹{grandTotal}</span>
            </div>
            {isOwnerView && (
              <div style={{ gridColumn: '1 / -1' }}>
                <strong>Customer:</strong> {customer?.name} ({customer?.phone})
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto' }}>
          <Link to={`/booking/${_id}`} style={{ textDecoration: 'none' }}>
            <Button variant="outline">View Details</Button>
          </Link>
          
          {!isOwnerView && bookingStatus === 'Pending' && (
            <Button 
              variant="danger" 
              onClick={() => onAction(_id, 'cancel')}
              disabled={actionLoadingId === _id}
            >
              Cancel Booking
            </Button>
          )}

          {isOwnerView && bookingStatus === 'Pending' && (
            <>
              <Button 
                variant="primary" 
                onClick={() => onAction(_id, 'accept')}
                disabled={actionLoadingId === _id}
              >
                Accept
              </Button>
              <Button 
                variant="danger" 
                onClick={() => onAction(_id, 'reject')}
                disabled={actionLoadingId === _id}
              >
                Reject
              </Button>
            </>
          )}

          {isOwnerView && bookingStatus === 'Accepted' && paymentStatus === 'Pending' && (
            <Button 
              variant="primary" 
              onClick={() => onAction(_id, 'payment')}
              disabled={actionLoadingId === _id}
            >
              Mark Payment Received
            </Button>
          )}

          {isOwnerView && bookingStatus === 'Active' && (
            <Button 
              variant="primary" 
              onClick={() => onAction(_id, 'complete')}
              disabled={actionLoadingId === _id}
            >
              Mark Completed
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default BookingCard;
