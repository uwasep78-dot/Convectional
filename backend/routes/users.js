const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, isSuperAdmin, isManager } = require('../middleware/auth');
const { mongoIdValidation, paginationValidations } = require('../validators');

router.get('/', protect, isSuperAdmin, paginationValidations, userController.getAllUsers);
router.get('/:id', protect, isSuperAdmin, mongoIdValidation('id'), userController.getUser);
router.post('/', protect, isSuperAdmin, userController.createUser);
router.put('/:id', protect, isSuperAdmin, mongoIdValidation('id'), userController.updateUser);
router.delete('/:id', protect, isSuperAdmin, mongoIdValidation('id'), userController.deleteUser);
router.put('/:id/password', protect, isSuperAdmin, mongoIdValidation('id'), userController.updateUserPassword);

module.exports = router;