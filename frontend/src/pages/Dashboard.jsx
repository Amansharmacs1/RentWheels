import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import AnalyticsChart from '../components/ui/AnalyticsChart';
import api from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [stats, setStats] = useState({
    bookings: [],
    vehicles: [],
    wishlist: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [bookingsRes, vehiclesRes, wishlistRes] = await Promise.all([
          api.get('/bookings/my'),
          api.get('/vehicles/my'),
          api.get('/wishlist')
        ]);
        setStats({
          bookings: bookingsRes.data.bookings || [],
          vehicles: vehiclesRes.data.vehicles || [],
          wishlist: wishlistRes.data || []
        });
      } catch (error) {
        console.error('Failed to load dashboard data');
      }
    };
    fetchDashboardData();
  }, []);

  const totalBookings = stats.bookings.length;
  const activeBookings = stats.bookings.filter(b => b.bookingStatus === 'Active').length;
  const completedBookings = stats.bookings.filter(b => b.bookingStatus === 'Completed').length;
  const pendingRequests = stats.bookings.filter(b => b.bookingStatus === 'Pending').length;
  
  // Calculate Monthly Earnings for Owner
  const earningsData = stats.bookings
    .filter(b => b.bookingStatus === 'Completed' && b.owner._id === user?._id)
    .reduce((acc, b) => {
      const month = new Date(b.createdAt).toLocaleString('default', { month: 'short' });
      const existing = acc.find(item => item.name === month);
      if (existing) {
        existing.amount += b.grandTotal;
      } else {
        acc.push({ name: month, amount: b.grandTotal });
      }
      return acc;
    }, []);

  return (
    <div className="dashboard page-wrapper">
      <div className="container">
        <div className="dashboard-header" style={{ marginBottom: '2rem' }}>
          <h2>Welcome, {user?.name}!</h2>
          <p>Your RentWheels Dashboard</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem', alignItems: 'start' }}>
          <Card className="profile-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 1rem auto' }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <h3 style={{ margin: '0 0 0.5rem 0' }}>{user?.name}</h3>
            <p style={{ color: '#6b7280', margin: '0 0 1.5rem 0' }}>{user?.email}</p>
            {user?.role === 'Admin' && (
              <Link to="/admin/dashboard" style={{ textDecoration: 'none', display: 'block', marginBottom: '1rem' }}>
                <Button variant="primary" isFullWidth>Admin Panel</Button>
              </Link>
            )}
            <Button onClick={logout} variant="secondary" isFullWidth>Logout</Button>
          </Card>

          <div>
            {/* Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              <Card style={{ padding: '1.5rem', textAlign: 'center' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#6b7280' }}>Total Bookings</h4>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: 'var(--primary-color)' }}>{totalBookings}</p>
              </Card>
              <Card style={{ padding: '1.5rem', textAlign: 'center' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#6b7280' }}>Active Rentals</h4>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#10b981' }}>{activeBookings}</p>
              </Card>
              <Card style={{ padding: '1.5rem', textAlign: 'center' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#6b7280' }}>Wishlist</h4>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#ef4444' }}>{stats.wishlist.length}</p>
              </Card>
              <Card style={{ padding: '1.5rem', textAlign: 'center' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#6b7280' }}>My Vehicles</h4>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#f59e0b' }}>{stats.vehicles.length}</p>
              </Card>
            </div>

            {/* Quick Actions */}
            <h3 style={{ marginBottom: '1rem' }}>Quick Actions</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              <Card style={{ padding: '1.5rem' }}>
                <h3 style={{ marginTop: 0 }}>Rent a Vehicle</h3>
                <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Browse our premium selection of vehicles to rent.</p>
                <Link to="/explore" style={{ textDecoration: 'none' }}>
                  <Button variant="primary" isFullWidth>Explore Vehicles</Button>
                </Link>
              </Card>

              <Card style={{ padding: '1.5rem' }}>
                <h3 style={{ marginTop: 0 }}>My Bookings</h3>
                <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '1.5rem' }}>View your upcoming and past rentals.</p>
                <Link to="/my-bookings" style={{ textDecoration: 'none' }}>
                  <Button variant="secondary" isFullWidth>View Bookings</Button>
                </Link>
              </Card>

              <Card style={{ padding: '1.5rem' }}>
                <h3 style={{ marginTop: 0 }}>My Garage</h3>
                <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Manage your listed vehicles and add new ones.</p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Link to="/my-vehicles" style={{ flex: 1, textDecoration: 'none' }}>
                    <Button variant="secondary" isFullWidth>View All</Button>
                  </Link>
                  <Link to="/add-vehicle" style={{ flex: 1, textDecoration: 'none' }}>
                    <Button variant="primary" isFullWidth>Add New</Button>
                  </Link>
                </div>
              </Card>

              <Card style={{ padding: '1.5rem' }}>
                <h3 style={{ marginTop: 0 }}>Booking Requests</h3>
                <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Review and approve incoming booking requests.</p>
                <Link to="/booking-requests" style={{ textDecoration: 'none' }}>
                  <Button variant="secondary" isFullWidth>
                    Requests {pendingRequests > 0 && `(${pendingRequests})`}
                  </Button>
                </Link>
              </Card>
            </div>

            {/* Charts */}
            {earningsData.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <AnalyticsChart 
                  title="Monthly Earnings (Owner)"
                  type="bar" 
                  data={earningsData} 
                  xKey="name" 
                  yKey="amount" 
                  color="#10b981" 
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
