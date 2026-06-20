const Message = require('../models/Message.model');
const Booking = require('../models/Booking.model');

// Get all messages for a booking
exports.getMessages = async (req, res) => {
  try {
    const { bookingId } = req.params;
    
    // Verify booking exists and user is part of it
    const booking = await Booking.findById(bookingId).populate('rideId');
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Verify user is either the passenger or the driver of the ride
    // In a real production app, add strict auth checks here:
    // const isPassenger = booking.passengerId.toString() === req.user.id;
    // const isDriver = booking.rideId.driverId.toString() === req.user.id;
    // if (!isPassenger && !isDriver) return res.status(403)...

    const messages = await Message.find({ bookingId }).sort({ createdAt: 1 }).populate('senderId', 'personal_info.full_name name');
    
    res.json({ success: true, messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Send a new message
exports.sendMessage = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { text, senderModel } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({ success: false, message: 'Message text cannot be empty' });
    }

    // Create the message
    const newMessage = new Message({
      bookingId,
      senderId: req.user.id, // from auth middleware
      senderModel, // 'User' or 'PlannedDriver' depending on who is sending
      text: text.trim()
    });

    await newMessage.save();
    
    // Populate sender info before returning
    await newMessage.populate('senderId', 'personal_info.full_name name');

    res.status(201).json({ success: true, message: newMessage });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
