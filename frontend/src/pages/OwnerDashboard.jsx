import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import './OwnerDashboard.css';

const OwnerDashboard = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="dashboard page-wrapper">
      <div className="container">
        <div className="dashboard-header">
          <h2>Welcome, {user?.name}!</h2>
          <p>Owner Dashboard</p>
        </div>

        <div className="dashboard-grid">
          <Card className="profile-card">
            <div className="profile-info">
              <div className="avatar owner-avatar">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3>{user?.name}</h3>
                <p>{user?.email}</p>
                <span className="badge owner-badge">Owner</span>
              </div>
            </div>
            <Button onClick={logout} variant="secondary" className="mt-1">Logout</Button>
          </Card>

          <div className="quick-actions">
            <Card className="action-card">
              <h3>My Garage</h3>
              <p>Manage your listed vehicles and add new ones.</p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link to="/my-vehicles" style={{ flex: 1, textDecoration: 'none' }}>
                  <Button variant="secondary" isFullWidth>View All</Button>
                </Link>
                <Link to="/add-vehicle" style={{ flex: 1, textDecoration: 'none' }}>
                  <Button variant="primary" isFullWidth>Add New</Button>
                </Link>
              </div>
            </Card>
            <Card className="action-card">
              <h3>Rental Requests</h3>
              <p>Review and approve incoming booking requests.</p>
              <Button variant="primary" disabled>Coming Soon</Button>
            </Card>
            <Card className="action-card">
              <h3>Earnings</h3>
              <p>Track your revenue and upcoming payouts.</p>
              <Button variant="primary" disabled>Coming Soon</Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
