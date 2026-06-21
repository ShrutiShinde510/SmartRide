const express = require('express');
const router = express.Router();
const hireController = require('../controllers/hire.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/', authMiddleware, hireController.createRequest);
router.get('/my-requests', authMiddleware, hireController.getPassengerRequests);
router.get('/driver-requests', authMiddleware, hireController.getDriverRequests);
router.put('/:id/status', authMiddleware, hireController.updateStatus);
router.post('/:id/pay', authMiddleware, hireController.processPayment);

module.exports = router;
