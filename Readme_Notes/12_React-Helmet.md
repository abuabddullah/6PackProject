
## 12_React Helmet

### React Helmet : [timestart - timeEnd]
>
>> _**react helmet** library এর সাহায্যে আমরা প্রতিটা individual route এর জন্য specific and unique custom **tittle** set করতে পারি_

1. প্রথমে **_Helmet_** কে import করতে হবে **_react-helmet_** থেকে যা শুরুতেই install করাই আছে তারপর নিচের মত করে **_PageTitle_** component টাকে বানাতে হবে

>
>> এখানে **_title_** props টাকে অবশ্যই **_PageTitle_** component কে invoking এর সময় props drill করে পাঠাতে হবেই

####

```http
[[FOLDERNAME : 6PP_ECOMMERCE/frontend/src/component/layout/PageTitle/PageTitle.js]
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
import React from 'react';
import Helmet from 'react-helmet';

const PageTitle = ({title}) => {
    return (
        <Helmet>
            <title>{title} - 6PP</title>
        </Helmet>
    );
};

export default PageTitle;
```
####

2. এবার যেই যেই **route** এ custom title দরকার সেখানে গিয়ে নিচের মত করে **_PageTitle_** component কে **_title_** props সহ invoke করতে হবে

```http
[[FOLDERNAME : 6PP_ECOMMERCE/frontend/src/component/Home/Home.js]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
import React from 'react';
import { CgMouse } from 'react-icons/cg';
import PageTitle from '../layout/PageTitle/PageTitle';
import "./Home.css"
import ProductCard from "./ProductCard.js";

const products = [
    {
        _id: "1",
        name: "Product 1",
        price: "100",
        description: "This is product 1",
        image: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
        rating: 3.5,
        numOfReviews: 256,
    },{
        _id: "2",
        name: "Product 1",
        price: "100",
        description: "This is product 1",
        image: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
        rating: 3.5,
        numOfReviews: 256,
    },{
        _id: "3",
        name: "Product 1",
        price: "100",
        description: "This is product 1",
        image: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
        rating: 3.5,
        numOfReviews: 256,
    },{
        _id: "3",
        name: "Product 1",
        price: "100",
        description: "This is product 1",
        image: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
        rating: 3.5,
        numOfReviews: 256,
    },{
        _id: "3",
        name: "Product 1",
        price: "100",
        description: "This is product 1",
        image: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
        rating: 3.5,
        numOfReviews: 256,
    },{
        _id: "3",
        name: "Product 1",
        price: "100",
        description: "This is product 1",
        image: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
        rating: 3.5,
        numOfReviews: 256,
    },{
        _id: "3",
        name: "Product 1",
        price: "100",
        description: "This is product 1",
        image: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
        rating: 3.5,
        numOfReviews: 256,
    },
];

const Home = () => {
    return (
        <>
        <PageTitle
        title={'Home'}
        />
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
                    products.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
            </div>
        </>
    );
};

export default Home;
```