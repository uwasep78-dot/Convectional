const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  enrollment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Enrollment',
    required: true,
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
  date: {
    type: Date,
    required: [true, 'Date is required'],
  },
  session: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'late', 'excused'],
    default: 'present',
  },
  markedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  markedAt: {
    type: Date,
    default: Date.now,
  },
  notes: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

attendanceSchema.index({ enrollment: 1 });
attendanceSchema.index({ student: 1 });
attendanceSchema.index({ course: 1 });
attendanceSchema.index({ date: 1 });
attendanceSchema.index({ enrollment: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);