const express = require('express');
const router = express.Router();
const electricalController = require('../controllers/electricalController');
const { protect, isElectricalEngineer, isStaff } = require('../middleware/auth');
const { mongoIdValidation, paginationValidations } = require('../validators');

router.get('/', protect, isStaff, paginationValidations, electricalController.getAllProjects);
router.get('/stats', protect, isStaff, electricalController.getProjectStats);
router.get('/:id', protect, isStaff, mongoIdValidation('id'), electricalController.getProject);
router.post('/', protect, isElectricalEngineer, electricalController.createProject);
router.put('/:id', protect, isElectricalEngineer, mongoIdValidation('id'), electricalController.updateProject);
router.delete('/:id', protect, isElectricalEngineer, mongoIdValidation('id'), electricalController.deleteProject);
router.patch('/:id/status', protect, isElectricalEngineer, mongoIdValidation('id'), electricalController.updateStatus);
router.post('/:id/testing', protect, isElectricalEngineer, mongoIdValidation('id'), electricalController.addTestingRecord);
router.post('/:id/inspection', protect, isElectricalEngineer, mongoIdValidation('id'), electricalController.addSiteInspection);
router.post('/:id/complete', protect, isElectricalEngineer, mongoIdValidation('id'), electricalController.completeProject);

module.exports = router;