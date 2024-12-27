import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { setActiveLink, playSound } from "../slices/soundSlice"; 
import { useDispatch } from "react-redux";

const SearchBox = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { keyword: urlKeyword } = useParams();
  const [keyword, setKeyword] = useState(urlKeyword || "");

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      dispatch(setActiveLink(`/search/${keyword}`));
      dispatch(playSound("mouseSound"));
      navigate(`/search/${keyword}`);
      setKeyword(""); 
    } else {
      navigate("/");
    }
  };

  return (
    <Form onSubmit={submitHandler} className="d-flex m-2">
      <Form.Control
        type="text"
        name="q"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Search..."
        className="mr-sm-2 ml-sm-5"
      />
      <Button type="submit" variant="outline-light" className="p-2 ms-2">
        Search
      </Button>
    </Form>
  );
};

export default SearchBox;
