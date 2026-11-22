const Invoice = require('../models/Invoice');
const Payment = require('../models/Payment');
const { successResponse, errorResponse, paginate, buildPaginationMeta } = require('../utils/response');

const getAllInvoices = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.customer) filter.customer = req.query.customer;
    if (req.query.search) {
      filter.$or = [
        { invoiceNumber: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const total = await Invoice.countDocuments({ ...filter, isDeleted: { $ne: true } });
    const invoices = await Invoice.find({ ...filter, isDeleted: { $ne: true } })
      .populate('customer', 'name phone customerType')
      .populate('issuedBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return successResponse(res, invoices, 'Invoices retrieved successfully', 200, buildPaginationMeta(total, page, limit));
  } catch (error) {
    next(error);
  }
};

const getInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('customer', 'name phone email customerType')
      .populate('issuedBy', 'name')
      .populate('quotation')
      .populate('items.product', 'name sku');
    if (!invoice || invoice.isDeleted) {
      return errorResponse(res, 'Invoice not found', 404);
    }
    return successResponse(res, invoice);
  } catch (error) {
    next(error);
  }
};

const createInvoice = async (req, res, next) => {
  try {
    const invoice = new Invoice(req.body);
    invoice.issuedBy = req.user._id;
    invoice.calculateTotals();
    await invoice.save();
    await invoice.populate('customer', 'name phone customerType');
    return successResponse(res, invoice, 'Invoice created successfully', 201);
  } catch (error) {
    next(error);
  }
};

const updateInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice || invoice.isDeleted) {
      return errorResponse(res, 'Invoice not found', 404);
    }
    Object.assign(invoice, req.body);
    invoice.calculateTotals();
    await invoice.save();
    await invoice.populate('customer', 'name phone customerType');
    return successResponse(res, invoice, 'Invoice updated successfully');
  } catch (error) {
    next(error);
  }
};

const deleteInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return errorResponse(res, 'Invoice not found', 404);
    }
    invoice.isDeleted = true;
    invoice.deletedAt = new Date();
    await invoice.save();
    return successResponse(res, null, 'Invoice deleted successfully');
  } catch (error) {
    next(error);
  }
};

const recordPayment = async (req, res, next) => {
  try {
    const { amount, paymentMethod, transactionReference, notes, bankDetails } = req.body;
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice || invoice.isDeleted) {
      return errorResponse(res, 'Invoice not found', 404);
    }

    const payment = await Payment.create({
      invoice: invoice._id,
      customer: invoice.customer,
      amount,
      paymentMethod,
      transactionReference,
      receivedBy: req.user._id,
      notes,
      bankDetails,
    });

    invoice.amountPaid = (invoice.amountPaid || 0) + amount;
    invoice.amountDue = Math.max(0, invoice.totalAmount - invoice.amountPaid);
    if (invoice.amountPaid >= invoice.totalAmount) {
      invoice.status = 'paid';
      invoice.paidDate = new Date();
    } else if (invoice.amountPaid > 0) {
      invoice.status = 'partially_paid';
    }
    await invoice.save();

    await payment.populate('customer', 'name phone');
    return successResponse(res, { payment, invoice }, 'Payment recorded successfully', 201);
  } catch (error) {
    next(error);
  }
};

const getPayments = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.invoice) filter.invoice = req.query.invoice;
    if (req.query.customer) filter.customer = req.query.customer;
    if (req.query.paymentMethod) filter.paymentMethod = req.query.paymentMethod;
    if (req.query.status) filter.status = req.query.status;

    const total = await Payment.countDocuments({ ...filter, isDeleted: { $ne: true } });
    const payments = await Payment.find({ ...filter, isDeleted: { $ne: true } })
      .populate('invoice', 'invoiceNumber')
      .populate('customer', 'name phone')
      .populate('receivedBy', 'name')
      .sort({ paymentDate: -1 })
      .skip(skip)
      .limit(limit);

    return successResponse(res, payments, 'Payments retrieved successfully', 200, buildPaginationMeta(total, page, limit));
  } catch (error) {
    next(error);
  }
};

const getInvoiceStats = async (req, res, next) => {
  try {
    const total = await Invoice.countDocuments({ isDeleted: { $ne: true } });
    const byStatus = await Invoice.aggregate([
      { $match: { isDeleted: { $ne: true } } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    const totalSales = await Invoice.aggregate([
      { $match: { status: { $in: ['paid', 'partially_paid'] }, isDeleted: { $ne: true } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);
    const totalReceived = await Invoice.aggregate([
      { $match: { isDeleted: { $ne: true } } },
      { $group: { _id: null, total: { $sum: '$amountPaid' } } },
    ]);
    const outstanding = await Invoice.aggregate([
      { $match: { status: { $in: ['sent', 'partially_paid', 'overdue'] }, isDeleted: { $ne: true } } },
      { $group: { _id: null, total: { $sum: '$amountDue' } } },
    ]);

    return successResponse(res, {
      total,
      byStatus,
      totalSales: totalSales[0]?.total || 0,
      totalReceived: totalReceived[0]?.total || 0,
      outstanding: outstanding[0]?.total || 0,
    }, 'Invoice stats retrieved successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllInvoices,
  getInvoice,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  recordPayment,
  getPayments,
  getInvoiceStats,
};