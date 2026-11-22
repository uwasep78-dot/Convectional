const Training = require('../models/Training');
const Enrollment = require('../models/Enrollment');
const Student = require('../models/Student');
const User = require('../models/User');
const { successResponse, errorResponse, paginate, buildPaginationMeta } = require('../utils/response');

const getAllTrainings = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.category) filter.category = req.query.category;
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { code: { $regex: req.query.search, $options: 'i' } },
      ];
    }
    if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === 'true';

    const total = await Training.countDocuments(filter);
    const trainings = await Training.find(filter)
      .populate('category', 'name type')
      .populate('instructors', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const trainingsWithEnrollment = await Promise.all(trainings.map(async (t) => {
      const enrollmentCount = await Enrollment.countDocuments({ course: t._id, status: { $ne: 'cancelled' } });
      return { ...t.toObject(), enrollmentCount };
    }));

    return successResponse(res, trainingsWithEnrollment, 'Trainings retrieved successfully', 200, buildPaginationMeta(total, page, limit));
  } catch (error) {
    next(error);
  }
};

const getTraining = async (req, res, next) => {
  try {
    const training = await Training.findById(req.params.id)
      .populate('category', 'name type')
      .populate('instructors', 'name email');
    if (!training) {
      return errorResponse(res, 'Training not found', 404);
    }
    const enrollmentCount = await Enrollment.countDocuments({ course: training._id, status: { $ne: 'cancelled' } });
    return successResponse(res, { ...training.toObject(), enrollmentCount });
  } catch (error) {
    next(error);
  }
};

const createTraining = async (req, res, next) => {
  try {
    const training = new Training(req.body);
    await training.generateCode();
    await training.save();
    await training.populate('category', 'name type');
    return successResponse(res, training, 'Training created successfully', 201);
  } catch (error) {
    next(error);
  }
};

const updateTraining = async (req, res, next) => {
  try {
    const training = await Training.findById(req.params.id);
    if (!training) {
      return errorResponse(res, 'Training not found', 404);
    }
    Object.assign(training, req.body);
    await training.save();
    await training.populate('category', 'name type');
    return successResponse(res, training, 'Training updated successfully');
  } catch (error) {
    next(error);
  }
};

const deleteTraining = async (req, res, next) => {
  try {
    const training = await Training.findById(req.params.id);
    if (!training) {
      return errorResponse(res, 'Training not found', 404);
    }
    await training.deleteOne();
    return successResponse(res, null, 'Training deleted successfully');
  } catch (error) {
    next(error);
  }
};

const getTrainingStudents = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({ course: req.params.id })
      .populate('student', 'studentId name email phone')
      .populate('enrolledBy', 'name')
      .sort({ enrollmentDate: -1 });
    return successResponse(res, enrollments, 'Students retrieved successfully');
  } catch (error) {
    next(error);
  }
};

const getTrainingStats = async (req, res, next) => {
  try {
    const total = await Training.countDocuments();
    const byStatus = await Training.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    const totalEnrollments = await Enrollment.countDocuments();
    const totalStudents = await Student.countDocuments();
    const totalRevenue = await Enrollment.aggregate([
      { $match: { paymentStatus: { $in: ['paid', 'partial'] } } },
      { $group: { _id: null, total: { $sum: '$amountPaid' } } },
    ]);
    return successResponse(res, {
      totalTrainings: total,
      byStatus,
      totalEnrollments,
      totalStudents,
      totalRevenue: totalRevenue[0]?.total || 0,
    }, 'Training stats retrieved successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTrainings,
  getTraining,
  createTraining,
  updateTraining,
  deleteTraining,
  getTrainingStudents,
  getTrainingStats,
};