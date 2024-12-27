import React, { useState } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Card,
  Spinner,
} from "react-bootstrap";
import { useCreateCategoryMutation } from "../../slices/categorySlice";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";

const CategoryAddScreen = () => {
  const [categoryName, setCategoryName] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const validateFields = () => {
    if (!categoryName.trim()) {
      setError("Category name is required.");
      return false;
    }
    setError(null);
    return true;
  };

  const [createCategory, { isLoading: categoryLoading, error: categoryError }] =
    useCreateCategoryMutation();

  if (categoryLoading) {
    return <FaSpinner />;
  }
  if (categoryError) {
    return <div>{error}</div>;
  }

  const submitHandler = async (e) => {
    e.preventDefault();
  
    if (!validateFields()) return;
  
    setIsLoading(true);
    try {
      const response = await createCategory({
        category_name: categoryName,
      });
      console.log("Category added successfully!"); // Debug log
      toast.success("Category added"); // This should trigger the toast
      setIsLoading(false);
      setCategoryName("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Error adding category. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div style={{ paddingLeft: "250px" }}>
      <Container className="my-5">
        <h2 className="mb-4 text-center text-dark">Add New Category</h2>

        {error && (
          <div className="alert alert-danger text-center mb-4">{error}</div>
        )}

        <Card className="shadow-sm border-0">
          <Card.Body>
            <Form onSubmit={submitHandler}>
              {/* Category Name Input */}
              <Form.Group as={Row} className="mb-4">
                <Form.Label column sm={3} className="text-dark">
                  Category Name
                </Form.Label>
                <Col sm={9}>
                  <Form.Control
                    type="text"
                    placeholder="Enter category name"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    required
                    className="shadow-sm"
                    aria-label="Category Name"
                  />
                </Col>
              </Form.Group>

              {/* Submit Button */}
              <div className="d-flex justify-content-end">
                <Button
                  variant="primary"
                  type="submit"
                  className="px-4 py-2 shadow-sm border-0"
                  style={{ fontSize: "1rem", fontWeight: "600" }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Adding...
                    </>
                  ) : (
                    "Add Category"
                  )}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default CategoryAddScreen;
