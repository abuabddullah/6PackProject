import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { removeFromCart } from "../../reducers/productsReducer/cartSlice";

const CartItemCard = ({ item }) => {
  const dispatch = useDispatch();
  return (
    <div className="CartItemCard">
      <img src={item.images[0].url} alt="ssa" />
      <div>
        <Link to={`/product/${item._id}`}>{item.name}</Link>
        <span>{`Price: $${item.price}`}</span>
        <p onClick={() => dispatch(removeFromCart(item))}>Remove</p>
      </div>
    </div>
  );
};

export default CartItemCard;
