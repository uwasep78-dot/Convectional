const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Supplier name is required'],
    trim: true,
    unique: true,
    maxlength: [200, 'Supplier name cannot exceed 200 characters'],
  },
  code: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    uppercase: true,
  },
  contactPerson: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
  },
  phone: {
    type: String,
    trim: true,
  },
  alternatePhone: {
    type: String,
    trim: true,
  },
  address: {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    district: { type: String, trim: true },
    province: { type: String, trim: true },
    country: { type: String, trim: true, default: 'Rwanda' },
  },
  taxId: {
    type: String,
    trim: true,
  },
  paymentTerms: {
    type: String,
    trim: true,
    default: 'Net 30',
  },
  deliveryTime: {
    type: String,
    trim: true,
  },
  productCategories: [{
    type: String,
    trim: true,
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'blacklisted'],
    default: 'active',
  },
  rating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5'],
    default: 3,
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters'],
  },
}, {
  timestamps: true,
});

supplierSchema.index({ name: 'text' });
supplierSchema.index({ status: 1 });

supplierSchema.pre('save', async function (next) {
  if (this.isNew && !this.code) {
    const count = await this.constructor.countDocuments();
    this.code = `SUP${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Supplier', supplierSchema);