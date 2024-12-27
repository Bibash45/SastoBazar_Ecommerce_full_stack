import React, { useState } from "react";
import { Form, InputGroup, Button } from "react-bootstrap";
import { FaSearch, FaFilter, FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const SearchForOrder = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState(""); // For general search
  const [email, setEmail] = useState(""); // For filtering by email
  const [customerName, setCustomerName] = useState(""); // For filtering by customer name
  const [startDate, setStartDate] = useState(""); // Start date filter
  const [endDate, setEndDate] = useState(""); // End date filter
  const [minPrice, setMinPrice] = useState(""); // Min price filter
  const [maxPrice, setMaxPrice] = useState(""); // Max price filter
  const [pageNumber, setPageNumber] = useState(1); // Pagination

  // Handle search and filter action
  const handleSearch = () => {
    const params = new URLSearchParams();

    if (searchValue.trim()) params.append("keyword", searchValue);
    if (email.trim()) params.append("email", email);
    if (customerName.trim()) params.append("customerName", customerName);
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    if (minPrice) params.append("minPrice", minPrice);
    if (maxPrice) params.append("maxPrice", maxPrice);
    params.append("pageNumber", pageNumber); // Add page number for pagination

    navigate(`/admin/orderlist?${params.toString()}`);
  };

  // Handle key down event for Enter key press in the main search box
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <header className=" bg-light py-3 border-bottom">
      <div className=" d-flex justify-content-between align-items-center px-3">
        <Link to="/admin/orderlist">
          <FaArrowLeft size={30} className="icon-hover" />
        </Link>
        {/* Search and Filters */}
        <div className="d-flex align-items-center w-100 ms-3 ">
          {/* Search Box */}
          <InputGroup className="me-3">
            <Form.Control
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleKeyDown}
              value={searchValue}
              type="text"
              placeholder="Search by keyword..."
              aria-label="Search"
              className="shadow-sm"
            />
          </InputGroup>

          {/* Filter by Email */}
          <InputGroup className="me-3">
            <Form.Control
              onKeyDown={handleKeyDown}
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="Filter by email"
              aria-label="Filter by email"
              className="shadow-sm"
            />
          </InputGroup>

          {/* Filter by Customer Name */}
          <InputGroup className="me-3">
            <Form.Control
              onKeyDown={handleKeyDown}
              onChange={(e) => setCustomerName(e.target.value)}
              value={customerName}
              type="text"
              placeholder="Filter by customer name"
              aria-label="Filter by customer name"
              className="shadow-sm"
            />
          </InputGroup>

          {/* Filter by Date Range */}
          <InputGroup className="me-3">
            <Form.Control
              onKeyDown={handleKeyDown}
              type="date"
              onChange={(e) => setStartDate(e.target.value)}
              value={startDate}
              placeholder="Start Date"
              aria-label="Start Date"
              className="shadow-sm"
            />
          </InputGroup>
          <InputGroup className="me-3">
            <Form.Control
              onKeyDown={handleKeyDown}
              type="date"
              onChange={(e) => setEndDate(e.target.value)}
              value={endDate}
              placeholder="End Date"
              aria-label="End Date"
              className="shadow-sm"
            />
          </InputGroup>

          {/* Filter by Price Range */}
          <InputGroup className="me-3">
            <Form.Control
              type="number"
              onChange={(e) => setMinPrice(e.target.value)}
              value={minPrice}
              placeholder="Min Price"
              aria-label="Min Price"
              className="shadow-sm"
              onKeyDown={handleKeyDown}
            />
          </InputGroup>
          <InputGroup className="me-3">
            <Form.Control
              type="number"
              onChange={(e) => setMaxPrice(e.target.value)}
              value={maxPrice}
              placeholder="Max Price"
              aria-label="Max Price"
              className="shadow-sm"
              onKeyDown={handleKeyDown}
            />
          </InputGroup>

          {/* Search Button */}
          <Button variant="outline-success" onClick={handleSearch}>
            Apply Filters <FaFilter />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default SearchForOrder;
