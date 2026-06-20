const Ride = require('../models/Ride.model');

// Create a new ride (Driver)
exports.createRide = async (req, res) => {
  try {
    const { from, to, startLocation, endLocation, date, time, seats, price } = req.body;
    
    const newRide = new Ride({
      driverId: req.user.id, // Assuming auth middleware attaches user
      from,
      to,
      startLocation: startLocation || { lat: 18.5204, lng: 73.8567 }, // fallback to Pune
      endLocation: endLocation || { lat: 19.0760, lng: 72.8777 }, // fallback to Mumbai
      date,
      time,
      capacity: seats,
      pricePerSeat: price
    });

    await newRide.save();
    res.status(201).json({ success: true, ride: newRide });
  } catch (error) {
    console.error('Create ride error:', error);
    res.status(500).json({ success: false, message: 'Failed to create ride' });
  }
};

// Search rides (Passenger)
exports.searchRides = async (req, res) => {
  try {
    const { from, to, date, seats } = req.query;
    
    // Build query
    let query = { status: 'Upcoming' };
    if (from) query.from = new RegExp(from, 'i');
    if (to) query.to = new RegExp(to, 'i');
    
    // If date is provided, match the day
    if (date) {
      const searchDate = new Date(date);
      const nextDay = new Date(searchDate);
      nextDay.setDate(searchDate.getDate() + 1);
      query.date = { $gte: searchDate, $lt: nextDay };
    }

    const rides = await Ride.find(query).populate('driverId', 'name personal_info.full_name experience rating');
    
    // Filter out rides that don't have enough seats
    const requiredSeats = parseInt(seats) || 1;
    const availableRides = rides.filter(r => (r.capacity - r.bookedSeats) >= requiredSeats);

    res.status(200).json({ success: true, rides: availableRides });
  } catch (error) {
    console.error('Search rides error:', error);
    res.status(500).json({ success: false, message: 'Failed to search rides' });
  }
};

// Get driver's rides
exports.getDriverRides = async (req, res) => {
  try {
    const rides = await Ride.find({ driverId: req.user.id }).sort({ date: -1 });
    res.status(200).json({ success: true, rides });
  } catch (error) {
    console.error('Get driver rides error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch rides' });
  }
};

// Get single ride details
exports.getRideDetails = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id).populate('driverId', 'name personal_info vehicle experience account');
    if (!ride) {
      return res.status(404).json({ success: false, message: 'Ride not found' });
    }
    res.status(200).json({ success: true, ride });
  } catch (error) {
    console.error('Get ride details error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch ride details' });
  }
};
