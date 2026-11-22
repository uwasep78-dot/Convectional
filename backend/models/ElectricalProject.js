const mongoose = require('mongoose');

const electricalProjectSchema = new mongoose.Schema({
  projectNumber: {
    type: String,
    unique: true,
    sparse: true,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: [true, 'Customer is required'],
  },
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters'],
  },
  serviceCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  serviceType: {
    type: String,
    enum: ['installation', 'maintenance', 'repair', 'wiring', 'consultation', 'inspection', 'other'],
    default: 'installation',
  },
  status: {
    type: String,
    enum: [
      'pending', 'site_inspection_scheduled', 'site_inspection_completed',
      'design_phase', 'approved', 'in_progress', 'materials_ordered',
      'installation', 'testing', 'inspection_pending', 'completed',
      'cancelled', 'on_hold'
    ],
    default: 'pending',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  },
  siteAddress: {
    street: { type: String, required: true, trim: true },
    city: { type: String, trim: true },
    district: { type: String, trim: true },
    province: { type: String, trim: true },
    country: { type: String, trim: true, default: 'Rwanda' },
    coordinates: {
      lat: Number,
      lng: Number,
    },
  },
  contactPerson: {
    name: { type: String, trim: true },
    phone: { type: String, trim: true },
  },
  scheduledDate: Date,
  estimatedDuration: {
    value: Number,
    unit: { type: String, enum: ['days', 'weeks', 'months'] },
  },
  assignedTechnicians: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  assignedEngineers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  materialsRequired: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, required: true, min: 1 },
    unit: { type: String, trim: true },
    notes: { type: String, trim: true },
  }],
  estimatedCost: {
    type: Number,
    default: 0,
    min: [0, 'Estimated cost cannot be negative'],
  },
  actualCost: {
    type: Number,
    default: 0,
    min: [0, 'Actual cost cannot be negative'],
  },
  quotation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quotation',
  },
  invoice: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invoice',
  },
  siteInspection: {
    scheduledDate: Date,
    completedDate: Date,
    inspector: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    findings: { type: String, trim: true },
    photos: [{
      title: String,
      fileUrl: String,
      uploadedAt: { type: Date, default: Date.now },
    }],
    reportUrl: String,
  },
  testingRecords: [{
    testType: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    result: { type: String, required: true, trim: true },
    passed: { type: Boolean, required: true },
    tester: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    notes: { type: String, trim: true },
    photos: [{
      title: String,
      fileUrl: String,
      uploadedAt: { type: Date, default: Date.now },
    }],
  }],
  completionReport: {
    completedDate: Date,
    reportUrl: String,
    photos: [{
      title: String,
    fileUrl: String,
    uploadedAt: { type: Date, default: Date.now },
    }],
    customerApproval: {
      approved: Boolean,
      approvedAt: Date,
      comments: String,
    },
    handoverNotes: { type: String, trim: true },
  },
  documents: [{
    title: { type: String, required: true, trim: true },
    fileUrl: { type: String, required: true },
    documentType: { type: String, enum: ['permit', 'wiring_diagram', 'specification', 'contract', 'other'] },
    uploadedAt: { type: Date, default: Date.now },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  }],
  safetyChecks: [{
    item: { type: String, required: true, trim: true },
    checked: { type: Boolean, default: false },
    checkedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    checkedAt: Date,
    notes: { type: String, trim: true },
  }],
  notes: {
    type: String,
    trim: true,
    maxlength: [2000, 'Notes cannot exceed 2000 characters'],
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: Date,
}, {
  timestamps: true,
});

electricalProjectSchema.index({ customer: 1 });
electricalProjectSchema.index({ status: 1 });
electricalProjectSchema.index({ serviceType: 1 });
electricalProjectSchema.index({ priority: 1 });
electricalProjectSchema.index({ createdAt: -1 });

electricalProjectSchema.pre('save', async function (next) {
  if (this.isNew && !this.projectNumber) {
    const count = await this.constructor.countDocuments();
    this.projectNumber = `ELP${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

module.exports = mongoose.model('ElectricalProject', electricalProjectSchema);