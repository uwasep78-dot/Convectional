const express = require('express');
const router = express.Router();
const trainingController = require('../controllers/trainingController');
const { protect, isTrainingManager, isManager, isSuperAdmin } = require('../middleware/auth');
const { mongoIdValidation, paginationValidations, trainingValidations } = require('../validators');

router.get('/', paginationValidations, trainingController.getAllTrainings);
router.get('/stats', trainingController.getTrainingStats);
router.get('/:id', mongoIdValidation('id'), trainingController.getTraining);
router.post('/', protect, isTrainingManager, trainingValidations.create, trainingController.createTraining);
router.put('/:id', protect, isTrainingManager, mongoIdValidation('id'), trainingValidations.update, trainingController.updateTraining);
router.delete('/:id', protect, isTrainingManager, mongoIdValidation('id'), trainingController.deleteTraining);
router.get('/:id/students', protect, isTrainingManager, mongoIdValidation('id'), trainingController.getTrainingStudents);

module.exports = router;