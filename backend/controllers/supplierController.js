const Supplier = require('../models/Supplier');
const { successResponse, errorResponse, paginate, buildPaginationMeta } = require('../utils/response');

const getAllSuppliers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { code: { $regex: req.query.search, $options: 'i' } },
        { contactPerson: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const total = await Supplier.countDocuments(filter);
    const suppliers = await Supplier.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);
    return successResponse(res, suppliers, 'Suppliers retrieved successfully', 200, buildPaginationMeta(total, page, limit));
  } catch (error) {
    next(error);
  }
};

const getSupplier = async (req, res, next) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return errorResponse(res, 'Supplier not found', 404);
    }
    return successResponse(res, supplier);
  } catch (error) {
    next(error);
  }
};

const createSupplier = async (req, res, next) => {
  try {
    const supplier = await Supplier.create(req.body);
    return successResponse(res, supplier, 'Supplier created successfully', 201);
  } catch (error) {
    next(error);
  }
};

const updateSupplier = async (req, res, next) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return errorResponse(res, 'Supplier not found', 404);
    }
    Object.assign(supplier, req.body);
    await supplier.save();
    return successResponse(res, supplier, 'Supplier updated successfully');
  } catch (error) {
    next(error);
  }
};

const deleteSupplier = async (req, res, next) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return errorResponse(res, 'Supplier not found', 404);
    }
    await supplier.deleteOne();
    return successResponse(res, null, 'Supplier deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllSuppliers, getSupplier, createSupplier, updateSupplier, deleteSupplier };