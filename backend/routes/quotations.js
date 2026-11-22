const express = require('express');
const router = express.Router();
const quotationController = require('../controllers/quotationController');
const { protect, isStaff } = require('../middleware/auth');
const { mongoIdValidation, paginationValidations } = require('../validators');

router.get('/', protect, isStaff, paginationValidations, quotationController.getAllQuotations);
router.get('/stats', protect, isStaff, quotationController.getQuotationStats);
router.get('/:id', protect, isStaff, mongoIdValidation('id'), quotationController.getQuotation);
router.post('/', protect, isStaff, quotationController.createQuotation);
router.put('/:id', protect, isStaff, mongoIdValidation('id'), quotationController.updateQuotation);
router.delete('/:id', protect, isStaff, mongoIdValidation('id'), quotationController.deleteQuotation);
router.patch('/:id/status', protect, isStaff, mongoIdValidation('id'), quotationController.updateQuotationStatus);
router.post('/:id/convert', protect, isStaff, mongoIdValidation('id'), quotationController.convertToInvoice);

module.exports = router;