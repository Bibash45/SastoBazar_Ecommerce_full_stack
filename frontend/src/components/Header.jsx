import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Badge, Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { FaShoppingCart, FaUser, FaMusic } from "react-icons/fa";
import logo from "../assets/logo4.png";
import { LinkContainer } from "react-router-bootstrap";
import { useLogoutMutation } from "../slices/usersApiSlice";
import { logout } from "../slices/authSlice";
import SearchBox from "./SearchBox";
import { resetCart } from "../slices/cartSlice";
import { setActiveLink, playSound, stopSound } from "../slices/soundSlice";
import SoundPreloader from "../utils/preloadSounds";

const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();
  const [isMusicPlaying, setIsMusicPlaying] = useState(false); // Tracks music state

  // Handle music play/pause based on the visibility of the page
  useEffect(() => {
    // Load music state from localStorage on component mount
    const savedMusicState = localStorage.getItem("isMusicPlaying");
    if (savedMusicState === "true") {
      setIsMusicPlaying(true);
      dispatch(playSound("backgroundSound"));
    }

    // Listen for tab visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Pause music if the page is hidden (user switches tab or minimizes)
        if (isMusicPlaying) {
          dispatch(stopSound("backgroundSound"));
        }
      } else {
        // Resume music if it's playing
        if (isMusicPlaying) {
          dispatch(playSound("backgroundSound"));
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isMusicPlaying, dispatch]);

  // Toggle music play/pause
  const toggleMusic = () => {
    if (isMusicPlaying) {
      dispatch(stopSound("backgroundSound"));
      localStorage.setItem("isMusicPlaying", "false");
    } else {
      dispatch(playSound("backgroundSound"));
      localStorage.setItem("isMusicPlaying", "true");
    }
    setIsMusicPlaying(!isMusicPlaying);
  };

  const handleClick = (to) => {
    dispatch(setActiveLink(to));
    dispatch(playSound("mouseSound")); // Play mouse click sound
  };

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      handleClick("/login");
      dispatch(logout());
      dispatch(resetCart());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <SoundPreloader />
      <header>
        <Navbar bg="dark" variant="dark" expand="md" collapseOnSelect>
          <Container>
            <LinkContainer to="/" onClick={() => handleClick("/")}>
              <Navbar.Brand>
                <div className="d-flex align-items-center">
                  <img
                    src={logo}
                    alt="SastoBazaar"
                    style={{ width: "50px", marginRight: "10px" }}
                  />
                  <span className="pt-2">
                    <span style={{ color: "brown", fontWeight: "bold" }}>
                      Sasto
                    </span>
                    <span style={{ color: "blue", fontWeight: "500" }}>
                      Bazar
                    </span>
                  </span>
                </div>
              </Navbar.Brand>
            </LinkContainer>

            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto align-items-center">
                <SearchBox />

                <LinkContainer to="/cart" onClick={() => handleClick("/cart")}>
                  <Nav.Link>
                    <FaShoppingCart className="nav-icon" />
                    Cart:
                    {cartItems.length > 0 && (
                      <Badge
                        pill
                        bg="success"
                        style={{
                          marginLeft: "5px",
                        }}
                      >
                        {cartItems.reduce((a, c) => a + c.qty, 0)}
                      </Badge>
                    )}
                  </Nav.Link>
                </LinkContainer>

                {userInfo ? (
                  <NavDropdown
                    title={userInfo.name}
                    id="username"
                    className="dropdown-center"
                  >
                    <LinkContainer
                      to="/profile"
                      onClick={() => handleClick("/profile")}
                    >
                      <NavDropdown.Item>Profile</NavDropdown.Item>
                    </LinkContainer>

                    <NavDropdown.Item onClick={logoutHandler}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                ) : (
                  <LinkContainer
                    to="/login"
                    onClick={() => handleClick("/login")}
                  >
                    <Nav.Link>
                      <FaUser className="nav-icon" />
                      Sign In
                    </Nav.Link>
                  </LinkContainer>
                )}

                {/* {userInfo && userInfo.isAdmin && (
                  <NavDropdown
                    title="Admin"
                    id="adminmenu"
                    className="dropdown-center"
                  >
                    <LinkContainer
                      to="/admin/productlist"
                      onClick={() => handleClick("/admin/productlist")}
                    >
                      <NavDropdown.Item>Products</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer
                      to="/admin/userlist"
                      onClick={() => handleClick("/admin/userlist")}
                    >
                      <NavDropdown.Item>User</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer
                      to="/admin/orderlist"
                      onClick={() => handleClick("/admin/orderlist")}
                    >
                      <NavDropdown.Item>Orders</NavDropdown.Item>
                    </LinkContainer>
                  </NavDropdown>
                )} */}
                {/* Music Button with Play/Pause Functionality */}
                <button
                  className={`music-btn ${
                    isMusicPlaying ? "music-playing" : ""
                  }`}
                  onClick={toggleMusic}
                >
                  <FaMusic className="me-2" />
                </button>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>
    </>
  );
};

export default Header;
