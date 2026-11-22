const Customer = require('../models/Customer');
const { successResponse, errorResponse, paginate, buildPaginationMeta } = require('../utils/response');

const getAllCustomers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.customerType) filter.customerType = req.query.customerType;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
        { phone: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const total = await Customer.countDocuments(filter);
    const customers = await Customer.find(filter)
      .populate('userId', 'name email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return successResponse(res, customers, 'Customers retrieved successfully', 200, buildPaginationMeta(total, page, limit));
  } catch (error) {
    next(error);
  }
};

const getCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id).populate('userId', 'name email role');
    if (!customer) {
      return errorResponse(res, 'Customer not found', 404);
    }
    return successResponse(res, customer);
  } catch (error) {
    next(error);
  }
};

const createCustomer = async (req, res, next) => {
  try {
    const customerData = { ...req.body };
    if (req.body.customerType === 'individual') {
      delete customerData.companyDetails;
    }
    const customer = await Customer.create(customerData);
    return successResponse(res, customer, 'Customer created successfully', 201);
  } catch (error) {
    next(error);
  }
};

const updateCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return errorResponse(res, 'Customer not found', 404);
    }
    Object.assign(customer, req.body);
    await customer.save();
    return successResponse(res, customer, 'Customer updated successfully');
  } catch (error) {
    next(error);
  }
};

const deleteCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return errorResponse(res, 'Customer not found', 404);
    }
    await customer.deleteOne();
    return successResponse(res, null, 'Customer deleted successfully');
  } catch (error) {
    next(error);
  }
};

const getCustomerStats = async (req, res, next) => {
  try {
    const total = await Customer.countDocuments();
    const byType = await Customer.aggregate([
      { $group: { _id: '$customerType', count: { $sum: 1 } } },
    ]);
    const byStatus = await Customer.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    return successResponse(res, { total, byType, byStatus }, 'Customer stats retrieved successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerStats,
};