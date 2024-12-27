import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { saveShippingAddress } from "../slices/cartSlice";
import CheckoutSteps from "../components/CheckoutSteps";
import { playSound } from "../slices/soundSlice";
import { toast } from "react-toastify";

// List of Nepal citys with postal codes
const nepalcitys = [
  { name: "Kathmandu", postalCode: "44600" },
  { name: "Lalitpur", postalCode: "44700" },
  { name: "Bhaktapur", postalCode: "44800" },
  { name: "Pokhara", postalCode: "33700" },
  { name: "Chitwan", postalCode: "44200" },
  // Add other citys here
];

const ShippingScreen = () => {
  const { shippingAddress } = useSelector((state) => state.cart);
  const [address, setAddress] = useState(shippingAddress?.address || "");
  const [city, setcity] = useState(shippingAddress?.city || nepalcitys[0].name);
  const [postalCode, setPostalCode] = useState(
    shippingAddress?.postalCode || nepalcitys[0].postalCode
  );
  const [country] = useState("Nepal"); // Fixed to "Nepal"

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSound = () => {
    dispatch(playSound("cardSound"));
  };

  const handleNotificationSound = () => {
    dispatch(playSound("notificationSound"));
  };

  const handlecityChange = (e) => {
    const selectedcity = e.target.value;
    setcity(selectedcity);
    const selectedData = nepalcitys.find((d) => d.name === selectedcity);
    setPostalCode(selectedData?.postalCode || "");
  };

  const submitHandler = (e) => {
    handleSound();
    e.preventDefault();

    if (!address || !city || !postalCode) {
      handleNotificationSound();
      toast.error("Please complete all fields");
      return;
    }

    dispatch(saveShippingAddress({ address, city, postalCode, country }));

    navigate("/payment");
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 />
      <h1>Shipping</h1>

      <Form onSubmit={submitHandler}>
        <Form.Group controlId="address" className="my-2">
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="city" className="my-2">
          <Form.Label>city</Form.Label>
          <Form.Control as="select" value={city} onChange={handlecityChange}>
            {nepalcitys.map((city) => (
              <option key={city.name} value={city.name}>
                {city.name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="postalCode" className="my-2">
          <Form.Label>Postal Code</Form.Label>
          <Form.Control type="text" value={postalCode} readOnly></Form.Control>
        </Form.Group>

        <Form.Group controlId="country" className="my-2">
          <Form.Label>Country</Form.Label>
          <Form.Control type="text" value={country} readOnly></Form.Control>
        </Form.Group>

        <Form.Group>
          <Button type="submit" variant="primary" className="my-2">
            Continue
          </Button>
        </Form.Group>
      </Form>
    </FormContainer>
  );
};

export default ShippingScreen;
