const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { errorResponse } = require('../utils/response');

const protect = async (req, res, next) => {
  let token = null;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return errorResponse(res, 'User not found', 401);
      }
      if (!req.user.isActive) {
        return errorResponse(res, 'Account is deactivated', 403);
      }
      return next();
    } catch (error) {
      return errorResponse(res, 'Not authorized, token failed', 401);
    }
  }

  if (req.cookies && req.cookies.token) {
    try {
      const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return errorResponse(res, 'User not found', 401);
      }
      if (!req.user.isActive) {
        return errorResponse(res, 'Account is deactivated', 403);
      }
      return next();
    } catch (error) {
      return errorResponse(res, 'Not authorized, token failed', 401);
    }
  }

  return errorResponse(res, 'Not authorized, no token', 401);
};

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'Not authorized', 401);
    }
    if (!allowedRoles.includes(req.user.role)) {
      return errorResponse(res, 'Access denied. Insufficient permissions.', 403);
    }
    return next();
  };
};

const isSuperAdmin = authorize('super_admin');
const isManagingDirector = authorize('managing_director');
const isManager = authorize('manager', 'managing_director', 'super_admin');
const isTrainingManager = authorize('training_manager', 'manager', 'managing_director', 'super_admin');
const isInstructor = authorize('instructor', 'training_manager', 'manager', 'managing_director', 'super_admin');
const isTechnician = authorize('technician', 'manager', 'managing_director', 'super_admin');
const isElectricalEngineer = authorize('electrical_engineer', 'manager', 'managing_director', 'super_admin');
const isInventoryOfficer = authorize('inventory_officer', 'manager', 'managing_director', 'super_admin');
const isAccountant = authorize('accountant', 'manager', 'managing_director', 'super_admin');
const isContentEditor = authorize('content_editor', 'manager', 'managing_director', 'super_admin');
const isStaff = authorize(
  'super_admin', 'managing_director', 'manager', 'training_manager', 'instructor',
  'technician', 'electrical_engineer', 'inventory_officer', 'accountant', 'content_editor'
);

module.exports = {
  protect,
  authorize,
  isSuperAdmin,
  isManagingDirector,
  isManager,
  isTrainingManager,
  isInstructor,
  isTechnician,
  isElectricalEngineer,
  isInventoryOfficer,
  isAccountant,
  isContentEditor,
  isStaff,
};