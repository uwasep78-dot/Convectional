const PurchaseOrder = require('../models/PurchaseOrder');
const Product = require('../models/Product');
const InventoryMovement = require('../models/InventoryMovement');
const { successResponse, errorResponse, paginate, buildPaginationMeta } = require('../utils/response');

const getAllPurchaseOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.supplier) filter.supplier = req.query.supplier;
    if (req.query.paymentStatus) filter.paymentStatus = req.query.paymentStatus;
    if (req.query.search) {
      filter.$or = [
        { poNumber: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const total = await PurchaseOrder.countDocuments({ ...filter, isDeleted: { $ne: true } });
    const orders = await PurchaseOrder.find({ ...filter, isDeleted: { $ne: true } })
      .populate('supplier', 'name code')
      .populate('receivedBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return successResponse(res, orders, 'Purchase orders retrieved successfully', 200, buildPaginationMeta(total, page, limit));
  } catch (error) {
    next(error);
  }
};

const getPurchaseOrder = async (req, res, next) => {
  try {
    const order = await PurchaseOrder.findById(req.params.id)
      .populate('supplier', 'name code contactPerson email phone')
      .populate('receivedBy', 'name')
      .populate('items.product', 'name sku');
    if (!order || order.isDeleted) {
      return errorResponse(res, 'Purchase order not found', 404);
    }
    return successResponse(res, order);
  } catch (error) {
    next(error);
  }
};

const createPurchaseOrder = async (req, res, next) => {
  try {
    const order = new PurchaseOrder(req.body);
    await order.save();
    await order.populate('supplier', 'name code');
    return successResponse(res, order, 'Purchase order created successfully', 201);
  } catch (error) {
    next(error);
  }
};

const updatePurchaseOrder = async (req, res, next) => {
  try {
    const order = await PurchaseOrder.findById(req.params.id);
    if (!order || order.isDeleted) {
      return errorResponse(res, 'Purchase order not found', 404);
    }
    Object.assign(order, req.body);
    await order.save();
    await order.populate('supplier', 'name code');
    return successResponse(res, order, 'Purchase order updated successfully');
  } catch (error) {
    next(error);
  }
};

const deletePurchaseOrder = async (req, res, next) => {
  try {
    const order = await PurchaseOrder.findById(req.params.id);
    if (!order) {
      return errorResponse(res, 'Purchase order not found', 404);
    }
    order.isDeleted = true;
    order.deletedAt = new Date();
    await order.save();
    return successResponse(res, null, 'Purchase order deleted successfully');
  } catch (error) {
    next(error);
  }
};

const receiveOrder = async (req, res, next) => {
  try {
    const { receivedDate, notes, itemsReceived } = req.body;
    const order = await PurchaseOrder.findById(req.params.id);
    if (!order || order.isDeleted) {
      return errorResponse(res, 'Purchase order not found', 404);
    }

    order.actualDeliveryDate = receivedDate ? new Date(receivedDate) : new Date();
    order.receivedBy = req.user._id;
    order.receivedDate = new Date();
    order.notes = notes || order.notes;
    order.status = 'received';

    for (const item of order.items) {
      const receivedQty = itemsReceived?.find(r => r.product.toString() === item.product.toString())?.quantity || item.quantity;
      const product = await Product.findById(item.product);
      if (product) {
        const previousStock = product.currentStock;
        product.currentStock = previousStock + receivedQty;
        await product.save();

        await InventoryMovement.create({
          product: product._id,
          type: 'purchase',
          quantity: receivedQty,
          previousStock,
          newStock: product.currentStock,
          unitCost: item.unitPrice,
          reference: order.poNumber,
          referenceType: 'purchase_order',
          referenceId: order._id,
          reason: `Purchase order ${order.poNumber} received`,
          supplier: order.supplier,
          performedBy: req.user._id,
          notes,
        });
      }
    }

    await order.save();
    await order.populate('supplier', 'name code');
    return successResponse(res, order, 'Order received successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPurchaseOrders,
  getPurchaseOrder,
  createPurchaseOrder,
  updatePurchaseOrder,
  deletePurchaseOrder,
  receiveOrder,
};