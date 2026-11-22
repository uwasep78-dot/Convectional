const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { protect, isTrainingManager } = require('../middleware/auth');
const { mongoIdValidation, paginationValidations } = require('../validators');

router.get('/', protect, isTrainingManager, paginationValidations, studentController.getAllStudents);
router.get('/:id', protect, isTrainingManager, mongoIdValidation('id'), studentController.getStudent);
router.post('/', protect, isTrainingManager, studentController.createStudent);
router.put('/:id', protect, isTrainingManager, mongoIdValidation('id'), studentController.updateStudent);
router.delete('/:id', protect, isTrainingManager, mongoIdValidation('id'), studentController.deleteStudent);

module.exports = router;