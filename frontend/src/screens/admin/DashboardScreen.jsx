import React, { useState } from "react";
import { Container, Row, Col, Card, Table, Spinner } from "react-bootstrap";
import { Line, Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
} from "chart.js";

import {
  useGetOrdersQuery,
  useGetTotalQuery,
} from "../../slices/ordersApiSlice";
import {
  useGetMonthlyRevenueQuery,
  useGetMonthlyVisitQuery,
  useGetTopSellingProductsQuery,
  useGetTotalRevenueQuery,
} from "../../slices/revenueApiSlice";
import {
  useGetOutOfStockProductsQuery,
  useGetTotalProductsQuery,
} from "../../slices/productsApiSlice";
import { useGetTotalUsersQuery } from "../../slices/usersApiSlice";
import { useLocation, useNavigate } from "react-router-dom";
// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement
);

const DashboardScreen = () => {
  const [stock, setStock] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const finalStock = Number(queryParams.get("stock"));

  // API hooks
  const {
    data: totalRevenue,
    isLoading: totalRevenueLoading,
    error: totalRevenueError,
  } = useGetTotalRevenueQuery();

  const {
    data: totalOrders,
    isLoading: totalOrdersLoading,
    error: totalOrdersError,
  } = useGetTotalQuery();

  const {
    data: totalProducts,
    isLoading: totalProductsLoading,
    error: totalProductsError,
  } = useGetTotalProductsQuery();

  const {
    data: monthlyData,
    isLoading: monthlyDataLoading,
    error: monthlyDataError,
  } = useGetMonthlyRevenueQuery();

  const {
    data: topSellingProducts,
    isLoading: topSellingProductsLoading,
    error: topSellingProductsError,
  } = useGetTopSellingProductsQuery();

  const {
    data: totalUsers,
    isLoading: totalUsersLoading,
    error: totalUsersError,
  } = useGetTotalUsersQuery();

  const {
    data: monthlyVisitedUser,
    isLoading: monthlyVisitedUserLoading,
    error: monthlyVisitedUserError,
  } = useGetMonthlyVisitQuery();

  const {
    data: outOfStockData,
    isLoading: outOfStockDataLoading,
    error: outOfStockDataError,
  } = useGetOutOfStockProductsQuery(finalStock);

  // Handle loading and error states
  if (
    outOfStockDataLoading ||
    monthlyVisitedUserLoading ||
    totalUsersLoading ||
    topSellingProductsLoading ||
    totalRevenueLoading ||
    totalOrdersLoading ||
    monthlyDataLoading ||
    totalProductsLoading
  ) {
    return <Spinner animation="border" />;
  }

  if (
    outOfStockDataError ||
    monthlyVisitedUserError ||
    totalUsersError ||
    topSellingProductsError ||
    totalRevenueError ||
    totalOrdersError ||
    monthlyDataError ||
    totalProductsError
  ) {
    return <div>Error loading data</div>;
  }

  // Default or fallback values
  const revenue = totalRevenue?.totalRevenue ?? "Loading...";
  const productsData = {
    labels: topSellingProducts?.topSellingProducts?.map(
      (product) => product.name
    ) || ["No Products"],
    datasets: [
      {
        label: "Top-Selling Products",
        data: topSellingProducts?.topSellingProducts?.map(
          (product) => product.totalSold
        ) || [0],
        backgroundColor: [
          "#2196f3",
          "#673ab7",
          "red",
          "yellow",
          "blue",
          "green",
          "pink",
          "black",
          "purple",
          "brown",
        ],
        borderRadius: 4,
        hoverBackgroundColor: "#ff9800",
      },
    ],
  };

  const monthlyRevenueData = {
    labels: monthlyData?.labels || ["No Data"],
    datasets: [
      {
        label: monthlyData?.datasets[0]?.label || "Revenue",
        data: monthlyData?.datasets[0]?.data || [0],
        borderColor: monthlyData?.datasets[0]?.borderColor || "#4caf50",
        backgroundColor:
          monthlyData?.datasets[0]?.backgroundColor || "rgba(76, 175, 80, 0.2)",
      },
    ],
  };

  return (
    <div
      style={{
        paddingLeft: "250px",
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
      }}
    >
      <Container fluid>
        <marquee>
          <h1>
            <span className="text-success">A</span>
            <span className="text-info">D</span>
            <span className="text-warning">M</span>
            <span className="text-success">I</span>
            <span className="text-primary">N </span>
            <span className="text-danger">D</span>
            <span className="text-info">A</span>
            <span className="text-warning">S</span>
            <span className="text-success">H</span>
            <span
              style={{
                color: "brown",
              }}
            >
              B
            </span>
            <span className="text-info">O</span>
            <span className="text-warning">A</span>
            <span className="text-success">R</span>
            <span className="text-secondary">D</span>
          </h1>
        </marquee>

        {/* Summary Cards */}
        <div className="d-flex flex-wrap justify-content-around align-items-center">
          {[
            {
              title: "Total Revenue",
              value: `$${revenue}`,
              backgroundColor: "dark-subtle",
              color: "white",
            },
            {
              title: "Total Orders",
              value: totalOrders?.totalOrders || 0,
              backgroundColor: "secondary-subtle",
              color: "secondary-emphasis",
            },
            {
              title: "Total Products",
              value: totalProducts?.totalProducts ?? "N/A",
              backgroundColor: "success-subtle",
              color: "success-emphasis",
            },
            {
              title: "Total Users",
              value: totalUsers?.totalUsers ?? "N/A",
              backgroundColor: "danger-subtle",
              color: "danger-emphasis",
            },
            {
              title: "Monthly Visits",
              value: monthlyVisitedUser?.totalVisits ?? "N/A",
              backgroundColor: "warning-subtle",
              color: "warning-emphasis",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="d-flex justify-content-around align-items-center"
            >
              <div
                className={` px-5 py-2 my-2 shadow-xl rounded border-0  bg-${stat.backgroundColor}`}
              >
                <div>
                  <h3 className={`text-${stat.color} text-center `}>
                    {stat.title}
                  </h3>
                  <h4
                    className={`font-weight-bold text-center text-${stat.color}`}
                  >
                    {stat.value}
                  </h4>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className=" p-3 d-flex  justify-content-around align-items-end w-100 gap-4">
          <div className="w-50">
            <div className=" rounded border-0">
              <div>
                <Line data={monthlyRevenueData} />
                <h3 className="text-muted text-center">Revenue Trend</h3>
              </div>
            </div>
          </div>

          <div className="w-50 ">
            <div className=" rounded border-0">
              <div>
                <Bar data={productsData} />
                <h3 className="text-muted text-center">Top-Selling Products</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Out of stock products */}
        <div className="p-3 shadow-lg text-danger">
          <h2>Out of Stock Products</h2>
          <div className="text-end pb-3 d-flex justify-content-start align-items-center gap-2">
            <label htmlFor="stock" className="text-dark">
              Enter a stock you want get :
            </label>
            <input
              type="number"
              className="text-center text-danger"
              onChange={(e) => setStock(e.target.value)}
              value={stock}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  navigate(`?stock=${stock}`);
                }
              }}
            />
          </div>
          <Table striped bordered hover responsive>
            <thead className="bg-danger text-white">
              <tr>
                <th>Name</th>
                <th>Brand</th>
                <th>Category</th>
                <th>Description</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody className="text-dark">
              {outOfStockData.length > 0 ? (
                outOfStockData.map((product) => (
                  <tr key={product._id}>
                    <td>{product.name}</td>
                    <td>{product.brand}</td>
                    <td>{product.category.category_name}</td>
                    <td>{product.description}</td>
                    <td>${product.price}</td>
                    <td className="bg-white">
                      <p
                        className=" text-danger "
                        style={{
                          "font-weight": "900",
                          "font-size": "18px",
                        }}
                      >
                        {product.countInStock}
                      </p>
                    </td>
                    <td>{new Date(product.createdAt).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No out-of-stock products available
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </Container>
    </div>
  );
};

export default DashboardScreen;
