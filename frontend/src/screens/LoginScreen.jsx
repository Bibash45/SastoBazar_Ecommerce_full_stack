import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import { useLoginMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";
import Meta from "../components/Meta";
import Google from "../components/Google";
import { setActiveLink, playSound } from "../slices/soundSlice";
import SoundPreloader from "../utils/preloadSounds";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate]);

  const handleLinkClick = (to) => {
    dispatch(setActiveLink(to));
    dispatch(playSound("loginSound")); // Use the correct sound key here
  };

  const handleSound = () => {
    dispatch(playSound("cardSound"));
  };

  const handleNotificationSound = () => {
    dispatch(playSound("notificationSound"));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    handleSound();

    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      handleLinkClick(redirect); // Play sound and set active link
      navigate(redirect);
    } catch (error) {
      handleNotificationSound();
      toast.error(error?.data?.message || error.error);
      console.error("Login error:", error); // Log the error for debugging
    }
  };

  return (
    <>
      <SoundPreloader />
      <Meta title="SastoBazaar - signin" />
      <FormContainer>
        <h1>Sign In</h1>

        <Form onSubmit={submitHandler}>
          <Form.Group controlId="email" className="my-3">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              value={email}
              placeholder="Enter Email"
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="password" className="my-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              placeholder="Enter Password"
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group>
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
              className="w-100"
            >
              Sign In
            </Button>
          </Form.Group>

          {isLoading && <Loader />}
        </Form>

        {/* Add Forgot Password link here */}
        <Row className="pt-3 pb-3 text-center">
          <Col>
            New Customer?
            <Link
            className="text-info"
              to={redirect ? `/register?redirect=${redirect}` : "/register"}
            >
              Register
            </Link>
          </Col>
        </Row>
        <Row className="pb-3 text-center">
          <Col>
            <Link to="/forgot-password" className="text-info">Forgot Password?</Link>
          </Col>
        </Row>

        <Row>
          <div className="text-center hr-wrapper mb-3">
            <hr className="hr-line" />
            <span>Other options</span>
            <hr className="hr-line" />
          </div>
          <div>
            <Google />
          </div>
        </Row>
      </FormContainer>
    </>
  );
};

export default LoginScreen;
