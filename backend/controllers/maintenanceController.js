const MaintenanceJob = require('../models/MaintenanceJob');
const { successResponse, errorResponse, paginate, buildPaginationMeta } = require('../utils/response');

const getAllJobs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.customer) filter.customer = req.query.customer;
    if (req.query.priority) filter.priority = req.query.priority;
    if (req.query.assignedTechnician) filter.assignedTechnician = req.query.assignedTechnician;
    if (req.query.search) {
      filter.$or = [
        { jobNumber: { $regex: req.query.search, $options: 'i' } },
        { title: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const total = await MaintenanceJob.countDocuments({ ...filter, isDeleted: { $ne: true } });
    const jobs = await MaintenanceJob.find({ ...filter, isDeleted: { $ne: true } })
      .populate('customer', 'name phone customerType')
      .populate('assignedTechnician', 'name email')
      .populate('assignedBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return successResponse(res, jobs, 'Maintenance jobs retrieved successfully', 200, buildPaginationMeta(total, page, limit));
  } catch (error) {
    next(error);
  }
};

const getJob = async (req, res, next) => {
  try {
    const job = await MaintenanceJob.findById(req.params.id)
      .populate('customer', 'name phone email customerType')
      .populate('assignedTechnician', 'name email')
      .populate('assignedBy', 'name')
      .populate('sparePartsUsed.product', 'name sku')
      .populate('quotation')
      .populate('invoice');
    if (!job || job.isDeleted) {
      return errorResponse(res, 'Maintenance job not found', 404);
    }
    return successResponse(res, job);
  } catch (error) {
    next(error);
  }
};

const createJob = async (req, res, next) => {
  try {
    const job = new MaintenanceJob(req.body);
    job.assignedBy = req.user._id;
    if (req.body.assignedTechnician) {
      job.status = 'assigned';
    }
    await job.save();
    await job.populate('customer', 'name phone customerType');
    return successResponse(res, job, 'Maintenance job created successfully', 201);
  } catch (error) {
    next(error);
  }
};

const updateJob = async (req, res, next) => {
  try {
    const job = await MaintenanceJob.findById(req.params.id);
    if (!job || job.isDeleted) {
      return errorResponse(res, 'Maintenance job not found', 404);
    }
    Object.assign(job, req.body);
    if (req.body.assignedTechnician && job.status === 'pending') {
      job.status = 'assigned';
    }
    await job.save();
    await job.populate('customer', 'name phone customerType');
    return successResponse(res, job, 'Maintenance job updated successfully');
  } catch (error) {
    next(error);
  }
};

const deleteJob = async (req, res, next) => {
  try {
    const job = await MaintenanceJob.findById(req.params.id);
    if (!job) {
      return errorResponse(res, 'Maintenance job not found', 404);
    }
    job.isDeleted = true;
    job.deletedAt = new Date();
    await job.save();
    return successResponse(res, null, 'Maintenance job deleted successfully');
  } catch (error) {
    next(error);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    const job = await MaintenanceJob.findById(req.params.id);
    if (!job || job.isDeleted) {
      return errorResponse(res, 'Maintenance job not found', 404);
    }
    job.status = status;
    if (notes) {
      job.statusHistory.push({
        status,
        changedAt: new Date(),
        changedBy: req.user._id,
        notes,
      });
    }
    if (status === 'completed') {
      job.completedDate = new Date();
    }
    await job.save();
    return successResponse(res, job, 'Job status updated successfully');
  } catch (error) {
    next(error);
  }
};

const addSparePart = async (req, res, next) => {
  try {
    const job = await MaintenanceJob.findById(req.params.id);
    if (!job || job.isDeleted) {
      return errorResponse(res, 'Maintenance job not found', 404);
    }
    job.sparePartsUsed.push(req.body);
    await job.save();
    return successResponse(res, job, 'Spare part added successfully', 201);
  } catch (error) {
    next(error);
  }
};

const addServicePhoto = async (req, res, next) => {
  try {
    const job = await MaintenanceJob.findById(req.params.id);
    if (!job || job.isDeleted) {
      return errorResponse(res, 'Maintenance job not found', 404);
    }
    job.servicePhotos.push({ ...req.body, uploadedBy: req.user._id });
    await job.save();
    return successResponse(res, job, 'Service photo added successfully', 201);
  } catch (error) {
    next(error);
  }
};

const completeJob = async (req, res, next) => {
  try {
    const { completionReport, warranty, customerApproval } = req.body;
    const job = await MaintenanceJob.findById(req.params.id);
    if (!job || job.isDeleted) {
      return errorResponse(res, 'Maintenance job not found', 404);
    }
    job.status = 'completed';
    job.completedDate = new Date();
    if (completionReport) job.completionReport = completionReport;
    if (warranty) job.warranty = warranty;
    if (customerApproval) job.customerApproval = customerApproval;
    await job.save();
    return successResponse(res, job, 'Job completed successfully');
  } catch (error) {
    next(error);
  }
};

const getJobStats = async (req, res, next) => {
  try {
    const total = await MaintenanceJob.countDocuments({ isDeleted: { $ne: true } });
    const byStatus = await MaintenanceJob.aggregate([
      { $match: { isDeleted: { $ne: true } } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    const byPriority = await MaintenanceJob.aggregate([
      { $match: { isDeleted: { $ne: true } } },
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]);
    const completed = await MaintenanceJob.countDocuments({ status: 'completed', isDeleted: { $ne: true } });
    const pending = await MaintenanceJob.countDocuments({ status: 'pending', isDeleted: { $ne: true } });
    return successResponse(res, {
      total,
      completed,
      pending,
      byStatus,
      byPriority,
    }, 'Job stats retrieved successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  updateStatus,
  addSparePart,
  addServicePhoto,
  completeJob,
  getJobStats,
};