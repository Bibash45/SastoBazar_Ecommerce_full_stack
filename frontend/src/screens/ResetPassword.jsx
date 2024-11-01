import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { useDispatch } from "react-redux";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import Meta from "../components/Meta";
import { playSound } from "../slices/soundSlice";
import SoundPreloader from "../utils/preloadSounds";
import { useResetPasswordMutation } from "../slices/usersApiSlice";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const token = sp.get("token");

  const [resetPassword, { loading }] = useResetPasswordMutation();

//   useEffect(() => {
    // Optional: Check if token exists or is valid, and redirect or show a message if not
//   }, [token]);

  const handleSubmitSound = () => {
    dispatch(playSound("cardSound"));
  };

  const handleNotificationSound = () => {
    dispatch(playSound("notificationSound"));
  };

  const submitHandler = async (e) => {
    handleSubmitSound()
    e.preventDefault();

    if (password !== confirmPassword) {
      handleNotificationSound();
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const res = await resetPassword({
        token,
        password,
        confirmPassword,
      }).unwrap();
      setResetSuccess(true);
      handleNotificationSound()
      toast.success("Your password has been reset successfully!");
      navigate("/login");
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
        <h1>Reset Password</h1>

        {resetSuccess ? (
          <p>Your password has been reset successfully! You can now log in.</p>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="password" className="my-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                placeholder="Enter new password"
                onChange={(e) => setPassword(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="confirmPassword" className="my-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                value={confirmPassword}
                placeholder="Confirm new password"
                onChange={(e) => setConfirmPassword(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group>
              <Button type="submit" variant="primary" className="mt-2">
                Reset Password
              </Button>
            </Form.Group>
            {loading && <Loader />}
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default ResetPassword;
