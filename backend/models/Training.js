const mongoose = require('mongoose');

const trainingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Course name is required'],
    trim: true,
    maxlength: [200, 'Course name cannot exceed 200 characters'],
  },
  code: {
    type: String,
    unique: true,
    trim: true,
    uppercase: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters'],
  },
  objectives: [{
    type: String,
    trim: true,
  }],
  entryRequirements: [{
    type: String,
    trim: true,
  }],
  duration: {
    value: {
      type: Number,
      required: true,
      min: [1, 'Duration must be at least 1'],
    },
    unit: {
      type: String,
      enum: ['days', 'weeks', 'months', 'hours'],
      default: 'weeks',
    },
  },
  fee: {
    type: Number,
    required: [true, 'Fee is required'],
    min: [0, 'Fee cannot be negative'],
  },
  maxStudents: {
    type: Number,
    default: 30,
    min: [1, 'Max students must be at least 1'],
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required'],
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required'],
  },
  venue: {
    type: String,
    trim: true,
  },
  instructors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  materials: [{
    title: { type: String, required: true, trim: true },
    fileUrl: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  }],
  status: {
    type: String,
    enum: ['draft', 'upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'draft',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  certificateTemplate: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

trainingSchema.index({ status: 1 });
trainingSchema.index({ startDate: 1 });
trainingSchema.index({ category: 1 });

trainingSchema.virtual('enrollmentCount', {
  ref: 'Enrollment',
  localField: '_id',
  foreignField: 'course',
  count: true,
});

trainingSchema.methods.generateCode = async function () {
  const prefix = 'TRN';
  const count = await this.constructor.countDocuments();
  this.code = `${prefix}${String(count + 1).padStart(4, '0')}`;
};

module.exports = mongoose.model('Training', trainingSchema);