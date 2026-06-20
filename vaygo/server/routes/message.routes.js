const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message.controller');
const protect = require('../middleware/auth.middleware');

// Routes
router.get('/:bookingId', protect, messageController.getMessages);
router.post('/:bookingId', protect, messageController.sendMessage);

module.exports = router;
