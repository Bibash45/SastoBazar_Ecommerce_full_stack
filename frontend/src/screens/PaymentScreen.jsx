import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button, Col } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import { savePaymentMethod } from "../slices/cartSlice";
import { playSound } from "../slices/soundSlice";


const PaymentScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const shippingAddress = useSelector((state) => state.cart.shippingAddress);
  const [paymentMethod, setPaymentMethod] = useState("PayPal");

  useEffect(() => {
    const { address, city, postalCode, country } = shippingAddress;
    if (!(address && city && postalCode && country)) {
      navigate("/shipping");
    }
  }, [navigate, shippingAddress]);

  const handleSound = () => {
    dispatch(playSound("cardSound"));
  };

  const submitHandler = (e) => {
    handleSound()
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };
  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />

      <h1>Payment Method</h1>

      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as="legend">Select Method</Form.Label>
          <Col>
            <Form.Check
              type="radio"
              className="my-2"
              label="PayPal or Credit Card"
              id="PayPal"
              name="paymentMethod"
              value={paymentMethod}
              checked
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></Form.Check>
          </Col>
        </Form.Group>
        <Button type="submit" variant="primary">
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default PaymentScreen;
