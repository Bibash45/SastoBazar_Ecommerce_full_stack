import React from "react";
import { FaFacebook, FaShoppingCart, FaUser, FaTwitter, FaInstagram } from "react-icons/fa";
import { Link } from "react-router-dom";
import logo from "../assets/logo4.png";
import { useDispatch } from "react-redux";
import { playSound } from "../slices/soundSlice"; // Import your sound action

const Footer = () => {
  const dispatch = useDispatch();

  // Function to handle button or link click with sound
  const handleClick = () => {
    dispatch(playSound("mouseSound")); // Play sound on click
  };

  return (
    <div className="footer container-fluid">
      <footer className="footer container d-flex justify-content-evenly row row-cols-1 row-cols-sm-2 row-cols-md-5 pt-4 mt-5 m-auto">
        <div className="d-flex align-items-center justify-content-center col mb-3">
          <Link
            to="/"
            className="d-flex flex-row flex-sm-column mb-3 link-body-emphasis text-decoration-none"
            onClick={handleClick} // Add onClick for sound
          >
            <img
              className="img-fluid"
              src={logo}
              alt="logo"
              style={{ width: "60px" }}
            />
            <h5 className="my-2 d-none d-md-block"> {/* Hide only on mobile */}
              <span className="pt-2">
                <span style={{ color: "rgb(255, 0, 0)", fontWeight: "600" }}>
                  Sasto
                </span>
                <span style={{ color: "#394bea", fontWeight: "500" }}>
                  Bazar
                </span>
              </span>
            </h5>
          </Link>
        </div>

        <div className="col mb-3 text-center">
          <h5>Company</h5>
          <ul className="nav flex-column pt-2">
            <li className="nav-item mb-2">
              <Link to="/" className="nav-link p-0 text-white fw-light" onClick={handleClick}>
                Home
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link to="/about-us" className="nav-link p-0 text-white fw-light" onClick={handleClick}>
                About Us
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link to="/contact" className="nav-link p-0 text-white fw-light" onClick={handleClick}>
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div className="col mb-3 text-center">
          <h5>Telephone</h5>
          <ul className="nav flex-column pt-2">
            <li className="nav-item mb-2">
              <Link to="#" className="nav-link p-0 text-white fw-light" onClick={handleClick}>
                Office:+012235
              </Link>
            </li>
            <li className="nav-item">
              <Link to="#" className="nav-link p-0 text-white fw-light" onClick={handleClick}>
                FAX:8945982
              </Link>
            </li>
          </ul>
        </div>

        <div className="col mb-3 text-center">
          <h5>Contact Us</h5>
          <ul className="nav d-flex flex-column">
            <li>
              <Link className="text-light fs-2" to="" onClick={handleClick}>
                <FaFacebook />
              </Link>
            </li>
            <li>
              <Link className="text-light fs-2" to="" onClick={handleClick}>
                <FaTwitter />
              </Link>
            </li>
            <li>
              <Link className="text-light fs-2" to="" onClick={handleClick}>
                <FaInstagram />
              </Link>
            </li>
          </ul>
        </div>
      </footer>
      <div className="align-items-center text-white pb-1">
        <div className="border-top text-white py-2 mx-5 opacity-30">
          <p className="m-0 text-center opacity-50">
            Copyright © 2024. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
