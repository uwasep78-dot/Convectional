const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required'],
    unique: true,
  },
  studentId: {
    type: String,
    unique: true,
    sparse: true,
  },
  dateOfBirth: Date,
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
  },
  educationLevel: {
    type: String,
    trim: true,
  },
  occupation: {
    type: String,
    trim: true,
  },
  emergencyContact: {
    name: { type: String, trim: true },
    phone: { type: String, trim: true },
    relationship: { type: String, trim: true },
  },
  address: {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    district: { type: String, trim: true },
    province: { type: String, trim: true },
    country: { type: String, trim: true, default: 'Rwanda' },
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters'],
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'graduated', 'suspended'],
    default: 'active',
  },
}, {
  timestamps: true,
});

studentSchema.index({ status: 1 });

studentSchema.pre('save', async function (next) {
  if (this.isNew && !this.studentId) {
    const count = await this.constructor.countDocuments();
    this.studentId = `STU${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Student', studentSchema);