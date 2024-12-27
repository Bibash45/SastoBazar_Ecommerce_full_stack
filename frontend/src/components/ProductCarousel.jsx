import React from "react";
import { Link } from "react-router-dom";
import { Carousel, Image } from "react-bootstrap";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useGetTopProductsQuery } from "../slices/productsApiSlice";
import { useDispatch } from "react-redux";
import { playSound } from "../slices/soundSlice";

const ProductCarousel = () => {
  const dispatch = useDispatch();

  const handleSound = () => {
    dispatch(playSound("cardSound")); 
  };
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error?.data?.message || error.error || "An error occurred"}</Message>
  ) : (
    products && products.length > 0 ? (
      <Carousel pause="hover" className="bg-primary mb-4">
        {products.map((product) => (
          <Carousel.Item key={product._id}>
            <Link to={`/product/${product._id}`} className="nav-link" onClick={handleSound}>
              {/* Add responsive styles */}
              <Image
                src={product.images[0]}
                alt={product.name}
                fluid
                className="d-block mx-auto"
                style={{ maxHeight: "450px", objectFit: "contain" }}
              />
              <Carousel.Caption className="carousel-caption">
                <h2>
                  {product.name} (${product.price})
                </h2>
              </Carousel.Caption>
            </Link>
          </Carousel.Item>
        ))}
      </Carousel>
    ) : (
      <Message variant="info">No top products found</Message>
    )
  );
};

export default ProductCarousel;
