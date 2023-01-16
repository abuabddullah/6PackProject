import React, { useEffect, useState } from "react";
import "./SingleProductDetails.css";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchProductById } from "../../reducers/productsReducer/productsActions";

import Carousel from "react-material-ui-carousel";
import PageTitle from "../layout/PageTitle/PageTitle";
import ReactStars from "react-rating-stars-component";
import Loader from "../layout/Loader/Loader";
import { toast } from "react-toastify";
import { clearFetchSingleProductErrors } from "../../reducers/productsReducer/singleProductSlice";
import ReviewCard from "./ReviewCard.js";
import { addToCart } from "../../reducers/productsReducer/cartSlice";

const SingleProductDetails = () => {
  const { _id } = useParams();
  const dispatch = useDispatch();
  const { product, isLoading, error } = useSelector(
    (store) => store.productDetails
  );
  const [quantity, setQuantity] = useState(1);

  const increaseQty = () => {
    if (quantity >= product.Stock) return;
    const qty4cart = quantity + 1;
    setQuantity(qty4cart);
  };
  const decreaseQty = () => {
    if (quantity <= 1) return;
    const qty4cart = quantity - 1;
    setQuantity(qty4cart);
  };

  const handleAddToCart=()=>{
    dispatch(addToCart({product,quantity}));
  }

  useEffect(() => {
    if (error) {
      toast.error(error, { id: "fetchProductById_error" });
      dispatch(clearFetchSingleProductErrors());
    }
    dispatch(fetchProductById(_id));
  }, [dispatch, _id, error]);

  const options = {
    count: 5,
    value: product.ratings,
    edit: false,
    size: window.innerWidth < 768 ? 12 : 20,
    isHalf: true,
    activeColor: "#eb4034",
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <PageTitle title={`${product.name}`} />
          <div className="ProductDetails">
            <div>
              <Carousel>
                {product.images &&
                  product.images.map((item, i) => (
                    <img
                      className="CarouselImage"
                      key={i}
                      src={item.url}
                      alt={`${i} Slide`}
                    />
                  ))}
              </Carousel>
            </div>

            <div>
              <div className="detailsBlock-1">
                <h2>{product.name}</h2>
                <p>Product # {product._id}</p>
              </div>
              <div className="detailsBlock-2">
                <ReactStars {...options} />
                <span className="detailsBlock-2-span">
                  {" "}
                  ({product.numOfReviews} Reviews)
                </span>
              </div>
              <div className="detailsBlock-3">
                <h1>{`₹${product.price}`}</h1>
                <div className="detailsBlock-3-1">
                  <div className="detailsBlock-3-1-1">
                    <button onClick={decreaseQty}>-</button>
                    <input readOnly type="number" value={quantity} />{" "}
                    {/* readOnly defend cursor blinking & type editing */}
                    <button onClick={increaseQty}>+</button>
                  </div>
                  <button 
                  onClick={handleAddToCart}
                  disabled={product.Stock < 1 ? true : false}>
                    Add to Cart
                  </button>
                </div>

                <p>
                  Status:
                  <b className={product.Stock < 1 ? "redColor" : "greenColor"}>
                    {product.Stock < 1 ? "OutOfStock" : "InStock"}
                  </b>
                </p>
              </div>

              <div className="detailsBlock-4">
                Description : <p>{product.description}</p>
              </div>

              <button className="submitReview">Submit Review</button>
            </div>
          </div>

          <h3 className="reviewsHeading">REVIEWS</h3>
          {product.reviews && product.reviews[0] ? (
            <div className="reviews">
              {product.reviews &&
                product.reviews.map((review) => (
                  <ReviewCard key={review._id} review={review} />
                ))}
            </div>
          ) : (
            <p className="noReviews">No Reviews Yet</p>
          )}
        </>
      )}
    </>
  );
};

export default SingleProductDetails;
