import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import './CustomerDashboard.css';

const CustomerDashboard = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="dashboard page-wrapper">
      <div className="container">
        <div className="dashboard-header">
          <h2>Welcome, {user?.name}!</h2>
          <p>Customer Dashboard</p>
        </div>

        <div className="dashboard-grid">
          <Card className="profile-card">
            <div className="profile-info">
              <div className="avatar">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3>{user?.name}</h3>
                <p>{user?.email}</p>
                <span className="badge">Customer</span>
              </div>
            </div>
            <Button onClick={logout} variant="secondary" className="mt-1">Logout</Button>
          </Card>

          <div className="quick-actions">
            <Card className="action-card">
              <h3>Find a Car</h3>
              <p>Browse our premium selection of vehicles.</p>
              <Link to="/explore" className="btn-full-link" style={{ display: 'block', textDecoration: 'none' }}>
                <Button variant="primary" isFullWidth>Explore Vehicles</Button>
              </Link>
            </Card>
            <Card className="action-card">
              <h3>My Bookings</h3>
              <p>View your upcoming and past rentals.</p>
              <Button variant="primary" disabled>Coming Soon</Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
