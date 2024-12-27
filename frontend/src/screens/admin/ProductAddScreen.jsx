import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import FormContainer from "../../components/FormContainer";
import { toast, ToastContainer } from "react-toastify";
import {
  useUploadProductImageMutation,
  useCreateProductMutation,
} from "../../slices/productsApiSlice";
import { useGetAllCategoryQuery } from "../../slices/categorySlice";

const ProductAddScreen = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [images, setImages] = useState([]); // Array to hold multiple image URLs
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [countInStock, setCountInStock] = useState(0);

  const { data: categories, isLoading } = useGetAllCategoryQuery();

  const [uploadProductImage, { isLoading: loadingUpload }] =
    useUploadProductImageMutation();
  const [createProduct, { isLoading: loadingCreate }] =
    useCreateProductMutation();

  const navigate = useNavigate();

  // Handler for creating a product
  const createProductHandler = async (e) => {
    e.preventDefault();
    const newProduct = {
      name,
      price,
      images, 
      brand,
      category,
      description,
      countInStock,
    };

    try {
      await createProduct(newProduct).unwrap();
      toast.success("Product created successfully");
      resetForm(); // Reset form after successful creation
      navigate("/admin/productlist");
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  // Image upload handler for multiple images
  const uploadFileHandler = async (e) => {
    const files = e.target.files;
    const formData = new FormData();

    Array.from(files).forEach((file) => {
      formData.append("images", file);
    });

    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImages(res.images); // Save array of image URLs returned by backend
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  // Reset form fields
  const resetForm = () => {
    setName("");
    setPrice(0);
    setImages([]);
    setBrand("");
    setCategory("");
    setDescription("");
    setCountInStock(0);
  };

  return (
    <div style={{ width: "100%" }}>
      <ToastContainer />

      <Link to="/admin/productlist" className="btn btn-light my-3">
        Go Back
      </Link>
      <FormContainer>
        <h1>Add Product</h1>

        {loadingCreate ? (
          <Loader />
        ) : (
          <Form onSubmit={createProductHandler}>
            <Form.Group controlId="name" className="my-2">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="price" className="my-2">
              <Form.Label>Price</Form.Label>
              <Form.Control
                min="0"
                type="number"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              ></Form.Control>
            </Form.Group>

            {/* IMAGE INPUT */}
            <Form.Group controlId="image" className="my-2">
              <Form.Label>Images</Form.Label>
              <Form.Control
                type="file"
                multiple
                label="Choose files"
                onChange={uploadFileHandler}
              ></Form.Control>
              {loadingUpload && <Loader />}
            </Form.Group>

            <Form.Group controlId="brand" className="my-2">
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="countInStock" className="my-2">
              <Form.Label>Count In Stock</Form.Label>
              <Form.Control
                min="0"
                type="number"
                placeholder="Enter Count In Stock"
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="category" className="my-2">
              <Form.Label>Category</Form.Label>
              <Form.Control
                as="select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={isLoading || !categories}
              >
                <option value="">
                  {isLoading ? "Loading categories..." : "Select a category"}
                </option>
                {categories?.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.category_name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="description" className="my-2">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Button type="submit" variant="primary" className="my-2">
              Create Product
            </Button>
          </Form>
        )}
      </FormContainer>
    </div>
  );
};

export default ProductAddScreen;
