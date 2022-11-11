import React from "react";
import { CgMouse } from "react-icons/cg";
import PageTitle from "../layout/PageTitle/PageTitle";
import "./Home.css";
import ProductCard from "./ProductCard.js";
import Loader from "../layout/Loader/Loader";
import { useNavigate } from "react-router-dom";
import { useGetAllProducts4HomeQuery } from "../../reducers/productsReducer/products4HomeAPI";

const Home = () => {
  const navigate = useNavigate();
  

  const { data, error, isLoading } = useGetAllProducts4HomeQuery();
  const { products } = data || {};
  

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <PageTitle title={"Home"} />
          <div className="banner">
            <p>Welcome to</p>
            <h1>6 Pack Projects</h1>
            <a href="#displayContainer">
              <button>
                Scroll <CgMouse />
              </button>
            </a>
          </div>

          <h2 className="homeHeading">Featured Products</h2>

          <div className="displayContainer" id="displayContainer">
            {products &&
              products
                .slice(0, 4)
                .map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
          </div>

          <p style={{ textAlign: "center" }}>
            <button
              className="submitReview"
              onClick={() => navigate("/products")}
            >
              See more ...
            </button>
          </p>
        </>
      )}
    </>
  );
};

export default Home;
