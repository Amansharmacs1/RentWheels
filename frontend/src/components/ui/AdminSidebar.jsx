import React from 'react';
import { NavLink } from 'react-router-dom';
import Card from './Card';
import './AdminSidebar.css';

const AdminSidebar = () => {
  return (
    <Card className="admin-sidebar">
      <div className="admin-sidebar-header">
        <h3>Admin Panel</h3>
      </div>
      <nav className="admin-nav">
        <NavLink to="/admin/dashboard" className={({ isActive }) => (isActive ? 'admin-link active' : 'admin-link')}>
          Dashboard
        </NavLink>
        <NavLink to="/admin/users" className={({ isActive }) => (isActive ? 'admin-link active' : 'admin-link')}>
          Users
        </NavLink>
        <NavLink to="/admin/vehicles" className={({ isActive }) => (isActive ? 'admin-link active' : 'admin-link')}>
          Vehicles
        </NavLink>
        <NavLink to="/admin/bookings" className={({ isActive }) => (isActive ? 'admin-link active' : 'admin-link')}>
          Bookings
        </NavLink>
      </nav>
    </Card>
  );
};

export default AdminSidebar;
