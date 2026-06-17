const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const PlannedDriver = require('../models/PlannedDriver.model');
const FlexibleDriver = require('../models/FlexibleDriver.model');
const OnDemandDriver = require('../models/OnDemandDriver.model');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authorization token required' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const role = (decoded.role || '').toLowerCase();
    let user = null;

    if (role === 'passenger') {
      user = await User.findById(decoded.id || decoded._id);
    } else if (role === 'driver_planned') {
      user = await PlannedDriver.findById(decoded.id || decoded._id);
    } else if (role === 'driver_hire') {
      user = await FlexibleDriver.findById(decoded.id || decoded._id);
    } else if (role === 'driver_on_demand') {
      user = await OnDemandDriver.findById(decoded.id || decoded._id);
    } else {
      // Fallback to check all collections
      user = await User.findById(decoded.id || decoded._id) ||
             await PlannedDriver.findById(decoded.id || decoded._id) ||
             await FlexibleDriver.findById(decoded.id || decoded._id) ||
             await OnDemandDriver.findById(decoded.id || decoded._id);
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found or session expired' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};
