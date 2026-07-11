import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/ui/Loader';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import BookingForm from '../components/ui/BookingForm';
import './VehicleDetails.css';

const VehicleDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [vehicle, setVehicle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const { data } = await api.get(`/vehicles/${id}`);
        setVehicle(data);
      } catch (error) {
        toast.error('Failed to load vehicle details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicle();
  }, [id]);

  if (isLoading) return <div className="page-wrapper"><Loader /></div>;
  if (!vehicle) return <div className="page-wrapper container" style={{ textAlign: 'center', padding: '4rem 0' }}>Vehicle not found</div>;

  return (
    <div className="vehicle-details-page page-wrapper">
      <div className="container">
        
        {/* Breadcrumb */}
        <div style={{ marginBottom: '1rem' }}>
          <Link to="/explore" style={{ color: 'var(--primary-color)' }}>← Back to Explore</Link>
        </div>

        <div className="details-grid">
          {/* Left Column - Images & Details */}
          <div className="details-main">
            <Card className="gallery-card">
              <div className="main-image">
                <img src={vehicle.images[activeImage]} alt={`${vehicle.brand} ${vehicle.model}`} />
                <span className={`availability-badge ${vehicle.availability ? 'available' : 'unavailable'}`}>
                  {vehicle.availability ? 'Available for Rent' : 'Currently Unavailable'}
                </span>
              </div>
              
              {vehicle.images.length > 1 && (
                <div className="thumbnail-list">
                  {vehicle.images.map((img, idx) => (
                    <div 
                      key={idx} 
                      className={`thumbnail ${activeImage === idx ? 'active' : ''}`}
                      onClick={() => setActiveImage(idx)}
                    >
                      <img src={img} alt={`Thumbnail ${idx + 1}`} />
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card className="specs-card">
              <h3>Specifications</h3>
              <div className="specs-grid">
                <div className="spec-item">
                  <span className="spec-label">Brand</span>
                  <span className="spec-value">{vehicle.brand}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Model</span>
                  <span className="spec-value">{vehicle.model}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Year</span>
                  <span className="spec-value">{vehicle.year}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Fuel Type</span>
                  <span className="spec-value">{vehicle.fuelType}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Transmission</span>
                  <span className="spec-value">{vehicle.transmission}</span>
                </div>
                {vehicle.type === 'Car' && (
                  <div className="spec-item">
                    <span className="spec-label">Seating Capacity</span>
                    <span className="spec-value">{vehicle.seatingCapacity} Persons</span>
                  </div>
                )}
                {vehicle.type === 'Bike' && (
                  <div className="spec-item">
                    <span className="spec-label">Engine Capacity</span>
                    <span className="spec-value">{vehicle.engineCapacity} cc</span>
                  </div>
                )}
              </div>
            </Card>

            <Card className="description-card">
              <h3>Description</h3>
              <p>{vehicle.description}</p>
            </Card>
          </div>

          {/* Right Column - Booking Info & Owner */}
          <div className="details-sidebar">
            <Card className="booking-card">
              <h2 className="title">{vehicle.brand} {vehicle.model}</h2>
              <div className="type-badge">{vehicle.type}</div>
              
              <div className="price-section">
                <div className="price-row">
                  <span className="price">₹{vehicle.pricePerDay}</span>
                  <span className="period">/ day</span>
                </div>
                <div className="price-row-small">
                  <span>₹{vehicle.pricePerHour} / hour</span>
                </div>
              </div>

              <div className="deposit-section">
                <span>Security Deposit:</span>
                <strong>₹{vehicle.securityDeposit}</strong>
              </div>

              <BookingForm vehicle={vehicle} user={user} />
            </Card>

            <Card className="location-card">
              <h3>Location</h3>
              <p><strong>{vehicle.city}, {vehicle.state}</strong></p>
              <p className="address-text">{vehicle.pickupAddress}</p>
            </Card>

            <Card className="owner-card">
              <h3>Listed By</h3>
              <div className="owner-info">
                <div className="owner-avatar">
                  {vehicle.owner.name.charAt(0).toUpperCase()}
                </div>
                <div className="owner-details">
                  <h4>{vehicle.owner.name}</h4>
                  <p>Verified Owner</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetails;
