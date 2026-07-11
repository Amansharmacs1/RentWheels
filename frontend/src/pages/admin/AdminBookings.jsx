import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import AdminSidebar from '../../components/ui/AdminSidebar';
import Card from '../../components/ui/Card';
import Loader from '../../components/ui/Loader';
import StatusBadge from '../../components/ui/StatusBadge';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get(`/admin/bookings?status=${statusFilter}`);
      setBookings(data);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  return (
    <div className="page-wrapper" style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem', padding: '2rem' }}>
      <AdminSidebar />
      <div className="admin-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ margin: 0, color: 'var(--text-dark)' }}>Booking Management (Read Only)</h2>
          <select 
            className="form-select" 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: '200px' }}
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Accepted">Accepted</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
        
        <Card style={{ padding: '0', overflow: 'hidden' }}>
          {isLoading ? (
            <div style={{ padding: '2rem' }}><Loader /></div>
          ) : bookings.length === 0 ? (
            <p style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>No bookings found.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                  <th style={{ padding: '1rem' }}>ID / Dates</th>
                  <th style={{ padding: '1rem' }}>Vehicle</th>
                  <th style={{ padding: '1rem' }}>Customer</th>
                  <th style={{ padding: '1rem' }}>Owner</th>
                  <th style={{ padding: '1rem' }}>Status</th>
                  <th style={{ padding: '1rem', textAlign: 'right' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(booking => (
                  <tr key={booking._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '1rem' }}>
                      <Link to={`/booking/${booking._id}`} style={{ fontWeight: '500', color: 'var(--primary-color)', textDecoration: 'none' }}>
                        #{booking._id.substring(booking._id.length - 6).toUpperCase()}
                      </Link>
                      <br />
                      <small style={{ color: '#6b7280' }}>
                        {new Date(booking.pickupDate).toLocaleDateString()} - {new Date(booking.returnDate).toLocaleDateString()}
                      </small>
                    </td>
                    <td style={{ padding: '1rem', color: '#4b5563' }}>
                      {booking.vehicle?.brand} {booking.vehicle?.model}
                    </td>
                    <td style={{ padding: '1rem', color: '#4b5563' }}>
                      {booking.customer?.name}
                    </td>
                    <td style={{ padding: '1rem', color: '#4b5563' }}>
                      {booking.owner?.name}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <StatusBadge status={booking.bookingStatus} type="booking" />
                      <div style={{ marginTop: '0.25rem' }}>
                        <StatusBadge status={booking.paymentStatus} type="payment" />
                      </div>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 'bold' }}>
                      ₹{booking.grandTotal}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AdminBookings;
