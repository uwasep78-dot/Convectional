const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  action: {
    type: String,
    required: [true, 'Action is required'],
    trim: true,
  },
  resource: {
    type: String,
    required: [true, 'Resource is required'],
    trim: true,
  },
  resourceId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  method: {
    type: String,
    enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  },
  endpoint: {
    type: String,
    trim: true,
  },
  ip: {
    type: String,
    trim: true,
  },
  userAgent: {
    type: String,
    trim: true,
  },
  status: {
    type: Number,
  },
  changes: {
    type: mongoose.Schema.Types.Mixed,
  },
  error: {
    type: String,
    trim: true,
  },
  duration: Number,
  metadata: {
    type: mongoose.Schema.Types.Mixed,
  },
}, {
  timestamps: true,
});

auditLogSchema.index({ user: 1 });
auditLogSchema.index({ resource: 1 });
auditLogSchema.index({ action: 1 });
auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ resourceId: 1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);