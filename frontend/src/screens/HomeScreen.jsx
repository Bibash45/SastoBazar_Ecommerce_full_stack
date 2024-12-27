import React from "react";
import { Row, Col } from "react-bootstrap";
import { Link, useLocation, useParams } from "react-router-dom";
import Product from "../components/Product";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useGetProductsQuery } from "../slices/productsApiSlice";
import Paginate from "../components/Paginate";
import ProductCarousel from "../components/ProductCarousel";
import Meta from "../components/Meta";

const HomeScreen = () => {
  const { keyword = "" } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const pageNumber =
    Number(queryParams.get("pageNumber")) === 0
      ? 1
      : Number(queryParams.get("pageNumber"));
  const { data, isLoading, error } = useGetProductsQuery({
    keyword,
    pageNumber,
  });

  return (
    <>
      <Meta title="SastoBazaar" />
      {!keyword ? (
        <ProductCarousel />
      ) : (
        <Link to="/" className="btn btn-light mb-4">
          Go Back
        </Link>
      )}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error?.error}
        </Message>
      ) : (
        <>
          <h1>Latest Product</h1>
          <Row>
            {data.products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Paginate
            pages={data.pages}
            page={data.page}
            keyword={keyword ? keyword : ""}
          />
        </>
      )}
    </>
  );
};

export default HomeScreen;
