const Enrollment = require('../models/Enrollment');
const Student = require('../models/Student');
const User = require('../models/User');
const Training = require('../models/Training');
const Certificate = require('../models/Certificate');
const { successResponse, errorResponse, paginate, buildPaginationMeta } = require('../utils/response');

const getAllEnrollments = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.student) filter.student = req.query.student;
    if (req.query.course) filter.course = req.query.course;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.paymentStatus) filter.paymentStatus = req.query.paymentStatus;

    const total = await Enrollment.countDocuments(filter);
    const enrollments = await Enrollment.find(filter)
      .populate('student', 'studentId name email')
      .populate('course', 'name code')
      .populate('enrolledBy', 'name')
      .sort({ enrollmentDate: -1 })
      .skip(skip)
      .limit(limit);

    return successResponse(res, enrollments, 'Enrollments retrieved successfully', 200, buildPaginationMeta(total, page, limit));
  } catch (error) {
    next(error);
  }
};

const getEnrollment = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id)
      .populate('student', 'studentId name email phone')
      .populate('course', 'name code fee')
      .populate('enrolledBy', 'name');
    if (!enrollment) {
      return errorResponse(res, 'Enrollment not found', 404);
    }
    return successResponse(res, enrollment);
  } catch (error) {
    next(error);
  }
};

const createEnrollment = async (req, res, next) => {
  try {
    const { studentId, courseId, course, training, name, email, phone, fullName, notes, discount } = req.body;
    const courseIdResolved = courseId || course || training || req.body.trainingId;

    let student = null;
    if (studentId) {
      student = await Student.findById(studentId);
    } else if (email) {
      let user = await User.findOne({ email });
      if (!user) {
        user = await User.create({
          name: fullName || name || 'Training Applicant',
          email,
          password: Math.random().toString(36).slice(-10),
          phone: phone || req.body.phoneNumber,
          role: 'student',
        });
      }
      student = await Student.findOne({ user: user._id });
      if (!student) {
        student = await Student.create({
          user: user._id,
        });
      }
    }

    if (!student) {
      return errorResponse(res, 'Student information required', 400);
    }

    const courseDoc = await Training.findById(courseIdResolved);
    if (!courseDoc && courseIdResolved) {
      // try to find by name
    }
    if (!courseDoc) {
      return errorResponse(res, 'Course/Training not found', 404);
    }

    const existing = await Enrollment.findOne({ student: student._id, course: courseDoc._id });
    if (existing) {
      return errorResponse(res, 'Already applied/enrolled for this training', 400);
    }

    const enrollment = await Enrollment.create({
      student: student._id,
      course: courseDoc._id,
      totalAmount: courseDoc.fee || 0,
      discount: discount || 0,
      notes: notes || req.body.message || '',
      enrolledBy: req.user ? req.user._id : undefined,
      status: 'pending',
    });

    await enrollment.populate('student', 'studentId name email');
    await enrollment.populate('course', 'name code fee');

    return successResponse(res, enrollment, 'Training application submitted successfully', 201);
  } catch (error) {
    next(error);
  }
};

const updateEnrollment = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);
    if (!enrollment) {
      return errorResponse(res, 'Enrollment not found', 404);
    }
    Object.assign(enrollment, req.body);
    await enrollment.save();
    await enrollment.populate('student', 'studentId name email');
    await enrollment.populate('course', 'name code fee');
    return successResponse(res, enrollment, 'Enrollment updated successfully');
  } catch (error) {
    next(error);
  }
};

const deleteEnrollment = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);
    if (!enrollment) {
      return errorResponse(res, 'Enrollment not found', 404);
    }
    await enrollment.deleteOne();
    return successResponse(res, null, 'Enrollment deleted successfully');
  } catch (error) {
    next(error);
  }
};

const recordPayment = async (req, res, next) => {
  try {
    const { amount, method, reference, notes } = req.body;
    const enrollment = await Enrollment.findById(req.params.id);
    if (!enrollment) {
      return errorResponse(res, 'Enrollment not found', 404);
    }

    enrollment.amountPaid = (enrollment.amountPaid || 0) + amount;
    if (enrollment.amountPaid >= enrollment.totalAmount) {
      enrollment.paymentStatus = 'paid';
    } else {
      enrollment.paymentStatus = 'partial';
    }
    enrollment.notes = notes || enrollment.notes;
    await enrollment.save();

    return successResponse(res, enrollment, 'Payment recorded successfully');
  } catch (error) {
    next(error);
  }
};

const issueCertificate = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id)
      .populate('student', 'name')
      .populate('course', 'name');
    if (!enrollment) {
      return errorResponse(res, 'Enrollment not found', 404);
    }

    if (enrollment.certificateIssued) {
      return errorResponse(res, 'Certificate already issued for this enrollment', 400);
    }

    const certificate = await Certificate.create({
      enrollment: enrollment._id,
      student: enrollment.student._id,
      course: enrollment.course._id,
      studentName: enrollment.student.name,
      courseName: enrollment.course.name,
      issuedBy: req.user._id,
    });

    enrollment.certificateIssued = true;
    enrollment.certificateIssuedAt = new Date();
    await enrollment.save();

    return successResponse(res, certificate, 'Certificate issued successfully', 201);
  } catch (error) {
    next(error);
  }
};

const getStudentEnrollments = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({ student: req.params.studentId })
      .populate('course', 'name code fee startDate endDate')
      .sort({ enrollmentDate: -1 });
    return successResponse(res, enrollments, 'Student enrollments retrieved successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllEnrollments,
  getEnrollment,
  createEnrollment,
  updateEnrollment,
  deleteEnrollment,
  recordPayment,
  issueCertificate,
  getStudentEnrollments,
};