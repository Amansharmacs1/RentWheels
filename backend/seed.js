require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const Vehicle = require('./models/Vehicle');

const seedData = async () => {
  try {
    console.log('Connecting to MongoDB...', process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    // Create or update dummy owner to ensure password is correct
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    let owner = await User.findOneAndUpdate(
      { email: 'owner@rentwheels.com' },
      {
        name: 'Demo Owner',
        password: hashedPassword,
        role: 'Owner',
        phone: '9876543210'
      },
      { upsert: true, new: true }
    );
    console.log('Dummy Owner Verified/Updated');

    // Create Admin User
    let admin = await User.findOneAndUpdate(
      { email: 'admin@rentwheels.com' },
      {
        name: 'Super Admin',
        password: hashedPassword,
        role: 'Admin',
        phone: '1111111111',
        accountStatus: 'Active'
      },
      { upsert: true, new: true }
    );
    console.log('Admin User created (admin@rentwheels.com)');

    // Create Customer User
    let customer = await User.findOneAndUpdate(
      { email: 'customer@rentwheels.com' },
      {
        name: 'Demo Customer',
        password: hashedPassword,
        role: 'Customer',
        phone: '2222222222',
        accountStatus: 'Active'
      },
      { upsert: true, new: true }
    );
    console.log('Customer User created (customer@rentwheels.com)');

    // Clear existing vehicles to avoid duplicates during testing (optional, but good for clean slate)
    await Vehicle.deleteMany({ owner: owner._id });
    console.log('Cleared existing dummy vehicles');

    const dummyVehicles = [
      {
        owner: owner._id,
        type: 'Car',
        brand: 'Honda',
        model: 'City',
        year: 2023,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        seatingCapacity: 5,
        pricePerHour: 200,
        pricePerDay: 2000,
        securityDeposit: 5000,
        state: 'Delhi',
        city: 'New Delhi',
        pickupAddress: 'Connaught Place, New Delhi',
        description: 'A beautiful and reliable Honda City, perfect for city drives and highway cruising with premium comfort.',
        registrationNumber: 'DL-1C-1234',
        insuranceValidTill: new Date('2027-01-01'),
        images: [
          '/assets/civic1.jpg',
          '/assets/civic2.jpg',
          '/assets/civic3.jpg'
        ],
        availability: true,
        verificationStatus: 'Verified',
        verifiedBy: admin._id,
        verifiedAt: new Date()
      },
      {
        owner: owner._id,
        type: 'Car',
        brand: 'Toyota',
        model: 'Fortuner',
        year: 2022,
        fuelType: 'Diesel',
        transmission: 'Automatic',
        seatingCapacity: 7,
        pricePerHour: 400,
        pricePerDay: 4500,
        securityDeposit: 10000,
        state: 'Maharashtra',
        city: 'Mumbai',
        pickupAddress: 'Bandra West, Mumbai',
        description: 'Spacious and powerful SUV, great for family trips and off-roading adventures.',
        registrationNumber: 'MH-02-5678',
        insuranceValidTill: new Date('2026-12-31'),
        images: [
          '/assets/fortuner1.jpg',
          '/assets/fortuner2.jpg',
          '/assets/fortuner3.jpg'
        ],
        availability: true,
        verificationStatus: 'Verified',
        verifiedBy: admin._id,
        verifiedAt: new Date()
      },
      {
        owner: owner._id,
        type: 'Bike',
        brand: 'Royal Enfield',
        model: 'Classic 350',
        year: 2021,
        fuelType: 'Petrol',
        transmission: 'Manual',
        engineCapacity: 350,
        pricePerHour: 100,
        pricePerDay: 800,
        securityDeposit: 2000,
        state: 'Karnataka',
        city: 'Bangalore',
        pickupAddress: 'Indiranagar, Bangalore',
        description: 'Classic cruiser bike for a smooth ride and exploring the city.',
        registrationNumber: 'KA-01-9012',
        insuranceValidTill: new Date('2027-05-15'),
        images: [
          '/assets/bullet1.jpg',
          '/assets/bullet2.jpg',
          '/assets/bullet3.jpg'
        ],
        availability: true,
        verificationStatus: 'Verified',
        verifiedBy: admin._id,
        verifiedAt: new Date()
      }
    ];

    await Vehicle.insertMany(dummyVehicles);
    console.log('Dummy Vehicles added successfully!');
    
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
