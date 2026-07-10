import React, { useState, useEffect } from 'react';
import Input from './Input';
import Button from './Button';
import ImageUploader from './ImageUploader';
import './VehicleForm.css';

const VehicleForm = ({ initialData, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    type: 'Car',
    brand: '',
    model: '',
    year: '',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    seatingCapacity: '',
    engineCapacity: '',
    pricePerHour: '',
    pricePerDay: '',
    securityDeposit: '',
    state: '',
    city: '',
    pickupAddress: '',
    description: '',
    registrationNumber: '',
    insuranceValidTill: '',
    images: [],
    availability: true
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...formData,
        ...initialData,
        insuranceValidTill: initialData.insuranceValidTill ? new Date(initialData.insuranceValidTill).toISOString().split('T')[0] : ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="vehicle-form">
      <h3>Images</h3>
      <ImageUploader 
        existingImages={formData.images} 
        onImagesChange={(urls) => setFormData({ ...formData, images: urls })} 
      />
      {formData.images.length === 0 && <p className="error-message">At least one image is required.</p>}

      <div className="form-section">
        <h3>Basic Information</h3>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Vehicle Type</label>
            <select name="type" className="form-select" value={formData.type} onChange={handleChange} required>
              <option value="Car">Car</option>
              <option value="Bike">Bike</option>
            </select>
          </div>
          <Input label="Brand" name="brand" value={formData.brand} onChange={handleChange} required />
          <Input label="Model" name="model" value={formData.model} onChange={handleChange} required />
          <Input label="Year" type="number" name="year" value={formData.year} onChange={handleChange} min="1990" max={new Date().getFullYear() + 1} required />
        </div>
      </div>

      <div className="form-section">
        <h3>Specifications</h3>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Fuel Type</label>
            <select name="fuelType" className="form-select" value={formData.fuelType} onChange={handleChange} required>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Transmission</label>
            <select name="transmission" className="form-select" value={formData.transmission} onChange={handleChange} required>
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
            </select>
          </div>
          {formData.type === 'Car' && (
            <Input label="Seating Capacity" type="number" name="seatingCapacity" value={formData.seatingCapacity} onChange={handleChange} min="1" required />
          )}
          {formData.type === 'Bike' && (
            <Input label="Engine Capacity (cc)" type="number" name="engineCapacity" value={formData.engineCapacity} onChange={handleChange} min="50" required />
          )}
        </div>
      </div>

      <div className="form-section">
        <h3>Pricing (₹)</h3>
        <div className="form-grid">
          <Input label="Price Per Hour" type="number" name="pricePerHour" value={formData.pricePerHour} onChange={handleChange} min="0" required />
          <Input label="Price Per Day" type="number" name="pricePerDay" value={formData.pricePerDay} onChange={handleChange} min="0" required />
          <Input label="Security Deposit" type="number" name="securityDeposit" value={formData.securityDeposit} onChange={handleChange} min="0" required />
        </div>
      </div>

      <div className="form-section">
        <h3>Location</h3>
        <div className="form-grid">
          <Input label="State" name="state" value={formData.state} onChange={handleChange} required />
          <Input label="City" name="city" value={formData.city} onChange={handleChange} required />
          <div className="form-group col-span-full">
            <label className="form-label">Pickup Address</label>
            <textarea className="form-input" name="pickupAddress" value={formData.pickupAddress} onChange={handleChange} required rows="2" />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Details & Documents</h3>
        <div className="form-grid">
          <Input label="Registration Number" name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} required />
          <Input label="Insurance Valid Till" type="date" name="insuranceValidTill" value={formData.insuranceValidTill} onChange={handleChange} required />
          <div className="form-group col-span-full">
            <label className="form-label">Description</label>
            <textarea className="form-input" name="description" value={formData.description} onChange={handleChange} required rows="4" />
          </div>
        </div>
      </div>

      <div className="form-section">
        <label className="checkbox-label">
          <input type="checkbox" name="availability" checked={formData.availability} onChange={handleChange} />
          <span>Vehicle is currently available for rent</span>
        </label>
      </div>

      <Button type="submit" variant="primary" isFullWidth disabled={isLoading || formData.images.length === 0}>
        {isLoading ? 'Saving...' : 'Save Vehicle'}
      </Button>
    </form>
  );
};

export default VehicleForm;
