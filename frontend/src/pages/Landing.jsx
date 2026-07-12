import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { Car, Zap, CheckCircle, Globe, Headphones, Shield, ChevronLeft, ChevronRight } from 'lucide-react';
import './Landing.css';

const Landing = () => {
  const navigate = useNavigate();

  const handleExplore = () => {
    navigate('/explore');
  };

  return (
    <div className="landing-autolux">
      <Helmet>
        <title>AutoLux - Modern Luxury Car Ecommerce</title>
      </Helmet>

      {/* Hero Section */}
      <section className="al-hero">
        <h1>Drive the Future</h1>
        <p>Discover premium cars with cutting-edge technology</p>
        <div className="al-hero-buttons">
          <button className="al-btn al-btn-outline" onClick={handleExplore}>Explore Models</button>
          <button className="al-btn al-btn-solid" onClick={handleExplore}>Book Test Drive</button>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="al-section">
        <h2 className="al-section-title">Featured Categories</h2>
        <div className="al-categories-grid">
          <div className="al-category-card" onClick={handleExplore}>
            <Car />
            <h3>SUV</h3>
          </div>
          <div className="al-category-card" onClick={handleExplore}>
            <Car />
            <h3>Sedan</h3>
          </div>
          <div className="al-category-card" onClick={handleExplore}>
            <Car />
            <h3>Sports</h3>
          </div>
          <div className="al-category-card" onClick={handleExplore}>
            <Zap />
            <h3>Electric</h3>
          </div>
          <div className="al-category-card" onClick={handleExplore}>
            <Zap />
            <h3>Hybrid</h3>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="al-section">
        <h2 className="al-section-title">Why Choose RentWheels</h2>
        <div className="al-perks" style={{ justifyContent: 'space-around' }}>
          <div className="al-perk"><CheckCircle size={24} /> Verified Owners</div>
          <div className="al-perk"><Shield size={24} /> Secure Payments</div>
          <div className="al-perk"><Headphones size={24} /> 24/7 Support</div>
          <div className="al-perk"><Globe size={24} /> Flexible Rentals</div>
        </div>
      </section>

      {/* How It Works */}
      <section className="al-section">
        <h2 className="al-section-title">How It Works</h2>
        <div className="al-categories-grid" style={{ gap: '3rem' }}>
          <div style={{ textAlign: 'center', maxWidth: '250px' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--autolux-cyan)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', margin: '0 auto 1rem' }}>1</div>
            <h3 style={{ marginBottom: '0.5rem' }}>Sign Up</h3>
            <p style={{ color: 'var(--autolux-text-secondary)', fontSize: '0.9rem' }}>Create your account as a Customer or an Owner in minutes.</p>
          </div>
          <div style={{ textAlign: 'center', maxWidth: '250px' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--autolux-cyan)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', margin: '0 auto 1rem' }}>2</div>
            <h3 style={{ marginBottom: '0.5rem' }}>Find or List</h3>
            <p style={{ color: 'var(--autolux-text-secondary)', fontSize: '0.9rem' }}>Browse available vehicles or list your own car for rent.</p>
          </div>
          <div style={{ textAlign: 'center', maxWidth: '250px' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--autolux-cyan)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', margin: '0 auto 1rem' }}>3</div>
            <h3 style={{ marginBottom: '0.5rem' }}>Hit the Road</h3>
            <p style={{ color: 'var(--autolux-text-secondary)', fontSize: '0.9rem' }}>Book securely, grab the keys, and enjoy your drive.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
