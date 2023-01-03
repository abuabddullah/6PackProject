import { Slider, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchAllProducts } from "../../reducers/productsReducer/productsActions";
import { clearFetchAllProductsErrors } from "../../reducers/productsReducer/productsSlice";
import ProductCard from "../Home/ProductCard";
import Loader from "../layout/Loader/Loader";
import PageTitle from "../layout/PageTitle/PageTitle";
import "./Products.css";
import ProductsPagination from "./ProductsPagination";

const Products = () => {
  const { keyWord } = useParams();
  const { productsCount, products, error, isLoading } = useSelector(
    (store) => store.products
  );
  const dispatch = useDispatch();

  // for pagination
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(3);
  const [noOfPages, setNoOfPages] = useState(0);

  if (page > noOfPages) {
    setPage(noOfPages - 1);
  }
  if (page < 0) {
    setPage(0);
  }

  // for price range
  const [price, setPrice] = useState([0, 250000]);
  const handlePriceRange = (event, newValue) => {
    setPrice(newValue);
  };

  // for rating
  const [ratings, setRatings] = useState(0);

  // for category
  const categories = [
    "All",
    "Laptops",
    "Footwear",
    "Bottoms",
    "Tops",
    "Attire",
    "Camera",
    "Smartphones",
    "Watches",
    "Headphones",
  ];
  const [category, setCategory] = useState("");

  // dispatching fetchAllProducts action
  useEffect(() => {
    if (error) {
      toast.error(error, { id: "fetchAllProducts_error" });
      dispatch(clearFetchAllProductsErrors());
    }
    dispatch(fetchAllProducts({ keyWord, page, limit, price,ratings, category }));

    setNoOfPages(Math.ceil(productsCount / limit));
  }, [
    dispatch,
    error,
    keyWord,
    page,
    limit,
    productsCount,
    noOfPages,
    price,
    ratings,
    category,
  ]);
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <PageTitle title="PRODUCTS" />
          <h2 className="productsHeading">Products</h2>

          <div className="products">
            {products &&
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
          </div>
        </>
      )}

      <div className="filterBox">
        <Typography>Price</Typography>
        <Slider
          size="small"
          value={price}
          onChange={handlePriceRange}
          // valueLabelDisplay="on" // "on" always shows the value on the slider
          valueLabelDisplay="auto" // "auto" shows the value on the slider when the user is interacting with it
          aria-labelledby="range-slider"
          min={0}
          max={25000}
        />

        <Typography>Category</Typography>
        <ul className="categoryBox">
          {categories.map((category) => (
            <li
              className="category-link"
              key={category}
              onClick={() => setCategory(category)}
            >
              {category}
            </li>
          ))}
        </ul>

        <fieldset>
          <Typography component="legend">Ratings Above</Typography>
          <Slider
            size="small"
            value={ratings}
            onChange={(e, newRatings) => setRatings(newRatings)}
            aria-labelledby="continous-slider"
            min={0}
            max={5}
            valueLabelDisplay="auto"
          />
        </fieldset>
      </div>

      {limit < productsCount && (
        <ProductsPagination
          setPage={setPage}
          page={page}
          noOfPages={noOfPages}
          setLimit={setLimit}
        />
      )}
    </>
  );
};

export default Products;
