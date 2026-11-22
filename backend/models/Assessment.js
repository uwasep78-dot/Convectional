const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
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
  title: {
    type: String,
    required: [true, 'Assessment title is required'],
    trim: true,
  },
  type: {
    type: String,
    enum: ['quiz', 'assignment', 'exam', 'practical', 'project'],
    default: 'quiz',
  },
  totalMarks: {
    type: Number,
    required: true,
    min: [0, 'Total marks cannot be negative'],
  },
  score: {
    type: Number,
    required: true,
    min: [0, 'Score cannot be negative'],
  },
  percentage: {
    type: Number,
    min: [0, 'Percentage cannot be negative'],
    max: [100, 'Percentage cannot exceed 100'],
  },
  grade: {
    type: String,
    enum: ['A', 'B', 'C', 'D', 'F'],
  },
  assessedAt: {
    type: Date,
    default: Date.now,
  },
  assessedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  feedback: {
    type: String,
    trim: true,
  },
  attachments: [{
    title: String,
    fileUrl: String,
    uploadedAt: { type: Date, default: Date.now },
  }],
}, {
  timestamps: true,
});

assessmentSchema.index({ enrollment: 1 });
assessmentSchema.index({ student: 1 });
assessmentSchema.index({ course: 1 });

assessmentSchema.pre('save', function (next) {
  if (this.totalMarks > 0) {
    this.percentage = Math.round((this.score / this.totalMarks) * 100);
  }
  if (this.percentage >= 80) this.grade = 'A';
  else if (this.percentage >= 70) this.grade = 'B';
  else if (this.percentage >= 60) this.grade = 'C';
  else if (this.percentage >= 50) this.grade = 'D';
  else this.grade = 'F';
  next();
});

module.exports = mongoose.model('Assessment', assessmentSchema);