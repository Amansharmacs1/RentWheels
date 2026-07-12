const Vehicle = require('../models/Vehicle');

// Create a new vehicle
const createVehicle = async (req, res) => {
  try {
    const {
      type, brand, model, year, fuelType, transmission,
      seatingCapacity, engineCapacity, pricePerHour, pricePerDay,
      securityDeposit, state, city, pickupAddress, description,
      registrationNumber, insuranceValidTill, images, availability
    } = req.body;

    // Basic validation
    if (!type || !brand || !model || !year || !pricePerDay || !images || images.length === 0) {
      return res.status(400).json({ message: 'Please provide all required fields and at least one image.' });
    }

    if (pricePerDay < 0 || pricePerHour < 0 || securityDeposit < 0) {
      return res.status(400).json({ message: 'Prices and deposit must be positive numbers.' });
    }

    const vehicle = await Vehicle.create({
      owner: req.user._id,
      type, brand, model, year, fuelType, transmission,
      seatingCapacity, engineCapacity, pricePerHour, pricePerDay,
      securityDeposit, state, city, pickupAddress, description,
      registrationNumber, insuranceValidTill, images, availability
    });

    res.status(201).json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// Get all vehicles with filters, search, and sort
const getVehicles = async (req, res) => {
  try {
    const { search, type, brand, fuelType, transmission, city, minPrice, maxPrice, sort, availability, page = 1, limit = 10 } = req.query;

    let query = { isArchived: false };

    // Search by brand, model, or city
    if (search) {
      query.$or = [
        { brand: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } }
      ];
    }

    // Filters
    // Public listings only show Verified vehicles
    query.verificationStatus = 'Verified';

    if (type) query.type = type;
    if (brand) query.brand = brand;
    if (fuelType) query.fuelType = fuelType;
    if (transmission) query.transmission = transmission;
    if (city) query.city = { $regex: city, $options: 'i' };
    if (availability !== undefined) query.availability = availability === 'true';

    // Price range
    if (minPrice || maxPrice) {
      query.pricePerDay = {};
      if (minPrice) query.pricePerDay.$gte = Number(minPrice);
      if (maxPrice) query.pricePerDay.$lte = Number(maxPrice);
    }

    // Sort logic
    let sortOption = {};
    if (sort === 'priceAsc') sortOption = { pricePerDay: 1 };
    else if (sort === 'priceDesc') sortOption = { pricePerDay: -1 };
    else if (sort === 'oldest') sortOption = { createdAt: 1 };
    else sortOption = { createdAt: -1 }; // Default newest

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;

    const total = await Vehicle.countDocuments(query);
    const vehicles = await Vehicle.find(query)
      .populate('owner', 'name profileImage') // Only get owner name and image
      .sort(sortOption)
      .skip(skip)
      .limit(limitNumber);

    res.json({
      vehicles,
      page: pageNumber,
      pages: Math.ceil(total / limitNumber),
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get single vehicle by ID
const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id)
      .populate('owner', 'name profileImage');

    if (vehicle) {
      res.json(vehicle);
    } else {
      res.status(404).json({ message: 'Vehicle not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Update vehicle (Only Owner)
const updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    // Check authorization
    if (vehicle.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized to update this vehicle' });
    }

    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedVehicle);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// Delete vehicle (Only Owner)
const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    // Check authorization
    if (vehicle.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized to delete this vehicle' });
    }

    await vehicle.deleteOne();
    res.json({ message: 'Vehicle removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get vehicles of logged-in owner
const getMyVehicles = async (req, res) => {
  try {
    const { page = 1, limit = 10, isArchived } = req.query;
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;

    const query = { owner: req.user._id };
    if (isArchived !== undefined) {
      query.isArchived = isArchived === 'true';
    }

    const total = await Vehicle.countDocuments(query);
    const vehicles = await Vehicle.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

    res.json({
      vehicles,
      page: pageNumber,
      pages: Math.ceil(total / limitNumber),
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  createVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  getMyVehicles
};
