const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController');
const { protect, isTrainingManager, isStaff } = require('../middleware/auth');
const { mongoIdValidation, paginationValidations } = require('../validators');

router.post('/', enrollmentController.createEnrollment);
router.get('/', protect, isStaff, paginationValidations, enrollmentController.getAllEnrollments);

module.exports = router;