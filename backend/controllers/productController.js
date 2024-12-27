import asyncHandler from "../middleware/asyncHandler.js";
import mongoose from "mongoose";
import Product from "../models/productModel.js";

// @desc    Fetch all products
// @route   GET/api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = Number(process.env.PAGINATION_LIMIT_ADMIN) || 10; // Fallback to 10 if not set
  const page = Number(req.query.pageNumber || 1);

  // Handle keyword search (only if provided)
  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: "i" } }
    : {};

  // Handle category filter and convert category to ObjectId only if valid
  let category = {};
  if (
    req.query.category &&
    mongoose.Types.ObjectId.isValid(req.query.category)
  ) {
    category = { category: new mongoose.Types.ObjectId(req.query.category) };
  }

  // Handle price range filter (only if both are provided and valid)
  let price = {};
  if (
    req.query.minPrice &&
    !isNaN(req.query.minPrice) &&
    req.query.maxPrice &&
    !isNaN(req.query.maxPrice)
  ) {
    price = {
      price: {
        $gte: Number(req.query.minPrice),
        $lte: Number(req.query.maxPrice),
      },
    };
  }

  // Handle minimum rating filter
  let ratingFilter = {};
  if (req.query.minRating && !isNaN(req.query.minRating)) {
    ratingFilter = { rating: { $gte: Number(req.query.minRating) } };
  }

  // Handle reviews filter (optional, e.g., minReviews)
  let reviewFilter = {};
  if (req.query.minReviews && !isNaN(req.query.minReviews)) {
    reviewFilter = { numReviews: { $gte: Number(req.query.minReviews) } };
  }

  // Combine all filters, ensuring they are only included if valid
  const filters = {
    ...keyword,
    ...category,
    ...price,
    ...ratingFilter,
    ...reviewFilter,
  };

  // If no filters are provided, return default products (all products)
  const count = await Product.countDocuments(filters);

  // Get products based on filters and pagination
  const products = await Product.find(filters)
    .limit(pageSize)
    .skip((page - 1) * pageSize)
    .populate("category");

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});



// @desc    Fetch a product
// @route   GET/api/products/:id
// @access  Public
const getProductsById = asyncHandler(async (req, res) => {
  const product = await Product.findById({
    _id: req.params.id,
  });
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Resource not found");
  }
});

// @desc    Create a products
// @route   POST/api/products
// @access  Private/Admin
const postProduct = asyncHandler(async (req, res) => {
  const { name, price, description, images, brand, category, countInStock } =
    req.body;

  // Validate required fields
  if (!name || !price || !category || !countInStock) {
    res.status(400);
    throw new Error("All required fields must be provided");
  }

  // Optional: Validate category as ObjectId
  if (!mongoose.Types.ObjectId.isValid(category)) {
    res.status(400);
    throw new Error("Invalid category ID");
  }

  // Validate images array
  if (!images || !Array.isArray(images) || images.length === 0) {
    res.status(400);
    throw new Error("At least one image must be provided");
  }

  // Create a new product instance
  const product = new Product({
    name,
    price,
    user: req.user._id,
    images, // Save array of image paths
    brand,
    category,
    countInStock,
    numReviews: 0,
    description,
  });

  // Save to database and send response
  try {
    const createProduct = await product.save();
    res.status(201).json(createProduct);
  } catch (error) {
    res.status(500);
    throw new Error("Product creation failed");
  }
});

// @desc    UPDATE all products
// @route   PUT/api/products
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.image = image || product.image;
    product.brand = brand || product.brand;
    product.category = category || product.category;
    product.countInStock = countInStock || product.countInStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct).populate("category");
  } else {
    res.status(404);
    throw new Error("Resource not found");
  }
});

// @desc    Delete all products
// @route   DELETE/api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  console.log(req.params.id);

  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({
      _id: product._id,
    });
    res.status(200).json({
      message: "Product deleted",
    });
  } else {
    res.status(404);
    throw new Error("Resource not found");
  }
});

// @desc    Create a new review
// @route   POST/api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Product already reviewed");
    }

    const review = {
      name: req.user.name,
      rating: rating,
      comment,
      user: req.user._id,
    };
    product.reviews.push(review);

    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, review) => acc + review.rating, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({
      message: "Review added",
    });
  } else {
    res.status(404);
    throw new Error("Resource not found");
  }
});

// @desc    Get a product
// @route   GET/api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);

  res.status(200).json(products);
});

const similarProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Find the product by ID and populate the category field
  const product = await Product.findById(id).populate("category");

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  // Build filter criteria based on category and brand
  const filter = {
    $or: [
      { category: product.category._id }, // Same category
      { brand: product.brand }, // Same brand
    ],
  };

  //optional
  if (req.query.minPrice && req.query.maxPrice) {
    filter.price = { $gte: req.query.minPrice, $lte: req.query.maxPrice };
  }

  const similarProducts = await Product.find(filter)
    .where("_id")
    .ne(id)
    .limit(5)
    .select("name price category brand images");

  if (similarProducts.length === 0) {
    return res.status(404).json({ message: "No similar products found" });
  }

  // Return similar products
  res.json(similarProducts);
});

const getTotalProducts = asyncHandler(async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments(); // Get total orders count
    res.status(200).json({ totalProducts }); // Send response
  } catch (error) {
    res.status(500).json({ message: error.message }); // Handle errors
  }
});

const getProductsAccordingToStock = asyncHandler(async (req, res) => {
  const stock = parseInt(req.query.stock);
  const filter = stock
    ? { countInStock: { $lte: stock } }
    : { countInStock: 0 };
  const products = await Product.find(filter).populate("category");
  if (products) {
    res.status(200).json(products);
  } else {
    res.status(404);
    throw new Error("Resource not found");
  }
});

export {
  getProducts,
  getProductsById,
  postProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
  similarProduct,
  getTotalProducts,
  getProductsAccordingToStock,
};
