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

  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(3);
  const [noOfPages, setNoOfPages] = useState(0);

  if (page > noOfPages) {
    setPage(noOfPages - 1);
  }
  if (page < 0) {
    setPage(0);
  }

  useEffect(() => {
    if (error) {
      toast.error(error, { id: "fetchAllProducts_error" });
      dispatch(clearFetchAllProductsErrors());
    }
    dispatch(fetchAllProducts({ keyWord, page, limit }));

    setNoOfPages(Math.ceil(productsCount / limit));
  }, [dispatch, error, keyWord, page, limit, productsCount, noOfPages]);
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
