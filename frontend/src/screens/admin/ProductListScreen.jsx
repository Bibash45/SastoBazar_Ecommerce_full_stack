import React, { useState } from "react";
import { Table, Button } from "react-bootstrap";
import { Link, useLocation, useParams } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
} from "../../slices/productsApiSlice";
import HeaderWithSearchAndFilter from "../../components/admin/HeaderWithSearchAndFilter";
import ProductPaginate from "../../components/admin/ProductPaginate";

const ProductListScreen = () => {
  const location = useLocation();
  const { keyword } = useParams();
  const queryParams = new URLSearchParams(location.search);
  const minPrice = Number(queryParams.get("minPrice"));
  const maxPrices = Number(queryParams.get("maxPrice"));
  const minRating = Number(queryParams.get("minRating"));
  const pageNumber =
    Number(queryParams.get("pageNumber")) === 0
      ? 1
      : Number(queryParams.get("pageNumber"));
  const category = queryParams.get("category");

  const maxPrice = maxPrices === 0 ? null : maxPrices;

  const { data, isLoading, error, refetch } = useGetProductsQuery({
    pageNumber,
    keyword,
    category,
    minPrice,
    maxPrice,
    minRating,
  });

  const [createProduct, { isLoading: loadingCreate }] =
    useCreateProductMutation();

  const [deleteProduct, { isLoading: loadingDelete }] =
    useDeleteProductMutation();

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this product ?")) {
      try {
        await deleteProduct(id);
        toast.success("Product deleted");
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const [hoveredImage, setHoveredImage] = useState(null);

  return (
    <>
      <div
        style={{
          overflowY: "auto",
          paddingLeft: "250px",
        }}
      >
        <marquee>
          <h1>Product list</h1>
        </marquee>
        <HeaderWithSearchAndFilter />
        {loadingCreate && <Loader />}
        {loadingDelete && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger" className="text-center">
            {error.data.message}
          </Message>
        ) : (
          <>
            <Table striped hover responsive className="table-sm border rounded">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>IMAGES</th>
                  <th>NAME</th>
                  <th>PRICE</th>
                  <th>STOCK</th>
                  <th>CATEGORY</th>
                  <th>BRAND</th>
                  <th>Rating</th>
                  <th>Views</th>
                  <th className="text-center">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {data.products.map((product) => (
                  <tr key={product._id} className="align-middle">
                    <td>{product._id}</td>
                    <td>
                      <div
                        className="d-flex justify-content-center  "
                        onMouseLeave={() => setHoveredImage(null)}
                      >
                        {product.images.map((img, index) => (
                          <img
                            key={index}
                            src={`/${img}`}
                            alt={`Product ${index + 1}`}
                            className="thumbnail"
                            onMouseEnter={() =>
                              setHoveredImage(`/${img}`)
                            }
                          />
                        ))}
                        {hoveredImage && (
                          <div className="hover-image">
                            <img src={hoveredImage} alt="Hovered" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td>{product.name}</td>
                    <td>${product.price.toFixed(2)}</td>
                    <td>{product.countInStock}</td>
                    <td>{product?.category?.category_name || ""}</td>
                    <td>{product.brand}</td>
                    <td>{product.rating}</td>
                    <td>{product.numReviews}</td>
                    <td className="text-center">
                      <Link to={`/admin/product/${product._id}/edit`}>
                        <Button variant="info" className="btn-sm me-2">
                          <FaEdit />
                        </Button>
                      </Link>
                      <Button
                        variant="danger"
                        className="btn-sm"
                        onClick={() => deleteHandler(product._id)}
                      >
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <ProductPaginate
              pages={data.pages}
              page={data.page}
              isAdmin={true}
            />
          </>
        )}
      </div>
    </>
  );
};

export default ProductListScreen;
