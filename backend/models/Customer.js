const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  customerType: {
    type: String,
    enum: ['individual', 'company', 'institution', 'organization'],
    required: [true, 'Customer type is required'],
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [200, 'Name cannot exceed 200 characters'],
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
  },
  phone: {
    type: String,
    required: [true, 'Phone is required'],
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
    postalCode: { type: String, trim: true },
  },
  companyDetails: {
    registrationNumber: { type: String, trim: true },
    industry: { type: String, trim: true },
    taxId: { type: String, trim: true },
    website: { type: String, trim: true },
    contactPerson: { type: String, trim: true },
    contactDesignation: { type: String, trim: true },
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    sparse: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'blacklisted'],
    default: 'active',
  },
  source: {
    type: String,
    enum: ['website', 'referral', 'direct', 'advertisement', 'other'],
    default: 'website',
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters'],
  },
  tags: [String],
}, {
  timestamps: true,
});

customerSchema.index({ name: 'text' });
customerSchema.index({ email: 1 });
customerSchema.index({ phone: 1 });
customerSchema.index({ customerType: 1 });
customerSchema.index({ status: 1 });

module.exports = mongoose.model('Customer', customerSchema);