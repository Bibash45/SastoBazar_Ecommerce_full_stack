import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import Rating from "./Rating";
import { useDispatch } from "react-redux";
import { playSound } from "../slices/soundSlice";

const Product = ({ product }) => {
  const dispatch = useDispatch();

  const handleSound = () => {
    dispatch(playSound("cardSound"));
  };

  console.log(product);
  

  return (
    <Card className="my-3 p-3 rounded" onClick={handleSound}>
      <Link to={`/product/${product._id}`}>
        <Card.Img
          src={`/${product.images[0]}`}
          variant="top"
        />
      </Link>

      <Card.Body>
        <Link to={`/product/${product._id}`}>
          <Card.Title as="div" className="product-title">
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>

        <Card.Text as="div">
          <Rating
            value={product.rating}
            text={`${product.numReviews} review`}
          />
        </Card.Text>

        <Card.Text as="h3">${product.price}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Product;
