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
router.post('/:id/rate', authMiddleware, bookingController.rateBooking);
router.get('/driver/feedbacks', authMiddleware, bookingController.getDriverFeedbacks);

module.exports = router;
