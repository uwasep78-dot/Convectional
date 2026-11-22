const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const {
  authValidations,
  paginationValidations,
} = require('../validators');

router.post('/register', authValidations.register, authController.register);
router.post('/login', authValidations.login, authController.login);
router.post('/logout', protect, authController.logout);
router.get('/me', protect, authController.getMe);
router.put('/profile', protect, authController.updateProfile);
router.put('/change-password', protect, authController.changePassword);
router.post('/forgot-password', authValidations.forgotPassword, authController.forgotPassword);
router.post('/reset-password', authValidations.resetPassword, authController.resetPassword);

module.exports = router;