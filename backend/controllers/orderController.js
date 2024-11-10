import asyncHandler from "../middleware/asyncHandler.js";
import Order from "../models/orderModel.js";
import { sendOrderDeliveredEmail } from "../utils/emailService.js";

// @desc    Create new order
// @route   POST/api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    totalPrice,
    shippingPrice,
  } = req.body;
  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
  } else {
    const order = new Order({
      orderItems: orderItems.map((x) => ({
        ...x,
        product: x._id,
        _id: undefined,
      })),
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      totalPrice,
      shippingPrice,
    });
    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
});

// @desc    Get logged in user orders
// @route   GET/api/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({
    user: req.user._id,
  });

  if (!orders || orders.length === 0) {
    res.status(404); // Use 404 to indicate resource not found
    throw new Error("No orders found");
  } else {
    res.status(200).json(orders);
  }
});

// @desc    Get order by ID
// @route   GET/api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (!order) {
    res.status(400);
    throw new Error("Order not found");
  } else {
    res.status(200).json(order);
  }
});

// @desc    Update order to paid
// @route   PUT/api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(400);
    throw new Error("Order not found");
  } else {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address,
    };
    const updateOrder = await order.save();
    res.status(200).json(updateOrder);
  }
});

// @desc    Update order to delivered
// @route   PUT/api/orders/:id/delivered
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  const orderData = req.body;
  const { email } = orderData.user;
  console.log(email);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const updateOrder = await order.save();

    await sendOrderDeliveredEmail(email, orderData);
    res.status(200).json(updateOrder);
  } else {
    res.status(400);
    throw new Error("Order not found");
  }
});

// @desc    Update all orders
// @route   GET/api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate("user", "id name");
  res.status(200).json(orders);
});

export {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
};
