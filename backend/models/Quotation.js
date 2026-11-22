const mongoose = require('mongoose');

const quotationSchema = new mongoose.Schema({
  quotationNumber: {
    type: String,
    unique: true,
    sparse: true,
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
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters'],
  },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Training' },
    description: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 1 },
    unit: { type: String, trim: true },
    unitPrice: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
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
    min: [0, 'Discount value cannot be negative'],
  },
  discountAmount: {
    type: Number,
    default: 0,
    min: [0, 'Discount amount cannot be negative'],
  },
  taxRate: {
    type: Number,
    default: 0,
    min: [0, 'Tax rate cannot be negative'],
    max: [100, 'Tax rate cannot exceed 100'],
  },
  taxAmount: {
    type: Number,
    default: 0,
    min: [0, 'Tax amount cannot be negative'],
  },
  totalAmount: {
    type: Number,
    required: true,
    default: 0,
    min: [0, 'Total amount cannot be negative'],
  },
  status: {
    type: String,
    enum: ['draft', 'sent', 'approved', 'rejected', 'expired', 'converted'],
    default: 'draft',
  },
  validUntil: {
    type: Date,
    required: [true, 'Valid until date is required'],
  },
  issuedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sentAt: Date,
  approvedAt: Date,
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  rejectedAt: Date,
  rejectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  rejectionReason: {
    type: String,
    trim: true,
  },
  convertedToInvoice: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invoice',
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

quotationSchema.index({ customer: 1 });
quotationSchema.index({ status: 1 });
quotationSchema.index({ issuedBy: 1 });
quotationSchema.index({ validUntil: 1 });
quotationSchema.index({ createdAt: -1 });

quotationSchema.pre('save', async function (next) {
  if (this.isNew && !this.quotationNumber) {
    const count = await this.constructor.countDocuments();
    this.quotationNumber = `QUO${String(count + 1).padStart(6, '0')}`;
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
  next();
});

quotationSchema.methods.calculateTotals = function () {
  this.subtotal = this.items.reduce((sum, item) => sum + (item.total || 0), 0) + this.laborCost + this.partsCost;
  if (this.discountType === 'percentage') {
    this.discountAmount = (this.subtotal * this.discountValue) / 100;
  } else if (this.discountType === 'fixed') {
    this.discountAmount = this.discountValue;
  }
  const afterDiscount = this.subtotal - this.discountAmount;
  this.taxAmount = (afterDiscount * this.taxRate) / 100;
  this.totalAmount = afterDiscount + this.taxAmount;
  return this;
};

module.exports = mongoose.model('Quotation', quotationSchema);