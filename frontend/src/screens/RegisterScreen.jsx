import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import {
  useRegisterMutation,
  useVerifyUserMutation,
  useResendCodeMutation,
} from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";
import Meta from "../components/Meta";
import { setActiveLink, playSound } from "../slices/soundSlice";
import SoundPreloader from "../utils/preloadSounds";

const RegisterScreen = () => {
  const [isRegistering,setIsRegistering] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [register, { isLoading: isRegisteringLoading }] = useRegisterMutation();
  const [verifyUser, { isLoading: isVerifyingLoading }] = useVerifyUserMutation();
  const [resendCode, { isLoading: isResendingLoading }] = useResendCodeMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate]);

  const handleSound = () => {
    dispatch(playSound("cardSound"));
  };

  const handleClick = (to) => {
    dispatch(setActiveLink(to));
    dispatch(playSound("loginSound"));
  };

  const handleNotificationSound=()=>{
    dispatch(playSound("notificationSound"))
  }


  const submitRegisterHandler = async (e) => {
    handleSound();
    e.preventDefault();
    if(!(name && email && password && confirmPassword)){
      handleNotificationSound()
      toast.error("Complete the field to continue..")
    }
    if (password !== confirmPassword) {
      handleNotificationSound()
      toast.error("Passwords do not match");
      return;
    }
    try {
      const res = await register({ name, email, password }).unwrap();
      console.log(res);
  
      if (res.message) {
        // If the response contains a message, it indicates success
        setIsRegistering(false); 
        handleNotificationSound()
        toast.success(res.message);
      } else {
        handleNotificationSound()
        toast.warn("User already exists. Please verify.");
        setIsRegistering(false);
      }
    } catch (error) {
      // handleNotificationSound()
      // toast.error(error?.data?.message || error.error);
      console.log(error);
      
    }
  };
  
  const submitVerifyHandler = async (e) => {
    handleSound();
    e.preventDefault();
    if (code.length !== 6) {
      handleNotificationSound()
      toast.error("Verification code must be 6 digits");
      return;
    }
    try {
      const res = await verifyUser({ code, email }).unwrap();
      dispatch(setCredentials({ ...res }));
      handleClick(redirect);
      navigate(redirect);
    } catch (error) {
      handleNotificationSound()
      toast.error(error?.data?.message || error.error);
    }
  };

  const resendCodeHandler = async () => {
    try {
      await resendCode({ email }).unwrap();
      handleNotificationSound()
      toast.success("Verification code resent");
    } catch (error) {
      handleNotificationSound()
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <>
      <SoundPreloader />
      <Meta title="SastoBazaar - Sign Up / Verify" />
      <FormContainer>
        <h1>{isRegistering ? "Sign Up" : "Verify Code"}</h1>
        <Form
          onSubmit={isRegistering ? submitRegisterHandler : submitVerifyHandler}
        >
          {isRegistering ? (
            <>
              <Form.Group controlId="name" className="my-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={name}
                  placeholder="Enter Name"
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="email" className="my-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  placeholder="Enter Email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="password" className="my-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  placeholder="Enter Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="confirmPassword" className="my-3">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  value={confirmPassword}
                  placeholder="Confirm Password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </Form.Group>
            </>
          ) : (
            <>
              <Form.Group controlId="code" className="my-3">
                <Form.Label>Verification Code:</Form.Label>
                <Form.Control
                  type="text"
                  value={code}
                  placeholder="Enter code"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      setCode(value);
                    }
                  }}
                />
              </Form.Group>
              <Button variant="danger" className="text-light btn-sm" onClick={resendCodeHandler} disabled={isResendingLoading}>
                {isResendingLoading ? "Sending..." : "Send Code"}
              </Button>
            </>
          )}
          <Form.Group>
            <Button
              type="submit"
              variant="primary"
              className="mt-2 w-100"
              disabled={
                isRegistering ? isRegisteringLoading : isVerifyingLoading
              }
            >
              {isRegistering ? "Register" : "Verify"}
            </Button>
          </Form.Group>
          {(isRegistering ? isRegisteringLoading : isVerifyingLoading) && (
            <Loader />
          )}
        </Form>
        <Row className="py-3 text-center">
          <Col>
            {isRegistering ? (
              <>
                Already have an account?{" "}
                <Link
                className="text-info"
                to={redirect ? `/login?redirect=${redirect}` : "/login"}>
                  Login
                </Link>
              </>
            ) : (
              <>
                Need to register?{" "}
                <Button variant="link" onClick={() => setIsRegistering(true)}>
                  Sign Up
                </Button>
              </>
            )}
          </Col>
        </Row>
      </FormContainer>
    </>
  );
};

export default RegisterScreen;
