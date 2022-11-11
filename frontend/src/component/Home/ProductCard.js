import React from 'react';
import ReactStars from "react-rating-stars-component";
import { Link } from 'react-router-dom';
import "./ProductCard.css"




const ProductCard = ({ product }) => {
    // console.log(product);
    const options = {
        count: 5,
        value: product.ratings,
        edit: false,
        size: window.innerWidth < 768 ? 12 : 20,
        isHalf: true,
        activeColor: "#eb4034",
    }
    return (
        <Link className="productCard" to={`/product/${product._id}`}>
            <img src={product.images[0].url} alt={product.name} />
            <p>{product.name}</p>
            <div>
                <ReactStars {...options} />{" "}
                <span className="productCardSpan">
                    {" "}
                    ({product.numOfReviews} Reviews)
                </span>
            </div>
            <span>{`৳${product.price}`}</span>
        </Link>
    );
};

export default ProductCard;