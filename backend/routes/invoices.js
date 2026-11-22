const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');
const { protect, isAccountant, isStaff } = require('../middleware/auth');
const { mongoIdValidation, paginationValidations } = require('../validators');

router.get('/', protect, isStaff, paginationValidations, invoiceController.getAllInvoices);
router.get('/stats', protect, isStaff, invoiceController.getInvoiceStats);
router.get('/payments', protect, isStaff, paginationValidations, invoiceController.getPayments);
router.get('/:id', protect, isStaff, mongoIdValidation('id'), invoiceController.getInvoice);
router.post('/', protect, isAccountant, invoiceController.createInvoice);
router.put('/:id', protect, isAccountant, mongoIdValidation('id'), invoiceController.updateInvoice);
router.delete('/:id', protect, isAccountant, mongoIdValidation('id'), invoiceController.deleteInvoice);
router.post('/:id/payment', protect, isAccountant, mongoIdValidation('id'), invoiceController.recordPayment);

module.exports = router;