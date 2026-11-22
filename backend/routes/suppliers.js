const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const { protect, isInventoryOfficer, isSuperAdmin } = require('../middleware/auth');
const { mongoIdValidation, paginationValidations } = require('../validators');

router.get('/', protect, paginationValidations, supplierController.getAllSuppliers);
router.get('/:id', protect, mongoIdValidation('id'), supplierController.getSupplier);
router.post('/', protect, isInventoryOfficer, supplierController.createSupplier);
router.put('/:id', protect, isInventoryOfficer, mongoIdValidation('id'), supplierController.updateSupplier);
router.delete('/:id', protect, isSuperAdmin, mongoIdValidation('id'), supplierController.deleteSupplier);

module.exports = router;