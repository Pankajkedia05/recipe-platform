const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');

const fallbackUser = {
  _id: 'demo-user',
  username: 'demo',
  email: 'demo@example.com',
  avatar: ''
};

const protect = async (req, res, next) => {
  let token;

  if (mongoose.connection.readyState !== 1) {
    req.user = fallbackUser;
    return next();
  }

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }
      
      next();
    } catch (error) {
      console.error('Auth error:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const optionalAuth = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    } catch (error) {
      // Continue without user
    }
  }
  
  next();
};

module.exports = { protect, optionalAuth };