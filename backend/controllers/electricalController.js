const ElectricalProject = require('../models/ElectricalProject');
const { successResponse, errorResponse, paginate, buildPaginationMeta } = require('../utils/response');

const getAllProjects = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.serviceType) filter.serviceType = req.query.serviceType;
    if (req.query.customer) filter.customer = req.query.customer;
    if (req.query.priority) filter.priority = req.query.priority;
    if (req.query.search) {
      filter.$or = [
        { projectNumber: { $regex: req.query.search, $options: 'i' } },
        { title: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const total = await ElectricalProject.countDocuments({ ...filter, isDeleted: { $ne: true } });
    const projects = await ElectricalProject.find({ ...filter, isDeleted: { $ne: true } })
      .populate('customer', 'name phone customerType')
      .populate('assignedTechnicians', 'name')
      .populate('assignedEngineers', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return successResponse(res, projects, 'Projects retrieved successfully', 200, buildPaginationMeta(total, page, limit));
  } catch (error) {
    next(error);
  }
};

const getProject = async (req, res, next) => {
  try {
    const project = await ElectricalProject.findById(req.params.id)
      .populate('customer', 'name phone email customerType')
      .populate('assignedTechnicians', 'name email')
      .populate('assignedEngineers', 'name email')
      .populate('quotation')
      .populate('invoice');
    if (!project || project.isDeleted) {
      return errorResponse(res, 'Project not found', 404);
    }
    return successResponse(res, project);
  } catch (error) {
    next(error);
  }
};

const createProject = async (req, res, next) => {
  try {
    const project = new ElectricalProject(req.body);
    await project.save();
    await project.populate('customer', 'name phone customerType');
    return successResponse(res, project, 'Project created successfully', 201);
  } catch (error) {
    next(error);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const project = await ElectricalProject.findById(req.params.id);
    if (!project || project.isDeleted) {
      return errorResponse(res, 'Project not found', 404);
    }
    Object.assign(project, req.body);
    await project.save();
    await project.populate('customer', 'name phone customerType');
    return successResponse(res, project, 'Project updated successfully');
  } catch (error) {
    next(error);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    const project = await ElectricalProject.findById(req.params.id);
    if (!project) {
      return errorResponse(res, 'Project not found', 404);
    }
    project.isDeleted = true;
    project.deletedAt = new Date();
    await project.save();
    return successResponse(res, null, 'Project deleted successfully');
  } catch (error) {
    next(error);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    const project = await ElectricalProject.findById(req.params.id);
    if (!project || project.isDeleted) {
      return errorResponse(res, 'Project not found', 404);
    }
    project.status = status;
    if (notes) project.notes = (project.notes ? project.notes + '\n' : '') + notes;
    await project.save();
    return successResponse(res, project, 'Project status updated successfully');
  } catch (error) {
    next(error);
  }
};

const addTestingRecord = async (req, res, next) => {
  try {
    const project = await ElectricalProject.findById(req.params.id);
    if (!project || project.isDeleted) {
      return errorResponse(res, 'Project not found', 404);
    }
    project.testingRecords.push({ ...req.body, tester: req.user._id });
    await project.save();
    return successResponse(res, project, 'Testing record added successfully', 201);
  } catch (error) {
    next(error);
  }
};

const addSiteInspection = async (req, res, next) => {
  try {
    const project = await ElectricalProject.findById(req.params.id);
    if (!project || project.isDeleted) {
      return errorResponse(res, 'Project not found', 404);
    }
    project.siteInspection = { ...req.body, inspector: req.user._id };
    await project.save();
    return successResponse(res, project, 'Site inspection recorded successfully');
  } catch (error) {
    next(error);
  }
};

const completeProject = async (req, res, next) => {
  try {
    const { handoverNotes, customerApproval } = req.body;
    const project = await ElectricalProject.findById(req.params.id);
    if (!project || project.isDeleted) {
      return errorResponse(res, 'Project not found', 404);
    }
    project.status = 'completed';
    project.completionReport = {
      completedDate: new Date(),
      handoverNotes,
      customerApproval,
    };
    await project.save();
    return successResponse(res, project, 'Project completed successfully');
  } catch (error) {
    next(error);
  }
};

const getProjectStats = async (req, res, next) => {
  try {
    const total = await ElectricalProject.countDocuments({ isDeleted: { $ne: true } });
    const byStatus = await ElectricalProject.aggregate([
      { $match: { isDeleted: { $ne: true } } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    const byType = await ElectricalProject.aggregate([
      { $match: { isDeleted: { $ne: true } } },
      { $group: { _id: '$serviceType', count: { $sum: 1 } } },
    ]);
    const byPriority = await ElectricalProject.aggregate([
      { $match: { isDeleted: { $ne: true } } },
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]);
    return successResponse(res, { total, byStatus, byType, byPriority }, 'Project stats retrieved successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  updateStatus,
  addTestingRecord,
  addSiteInspection,
  completeProject,
  getProjectStats,
};