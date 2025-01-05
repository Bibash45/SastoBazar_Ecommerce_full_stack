import React from "react";
import { Table, Button } from "react-bootstrap";
import { Link, useLocation, useParams } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { useGetOrdersQuery } from "../../slices/ordersApiSlice";
import Paginate from "../../components/Paginate";
import SearchForOrder from "../../components/admin/SearchForOrder";

const OrderListScreen = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const filters = {
    keyword: queryParams.get("keyword"),
    pageNumber: queryParams.get("pageNumber"),
    email: queryParams.get("email"),
    customerName: queryParams.get("customerName"),
    startDate: queryParams.get("startDate"),
    endDate: queryParams.get("endDate"),
    minPrice: queryParams.get("minPrice"),
    maxPrice: queryParams.get("maxPrice"),
  };

  const cleanFilters = (filters) => {
    const validFilters = {};
    Object.keys(filters).forEach((key) => {
      if (filters[key] && filters[key] !== "null") {
        validFilters[key] = filters[key];
      }
    });
    return validFilters;
  };
  const validFilters = cleanFilters(filters);

  console.log(filters);

  const { data: orders, isLoading, error } = useGetOrdersQuery(validFilters);
  console.log(orders);

  return (
    <div
      style={{
        paddingLeft: "250px",
      }}
    >
      <marquee>
        <h1>Orders List</h1>
      </marquee>
      <SearchForOrder />
      {!orders ? (
        <div>
          <Message variant="danger">No orders found</Message>
        </div>
      ) : (
        <div className="w-full">
          {isLoading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">
              {error.data.message || "No orders found..."}
            </Message>
          ) : (
            <>
              <Table striped hover responsive className="table-sm">
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>USER</th>
                    <th>DATE</th>
                    <th>TOTAL</th>
                    <th>PAID</th>
                    <th>DELIVERED</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {orders?.orders?.map((order) => (
                    <tr key={order._id}>
                      <td>{order._id}</td>
                      <td>{order.user?.name}</td>
                      <td>{order.createdAt?.substring(0, 10)}</td>
                      <td>${order.totalPrice}</td>
                      <td>
                        {order.isPaid ? (
                          order.paidAt?.substring(0, 10)
                        ) : (
                          <FaTimes style={{ color: "red" }} />
                        )}
                      </td>
                      <td>
                        {order.isDelivered ? (
                          order.deliveredAt?.substring(0, 10)
                        ) : (
                          <FaTimes style={{ color: "red" }} />
                        )}
                      </td>
                      <td>
                        <Link to={`/admin/orderdetail/${order._id}`}>
                          <Button variant="light" className="btn-sm">
                            Details
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              {/* Uncomment if Paginate is necessary */}
              <Paginate
                pages={orders.pages}
                page={orders.page}
                isAdmin={true}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderListScreen;
