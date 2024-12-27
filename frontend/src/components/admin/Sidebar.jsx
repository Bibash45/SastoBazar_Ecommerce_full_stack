import React, { useState } from "react";
import { Nav, Dropdown } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaBoxOpen,
  FaClipboardList,
  FaUsers,
  FaChartLine,
  FaCogs,
  FaQuestionCircle,
  FaBars,
  FaTag, // Add FaTag for category icon
} from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { useDispatch } from "react-redux";
import { logout } from "../../slices/authSlice";
import { resetCart } from "../../slices/cartSlice";
import { useLogoutMutation } from "../../slices/usersApiSlice";

import logo from "../../assets/logo4.png";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      dispatch(resetCart());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Sidebar */}
      <div
        className={`sidebar position-fixed top-0 left-0 bg-dark text-white p-3 min-vh-100 ${
          collapsed ? "collapsed-sidebar" : ""
        }`}
        style={{
          width: collapsed ? "80px" : "250px",
          transition: "width 0.3s ease-in-out, padding 0.3s ease-in-out",
          position: "sticky",
          top: "0",
        }}
      >
        <div className="d-flex justify-content-around align-items-center mb-4">
          {!collapsed && (
            <Link to="/admin">
              <div className="d-flex align-items-center">
                <img
                  src={logo}
                  alt="SastoBazaar"
                  style={{
                    width: collapsed ? "35px" : "50px",
                    transition: "width 0.3s ease-in-out",
                    marginRight: collapsed ? "0" : "10px",
                  }}
                />
              </div>
            </Link>
          )}
          <FaBars
            className="text-white cursor-pointer text-center"
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: collapsed ? "1.5rem" : "1.8rem",
              transition: "transform 0.3s",
              transform: collapsed ? "rotate(0deg)" : "rotate(180deg)",
            }}
          />
        </div>

        <Nav className="flex-column">
          <Nav.Link
            as={Link}
            to="/admin"
            className={`text-white ${
              isActive("/admin") ? "active" : ""
            } d-flex align-items-center mb-3`}
          >
            <FaHome className="me-2" />
            {!collapsed && <span className="ms-2">Dashboard</span>}
          </Nav.Link>

          {/* Products Dropdown */}
          <Dropdown className="mb-3">
            <Dropdown.Toggle
              className={`text-white ${
                isActive("/admin/productlist") ? "active" : ""
              } d-flex align-items-center`}
            >
              <FaBoxOpen className="me-2" />
              {!collapsed && <span className="ms-2">Products</span>}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item
                as={Link}
                to="/admin/productlist"
                className={`text-secondary ${
                  isActive("/admin/productlist") ? "active" : ""
                }`}
              >
                Product List
              </Dropdown.Item>
              <Dropdown.Item
                as={Link}
                to="/admin/product/add"
                className={`text-secondary ${
                  isActive("/admin/product/add") ? "active" : ""
                }`}
              >
                Add Product
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          {/* Categories Dropdown */}
          <Dropdown className="mb-3">
            <Dropdown.Toggle
              className={`text-white ${
                isActive("/admin/categorylist") ? "active" : ""
              } d-flex align-items-center`}
            >
              <FaTag className="me-2" />
              {!collapsed && <span className="ms-2">Categories</span>}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item
                as={Link}
                to="/admin/categorylist"
                className={`text-secondary ${
                  isActive("/admin/categorylist") ? "active" : ""
                }`}
              >
                Category List
              </Dropdown.Item>
              <Dropdown.Item
                as={Link}
                to="/admin/category/add"
                className={`text-secondary ${
                  isActive("/admin/category/add") ? "active" : ""
                }`}
              >
                Add Category
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <Nav.Link
            as={Link}
            to="/admin/orderlist"
            className={`text-white ${
              isActive("/admin/orderlist") ? "active" : ""
            } d-flex align-items-center mb-3`}
          >
            <FaClipboardList className="me-2" />
            {!collapsed && <span className="ms-2">Orders</span>}
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="/admin/userlist"
            className={`text-white ${
              isActive("/admin/userlist") ? "active" : ""
            } d-flex align-items-center mb-3`}
          >
            <FaUsers className="me-2" />
            {!collapsed && <span className="ms-2">Customers</span>}
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="/admin/reports"
            className={`text-white ${
              isActive("/reports") ? "active" : ""
            } d-flex align-items-center mb-3`}
          >
            <FaChartLine className="me-2" />
            {!collapsed && <span className="ms-2">Reports</span>}
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="/settings"
            className={`text-white ${
              isActive("/settings") ? "active" : ""
            } d-flex align-items-center mb-3`}
          >
            <FaCogs className="me-2" />
            {!collapsed && <span className="ms-2">Settings</span>}
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="/help"
            className={`text-white ${
              isActive("/help") ? "active" : ""
            } d-flex align-items-center mb-3`}
          >
            <FaQuestionCircle className="me-2" />
            {!collapsed && <span className="ms-2">Help</span>}
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="/login"
            onClick={logoutHandler}
            className={`text-white ${
              isActive("/login") ? "active" : ""
            } d-flex align-items-center mb-3`}
          >
            <MdLogout
              className="me-2"
              style={{ transform: "rotate(180deg)" }}
            />
            {!collapsed && <span className="ms-2">Signout</span>}
          </Nav.Link>
        </Nav>
      </div>
    </>
  );
};

export default Sidebar;
