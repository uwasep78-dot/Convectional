const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');
const { protect, isInventoryOfficer, isStaff } = require('../middleware/auth');
const { mongoIdValidation, paginationValidations } = require('../validators');

router.get('/', protect, isStaff, paginationValidations, purchaseController.getAllPurchaseOrders);
router.get('/:id', protect, isStaff, mongoIdValidation('id'), purchaseController.getPurchaseOrder);
router.post('/', protect, isInventoryOfficer, purchaseController.createPurchaseOrder);
router.put('/:id', protect, isInventoryOfficer, mongoIdValidation('id'), purchaseController.updatePurchaseOrder);
router.delete('/:id', protect, isInventoryOfficer, mongoIdValidation('id'), purchaseController.deletePurchaseOrder);
router.post('/:id/receive', protect, isInventoryOfficer, mongoIdValidation('id'), purchaseController.receiveOrder);

module.exports = router;