import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Line, Pie } from "react-chartjs-2";

const ReportsScreen = () => {
  const [salesData, setSalesData] = useState([]);
  const [ordersData, setOrdersData] = useState([]);

  //   useEffect(() => {
  //     // Fetch data from API
  //     fetchSalesData();
  //     fetchOrdersData();
  //   }, []);

  const fetchSalesData = async () => {
    // Example: Fetch sales data from backend
    const response = await fetch("/api/reportsScreenReportsScreen/sales");
    const data = await response.json();
    setSalesData(data);
  };

  const fetchOrdersData = async () => {
    // Example: Fetch orders data
    const response = await fetch("/api/reportsScreenReportsScreen/orders");
    const data = await response.json();
    setOrdersData(data);
  };

  return (
    <Container
      style={{
        paddingLeft: "250px",
      }}
    >
      <h1>ReportsScreen</h1>
      <Row>
        {/* Sales Report */}
        <Col md={6}>
          <h3>Sales Trend</h3>
          <Line
            data={{
              labels: salesData.map((item) => item.date),
              datasets: [
                {
                  label: "Revenue",
                  data: salesData.map((item) => item.revenue),
                  borderColor: "rgba(75, 192, 192, 1)",
                  backgroundColor: "rgba(75, 192, 192, 0.2)",
                  fill: true,
                },
              ],
            }}
          />
        </Col>

        {/* Orders Report */}
        <Col md={6}>
          <h3>Order Status</h3>
          <Pie
            data={{
              labels: ["Pending", "Completed", "Canceled"],
              datasets: [
                {
                  data: ordersData.map((status) => status.count),
                  backgroundColor: ["#ffc107", "#28a745", "#dc3545"],
                },
              ],
            }}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default ReportsScreen;
