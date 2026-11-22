const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Recipient is required'],
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [1000, 'Message cannot exceed 1000 characters'],
  },
  type: {
    type: String,
    enum: ['info', 'success', 'warning', 'error', 'training', 'maintenance', 'invoice', 'project', 'inventory', 'system'],
    default: 'info',
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal',
  },
  category: {
    type: String,
    enum: ['training', 'maintenance', 'electrical', 'inventory', 'invoice', 'payment', 'customer', 'project', 'system', 'article'],
    required: true,
  },
  relatedType: {
    type: String,
    enum: ['training', 'enrollment', 'maintenance', 'electrical_project', 'invoice', 'payment', 'product', 'customer', 'quotation', 'article', 'user'],
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  actionUrl: {
    type: String,
    trim: true,
  },
  actionLabel: {
    type: String,
    trim: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  readAt: Date,
  readBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: Date,
  expiresAt: Date,
}, {
  timestamps: true,
});

notificationSchema.index({ recipient: 1 });
notificationSchema.index({ isRead: 1 });
notificationSchema.index({ category: 1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ priority: 1 });
notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ recipient: 1, isRead: 1 });

module.exports = mongoose.model('Notification', notificationSchema);