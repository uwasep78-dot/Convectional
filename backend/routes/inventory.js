const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const { protect, isInventoryOfficer, isStaff } = require('../middleware/auth');
const { mongoIdValidation, paginationValidations } = require('../validators');

router.get('/', protect, isStaff, paginationValidations, inventoryController.getAllProducts);
router.get('/low-stock', protect, isStaff, inventoryController.getLowStock);
router.get('/movements', protect, isStaff, paginationValidations, inventoryController.getInventoryMovements);
router.get('/stats', protect, isStaff, inventoryController.getInventoryStats);
router.get('/:id', protect, isStaff, mongoIdValidation('id'), inventoryController.getProduct);
router.post('/', protect, isInventoryOfficer, inventoryController.createProduct);
router.put('/:id', protect, isInventoryOfficer, mongoIdValidation('id'), inventoryController.updateProduct);
router.delete('/:id', protect, isInventoryOfficer, mongoIdValidation('id'), inventoryController.deleteProduct);
router.post('/:id/stock', protect, isInventoryOfficer, mongoIdValidation('id'), inventoryController.updateStock);

module.exports = router;