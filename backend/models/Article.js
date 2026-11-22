const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  slug: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    lowercase: true,
  },
  excerpt: {
    type: String,
    trim: true,
    maxlength: [300, 'Excerpt cannot exceed 300 characters'],
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
  },
  featuredImage: {
    url: { type: String, required: true },
    alt: { type: String, trim: true },
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required'],
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
  }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author is required'],
  },
  status: {
    type: String,
    enum: ['draft', 'pending_review', 'published', 'scheduled', 'archived'],
    default: 'draft',
  },
  publishedAt: Date,
  scheduledAt: Date,
  archivedAt: Date,
  viewCount: {
    type: Number,
    default: 0,
  },
  uniqueViewCount: {
    type: Number,
    default: 0,
  },
  hoverCount: {
    type: Number,
    default: 0,
  },
  commentsEnabled: {
    type: Boolean,
    default: true,
  },
  comments: [{
    author: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    content: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now },
    isApproved: { type: Boolean, default: false },
    isEdited: { type: Boolean, default: false },
    editedAt: Date,
  }],
  metaDescription: {
    type: String,
    trim: true,
    maxlength: [160, 'Meta description cannot exceed 160 characters'],
  },
  metaKeywords: {
    type: String,
    trim: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  isPinned: {
    type: Boolean,
    default: false,
  },
  readingTime: {
    type: Number,
    default: 0,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: Date,
}, {
  timestamps: true,
});

articleSchema.index({ status: 1 });
articleSchema.index({ category: 1 });
articleSchema.index({ author: 1 });
articleSchema.index({ publishedAt: -1 });
articleSchema.index({ isFeatured: 1 });
articleSchema.index({ isPinned: 1 });
articleSchema.index({ viewCount: -1 });
articleSchema.index({ createdAt: -1 });
articleSchema.index({ title: 'text' });

articleSchema.pre('save', function (next) {
  if (this.title && this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  const wordCount = this.content ? this.content.split(/\s+/).length : 0;
  this.readingTime = Math.max(1, Math.ceil(wordCount / 200));
  next();
});

articleSchema.methods.incrementView = function (ip, userAgent) {
  this.viewCount += 1;
  return this;
};

articleSchema.methods.incrementHover = function () {
  this.hoverCount += 1;
  return this;
};

module.exports = mongoose.model('Article', articleSchema);