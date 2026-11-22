const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters'],
  },
  sku: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    uppercase: true,
  },
  code: {
    type: String,
    unique: true,
    sparse: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required'],
  },
  subcategory: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters'],
  },
  shortDescription: {
    type: String,
    trim: true,
    maxlength: [300, 'Short description cannot exceed 300 characters'],
  },
  brand: {
    type: String,
    trim: true,
  },
  model: {
    type: String,
    trim: true,
  },
  unit: {
    type: String,
    enum: ['piece', 'meter', 'kilogram', 'liter', 'box', 'carton', 'roll', 'set', 'bundle', 'other'],
    default: 'piece',
  },
  purchasePrice: {
    type: Number,
    required: [true, 'Purchase price is required'],
    min: [0, 'Purchase price cannot be negative'],
  },
  sellingPrice: {
    type: Number,
    required: [true, 'Selling price is required'],
    min: [0, 'Selling price cannot be negative'],
  },
  currentStock: {
    type: Number,
    default: 0,
    min: [0, 'Stock cannot be negative'],
  },
  minimumStock: {
    type: Number,
    default: 10,
    min: [0, 'Minimum stock cannot be negative'],
  },
  maximumStock: {
    type: Number,
    default: 1000,
    min: [0, 'Maximum stock cannot be negative'],
  },
  reorderLevel: {
    type: Number,
    default: 20,
    min: [0, 'Reorder level cannot be negative'],
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
  },
  images: [{
    url: { type: String, required: true },
    alt: { type: String, trim: true },
    isPrimary: { type: Boolean, default: false },
  }],
  specifications: [{
    key: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true },
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['in_stock', 'low_stock', 'out_of_stock', 'discontinued'],
    default: 'in_stock',
  },
  warrantyPeriod: {
    type: String,
    trim: true,
  },
  location: {
    type: String,
    trim: true,
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters'],
  },
  viewCount: {
    type: Number,
    default: 0,
  },
  inquiryCount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

productSchema.index({ name: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ status: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ currentStock: 1 });
productSchema.index({ createdAt: -1 });

productSchema.pre('save', async function (next) {
  if (this.isNew && !this.sku) {
    const count = await this.constructor.countDocuments();
    this.sku = `SKU${String(count + 1).padStart(6, '0')}`;
  }
  if (this.isNew && !this.code) {
    const count = await this.constructor.countDocuments();
    this.code = `PRD${String(count + 1).padStart(5, '0')}`;
  }
  if (this.currentStock <= 0) {
    this.status = 'out_of_stock';
  } else if (this.currentStock <= this.minimumStock) {
    this.status = 'low_stock';
  } else {
    this.status = 'in_stock';
  }
  next();
});

productSchema.methods.updateStock = function (quantity, reason, reference, userId) {
  this.currentStock = Math.max(0, this.currentStock + quantity);
  return this;
};

module.exports = mongoose.model('Product', productSchema);