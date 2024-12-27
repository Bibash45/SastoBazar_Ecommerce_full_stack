import React, { useState } from "react";
import { Form, InputGroup, Dropdown, Button } from "react-bootstrap";
import { FaSearch, FaFilter } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const SearchForUser = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState("");

  // Handle search action
  const handleClick = (value) => {
    if (value.trim()) {
      navigate(`/admin/userlist/search/${value}`);
      setValue(""); // Clear the input after search
    }
  };

  // Handle key down event for Enter key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && value.trim()) {
      handleClick(value);
    }
  };

  return (
    <header
      className="bg-light py-3 border-bottom"
      style={{
        paddingLeft: "250px",
      }}
    >
     
      <div className="container d-flex justify-content-between align-items-center ">
        <Link to="/admin/userlist">
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
        </div>
      </div>
    </header>
  );
};

export default SearchForUser;
