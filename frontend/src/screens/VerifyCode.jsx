import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import { useVerifyUserMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";
import Meta from "../components/Meta";
import { playSound } from "../slices/soundSlice";


const VerifyCode = () => {
  const [code, setCode] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [verifyUser, { isLoading }] = useVerifyUserMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  const handleNotificationSound=()=>{
    dispatch(playSound("notificationSound"))
  }


  const submitHandler = async (e) => {
    e.preventDefault();
    if (code.length !== 6) {
handleNotificationSound()
      toast.error("Verification code must be 6 digits");
      return;
    }

    try {
      const res = await verifyUser({ code, email: userInfo.email }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (error) {
      handleNotificationSound()
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <>
      <Meta title="SastoBazaar - Verify Code" />
      <FormContainer>
        <h1>Verify Code</h1>

        <Form onSubmit={submitHandler}>
          <Form.Group controlId="code" className="my-3">
            <Form.Label>Verification Code:</Form.Label>
            <Form.Control
              type="text" // or "number"
              value={code}
              placeholder="Enter code"
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value)) { // Only allow digits
                  setCode(value);
                }
              }}
            />
          </Form.Group>

          <Form.Group>
            <Button
              type="submit"
              variant="primary"
              className="mt-2"
              disabled={isLoading}
            >
              Verify
            </Button>
          </Form.Group>

          {isLoading && <Loader />}
        </Form>

        <Row className="py-3">
          <Col>
            Already have an account?{" "}
            <Link to={redirect ? `/login?redirect=${redirect}` : "/login"}>
              Login
            </Link>
          </Col>
        </Row>
      </FormContainer>
    </>
  );
};

export default VerifyCode;
