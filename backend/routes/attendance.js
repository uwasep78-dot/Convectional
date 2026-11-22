const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { protect, isTrainingManager, isInstructor } = require('../middleware/auth');

router.post('/mark', protect, isTrainingManager, attendanceController.markAttendance);
router.get('/', protect, isInstructor, attendanceController.getAttendance);
router.get('/student/:studentId/:courseId', protect, isInstructor, attendanceController.getStudentAttendanceSummary);
router.post('/assessment', protect, isInstructor, attendanceController.createAssessment);
router.get('/assessments', protect, isInstructor, attendanceController.getAssessments);
router.get('/results/:studentId/:courseId', protect, isInstructor, attendanceController.getStudentResults);

module.exports = router;