import React, { useState } from "react";
import { Form, InputGroup, Dropdown, Button } from "react-bootstrap";
import { FaSearch, FaFilter } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  useGetAllCategoryQuery,
  useGetCategoriesQuery,
} from "../../slices/categorySlice";

const HeaderWithSearchAndFilter = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState("");

  const {
    data: categories,
    isLoading: categoriesIsLoading,
    error: categoriesErros,
  } = useGetAllCategoryQuery();

  // Handle search action
  const handleClick = (value) => {
    if (value.trim()) {
      navigate(`/admin/productlist/search/${value}`);
      setValue(""); // Clear the input after search
    }
  };

  // Handle key down event for Enter key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && value.trim()) {
      handleClick(value);
    }
  };

  if (categoriesIsLoading) {
    return <div>Loading...</div>;
  }
  if (categoriesErros) {
    return <div>Error</div>;
  }

  return (
    <header className="bg-light py-3 border-bottom">
      <div className="container d-flex justify-content-between align-items-center ">
        <Link to="/admin/productlist">
          <FaArrowLeft size={30} className="icon-hover" />
        </Link>
        {/* Search and Filters */}
        <div className="d-flex align-items-center w-100 ms-3">
          {/* Search Box */}
          <InputGroup className="me-3">
            <Form.Control
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown} // Handle key press event
              value={value}
              type="text"
              placeholder="Search for products..."
              aria-label="Search"
              className="shadow-sm"
            />
            <Button
              variant="primary"
              className="shadow-sm"
              onClick={() => handleClick(value)}
            >
              <FaSearch />
            </Button>
          </InputGroup>

          {/* Filter Dropdowns */}
          <Dropdown className="me-2">
            <Dropdown.Toggle variant="outline-primary" className="shadow-sm">
              Category
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {categories.map((category) => {
                return (
                  <Dropdown.Item
                    key={category._id}
                    href={`/admin/productlist/search?category=${category._id}`}
                  >
                    {category.category_name}
                  </Dropdown.Item>
                );
              })}
            </Dropdown.Menu>
          </Dropdown>

          <Dropdown className="me-2">
            <Dropdown.Toggle variant="outline-primary" className="shadow-sm">
              Price Range
            </Dropdown.Toggle>
            <Dropdown.Menu
              style={{
                maxHeight: "200px", // Limit the height
                overflowY: "auto", // Enable vertical scrolling
              }}
            >
              <Dropdown.Item href="/admin/productlist/search?minPrice=0&&maxPrice=10">
                Under $10
              </Dropdown.Item>
              <Dropdown.Item href="/admin/productlist/search?minPrice=10&&maxPrice=20">
                $10 - $20
              </Dropdown.Item>
              <Dropdown.Item href="/admin/productlist/search?minPrice=20&&maxPrice=50">
                $20 - $50
              </Dropdown.Item>
              <Dropdown.Item href="/admin/productlist/search?minPrice=50&&maxPrice=100">
                $50 - $100
              </Dropdown.Item>
              <Dropdown.Item href="/admin/productlist/search?minPrice=100&&maxPrice=200">
                $100 - $200
              </Dropdown.Item>
              <Dropdown.Item href="/admin/productlist/search?minPrice=200&&maxPrice=500">
                $200 - $500
              </Dropdown.Item>
              <Dropdown.Item href="/admin/productlist/search?minPrice=500&&maxPrice=1000">
                $500 - $1000
              </Dropdown.Item>
              <Dropdown.Item href="/admin/productlist/search?minPrice=0&&maxPrice=100000">
                Above $1000
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <Dropdown>
            <Dropdown.Toggle variant="outline-primary" className="shadow-sm">
              Rating
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item href={`/admin/productlist/?minRating=5`}>
                5+ Stars
              </Dropdown.Item>
              <Dropdown.Item href={`/admin/productlist/?minRating=4`}>
                4+ Stars
              </Dropdown.Item>
              <Dropdown.Item href={`/admin/productlist/?minRating=3`}>
                3+ Stars
              </Dropdown.Item>
              <Dropdown.Item href={`/admin/productlist/?minRating=2`}>
                2+ Stars
              </Dropdown.Item>
              <Dropdown.Item href={`/admin/productlist/?minRating=0`}>
                All Ratings
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </header>
  );
};

export default HeaderWithSearchAndFilter;
