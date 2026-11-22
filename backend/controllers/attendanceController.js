const Attendance = require('../models/Attendance');
const Assessment = require('../models/Assessment');
const { successResponse, errorResponse, paginate, buildPaginationMeta } = require('../utils/response');

const markAttendance = async (req, res, next) => {
  try {
    const { studentId, courseId, date, session, status, notes } = req.body;
    const enrollment = await require('../models/Enrollment').findOne({ student: studentId, course: courseId });
    if (!enrollment) {
      return errorResponse(res, 'Student not enrolled in this course', 400);
    }

    const attendance = await Attendance.findOneAndUpdate(
      { student: studentId, course: courseId, date: new Date(date) },
      { session, status, notes, markedBy: req.user._id, markedAt: new Date() },
      { upsert: true, new: true, runValidators: true }
    ).populate('student', 'name').populate('course', 'name').populate('markedBy', 'name');

    return successResponse(res, attendance, 'Attendance marked successfully', 201);
  } catch (error) {
    next(error);
  }
};

const getAttendance = async (req, res, next) => {
  try {
    const { studentId, courseId, startDate, endDate } = req.query;
    const filter = {};
    if (studentId) filter.student = studentId;
    if (courseId) filter.course = courseId;
    if (startDate) filter.date = { $gte: new Date(startDate) };
    if (endDate) filter.date = { ...filter.date, $lte: new Date(endDate) };

    const attendance = await Attendance.find(filter)
      .populate('student', 'name studentId')
      .populate('course', 'name')
      .populate('markedBy', 'name')
      .sort({ date: -1 });

    return successResponse(res, attendance, 'Attendance retrieved successfully');
  } catch (error) {
    next(error);
  }
};

const getStudentAttendanceSummary = async (req, res, next) => {
  try {
    const { studentId, courseId } = req.params;
    const attendance = await Attendance.find({ student: studentId, course: courseId });
    const total = attendance.length;
    const present = attendance.filter(a => a.status === 'present').length;
    const late = attendance.filter(a => a.status === 'late').length;
    const absent = attendance.filter(a => a.status === 'absent').length;
    const percentage = total > 0 ? Math.round(((present + late) / total) * 100) : 0;

    return successResponse(res, {
      total,
      present,
      late,
      absent,
      percentage,
    }, 'Attendance summary retrieved successfully');
  } catch (error) {
    next(error);
  }
};

const createAssessment = async (req, res, next) => {
  try {
    const { studentId, courseId, title, type, totalMarks, score, assessedAt, feedback } = req.body;
    const enrollment = await require('../models/Enrollment').findOne({ student: studentId, course: courseId });
    if (!enrollment) {
      return errorResponse(res, 'Student not enrolled in this course', 400);
    }

    const assessment = await Assessment.create({
      enrollment: enrollment._id,
      student: studentId,
      course: courseId,
      title,
      type,
      totalMarks,
      score,
      assessedAt: assessedAt ? new Date(assessedAt) : new Date(),
      assessedBy: req.user._id,
      feedback,
    });

    await assessment.populate('student', 'name');
    await assessment.populate('course', 'name');
    await assessment.populate('assessedBy', 'name');

    return successResponse(res, assessment, 'Assessment created successfully', 201);
  } catch (error) {
    next(error);
  }
};

const getAssessments = async (req, res, next) => {
  try {
    const { studentId, courseId } = req.query;
    const filter = {};
    if (studentId) filter.student = studentId;
    if (courseId) filter.course = courseId;

    const assessments = await Assessment.find(filter)
      .populate('student', 'name')
      .populate('course', 'name')
      .populate('assessedBy', 'name')
      .sort({ assessedAt: -1 });

    return successResponse(res, assessments, 'Assessments retrieved successfully');
  } catch (error) {
    next(error);
  }
};

const getStudentResults = async (req, res, next) => {
  try {
    const { studentId, courseId } = req.params;
    const assessments = await Assessment.find({ student: studentId, course: courseId })
      .populate('course', 'name')
      .sort({ assessedAt: -1 });

    const totalMarks = assessments.reduce((sum, a) => sum + a.totalMarks, 0);
    const totalScore = assessments.reduce((sum, a) => sum + a.score, 0);
    const average = totalMarks > 0 ? Math.round((totalScore / totalMarks) * 100) : 0;

    return successResponse(res, {
      assessments,
      summary: {
        total: assessments.length,
        totalMarks,
        totalScore,
        averagePercentage: average,
      },
    }, 'Student results retrieved successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  markAttendance,
  getAttendance,
  getStudentAttendanceSummary,
  createAssessment,
  getAssessments,
  getStudentResults,
};