import Category from "../models/categoryModel.js";

export const testFunction = (req, res) => {
  res.send("This is from the category controller.");
};

// Insert the category
export const postCategory = async (req, res) => {
  const { category_name } = req.body;
  let category = new Category({ category_name });

  try {
    const existingCategory = await Category.findOne({ category_name });
    if (existingCategory) {
      return res.status(400).json({ error: "Category must be unique" });
    }

    category = await category.save();
    if (!category) {
      return res.status(400).json({ error: "Something went wrong" });
    }

    res.send(category);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Retrieve  categories based on pagenumber and keyword
export const categoryList = async (req, res) => {
  try {
    const pageNumber = Number(req.query.pageNumber) || 1;
    const pageSize = Number(process.env.PAGINATION_LIMIT) || 8;

    const keyword = req.query.keyword
      ? {
          category_name: { $regex: req.query.keyword, $options: "i" },
        }
      : {};

    // Count total categories matching the search criteria
    const count = await Category.countDocuments({ ...keyword });

    // Fetch categories with pagination and filtering
    const categories = await Category.find({ ...keyword })
      .limit(pageSize)
      .skip(pageSize * (pageNumber - 1));

    res.status(200).json({
      categories,
      page: pageNumber,
      pages: Math.ceil(count / pageSize), // Total number of pages
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const allCategoryList = async (req, res) => {
  try {
    const categories = await Category.find({});

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// View category details
export const categoryDetails = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(400).json({ error: "Something went wrong" });
    }
    res.send(category);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update category
export const updateCategory = async (req, res) => {
  try {
    const { category_name } = req.body;
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { category_name },
      { new: true }
    );

    if (!category) {
      return res.status(400).json({ error: "Category not found" });
    }

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete category
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ error: "Something went wrong" });
    }
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
