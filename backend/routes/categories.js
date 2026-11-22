const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { protect, isSuperAdmin } = require('../middleware/auth');
const { mongoIdValidation } = require('../validators');

router.get('/', categoryController.getAllCategories);
router.get('/:id', mongoIdValidation('id'), categoryController.getCategory);
router.post('/', protect, isSuperAdmin, categoryController.createCategory);
router.put('/:id', protect, isSuperAdmin, mongoIdValidation('id'), categoryController.updateCategory);
router.delete('/:id', protect, isSuperAdmin, mongoIdValidation('id'), categoryController.deleteCategory);

module.exports = router;