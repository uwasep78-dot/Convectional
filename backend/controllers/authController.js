const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { successResponse, errorResponse } = require('../utils/response');
const { generateToken } = require('../utils/jwt');
const AuditLog = require('../models/AuditLog');

const register = async (req, res, next) => {
  try {
    const { name, email, password, phone, role } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return errorResponse(res, 'User already exists with this email', 400);
    }

    user = new User({
      name,
      email,
      password,
      phone,
      role: role || 'customer',
    });

    await user.save();

    const token = generateToken(user._id, user.role);

    await AuditLog.create({
      user: user._id,
      action: 'register',
      resource: 'user',
      resourceId: user._id,
      method: req.method,
      endpoint: req.originalUrl,
      ip: req.ip,
      userAgent: req.get('User-Agent') || '',
      status: 201,
    });

    return successResponse(res, {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
      token,
    }, 'User registered successfully', 201);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    if (!user.isActive) {
      return errorResponse(res, 'Account is deactivated. Contact administrator.', 403);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id, user.role);

    await AuditLog.create({
      user: user._id,
      action: 'login',
      resource: 'user',
      resourceId: user._id,
      method: req.method,
      endpoint: req.originalUrl,
      ip: req.ip,
      userAgent: req.get('User-Agent') || '',
      status: 200,
    });

    return successResponse(res, {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
      token,
    }, 'Login successful');
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    await AuditLog.create({
      user: req.user._id,
      action: 'logout',
      resource: 'user',
      resourceId: req.user._id,
      method: req.method,
      endpoint: req.originalUrl,
      ip: req.ip,
      userAgent: req.get('User-Agent') || '',
      status: 200,
    });

    return successResponse(res, null, 'Logout successful');
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    return successResponse(res, user);
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, avatar } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }
    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.avatar = avatar || user.avatar;
    await user.save();

    await AuditLog.create({
      user: req.user._id,
      action: 'update_profile',
      resource: 'user',
      resourceId: req.user._id,
      method: req.method,
      endpoint: req.originalUrl,
      ip: req.ip,
      userAgent: req.get('User-Agent') || '',
      status: 200,
    });

    return successResponse(res, {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      avatar: user.avatar,
    }, 'Profile updated successfully');
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return errorResponse(res, 'Current password is incorrect', 400);
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    return successResponse(res, null, 'Password changed successfully');
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return successResponse(res, null, 'If an account exists with this email, a password reset link has been sent.');
    }

    const resetToken = require('crypto').randomBytes(32).toString('hex');
    user.passwordResetToken = require('crypto').createHash('sha256').update(resetToken).digest('hex');
    user.passwordResetExpires = Date.now() + 3600000;
    await user.save();

    return successResponse(res, { resetToken }, 'Password reset token generated');
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    const hashedToken = require('crypto').createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    }).select('+password');

    if (!user) {
      return errorResponse(res, 'Invalid or expired reset token', 400);
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return successResponse(res, null, 'Password reset successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
};