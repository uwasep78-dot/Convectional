const Student = require('../models/Student');
const User = require('../models/User');
const { successResponse, errorResponse, paginate, buildPaginationMeta } = require('../utils/response');

const getAllStudents = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.search) {
      filter.$or = [
        { studentId: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const total = await Student.countDocuments(filter);
    const students = await Student.find(filter)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return successResponse(res, students, 'Students retrieved successfully', 200, buildPaginationMeta(total, page, limit));
  } catch (error) {
    next(error);
  }
};

const getStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id).populate('user', 'name email phone');
    if (!student) {
      return errorResponse(res, 'Student not found', 404);
    }
    return successResponse(res, student);
  } catch (error) {
    next(error);
  }
};

const createStudent = async (req, res, next) => {
  try {
    const { userId, ...studentData } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }
    const existing = await Student.findOne({ user: userId });
    if (existing) {
      return errorResponse(res, 'Student profile already exists for this user', 400);
    }
    const student = await Student.create({ user: userId, ...studentData });
    await student.populate('user', 'name email phone');
    return successResponse(res, student, 'Student created successfully', 201);
  } catch (error) {
    next(error);
  }
};

const updateStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return errorResponse(res, 'Student not found', 404);
    }
    Object.assign(student, req.body);
    await student.save();
    await student.populate('user', 'name email phone');
    return successResponse(res, student, 'Student updated successfully');
  } catch (error) {
    next(error);
  }
};

const deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return errorResponse(res, 'Student not found', 404);
    }
    await student.deleteOne();
    return successResponse(res, null, 'Student deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllStudents, getStudent, createStudent, updateStudent, deleteStudent };