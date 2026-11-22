const mongoose = require('mongoose');

const articleViewSchema = new mongoose.Schema({
  article: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article',
    required: [true, 'Article is required'],
  },
  ip: {
    type: String,
    trim: true,
  },
  userAgent: {
    type: String,
    trim: true,
  },
  referrer: {
    type: String,
    trim: true,
  },
  eventType: {
    type: String,
    enum: ['view', 'hover'],
    default: 'view',
  },
  sessionId: {
    type: String,
    trim: true,
  },
  viewedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

articleViewSchema.index({ article: 1 });
articleViewSchema.index({ eventType: 1 });
articleViewSchema.index({ viewedAt: -1 });
articleViewSchema.index({ article: 1, ip: 1, eventType: 1, viewedAt: -1 });

module.exports = mongoose.model('ArticleView', articleViewSchema);