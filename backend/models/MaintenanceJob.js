const mongoose = require('mongoose');

const maintenanceJobSchema = new mongoose.Schema({
  jobNumber: {
    type: String,
    unique: true,
    sparse: true,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: [true, 'Customer is required'],
  },
  equipment: {
    name: { type: String, required: true, trim: true },
    model: { type: String, trim: true },
    serialNumber: { type: String, trim: true },
    brand: { type: String, trim: true },
    purchaseDate: Date,
    warrantyExpiry: Date,
  },
  serviceCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters'],
  },
  problemReported: {
    type: String,
    required: [true, 'Reported problem is required'],
    trim: true,
    maxlength: [1000, 'Reported problem cannot exceed 1000 characters'],
  },
  diagnosis: {
    type: String,
    trim: true,
    maxlength: [2000, 'Diagnosis cannot exceed 2000 characters'],
  },
  status: {
    type: String,
    enum: [
      'pending', 'assigned', 'in_progress', 'awaiting_parts',
      'quality_check', 'completed', 'cancelled', 'on_hold'
    ],
    default: 'pending',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  },
  scheduledDate: Date,
  scheduledTime: {
    type: String,
    trim: true,
  },
  assignedTechnician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  repairPlan: {
    type: String,
    trim: true,
    maxlength: [2000, 'Repair plan cannot exceed 2000 characters'],
  },
  sparePartsUsed: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, required: true, min: 1 },
    unit: { type: String, trim: true },
    unitPrice: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
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
  totalCost: {
    type: Number,
    default: 0,
    min: [0, 'Total cost cannot be negative'],
  },
  estimatedCost: {
    type: Number,
    default: 0,
    min: [0, 'Estimated cost cannot be negative'],
  },
  quotation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quotation',
  },
  invoice: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invoice',
  },
  servicePhotos: [{
    title: String,
    fileUrl: String,
    photoType: { type: String, enum: ['before', 'during', 'after', 'other'] },
    uploadedAt: { type: Date, default: Date.now },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  }],
  statusHistory: [{
    status: { type: String, required: true },
    changedAt: { type: Date, default: Date.now },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    notes: { type: String, trim: true },
  }],
  warranty: {
    provided: { type: Boolean, default: false },
    duration: { type: String, trim: true },
    expiryDate: Date,
    terms: { type: String, trim: true },
  },
  followUpVisits: [{
    scheduledDate: Date,
    purpose: { type: String, trim: true },
    completed: { type: Boolean, default: false },
    completedDate: Date,
    notes: { type: String, trim: true },
  }],
  customerApproval: {
    approved: { type: Boolean, default: false },
    approvedAt: Date,
    comments: { type: String, trim: true },
    rating: { type: Number, min: 1, max: 5 },
  },
  completionReport: {
    type: String,
    trim: true,
    maxlength: [2000, 'Completion report cannot exceed 2000 characters'],
  },
  completedDate: Date,
  isDeleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: Date,
}, {
  timestamps: true,
});

maintenanceJobSchema.index({ customer: 1 });
maintenanceJobSchema.index({ status: 1 });
maintenanceJobSchema.index({ priority: 1 });
maintenanceJobSchema.index({ assignedTechnician: 1 });
maintenanceJobSchema.index({ createdAt: -1 });

maintenanceJobSchema.pre('save', async function (next) {
  if (this.isNew && !this.jobNumber) {
    const count = await this.constructor.countDocuments();
    this.jobNumber = `MNT${String(count + 1).padStart(5, '0')}`;
  }
  if (this.isModified('status') && !this.isNew) {
    this.statusHistory.push({
      status: this.status,
      changedAt: new Date(),
    });
  }
  this.partsCost = this.sparePartsUsed.reduce((sum, p) => sum + (p.total || 0), 0);
  this.totalCost = this.laborCost + this.partsCost;
  next();
});

module.exports = mongoose.model('MaintenanceJob', maintenanceJobSchema);