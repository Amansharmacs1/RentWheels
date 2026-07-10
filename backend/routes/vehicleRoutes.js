const express = require('express');
const router = express.Router();
const {
  createVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  getMyVehicles
} = require('../controllers/vehicleController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getVehicles)
  .post(protect, createVehicle);

router.route('/my')
  .get(protect, getMyVehicles);

router.route('/:id')
  .get(getVehicleById)
  .put(protect, updateVehicle)
  .delete(protect, deleteVehicle);

module.exports = router;
