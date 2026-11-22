const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    unique: true,
    sparse: true,
  },
  quotation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quotation',
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: [true, 'Customer is required'],
  },
  customerType: {
    type: String,
    enum: ['individual', 'company', 'institution', 'organization'],
  },
  invoiceType: {
    type: String,
    enum: ['product', 'service', 'mixed', 'training'],
    default: 'mixed',
  },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Training' },
    description: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 1 },
    unit: { type: String, trim: true },
    unitPrice: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
    taxRate: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    notes: { type: String, trim: true },
  }],
  laborCost: {
    type: Number,
    default: 0,
    min: [0, 'Labor cost cannot be negative'],
  },
  partsCost: {
    type: Number,
    default: 0,
    min: [0, 'Parts cost cannot be negative'],
  },
  subtotal: {
    type: Number,
    required: true,
    default: 0,
    min: [0, 'Subtotal cannot be negative'],
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed', 'none'],
    default: 'none',
  },
  discountValue: {
    type: Number,
    default: 0,
  },
  discountAmount: {
    type: Number,
    default: 0,
  },
  taxRate: {
    type: Number,
    default: 0,
  },
  taxAmount: {
    type: Number,
    default: 0,
  },
  totalAmount: {
    type: Number,
    required: true,
    default: 0,
    min: [0, 'Total amount cannot be negative'],
  },
  amountPaid: {
    type: Number,
    default: 0,
    min: [0, 'Amount paid cannot be negative'],
  },
  amountDue: {
    type: Number,
    default: 0,
    min: [0, 'Amount due cannot be negative'],
  },
  status: {
    type: String,
    enum: ['draft', 'sent', 'partially_paid', 'paid', 'overdue', 'cancelled', 'refunded'],
    default: 'draft',
  },
  issuedDate: {
    type: Date,
    default: Date.now,
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required'],
  },
  paidDate: Date,
  issuedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  relatedProject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ElectricalProject',
  },
  relatedMaintenance: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MaintenanceJob',
  },
  relatedTraining: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Training',
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters'],
  },
  terms: {
    type: String,
    trim: true,
    maxlength: [1000, 'Terms cannot exceed 1000 characters'],
  },
  attachments: [{
    title: String,
    fileUrl: String,
    uploadedAt: { type: Date, default: Date.now },
  }],
  isDeleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: Date,
}, {
  timestamps: true,
});

invoiceSchema.index({ customer: 1 });
invoiceSchema.index({ status: 1 });
invoiceSchema.index({ issuedBy: 1 });
invoiceSchema.index({ dueDate: 1 });
invoiceSchema.index({ createdAt: -1 });

invoiceSchema.pre('save', async function (next) {
  if (this.isNew && !this.invoiceNumber) {
    const count = await this.constructor.countDocuments();
    this.invoiceNumber = `INV${String(count + 1).padStart(6, '0')}`;
  }
  this.subtotal = this.items.reduce((sum, item) => sum + (item.total || 0), 0) + this.laborCost + this.partsCost;
  if (this.discountType === 'percentage') {
    this.discountAmount = (this.subtotal * this.discountValue) / 100;
  } else if (this.discountType === 'fixed') {
    this.discountAmount = this.discountValue;
  }
  const afterDiscount = this.subtotal - this.discountAmount;
  this.taxAmount = (afterDiscount * this.taxRate) / 100;
  this.totalAmount = afterDiscount + this.taxAmount;
  this.amountDue = Math.max(0, this.totalAmount - this.amountPaid);
  if (this.amountPaid >= this.totalAmount && this.totalAmount > 0) {
    this.status = 'paid';
    this.paidDate = new Date();
  } else if (this.amountPaid > 0) {
    this.status = 'partially_paid';
  }
  next();
});

invoiceSchema.methods.calculateTotals = function () {
  this.subtotal = this.items.reduce((sum, item) => sum + (item.total || 0), 0) + this.laborCost + this.partsCost;
  if (this.discountType === 'percentage') {
    this.discountAmount = (this.subtotal * this.discountValue) / 100;
  } else if (this.discountType === 'fixed') {
    this.discountAmount = this.discountValue;
  }
  const afterDiscount = this.subtotal - this.discountAmount;
  this.taxAmount = (afterDiscount * this.taxRate) / 100;
  this.totalAmount = afterDiscount + this.taxAmount;
  this.amountDue = Math.max(0, this.totalAmount - this.amountPaid);
  return this;
};

module.exports = mongoose.model('Invoice', invoiceSchema);