const Product = require('../models/Product');
const InventoryMovement = require('../models/InventoryMovement');
const { successResponse, errorResponse, paginate, buildPaginationMeta } = require('../utils/response');

const getAllProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { sku: { $regex: req.query.search, $options: 'i' } },
        { code: { $regex: req.query.search, $options: 'i' } },
      ];
    }
    if (req.query.brand) filter.brand = req.query.brand;
    if (req.query.isFeatured !== undefined) filter.isFeatured = req.query.isFeatured === 'true';
    if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === 'true';

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .populate('category', 'name type')
      .populate('supplier', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return successResponse(res, products, 'Products retrieved successfully', 200, buildPaginationMeta(total, page, limit));
  } catch (error) {
    next(error);
  }
};

const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name type')
      .populate('supplier', 'name');
    if (!product) {
      return errorResponse(res, 'Product not found', 404);
    }
    return successResponse(res, product);
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const product = new Product(req.body);
    await product.save();
    await product.populate('category', 'name type');
    return successResponse(res, product, 'Product created successfully', 201);
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return errorResponse(res, 'Product not found', 404);
    }
    Object.assign(product, req.body);
    await product.save();
    await product.populate('category', 'name type');
    return successResponse(res, product, 'Product updated successfully');
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return errorResponse(res, 'Product not found', 404);
    }
    await product.deleteOne();
    return successResponse(res, null, 'Product deleted successfully');
  } catch (error) {
    next(error);
  }
};

const updateStock = async (req, res, next) => {
  try {
    const { quantity, reason, reference, referenceType, referenceId, unitCost, location, supplier, notes } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) {
      return errorResponse(res, 'Product not found', 404);
    }

    const previousStock = product.currentStock;
    const newStock = Math.max(0, previousStock + quantity);
    product.currentStock = newStock;

    await InventoryMovement.create({
      product: product._id,
      type: quantity > 0 ? 'purchase' : quantity < 0 ? 'sale' : 'adjustment',
      quantity: Math.abs(quantity),
      previousStock,
      newStock,
      unitCost: unitCost || product.purchasePrice,
      reference,
      referenceType,
      referenceId,
      reason,
      location,
      supplier,
      performedBy: req.user._id,
      notes,
    });

    await product.save();
    await product.populate('category', 'name type');
    return successResponse(res, product, 'Stock updated successfully');
  } catch (error) {
    next(error);
  }
};

const getLowStock = async (req, res, next) => {
  try {
    const products = await Product.aggregate([
      { $match: { $expr: { $lte: '$currentStock', '$minimumStock' }, isActive: true } },
    ]);
    const populated = await Product.populate(products, { path: 'category', select: 'name' });
    return successResponse(res, populated, 'Low stock products retrieved successfully');
  } catch (error) {
    next(error);
  }
};

const getInventoryMovements = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.product) filter.product = req.query.product;
    if (req.query.type) filter.type = req.query.type;
    if (req.query.referenceType) filter.referenceType = req.query.referenceType;

    const total = await InventoryMovement.countDocuments({ ...filter, isDeleted: { $ne: true } });
    const movements = await InventoryMovement.find({ ...filter, isDeleted: { $ne: true } })
      .populate('product', 'name sku')
      .populate('performedBy', 'name')
      .populate('supplier', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return successResponse(res, movements, 'Inventory movements retrieved successfully', 200, buildPaginationMeta(total, page, limit));
  } catch (error) {
    next(error);
  }
};

const getInventoryStats = async (req, res, next) => {
  try {
    const totalProducts = await Product.countDocuments({ isActive: true });
    const lowStock = await Product.countDocuments({ $expr: { $lte: '$currentStock', '$minimumStock' }, isActive: true });
    const outOfStock = await Product.countDocuments({ currentStock: 0, isActive: true });
    const totalValue = await Product.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, total: { $sum: { $multiply: ['$currentStock', '$purchasePrice'] } } } },
    ]);

    return successResponse(res, {
      totalProducts,
      lowStock,
      outOfStock,
      totalValue: totalValue[0]?.total || 0,
    }, 'Inventory stats retrieved successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
  getLowStock,
  getInventoryMovements,
  getInventoryStats,
};