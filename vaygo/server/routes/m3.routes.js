const express = require('express');
const router = express.Router();
const m3Controller = require('../controllers/m3.controller');
const authMiddleware = require('../middleware/auth.middleware');


router.post('/request/apply', authMiddleware, m3Controller.applyForGig);
router.post('/request/create', authMiddleware, m3Controller.createRequest);
router.get('/request/my-requests', authMiddleware, m3Controller.getFamilyRequests);
router.get('/request/pending', authMiddleware, m3Controller.getPendingRequests);
router.get('/request/driver-requests', authMiddleware, m3Controller.getDriverRequests);
router.get('/request/:id', authMiddleware, m3Controller.getRequest);
router.get('/drivers/available', authMiddleware, m3Controller.getAvailableDrivers);
router.post('/booking/select-driver', authMiddleware, m3Controller.selectDriver);
router.post('/booking/confirm', authMiddleware, m3Controller.confirmBooking);
router.post('/booking/start-trip', authMiddleware, m3Controller.startTrip);
router.post('/booking/end-trip', authMiddleware, m3Controller.endTrip);
router.post('/inspection/before', authMiddleware, m3Controller.inspectionBefore);
router.post('/inspection/after', authMiddleware, m3Controller.inspectionAfter);
router.get('/track/:bookingId', authMiddleware, m3Controller.trackLocation);
router.post('/payment/advance', authMiddleware, m3Controller.paymentAdvance);
router.post('/payment/final', authMiddleware, m3Controller.paymentFinal);
router.post('/dispute/raise', authMiddleware, m3Controller.raiseDispute);
router.post('/rating/driver', authMiddleware, m3Controller.rateDriver);
router.post('/rating/family', authMiddleware, m3Controller.rateFamily);

module.exports = router;
