import asyncHandler from "../middleware/asyncHandler.js";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
// @desc GET all revenue
// @route GET/api/revenue
// @access Private/Admin
const getRevenue = asyncHandler(async (req, res) => {
  try {
    const revenue = await Order.aggregate([
      {
        $match: { isPaid: true }, // Filter only paid orders
      },
      {
        $group: {
          _id: null, // Group all documents together
          totalRevenue: { $sum: "$totalPrice" }, // Sum the totalPrice field for paid orders
        },
      },
    ]);

    res.status(200).json({ totalRevenue: revenue[0]?.totalRevenue || 0 }); // Return revenue or 0 if empty
  } catch (error) {
    console.error("Error calculating total revenue:", error);
    res.status(500).json({ message: "Failed to calculate revenue" });
  }
});

// @desc get montly revenue of current year
// @route GET/api/revenue/monthly
// @access Private/Admin
const getMonthlyRevenue = asyncHandler(async (req, res) => {
  try {
    const monthlyRevenue = await Order.aggregate([
      {
        $match: { isPaid: true }, // Filter only paid orders
      },
      {
        $group: {
          _id: { $month: "$createdAt" }, // Group by month
          totalRevenue: { $sum: "$totalPrice" }, // Sum totalPrice for each month
        },
      },
      {
        $sort: { _id: 1 }, // Sort by month (Jan = 1, Feb = 2, ...)
      },
    ]);

    // Initialize the labels for all 12 months
    const labels = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Initialize the data array for all 12 months with default value 0
    const data = Array(12).fill(0);

    // Map the revenue to the corresponding month index
    monthlyRevenue.forEach((entry) => {
      data[entry._id - 1] = entry.totalRevenue;
    });

    // Send the response with all 12 months
    res.status(200).json({
      labels: labels, // Return all months (Jan-Dec)
      datasets: [
        {
          label: "Revenue",
          data: data, // All 12 months' revenue data
          borderColor: "#4caf50",
          backgroundColor: "rgba(76, 175, 80, 0.2)",
        },
      ],
    });
  } catch (error) {
    console.error("Error calculating monthly revenue:", error);
    res.status(500).json({ message: "Failed to calculate monthly revenue" });
  }
});

// @desc get montly revenue of current year
// @route GET/api/topsellingproducts
// @access Private/Admin
const topSellingProducts = asyncHandler(async (req, res) => {
  try {
    // Aggregation pipeline to fetch top-selling products
    const topSellingProducts = await Order.aggregate([
      {
        $match: { isPaid: true }, // Filter only paid orders
      },
      {
        $unwind: "$orderItems", // Unwind the orderItems array
      },
      {
        $group: {
          _id: "$orderItems.product", // Group by product ID
          totalSold: { $sum: "$orderItems.qty" }, // Sum of quantities sold for each product
        },
      },
      {
        $sort: { totalSold: -1 }, // Sort by totalSold in descending order
      },
      {
        $limit: 10, // Limit to top 10 products
      },
      {
        $lookup: {
          from: "products", // Join with the "products" collection to get product details
          localField: "_id", // Match the product ID
          foreignField: "_id",
          as: "productDetails", // Add product details to the result
        },
      },
      {
        $unwind: "$productDetails", // Unwind the productDetails array
      },
      {
        $project: {
          productId: "$_id", // Rename _id to productId
          name: "$productDetails.name", // Include product name
          price: "$productDetails.price", // Include product price
          image: "$productDetails.image", // Include product image
          totalSold: 1, // Include the total quantity sold
        },
      },
    ]);

    // Return the top-selling products as the response
    res.status(200).json({ topSellingProducts });
  } catch (error) {
    console.error("Error fetching top-selling products:", error);
    res.status(500).json({ message: "Failed to fetch top-selling products" });
  }
});

export { getRevenue, getMonthlyRevenue,topSellingProducts };
