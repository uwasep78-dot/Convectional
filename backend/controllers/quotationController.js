const Quotation = require('../models/Quotation');
const Invoice = require('../models/Invoice');
const { successResponse, errorResponse, paginate, buildPaginationMeta } = require('../utils/response');

const getAllQuotations = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.customer) filter.customer = req.query.customer;
    if (req.query.search) {
      filter.$or = [
        { quotationNumber: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const total = await Quotation.countDocuments({ ...filter, isDeleted: { $ne: true } });
    const quotations = await Quotation.find({ ...filter, isDeleted: { $ne: true } })
      .populate('customer', 'name phone customerType')
      .populate('issuedBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return successResponse(res, quotations, 'Quotations retrieved successfully', 200, buildPaginationMeta(total, page, limit));
  } catch (error) {
    next(error);
  }
};

const getQuotation = async (req, res, next) => {
  try {
    const quotation = await Quotation.findById(req.params.id)
      .populate('customer', 'name phone email customerType')
      .populate('issuedBy', 'name')
      .populate('approvedBy', 'name')
      .populate('items.product', 'name sku')
      .populate('relatedProject')
      .populate('relatedMaintenance');
    if (!quotation || quotation.isDeleted) {
      return errorResponse(res, 'Quotation not found', 404);
    }
    return successResponse(res, quotation);
  } catch (error) {
    next(error);
  }
};

const createQuotation = async (req, res, next) => {
  try {
    const quotation = new Quotation(req.body);
    quotation.issuedBy = req.user._id;
    quotation.calculateTotals();
    await quotation.save();
    await quotation.populate('customer', 'name phone customerType');
    return successResponse(res, quotation, 'Quotation created successfully', 201);
  } catch (error) {
    next(error);
  }
};

const updateQuotation = async (req, res, next) => {
  try {
    const quotation = await Quotation.findById(req.params.id);
    if (!quotation || quotation.isDeleted) {
      return errorResponse(res, 'Quotation not found', 404);
    }
    Object.assign(quotation, req.body);
    quotation.calculateTotals();
    await quotation.save();
    await quotation.populate('customer', 'name phone customerType');
    return successResponse(res, quotation, 'Quotation updated successfully');
  } catch (error) {
    next(error);
  }
};

const deleteQuotation = async (req, res, next) => {
  try {
    const quotation = await Quotation.findById(req.params.id);
    if (!quotation) {
      return errorResponse(res, 'Quotation not found', 404);
    }
    quotation.isDeleted = true;
    quotation.deletedAt = new Date();
    await quotation.save();
    return successResponse(res, null, 'Quotation deleted successfully');
  } catch (error) {
    next(error);
  }
};

const updateQuotationStatus = async (req, res, next) => {
  try {
    const { status, rejectionReason } = req.body;
    const quotation = await Quotation.findById(req.params.id);
    if (!quotation || quotation.isDeleted) {
      return errorResponse(res, 'Quotation not found', 404);
    }

    quotation.status = status;
    if (status === 'sent' && !quotation.sentAt) {
      quotation.sentAt = new Date();
    }
    if (status === 'approved') {
      quotation.approvedAt = new Date();
      quotation.approvedBy = req.user._id;
    }
    if (status === 'rejected') {
      quotation.rejectedAt = new Date();
      quotation.rejectedBy = req.user._id;
      quotation.rejectionReason = rejectionReason;
    }
    await quotation.save();
    await quotation.populate('customer', 'name phone customerType');
    return successResponse(res, quotation, 'Quotation status updated successfully');
  } catch (error) {
    next(error);
  }
};

const convertToInvoice = async (req, res, next) => {
  try {
    const quotation = await Quotation.findById(req.params.id);
    if (!quotation || quotation.isDeleted) {
      return errorResponse(res, 'Quotation not found', 404);
    }
    if (quotation.status !== 'approved') {
      return errorResponse(res, 'Only approved quotations can be converted to invoices', 400);
    }

    const Invoice = require('../models/Invoice');
    const invoice = new Invoice({
      quotation: quotation._id,
      customer: quotation.customer,
      customerType: quotation.customerType,
      items: quotation.items,
      laborCost: quotation.laborCost,
      partsCost: quotation.partsCost,
      subtotal: quotation.subtotal,
      discountType: quotation.discountType,
      discountValue: quotation.discountValue,
      discountAmount: quotation.discountAmount,
      taxRate: quotation.taxRate,
      taxAmount: quotation.taxAmount,
      totalAmount: quotation.totalAmount,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      issuedBy: quotation.issuedBy,
      relatedProject: quotation.relatedProject,
      relatedMaintenance: quotation.relatedMaintenance,
      notes: quotation.notes,
      terms: quotation.terms,
    });
    await invoice.save();

    quotation.convertedToInvoice = invoice._id;
    quotation.status = 'converted';
    await quotation.save();

    await invoice.populate('customer', 'name phone customerType');
    return successResponse(res, invoice, 'Invoice created successfully', 201);
  } catch (error) {
    next(error);
  }
};

const getQuotationStats = async (req, res, next) => {
  try {
    const total = await Quotation.countDocuments({ isDeleted: { $ne: true } });
    const byStatus = await Quotation.aggregate([
      { $match: { isDeleted: { $ne: true } } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    const totalValue = await Quotation.aggregate([
      { $match: { status: 'approved', isDeleted: { $ne: true } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);
    return successResponse(res, {
      total,
      byStatus,
      totalValue: totalValue[0]?.total || 0,
    }, 'Quotation stats retrieved successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllQuotations,
  getQuotation,
  createQuotation,
  updateQuotation,
  deleteQuotation,
  updateQuotationStatus,
  convertToInvoice,
  getQuotationStats,
};