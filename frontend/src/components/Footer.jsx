import React from "react";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import { Link } from "react-router-dom";
import logo from "../assets/logo4.png";
import { useDispatch } from "react-redux";
import { playSound } from "../slices/soundSlice";

const Footer = () => {
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(playSound("mouseSound")); // Play sound on click
  };

  return (
    <div className="footer bg-dark text-light py-4">
      <footer className="container">
        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 gy-4">
          {/* Logo and Branding */}
          <div className="col text-center">
            <Link
              to="/"
              className="d-flex flex-column align-items-center text-decoration-none"
              onClick={handleClick}
            >
              <img
                src={logo}
                alt="logo"
                className="img-fluid"
                style={{ width: "80px" }}
              />
              <h5 className="mt-2">
                <span style={{ color: "rgb(255, 0, 0)", fontWeight: "600" }}>
                  Sasto
                </span>
                <span style={{ color: "#394bea", fontWeight: "500" }}>
                  Bazar
                </span>
              </h5>
            </Link>
          </div>

          {/* Company Links */}
          <div className="col text-center">
            <h5>Company</h5>
            <ul className="list-unstyled mt-3">
              <li>
                <Link
                  to="/"
                  className="text-light text-decoration-none"
                  onClick={handleClick}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about-us"
                  className="text-light text-decoration-none"
                  onClick={handleClick}
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-light text-decoration-none"
                  onClick={handleClick}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Telephone */}
          <div className="col text-center">
            <h5>Contact</h5>
            <ul className="list-unstyled mt-3">
              <li>
                <span className="text-light d-block">Office: +012235</span>
              </li>
              <li>
                <span className="text-light d-block">FAX: 8945982</span>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="col text-center">
            <h5>Follow Us</h5>
            <div className="d-flex justify-content-center gap-3 mt-3">
              <Link
                to="#"
                className="text-light fs-3"
                aria-label="Facebook"
                onClick={handleClick}
              >
                <FaFacebook />
              </Link>
              <Link
                to="#"
                className="text-light fs-3"
                aria-label="Twitter"
                onClick={handleClick}
              >
                <FaTwitter />
              </Link>
              <Link
                to="#"
                className="text-light fs-3"
                aria-label="Instagram"
                onClick={handleClick}
              >
                <FaInstagram />
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-4 border-top pt-3">
          <p className="text-center mb-0">
            Copyright © 2024. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
