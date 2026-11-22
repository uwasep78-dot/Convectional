const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { protect, isStaff } = require('../middleware/auth');
const { mongoIdValidation, paginationValidations, customerValidations } = require('../validators');

router.get('/', protect, isStaff, paginationValidations, customerController.getAllCustomers);
router.get('/stats', protect, isStaff, customerController.getCustomerStats);
router.get('/:id', protect, isStaff, mongoIdValidation('id'), customerController.getCustomer);
router.post('/', protect, isStaff, customerValidations.create, customerController.createCustomer);
router.put('/:id', protect, isStaff, customerValidations.update, customerController.updateCustomer);
router.delete('/:id', protect, isStaff, mongoIdValidation('id'), customerController.deleteCustomer);

module.exports = router;