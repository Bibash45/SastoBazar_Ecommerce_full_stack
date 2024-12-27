import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import { useForgotPasswordMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";
import Meta from "../components/Meta";
import { setActiveLink, playSound } from "../slices/soundSlice";
import SoundPreloader from "../utils/preloadSounds";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate]);

  const handleSubmitSound = () => {
    dispatch(playSound("cardSound"));
  };

  const handleNotificationSound = () => {
    dispatch(playSound("notificationSound"));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    handleSubmitSound();

    try {
      const res = await forgotPassword({ email }).unwrap();
      setResetSent(true);
      handleNotificationSound()
      toast.success("Password reset link has been sent to your email.");
    } catch (error) {
      handleNotificationSound();
      toast.error(error?.data?.message || error.error);
      console.error("Reset Password error:", error);
    }
  };

  return (
    <>
      <SoundPreloader />
      <Meta title="SastoBazaar - Reset Password" />
      <FormContainer>
        <h1>Forgot Password</h1>

        {resetSent ? (
          <p>A password reset link has been sent to your email address.</p>
        ) : (
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

            <Form.Group>
              <Button
                type="submit"
                variant="primary"
                className="mt-2"
                disabled={isLoading}
              >
                Submit
              </Button>
            </Form.Group>

            {isLoading && <Loader />}
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default ForgotPassword;
