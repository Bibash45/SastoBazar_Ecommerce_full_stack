import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Row, Col, Image, Button, Card, ListGroup } from "react-bootstrap";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";

import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  useGetPayPalClientIdQuery,
  usePayOrderMutation,
} from "../../slices/ordersApiSlice";
import { playSound } from "../../slices/soundSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";

const AdminOrderDetails = () => {
  const dispatch = useDispatch();
  const { orderId } = useParams();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery({ orderId });

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();

  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const handleSound = () => {
    dispatch(playSound("cardSound"));
  };

  const handleNotificationSound = () => {
    dispatch(playSound("notificationSound"));
  };

  const {
    data: paypal,
    isLoading: loadingPayPal,
    error: errorPayPal,
  } = useGetPayPalClientIdQuery();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const loadPayPalScript = async () => {
      paypalDispatch({
        type: "resetOptions",
        value: {
          "client-id": paypal.clientId,
          currency: "USD",
        },
      });
      paypalDispatch({
        type: "setLoadingStatus",
        value: "pending", // Or true, depending on your reducer logic
      });
    };

    if (!errorPayPal && !loadingPayPal && paypal.clientId) {
      loadPayPalScript();
    }
  }, [order, paypal, paypalDispatch, loadingPayPal, errorPayPal]);

  async function onApprove(data, actions) {
    handleSound();
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details });
        refetch();
        handleNotificationSound();
        toast.success("Payment successful");
      } catch (error) {
        handleNotificationSound();
        toast.error(error?.data?.message || error.message);
      }
    });
  }
  async function onApproveTest() {
    handleSound();
    await payOrder({ orderId, details: { payer: {} } });
    refetch();
    handleNotificationSound();
    toast.success("Payment successful");
  }
  function onError(err) {
    handleNotificationSound();
    toast.error(err.message);
  }
  function createOrder(data, actions) {
    handleSound();
    return actions.order
      .create({
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: order.totalPrice,
            },
          },
        ],
      })
      .then((orderId) => {
        return orderId;
      });
  }

  const deliverOrderHandler = async () => {
    try {
      await deliverOrder({ orderId, order });
      refetch();
      handleNotificationSound();
      toast.success("Order delivered");
    } catch (error) {
      handleNotificationSound();
      toast.error(error?.data?.message || error.message);
    }
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error?.data?.message || error.error}</Message>
  ) : (
    <div
      style={{
        paddingLeft: "250px",
      }}
    >
      <h1>Order {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup>
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong> {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>
                <Link to="">{order.user.email}</Link>
              </p>
              <p>
                <strong>Address: </strong> {order.shippingAddress.address},{" "}
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                , {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant="success">
                  Delivered on {order.deliveredAt}
                </Message>
              ) : (
                <Message variant="danger">Not Delivered</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Payment</h2>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant="success">Paid on {order.paidAt}</Message>
              ) : (
                <Message variant="danger">Not Paid</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.length === 0 ? (
                <Message>Your order is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row className="align-items-center">
                        {/* Product Image */}
                        <Col md={2}>
                          <Image
                            src={`/${item.image}`}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>

                        {/* Product Name with Link */}
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>

                        {/* Quantity and Price */}
                        <Col md={4}>
                          {item.qty} x ${item.price.toFixed(2)} = $
                          {(item.qty * item.price).toFixed(2)}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>${order.itemsPrice}</Col>
                </Row>

                <Row>
                  <Col>Shipping</Col>
                  <Col>${order.shippingPrice}</Col>
                </Row>

                <Row>
                  <Col>Tax</Col>
                  <Col>${order.taxPrice}</Col>
                </Row>
                <hr />
                <Row>
                  <Col>Total:</Col>
                  <Col>${order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {/* PAY ORDER PLACEHOLDER */}

              {!order.isPaid && (
                <ListGroup.Item>
                  <Button
                    type="button"
                    className="btn btn-block"
                    onClick={deliverOrderHandler}
                    disabled={true}
                  >
                    Mark As Deliver
                  </Button>
                </ListGroup.Item>
              )}

              {/* MARK AS DELIVERED PLACEHOLDER */}
              {loadingDeliver && <Loader />}

              {userInfo &&
                userInfo.isAdmin &&
                order.isPaid &&
                !order.isDelivered && (
                  <ListGroup.Item>
                    <Button
                      type="button"
                      className="btn btn-block"
                      onClick={deliverOrderHandler}
                    >
                      Mark As Deliver
                    </Button>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminOrderDetails;
