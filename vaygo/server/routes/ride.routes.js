const express = require('express');
const router = express.Router();
const rideController = require('../controllers/ride.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/', authMiddleware, rideController.createRide);
router.get('/', rideController.searchRides);
router.get('/driver', authMiddleware, rideController.getDriverRides);
router.get('/:id', rideController.getRideDetails);

module.exports = router;
