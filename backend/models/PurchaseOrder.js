const mongoose = require('mongoose');

const purchaseOrderSchema = new mongoose.Schema({
  poNumber: {
    type: String,
    unique: true,
    sparse: true,
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
    required: [true, 'Supplier is required'],
  },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
    notes: { type: String, trim: true },
  }],
  status: {
    type: String,
    enum: ['draft', 'pending', 'ordered', 'partially_received', 'received', 'cancelled', 'closed'],
    default: 'draft',
  },
  totalAmount: {
    type: Number,
    required: true,
    min: [0, 'Total amount cannot be negative'],
  },
  taxAmount: {
    type: Number,
    default: 0,
    min: [0, 'Tax amount cannot be negative'],
  },
  discountAmount: {
    type: Number,
    default: 0,
    min: [0, 'Discount amount cannot be negative'],
  },
  grandTotal: {
    type: Number,
    required: true,
    min: [0, 'Grand total cannot be negative'],
  },
  expectedDeliveryDate: Date,
  actualDeliveryDate: Date,
  deliveryAddress: {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    district: { type: String, trim: true },
    province: { type: String, trim: true },
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'partial', 'paid', 'overdue'],
    default: 'pending',
  },
  paymentTerms: {
    type: String,
    trim: true,
    default: 'Net 30',
  },
  receivedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  receivedDate: Date,
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters'],
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

purchaseOrderSchema.index({ poNumber: 1 });
purchaseOrderSchema.index({ supplier: 1 });
purchaseOrderSchema.index({ status: 1 });
purchaseOrderSchema.index({ paymentStatus: 1 });
purchaseOrderSchema.index({ createdAt: -1 });

purchaseOrderSchema.pre('save', async function (next) {
  if (this.isNew && !this.poNumber) {
    const count = await this.constructor.countDocuments();
    this.poNumber = `PO${String(count + 1).padStart(6, '0')}`;
  }
  this.grandTotal = this.totalAmount + this.taxAmount - this.discountAmount;
  next();
});

module.exports = mongoose.model('PurchaseOrder', purchaseOrderSchema);