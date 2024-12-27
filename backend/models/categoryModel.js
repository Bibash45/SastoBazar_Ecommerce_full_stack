import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    category_name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const Category = mongoose.model("Category", categorySchema);

export default Category;
