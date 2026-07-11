import React from 'react';
import { Link } from 'react-router-dom';
import Card from './Card';
import Button from './Button';
import WishlistButton from './WishlistButton';
import './VehicleCard.css';

const VehicleCard = ({ vehicle, onEdit, onDelete, showActions = false }) => {
  return (
    <Card className="vehicle-card">
      <div className="vehicle-image-wrapper" style={{ position: 'relative' }}>
        <img src={vehicle.images[0]} alt={`${vehicle.brand} ${vehicle.model}`} className="vehicle-image" />
        <div style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: '50%', display: 'flex', zIndex: 10 }}>
          <WishlistButton vehicleId={vehicle._id} />
        </div>
        <span className={`vehicle-badge ${vehicle.availability ? 'badge-available' : 'badge-unavailable'}`}>
          {vehicle.availability ? 'Available' : 'Unavailable'}
        </span>
      </div>
      
      <div className="vehicle-info">
        <div className="vehicle-header">
          <h3 className="vehicle-title">{vehicle.brand} {vehicle.model}</h3>
          <span className="vehicle-type">{vehicle.type}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#6b7280' }}>
          <span style={{ color: '#fbbf24' }}>★</span>
          <strong>{vehicle.averageRating ? vehicle.averageRating.toFixed(1) : 'New'}</strong>
          <span>({vehicle.reviewCount || 0} reviews)</span>
        </div>
        
        <div className="vehicle-details">
          <div className="detail-row">
            <span>Transmission:</span>
            <strong>{vehicle.transmission}</strong>
          </div>
          <div className="detail-row">
            <span>Fuel:</span>
            <strong>{vehicle.fuelType}</strong>
          </div>
          <div className="detail-row">
            <span>Location:</span>
            <strong>{vehicle.city}</strong>
          </div>
        </div>

        <div className="vehicle-price">
          <span className="price-amount">₹{vehicle.pricePerDay}</span>
          <span className="price-period">/day</span>
        </div>

        <div className="vehicle-actions">
          {!showActions ? (
            <Link to={`/vehicle/${vehicle._id}`} className="btn-full-link">
              <Button variant="primary" isFullWidth>View Details</Button>
            </Link>
          ) : (
            <>
              <Link to={`/vehicle/${vehicle._id}`} className="flex-1">
                <Button variant="secondary" isFullWidth>View</Button>
              </Link>
              <Link to={`/edit-vehicle/${vehicle._id}`} className="flex-1">
                <Button variant="primary" isFullWidth>Edit</Button>
              </Link>
              <Button variant="secondary" style={{ borderColor: 'var(--error-color)', color: 'var(--error-color)' }} onClick={() => onDelete(vehicle._id)}>
                Delete
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};

export default VehicleCard;
