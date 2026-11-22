const mongoose = require('mongoose');

const inventoryMovementSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product is required'],
  },
  type: {
    type: String,
    enum: ['purchase', 'sale', 'transfer', 'return', 'damage', 'adjustment', 'issued_to_project', 'issued_to_maintenance'],
    required: [true, 'Movement type is required'],
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
  },
  previousStock: {
    type: Number,
    required: true,
  },
  newStock: {
    type: Number,
    required: true,
  },
  unitCost: {
    type: Number,
    default: 0,
  },
  totalCost: {
    type: Number,
    default: 0,
  },
  reference: {
    type: String,
    trim: true,
  },
  referenceType: {
    type: String,
    enum: ['purchase_order', 'sales_order', 'maintenance_job', 'electrical_project', 'transfer', 'adjustment', 'return'],
  },
  referenceId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  reason: {
    type: String,
    required: [true, 'Reason is required'],
    trim: true,
    maxlength: [500, 'Reason cannot exceed 500 characters'],
  },
  location: {
    type: String,
    trim: true,
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
  },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  photos: [{
    url: String,
    uploadedAt: { type: Date, default: Date.now },
  }],
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters'],
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: Date,
}, {
  timestamps: true,
});

inventoryMovementSchema.index({ product: 1 });
inventoryMovementSchema.index({ type: 1 });
inventoryMovementSchema.index({ referenceType: 1 });
inventoryMovementSchema.index({ referenceId: 1 });
inventoryMovementSchema.index({ performedBy: 1 });
inventoryMovementSchema.index({ createdAt: -1 });

inventoryMovementSchema.pre('save', function (next) {
  this.totalCost = Math.abs(this.quantity) * (this.unitCost || 0);
  next();
});

module.exports = mongoose.model('InventoryMovement', inventoryMovementSchema);