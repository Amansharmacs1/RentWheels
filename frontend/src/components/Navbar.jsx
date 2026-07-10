import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">
          RentWheels
        </Link>
        <ul className="navbar-links">
          <li>
            <Link to="/explore">Explore Vehicles</Link>
          </li>
          {user ? (
            <>
              {user.role === 'Owner' && (
                <li>
                  <Link to="/my-vehicles">My Vehicles</Link>
                </li>
              )}
              <li>
                <Link to={user.role === 'Owner' ? '/owner-dashboard' : '/customer-dashboard'}>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/profile">Profile</Link>
              </li>
              <li>
                <button onClick={handleLogout} className="btn btn-secondary">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/login" className="btn btn-secondary">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="btn btn-primary">
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
