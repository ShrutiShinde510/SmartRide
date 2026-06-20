const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/', authMiddleware, bookingController.createBooking);
router.get('/my-bookings', authMiddleware, bookingController.getPassengerBookings);
router.get('/:id', authMiddleware, bookingController.getBookingDetails);
router.post('/:id/pay', authMiddleware, bookingController.processPayment);
router.get('/ride/:rideId', authMiddleware, bookingController.getRidePassengers);
router.put('/:id/status', authMiddleware, bookingController.updateBoardingStatus);

module.exports = router;
