const mongoose = require('mongoose');

const companySettingsSchema = new mongoose.Schema({
  singleton: {
    type: Boolean,
    default: true,
    unique: true,
  },
  company: {
    name: {
      type: String,
      default: 'Conventional Complex & Duties and Renewable System Ltd.',
      trim: true,
    },
    abbreviation: {
      type: String,
      default: 'CCR',
      trim: true,
    },
    address: {
      street: { type: String, default: 'Muhoza Sector', trim: true },
      city: { type: String, default: 'Musanze', trim: true },
      district: { type: String, default: 'Musanze District', trim: true },
      province: { type: String, default: 'Northern Province', trim: true },
      country: { type: String, default: 'Rwanda', trim: true },
    },
    phone: {
      type: String,
      default: '0783024760',
      trim: true,
    },
    email: {
      type: String,
      default: 'ccdrs4@gmail.com',
      trim: true,
    },
    managingDirector: {
      type: String,
      default: 'Mfashimana Jean Marie Vianney',
      trim: true,
    },
    managingDirectorContact: {
      type: String,
      default: '0783024760',
      trim: true,
    },
    location: {
      type: String,
      default: 'Musanze, Northern Province, Rwanda',
      trim: true,
    },
    logo: String,
    website: String,
    taxId: String,
    registrationNumber: String,
  },
  branding: {
    primaryColor: { type: String, default: '#003366' },
    secondaryColor: { type: String, default: '#FF6600' },
    accentColor: { type: String, default: '#009933' },
    backgroundColor: { type: String, default: '#FFFFFF' },
    textColor: { type: String, default: '#333333' },
  },
  contact: {
    phone: { type: String, default: '0783024760' },
    email: { type: String, default: 'ccdrs4@gmail.com' },
    address: { type: String, default: 'Muhoza Sector, Musanze District, Northern Province, Rwanda.' },
    workingHours: {
      monday: { type: String, default: '8:00 AM - 5:00 PM' },
      tuesday: { type: String, default: '8:00 AM - 5:00 PM' },
      wednesday: { type: String, default: '8:00 AM - 5:00 PM' },
      thursday: { type: String, default: '8:00 AM - 5:00 PM' },
      friday: { type: String, default: '8:00 AM - 5:00 PM' },
      saturday: { type: String, default: '9:00 AM - 1:00 PM' },
      sunday: { type: String, default: 'Closed' },
    },
  },
  socialMedia: {
    facebook: String,
    twitter: String,
    instagram: String,
    linkedin: String,
    youtube: String,
  },
  financial: {
    currency: { type: String, default: 'RWF' },
    taxRate: { type: Number, default: 0 },
    taxName: { type: String, default: 'VAT' },
    paymentTerms: { type: String, default: 'Net 30' },
    bankName: String,
    bankAccountName: String,
    bankAccountNumber: String,
  },
  notifications: {
    emailEnabled: { type: Boolean, default: false },
    smsEnabled: { type: Boolean, default: false },
    lowStockThreshold: { type: Number, default: 10 },
  },
  maintenance: {
    defaultStatuses: {
      type: [String],
      default: ['pending', 'assigned', 'in_progress', 'awaiting_parts', 'quality_check', 'completed'],
    },
  },
  training: {
    defaultCategories: {
      type: [String],
      default: [
        'Electrical installation',
        'Solar installation and maintenance',
        'Electronics',
        'Technical equipment maintenance',
        'Electrical safety',
        'Renewable energy',
        'Practical engineering skills',
      ],
    },
  },
  features: {
    enableTraining: { type: Boolean, default: true },
    enableElectrical: { type: Boolean, default: true },
    enableMaintenance: { type: Boolean, default: true },
    enableInventory: { type: Boolean, default: true },
    enableRenewable: { type: Boolean, default: true },
    enableQuotations: { type: Boolean, default: true },
    enableNews: { type: Boolean, default: true },
    enableCustomerPortal: { type: Boolean, default: true },
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

companySettingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne({ singleton: true });
  if (!settings) {
    settings = await this.create({ singleton: true });
  }
  return settings;
};

companySettingsSchema.statics.updateSettings = async function (updates, userId) {
  let settings = await this.findOne({ singleton: true });
  if (!settings) {
    settings = new this({ singleton: true });
  }
  Object.assign(settings, updates);
  settings.updatedBy = userId;
  await settings.save();
  return settings;
};

module.exports = mongoose.model('CompanySettings', companySettingsSchema);