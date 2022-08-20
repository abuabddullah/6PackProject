## 11_Components Footer, Home, React rating stars component

### React rating stars component : [5:08:31 - 5:11:48]
>
>> _এবার আমরা **ProductCard** component এর ভিতরে react-rating use করব_
>>
>>> **ProductCard** component টা হচ্ছে মুলত **_Home.js_** component এর ভিতরে single product এর জন্য যে component নেয়া হয়েছে সেটা


1. প্রথমে terminal দিয়ে "6PP_ECOMMERCE/**_frontend_**" folder এ npm দিয়ে **react-rating-stars-component** dependency install করতে হবে । এর পর app টাকে command এর সাহায্যে start করতে হবে

>
>> **_react-rating-stars-component_**  কে পরবর্তিতে delete করে **miui** এর star rating element use করা হবে

####
```http
[[FOLDERNAME : 6PP_ECOMMERCE/frontend]
""""""""""""""""""""""""""""""""""""""""""""""""""
npm i react-rating-stars-component

npm start
```
####


2. এবার 6PP_ECOMMERCE/frontend/src/component/Home/**_ProductCard.js_** file এ **_ReactStars_** কে import করে নিয়ে তারপর তারজন্য fixed requirement গুলো নিয়ে একটা **_options_** variable বানাব। এরপর এই **_options_** সহ **_ReactStars_** কে প্রয়োজন অনুযায়ি জায়গা মত invoke করব

>
>> এখানে **edit** কে **false** রাখা হয়েছে কারন card এ শুধু যত ratings already আছে তা দেখানো হবে কোন rating নেয়া হবে না যেখানে rating নেয়া হবে সেখানে **_edit : true _**হবে

####
```http
[[FOLDERNAME : 6PP_ECOMMERCE/frontend/src/component/Home/ProductCard.js]
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
import React from 'react';
import ReactStars from "react-rating-stars-component";
import { Link } from 'react-router-dom';
import "./ProductCard.css"




const ProductCard = ({ product }) => {
    const options = {
        count: 5,
        value: product.rating,
        edit: false,
        size: window.innerWidth < 768 ? 12 : 20,
        isHalf: true,
        activeColor: "#eb4034",
    }
    return (
        <Link className="productCard" to={`/product/${product._id}`}>
            <img src={product.image} alt={product.name} />
            <p>{product.name}</p>
            <div>
                <ReactStars {...options} />{" "}
                <span className="productCardSpan">
                    {" "}
                    ({product.numOfReviews} Reviews)
                </span>
            </div>
            <span>{`₹${product.price}`}</span>
        </Link>
    );
};

export default ProductCard;
```
####