import React, { useState } from "react";
import { Table, Button, Container, Modal, Spinner } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaEdit, FaSearch, FaTrashAlt } from "react-icons/fa";
import {
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useUpdateCategoryMutation,
} from "../../slices/categorySlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { debounce } from "lodash";
import PaginationForCategory from "../../components/admin/PaginationForCategory";

const CategoryListScreen = () => {
  const navigate = useNavigate();
  const { pageNumber } = useParams();
  const { keyword } = useParams();

  const {
    data: categories,
    isLoading,
    error,
    refetch: refetchCategories,
  } = useGetCategoriesQuery({ pageNumber, keyword });

  const [updateCategory, { isLoading: updateCategoryLoading }] =
    useUpdateCategoryMutation();

  const [deleteCategory, { isLoading: deleteLoading, error: deleteError }] =
    useDeleteCategoryMutation();

  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editedCategoryName, setEditedCategoryName] = useState("");

  const deleteCategoryHandler = async (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategory(categoryId);
        toast.success("Category deleted!");
        refetchCategories();
      } catch (error) {
        toast.error(error?.data?.message || "Failed to delete category.");
      }
    }
  };

  const editCategoryHandler = (category) => {
    setEditingCategory(category._id);
    setEditedCategoryName(category.category_name);
    setShowModal(true);
  };

  const updateCategoryHandler = async () => {
    if (!editedCategoryName.trim()) {
      toast.error("Category name is required!");
      return;
    }

    try {
      await updateCategory({
        categoryId: editingCategory,
        category_name: editedCategoryName.trim(),
      }).unwrap();
      toast.success("Category updated successfully!");
      setShowModal(false);
      setEditingCategory(null);
      setEditedCategoryName("");
      refetchCategories();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update category.");
    }
  };

  const handleSearch = (value) => {
    if (value.trim() === "") {
      navigate("/admin/categorylist");
    } else {
      navigate(`/admin/categorylist/search/${value}`);
    }
  };

  const debouncedSearch = debounce((value) => handleSearch(value), 300);

  return (
    <div style={{ paddingLeft: "250px" }}>
      <ToastContainer />
      <Container>
        <marquee>
          <h1>Category list</h1>
        </marquee>
        <div className="d-flex justify-content-between align-items-center mb-3">
          {/* Add New Category Button */}
          <Link to="/admin/category/add">
            <Button variant="primary">Add New Category</Button>
          </Link>

          {/* Search Input with Icon */}
          <div className="d-flex align-items-center mb-3">
            <FaArrowLeft
              size={30}
              className="mx-2 hover-icon"
              style={{
                transition: "transform 0.3s ease-in-out",
              }}
              onClick={() => navigate("/admin/categorylist")}
            />
            <input
              type="text"
              className="form-control"
              placeholder="Search categories..."
              style={{ maxWidth: "300px" }}
              onChange={(e) => debouncedSearch(e.target.value)}
            />

            <FaSearch
              onClick={() => navigate("/admin/categorylist")}
              className="hover-icon"
              style={{
                marginLeft: "-30px",
                cursor: "pointer",
                color: "gray",
                transition:
                  "color 0.3s ease-in-out, transform 0.3s ease-in-out",
              }}
            />
          </div>
        </div>

        {error ? (
          <p className="text-danger">Failed to load categories.</p>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="3">Loading...</td>
                </tr>
              ) : (
                categories?.categories?.map((category, index) => (
                  <tr key={category._id}>
                    <td>{index + 1}</td>
                    <td>{category.category_name}</td>
                    <td>
                      <Button
                        variant="warning"
                        className="me-2"
                        onClick={() => editCategoryHandler(category)}
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => deleteCategoryHandler(category._id)}
                      >
                        <FaTrashAlt />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        )}

        {/* Modal for Editing Category */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Edit Category</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input
              type="text"
              value={editedCategoryName}
              onChange={(e) => setEditedCategoryName(e.target.value)}
              className="form-control"
              placeholder="Enter category name"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  updateCategoryHandler();
                }
              }}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowModal(false)}
              disabled={updateCategoryLoading}
            >
              Cancel
            </Button>
            <Button
              variant="success"
              onClick={updateCategoryHandler}
              disabled={updateCategoryLoading}
            >
              {updateCategoryLoading ? (
                <Spinner animation="border" size="sm" />
              ) : (
                "Update"
              )}
            </Button>
          </Modal.Footer>
        </Modal>
        {categories && (
          <PaginationForCategory
            pages={categories.pages}
            page={categories.page}
            isAdmin={true}
          />
        )}
      </Container>
    </div>
  );
};

export default CategoryListScreen;
