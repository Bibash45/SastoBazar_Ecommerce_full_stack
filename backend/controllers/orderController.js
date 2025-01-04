import asyncHandler from "../middleware/asyncHandler.js";
import Order from "../models/orderModel.js";
import { sendOrderDeliveredEmail } from "../utils/emailService.js";
import User from "../models/userModel.js";
import Product from "../models/productModel.js";
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
  console.log(req.body);

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
// @route   PUT /api/orders/:id/delivered
// @access  Private/Admin
// @desc    Update order to delivered
// @route   PUT /api/orders/:id/delivered
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    // Mark order as delivered
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    // Loop through the order items and update stock
    for (const item of order.orderItems) {
      const productId = item.product; // Use item.product for product reference

      const product = await Product.findById(productId); // Get the product by ID

      if (product) {
        // Reduce stock by the quantity ordered, only if enough stock is available
        if (product.countInStock >= item.qty) {
          product.countInStock -= item.qty;
        }

        // Ensure stock doesn't go negative
        if (product.countInStock < 0) {
          product.countInStock = 0;
        }

        // Save the updated product stock
        await product.save();
      } else {
        console.log(`Product with id ${productId} not found`);
      }
    }

    // Save the updated order status
    const updatedOrder = await order.save();

    // Optionally, send a confirmation email (if required)
    // await sendOrderDeliveredEmail(order.user.email, order);

    res.status(200).json(updatedOrder);
  } else {
    res.status(400);
    throw new Error("Order not found");
  }
});


// @desc    Update all orders
// @route   GET/api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  console.log(req.query);

  const pageSize = Number(process.env.PAGINATION_LIMIT) || 10; // Default pagination size
  const page = Number(req.query.pageNumber) || 1; // Default page is 1

  // Initialize filters
  let keyword = {};

  // If both customerName and email are provided, combine them using $and and $or
  if (req.query.keyword) {
    keyword["orderItems.name"] = { $regex: req.query.keyword, $options: "i" }; // Case-insensitive search
  }

  // Filter by user email or name (either email or name) but exclude a specific userId
  if (req.query.email || req.query.customerName) {
    let userFilter = {
      $and: [
        {
          $or: [],
        },
        {},
      ],
    };

    if (req.query.email) {
      userFilter.$and[0].$or.push({
        email: { $regex: req.query.email, $options: "i" }, 
      });
    }

    if (req.query.customerName) {
      userFilter.$and[0].$or.push({
        name: { $regex: req.query.customerName, $options: "i" }, 
      });
    }

    // Optional: Exclude a specific userId (add the condition to exclude)
    if (req.query.userId) {
      userFilter.$and[1]._id = { $ne: req.query.userId }; // Exclude userId
    }

    const user = await User.find(userFilter);
    if (user && user.length > 0) {
      // Populate `user` in orders filter
      keyword["user"] = { $in: user.map((u) => u._id) }; // Use userIds from found users
    } else {
      return res
        .status(404)
        .json({ message: "No users found with that email or name" });
    }
  }

  // Other filters (paymentMethod, totalPrice, qty, etc.) remain the same
  if (req.query.paymentMethod) {
    keyword["paymentMethod"] = {
      $regex: req.query.paymentMethod,
      $options: "i",
    };
  }

  if (req.query.minPrice || req.query.maxPrice) {
    const minPrice = req.query.minPrice ? Number(req.query.minPrice) : 0;
    const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : Infinity;

    keyword.totalPrice = { $gte: minPrice, $lte: maxPrice };
  }

  if (req.query.minQty || req.query.maxQty) {
    const minQty = req.query.minQty ? Number(req.query.minQty) : 0;
    const maxQty = req.query.maxQty ? Number(req.query.maxQty) : Infinity;

    keyword["orderItems.qty"] = { $gte: minQty, $lte: maxQty };
  }

  if (req.query.productId) {
    keyword["orderItems.product"] = req.query.productId;
  }

  if (req.query.isPaid) {
    keyword.isPaid = req.query.isPaid === "true";
  }

  if (req.query.isDelivered) {
    keyword.isDelivered = req.query.isDelivered === "true";
  }

  if (req.query.startDate || req.query.endDate) {
    const startDate = req.query.startDate
      ? new Date(req.query.startDate)
      : null;
    const endDate = req.query.endDate ? new Date(req.query.endDate) : null;

    keyword.createdAt = {};
    if (startDate) keyword.createdAt.$gte = startDate;
    if (endDate) keyword.createdAt.$lte = endDate;
  }

  try {
    // Count documents matching the filters
    const count = await Order.countDocuments({ ...keyword });

    // Fetch filtered orders with pagination
    const orders = await Order.find({ ...keyword })
      .limit(pageSize)
      .skip((page - 1) * pageSize)
      .sort({ createdAt: -1 })
      .populate("user", "name email")
      .select("-__v")
      .sort({ createdAt: -1 });
    if (!orders || orders.length === 0) {
      res.status(404).json({ message: "No orders found" });
    } else {
      res.status(200).json({
        orders,
        page,
        pages: Math.ceil(count / pageSize),
        totalOrders: count,
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error fetching orders: ${error.message}` });
  }
});

const getTotalOrder = asyncHandler(async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments(); // Get total orders count
    res.status(200).json({ totalOrders }); // Send response
  } catch (error) {
    res.status(500).json({ message: error.message }); // Handle errors
  }
});

export {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
  getTotalOrder,
};
