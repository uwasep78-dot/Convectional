const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  enrollment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Enrollment',
    required: true,
    unique: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Training',
    required: true,
  },
  certificateNumber: {
    type: String,
    unique: true,
    sparse: true,
  },
  studentName: {
    type: String,
    required: true,
  },
  courseName: {
    type: String,
    required: true,
  },
  issueDate: {
    type: Date,
    default: Date.now,
  },
  validUntil: Date,
  grade: String,
  score: Number,
  totalMarks: Number,
  certificateUrl: String,
  templateUsed: String,
  issuedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  isRevoked: {
    type: Boolean,
    default: false,
  },
  revokedAt: Date,
  revokedReason: String,
}, {
  timestamps: true,
});

certificateSchema.index({ student: 1 });
certificateSchema.index({ course: 1 });

certificateSchema.pre('save', async function (next) {
  if (this.isNew && !this.certificateNumber) {
    const count = await this.constructor.countDocuments();
    this.certificateNumber = `CCR-CRT-${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Certificate', certificateSchema);