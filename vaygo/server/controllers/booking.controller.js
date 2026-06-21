const Booking = require('../models/Booking.model');
const Ride = require('../models/Ride.model');

// Create new booking (Passenger)
exports.createBooking = async (req, res) => {
  try {
    const { rideId, seats } = req.body;
    
    const ride = await Ride.findById(rideId);
    if (!ride) return res.status(404).json({ success: false, message: 'Ride not found' });
    
    if (ride.capacity - ride.bookedSeats < seats) {
      return res.status(400).json({ success: false, message: 'Not enough seats available' });
    }

    const totalFare = ride.pricePerSeat * seats;
    
    const booking = new Booking({
      rideId,
      passengerId: req.user.id,
      seatsReserved: seats,
      totalFare
    });

    await booking.save();
    res.status(201).json({ success: true, bookingId: booking._id });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ success: false, message: 'Failed to create booking' });
  }
};

// Process payment (mock)
exports.processPayment = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    booking.paymentStatus = 'Completed';
    await booking.save();

    // Increment booked seats on the ride
    await Ride.findByIdAndUpdate(booking.rideId, { $inc: { bookedSeats: booking.seatsReserved } });

    res.status(200).json({ success: true, booking });
  } catch (error) {
    console.error('Process payment error:', error);
    res.status(500).json({ success: false, message: 'Failed to process payment' });
  }
};

// Get passengers for a ride (Driver)
exports.getRidePassengers = async (req, res) => {
  try {
    const bookings = await Booking.find({ rideId: req.params.rideId, paymentStatus: 'Completed' })
      .populate('passengerId');
    res.status(200).json({ success: true, passengers: bookings });
  } catch (error) {
    console.error('Get ride passengers error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch passengers' });
  }
};

// Update boarding status (Driver)
exports.updateBoardingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(req.params.id, { boardingStatus: status }, { new: true });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.status(200).json({ success: true, booking });
  } catch (error) {
    console.error('Update boarding status error:', error);
    res.status(500).json({ success: false, message: 'Failed to update status' });
  }
};

// Get booking details
exports.getBookingDetails = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate({
        path: 'rideId',
        populate: {
          path: 'driverId',
          select: 'personal_info vehicle'
        }
      });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.status(200).json({ success: true, booking });
  } catch (error) {
    console.error('Get booking details error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch booking details' });
  }
};

// Get all bookings for passenger
exports.getPassengerBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ passengerId: req.user.id })
      .populate({
        path: 'rideId',
        populate: {
          path: 'driverId',
          select: 'personal_info'
        }
      })
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    console.error('Get passenger bookings error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch passenger bookings' });
  }
};

// Rate a booking
exports.rateBooking = async (req, res) => {
  try {
    const { rating, feedback } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id, 
      { rating: Number(rating), feedback: feedback || '' }, 
      { new: true }
    );
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.status(200).json({ success: true, booking });
  } catch (error) {
    console.error('Rate booking error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit rating' });
  }
};

// Get feedbacks for a driver
exports.getDriverFeedbacks = async (req, res) => {
  try {
    // Find all rides by this driver
    const rides = await Ride.find({ driverId: req.user.id });
    const rideIds = rides.map(r => r._id);

    // Find all completed bookings with ratings for these rides
    const bookings = await Booking.find({ 
      rideId: { $in: rideIds }, 
      rating: { $gt: 0 } 
    }).populate('passengerId').sort({ createdAt: -1 }).limit(10);

    const feedbacks = bookings.map(b => ({
      _id: b._id,
      rating: b.rating,
      feedback: b.feedback,
      passengerName: b.passengerId?.personal_info?.full_name || 'Passenger',
      date: b.createdAt
    }));

    res.status(200).json({ success: true, feedbacks });
  } catch (error) {
    console.error('Get driver feedbacks error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch feedbacks' });
  }
};
