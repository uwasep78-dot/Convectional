const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenanceController');
const { protect, isTechnician, isStaff } = require('../middleware/auth');
const { mongoIdValidation, paginationValidations } = require('../validators');

router.get('/', protect, isStaff, paginationValidations, maintenanceController.getAllJobs);
router.get('/stats', protect, isStaff, maintenanceController.getJobStats);
router.get('/:id', protect, isStaff, mongoIdValidation('id'), maintenanceController.getJob);
router.post('/', protect, isTechnician, maintenanceController.createJob);
router.put('/:id', protect, isTechnician, mongoIdValidation('id'), maintenanceController.updateJob);
router.delete('/:id', protect, isTechnician, mongoIdValidation('id'), maintenanceController.deleteJob);
router.patch('/:id/status', protect, isTechnician, mongoIdValidation('id'), maintenanceController.updateStatus);
router.post('/:id/parts', protect, isTechnician, mongoIdValidation('id'), maintenanceController.addSparePart);
router.post('/:id/photos', protect, isTechnician, mongoIdValidation('id'), maintenanceController.addServicePhoto);
router.post('/:id/complete', protect, isTechnician, mongoIdValidation('id'), maintenanceController.completeJob);

module.exports = router;