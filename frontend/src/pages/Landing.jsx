import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import './Landing.css';

const Landing = () => {
  return (
    <div className="landing page-enter page-enter-active">
      <Helmet>
        <title>RentWheels - Premium Vehicle Rentals</title>
        <meta name="description" content="Rent premium vehicles from trusted owners or share your own car and earn money. RentWheels makes it seamless." />
      </Helmet>
      <section className="hero">
        <div className="container hero-content">
          <h1>Experience the Drive of Your Life</h1>
          <p>Rent premium vehicles from trusted owners or share your own car and earn money. RentWheels makes it seamless.</p>
          <div className="hero-buttons">
            <Link to="/register" className="btn btn-primary">Get Started</Link>
            <Link to="/login" className="btn btn-secondary">Login</Link>
          </div>
        </div>
      </section>

      <section className="features container">
        <div className="section-header">
          <h2>Why Choose Us</h2>
          <p>We provide the best service in the industry</p>
        </div>
        <div className="features-grid">
          <Card className="feature-card">
            <h3>Premium Selection</h3>
            <p>Access a wide range of top-tier vehicles for any occasion.</p>
          </Card>
          <Card className="feature-card">
            <h3>Secure & Safe</h3>
            <p>Your safety is our priority with verified owners and secure payments.</p>
          </Card>
          <Card className="feature-card">
            <h3>Flexible Rentals</h3>
            <p>Rent for a day, a week, or a month. Total flexibility for your needs.</p>
          </Card>
        </div>
      </section>

      <section className="how-it-works container">
        <div className="section-header">
          <h2>How RentWheels Works</h2>
        </div>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Sign Up</h3>
            <p>Create your account as a Customer or an Owner in minutes.</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Find or List</h3>
            <p>Browse available cars or list your own vehicle for rent.</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Hit the Road</h3>
            <p>Book securely and enjoy your premium driving experience.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
