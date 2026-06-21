const HireRequest = require('../models/HireRequest.model');

// Passenger creates a request
exports.createRequest = async (req, res) => {
  try {
    const { ownerId, from, to, date, time, address, passengers } = req.body;
    
    const request = new HireRequest({
      passengerId: req.user.id,
      ownerId,
      from,
      to,
      date,
      time,
      address,
      passengers
    });

    await request.save();
    res.status(201).json({ success: true, request });
  } catch (error) {
    console.error('Create hire request error:', error);
    res.status(500).json({ success: false, message: 'Failed to create hire request' });
  }
};

// Passenger fetches their requests
exports.getPassengerRequests = async (req, res) => {
  try {
    const requests = await HireRequest.find({ passengerId: req.user.id })
      .populate('ownerId', 'personal_info vehicle pricing')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, requests });
  } catch (error) {
    console.error('Get passenger requests error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch passenger requests' });
  }
};

// Driver fetches their requests
exports.getDriverRequests = async (req, res) => {
  try {
    const requests = await HireRequest.find({ ownerId: req.user.id })
      .lean()
      .sort({ createdAt: -1 });

    const Passenger = require('../models/Passenger.model');
    const User = require('../models/User.model');

    for (let r of requests) {
      let pass = await Passenger.findById(r.passengerId).lean();
      if (!pass) {
        pass = await User.findById(r.passengerId).lean();
      }

      if (pass) {
        r.passenger = {
          full_name: pass.full_name || pass.personal_info?.full_name || 'Passenger',
          phone: pass.phone || pass.personal_info?.phone || ''
        };
      } else {
        r.passenger = { full_name: 'Passenger', phone: '' };
      }
    }

    res.status(200).json({ success: true, requests });
  } catch (error) {
    console.error('Get driver requests error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch driver requests' });
  }
};

// Driver updates status (offer_sent, rejected, completed)
exports.updateStatus = async (req, res) => {
  try {
    const { status, finalPrice } = req.body;
    const updateData = { status };
    if (finalPrice !== undefined) {
      updateData.finalPrice = finalPrice;
    }

    const request = await HireRequest.findOneAndUpdate(
      { _id: req.params.id, ownerId: req.user.id },
      updateData,
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found or unauthorized' });
    }

    res.status(200).json({ success: true, request });
  } catch (error) {
    console.error('Update request status error:', error);
    res.status(500).json({ success: false, message: 'Failed to update request status' });
  }
};

// Passenger pays the advance (simulated)
exports.processPayment = async (req, res) => {
  try {
    const request = await HireRequest.findOneAndUpdate(
      { _id: req.params.id, passengerId: req.user.id },
      { status: 'confirmed', paymentStatus: 'advance_paid' },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found or unauthorized' });
    }

    res.status(200).json({ success: true, request });
  } catch (error) {
    console.error('Process hire payment error:', error);
    res.status(500).json({ success: false, message: 'Failed to process payment' });
  }
};
