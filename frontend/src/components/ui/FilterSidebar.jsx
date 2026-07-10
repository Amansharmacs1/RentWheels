import React from 'react';
import Card from './Card';
import './FilterSidebar.css';

const FilterSidebar = ({ filters, setFilters }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleReset = () => {
    setFilters({
      type: '',
      brand: '',
      fuelType: '',
      transmission: '',
      minPrice: '',
      maxPrice: '',
      availability: '',
      sort: 'newest'
    });
  };

  return (
    <Card className="filter-sidebar">
      <div className="filter-header">
        <h3>Filters</h3>
        <button type="button" onClick={handleReset} className="reset-btn">Reset All</button>
      </div>

      <div className="filter-group">
        <label>Sort By</label>
        <select name="sort" className="form-select" value={filters.sort} onChange={handleChange}>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="priceAsc">Price: Low to High</option>
          <option value="priceDesc">Price: High to Low</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Vehicle Type</label>
        <select name="type" className="form-select" value={filters.type} onChange={handleChange}>
          <option value="">All Types</option>
          <option value="Car">Car</option>
          <option value="Bike">Bike</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Fuel Type</label>
        <select name="fuelType" className="form-select" value={filters.fuelType} onChange={handleChange}>
          <option value="">All Fuel Types</option>
          <option value="Petrol">Petrol</option>
          <option value="Diesel">Diesel</option>
          <option value="Electric">Electric</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Transmission</label>
        <select name="transmission" className="form-select" value={filters.transmission} onChange={handleChange}>
          <option value="">All Transmissions</option>
          <option value="Automatic">Automatic</option>
          <option value="Manual">Manual</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Price Range (per day)</label>
        <div className="price-inputs">
          <input
            type="number"
            name="minPrice"
            placeholder="Min"
            className="form-input"
            value={filters.minPrice}
            onChange={handleChange}
            min="0"
          />
          <span>-</span>
          <input
            type="number"
            name="maxPrice"
            placeholder="Max"
            className="form-input"
            value={filters.maxPrice}
            onChange={handleChange}
            min="0"
          />
        </div>
      </div>

      <div className="filter-group">
        <label>Availability</label>
        <select name="availability" className="form-select" value={filters.availability} onChange={handleChange}>
          <option value="">All</option>
          <option value="true">Available</option>
          <option value="false">Unavailable</option>
        </select>
      </div>
    </Card>
  );
};

export default FilterSidebar;
