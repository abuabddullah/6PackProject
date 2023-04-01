## 14_MUI-Carousel,Paginition,Search,Filtering

> > using MUI to design component Paginition,Search,Filtering

### installing React Material UI Carousel : [6:05:02 - timeEnd]

1. **React Material UI Carousel** কে use করার জন্য নিম্নোক্ত package গুলা **fronend** folder এর terminal এ installed থাকতে হবে

####

```http
[[FOLDERNAME : 6PP_ECOMMERCE/frontend]
""""""""""""""""""""""""""""""""""""""""""""""""""
npm i react-material-ui-carousel

npm install @mui/material
npm install @mui/icons-material
npm install @mui/styles
```

####

### using React Material UI Carousel in SingleProductDetails Component

2. **Carousel** কে **React Material UI Carousel** থেকে import করে নিচের মত করে use করতে হবে

####

```http
[[FOLDERNAME : 6PP_ECOMMERCE\frontend\src\component\Product\SingleProductDetails.js]
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
 import React, { useEffect } from 'react';
import Carousel from 'react-material-ui-carousel'


 const SingleProductDetails = () => {
 return (
        <>
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
        </>
    );
};

export default SingleProductDetails;
```

####

### implementing MUI- Search in Search component : [6:42:12 - timeEnd]

3. প্রথমে প্রয়োজনিয় data আর design দিয়ে component কে সাজাতে হবে

> > এখানে **_Search.js_** component এ আপাতত কেবল একটা form নেয়া হয়েছে যেখানে **Search-button** click করলে input এর লিখাটা **console** এ দেখাবে

####

```http
[[FOLDERNAME : 6PP_ECOMMERCE\frontend\src\component\Product\Search.js]
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
import React, { useState } from 'react';
import PageTitle from '../layout/PageTitle/PageTitle';
import "./Search.css";

const Search = () => {
    const [keyword, setKeyword] = useState('');
    const searchSubmitHandler = (e) => {
        e.preventDefault();
        console.log(keyword);
    }
    return (
        <>
            <PageTitle title="Search A Product" />
            <form className="searchBox" onSubmit={searchSubmitHandler}>
                <input
                    type="text"
                    placeholder="Search a Product ..."
                    onChange={(e) => setKeyword(e.target.value)}
                />
                <input type="submit" value="Search" />
            </form>
        </>
    );
};

export default Search;
```

####

4. এবার **_useNavigate()_** hook এর সাহায্যে **keyWord** এর উপর basis করে **location** কে navigate করব

> > এখানে **_navigate_** কিন্তু **keyWord.trim()** এর উপর করা হয়েছে কারন এই **_.trime()_** method টা কোন **string** এর আগে ও পরের সব **whitespace** থাকে তা out করে দিয়ে exact keyword টা পেতে সাহায্যে করে
>
> > **_useHistory() & history.push()_** is replaced by **_useNavigate() & navigate()_**

####

```http
[[FOLDERNAME : 6PP_ECOMMERCE\frontend\src\component\Product\Search.js]
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTitle from '../layout/PageTitle/PageTitle';
import "./Search.css";

const Search = () => {
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState('');
    const searchSubmitHandler = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            navigate(`/products/${keyword}`);
        } else {
            navigate("/products");
        }
    }
    return (
        <>
            <PageTitle title="Search A Product" />
            <form className="searchBox" onSubmit={searchSubmitHandler}>
                <input
                    type="text"
                    placeholder="Search a Product ..."
                    onChange={(e) => setKeyword(e.target.value)}
                />
                <input type="submit" value="Search" />
            </form>
        </>
    );
};

export default Search;
```

####

5. এবার **_App.js_** file এ এই **navigation** এর against এ **route** বানাতে হবে যেন সেটা **Products** component এ যায়

####

```http
[[FOLDERNAME : 6PP_ECOMMERCE/frontend\src\App.js]
""""""""""""""""""""""""""""""""""""""""""""""""""
import './App.css';
import Header from "./component/layout/Header/Header.js"
import Footer from "./component/layout/Footer/Footer.js"
import NotFound from "./component/layout/NotFound/NotFound.js"
import Home from "./component/Home/Home.js"
import { Route, Routes, useRoutes } from 'react-router-dom';
import WebFont from "webfontloader";
import { useEffect } from 'react';
import SingleProductDetails from './component/Product/SingleProductDetails';
import Products from './component/Product/Products.js';
import Search from './component/Product/Search.js';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  //loading font from webfontloader
  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      }
    });
  }, []);

  return (
    <div className="App56fg1h">
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />


        <Route path="/products" element={<Products />} />
        <Route path="/products/:keyWord" element={<Products />} />


        <Route path="/product/:_id" element={<SingleProductDetails />} />

        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />


      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default App;

```

####

6. তারপর **Products** component এ **_useParams_** hook use করে searching **_keyWord_** কে বের করে নিয়ে আসব আর **_fetchAllProducts()_** action কে dispatch করার সময় এই **_keyWord_** কে **argument** হিসেবে pass করে দিব

####

```http
[[FOLDERNAME : 6PP_ECOMMERCE/frontend\src\component\Product\Products.js]
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { fetchAllProducts } from '../../reducers/productsReducer/productsActions';
import { clearAllProductsErrors } from '../../reducers/productsReducer/productsSlice';
import ProductCard from '../Home/ProductCard';
import Loader from '../layout/Loader/Loader';
import PageTitle from '../layout/PageTitle/PageTitle';
import "./Products.css";

const Products = () => {
    const {keyWord} = useParams();
    const { resultPerPage, productsCount, products, error, isLoading } = useSelector(store => store.products);
    const dispatch = useDispatch();

    useEffect(() => {
        if (error) {
            toast.error(error, { id: 'fetchAllProducts_error' });
            dispatch(clearAllProductsErrors());
        }
        dispatch(fetchAllProducts(keyWord));
    }, [dispatch, error,keyWord]);
    return (
        <>
            {isLoading ? <Loader /> : <>
                <PageTitle title="PRODUCTS" />
                <h2 className="productsHeading">Products</h2>

                <div className="products">
                    {products &&
                        products.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                </div>
            </>}
        </>
    );
};

export default Products;
```

####

7. তারপর **productsActions** file এর **_fetchAllProducts_** action-function এ **_keyWord_** parameter কে recive করাব আর এই **_keyWord_** এর সাপেক্ষেই **fetching** করাব

> > আগে যখন সরাসরি all product fetching হচ্ছিল তখন কোন parameter দেয়া লাগে নাই কিন্তু এখন যেহেতু **search** feature implement করেছি তাই **_keyWord_** এর সাপেক্ষেই **fetching** করাতে হবে
>
> > **_keyWord_** parameter এর initial value **খালি string** দেয়া হয়েছে যাতে কোন keyWord না থাকলে automatically সব products চলে আসে কোন **error** না খায়

####

```http
[[FOLDERNAME : 6PP_ECOMMERCE/frontend\src\reducers\productsReducer\productsActions.js]
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
import { createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";



// export const fetchAllProducts = createAsyncThunk("products/fetchAllProducts", async () => {
//     const { data } = await axios.get("https://sixpackproject-qnef.onrender.comapi/v1/products");
//     return data;
// })

export const fetchAllProducts = createAsyncThunk("products/fetchAllProducts", async (keyWord="") => {
    try {
        const { data } = await axios.get(`https://sixpackproject-qnef.onrender.comapi/v1/products?keyword=${keyWord}`);
        return data;
    } catch (err) {
        return err.message;
    }
})



export const fetchProductById = createAsyncThunk("productDetails/fetchProductById", async (id) => {
    try {
        const { data } = await axios
        .get(`https://sixpackproject-qnef.onrender.comapi/v1/product/${id}`);
        return data.product;
    } catch (err) {
        return err.message;
    }
})
```

####

### Pagination,Filter (By priceRange+ratings+category) : [6:49:56 - 06:59:00]

> যদিও ভিডিওতে **_pagination_** এর জন্য custom library use করেছে but আমি manual pagination componnet use করেছি

8. **_pagination_** এর জন্য প্রথমে একটা **_ProductsPagination_** component বানাব যেটা props হিসেবে **setPage,page,noOfPages,setLimit** এদের recive করে তারপর প্রয়োজন মত design করে নিব নিচের code follow করে

####

```http
[[FOLDERNAME : frontend\src\component\Product\ProductsPagination.js]
""""""""""""""""""""""""""""""""""""""""""""""""""
import React from "react";

const ProductsPagination = ({setPage,page,noOfPages,setLimit}) => {
  return (
    <div className="pagination">
      <>
        <button onClick={() => setPage(0)}>⇤</button>
        <button disabled={page === 0} onClick={() => setPage(page - 1)}>
          «
        </button>
        {[...Array(noOfPages).keys()].map((pNum, index) => (
          <button
            key={index}
            className={page === pNum ? "selected" : ""}
            onClick={() => setPage(pNum)}
          >
            {pNum + 1}
          </button>
        ))}
        <button
          disabled={page === noOfPages - 1}
          onClick={() => setPage(page + 1)}
          className="btn btn-primary text-white"
        >
          »
        </button>
        <button onClick={() => setPage(noOfPages - 1)}>⇥</button>
      </>
      <select onChange={(e) => setLimit(e.target.value)}>
        <option value="3" selected>
          3
        </option>
        <option value="6">6</option>
        <option value="9">9</option>
        <option value="12">12</option>
      </select>
    </div>
  );
};

export default ProductsPagination;

```

####

9. **Price-range** এর জন্য **useState([])** এর সাহায্যে initial price declare করবে তারপর MUI এর react slider for range-slider use করব যার সাহায্যে custom price range সেট করা যাবে
10. একই ভাবে **Ratings** এর জন্য **useState(0)** এর সাহায্যে initial ratings declare করবে তারপর MUI এর react slider for contiouns-slider use করব যার সাহায্যে custom ratings range সেট করা যাবে
11. **Category** array declare করে তাকে map করে **useState("")** এর সাহায্যে Select-option এর category selection এর ব্যাবস্থা করব
12. তারপর **dispatch** করার সময় **_keyWord, page, limit_** এর পাশাপাশি **_price,ratings, category_** কেউ দিয়ে দিব তদানুযায়ী data backend থেকে fetching করার জন্য

```http
filePath: frontend\src\component\Product\Products.js;
""""""""""""""""""""""""""""""""""""""""""""""""""""""

import { Slider, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchAllProducts } from "../../reducers/productsReducer/productsActions";
import { clearAllProductsErrors } from "../../reducers/productsReducer/productsSlice";
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
      dispatch(clearAllProductsErrors());
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




```

13. এরপর **_productsActions.js_** file এ **_fetchAllProducts_** functin এও **_keyWord, page, limit_** এর পাশাপাশি **_price,ratings, category_** কে default value declareing এর মাধ্যমে parameter হিসেবে recieve করা হবে আর তদানুযায়ী **_link_** কে modify করা হবে
    > > এখানে **price** এর range অনুযায়ী **[gte] & [lte]** key use করা হয়েছে
    >
    > > আর ratings এর জন্য আমরা যেহেতু একটা minimum ratings কে mention করে বলে দিতে চাই যে এত ratings এর উপরের জিনিস দেখাতে তাই শুধু **[gte]** key use করা হয়েছে
    >
    > > অন্যদিকে যদি কেবল **_category_** select করা হয় তখনি কেবল **_link_** এর শেষে **categroy** key কেও use করা হবে

```http
filePath: frontend\src\reducers\productsReducer\productsActions.js
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";



// export const fetchAllProducts = createAsyncThunk("products/fetchAllProducts", async () => {
//     const { data } = await axios.get("https://sixpackproject-qnef.onrender.comapi/v1/products");
//     return data;
// })


export const fetchAllProducts = createAsyncThunk("products/fetchAllProducts", async ({keyWord="",page=1,limit=3,price=[0,25000],ratings=0,category}) => {
    try {
        let link = `https://sixpackproject-qnef.onrender.comapi/v1/products?keyword=${keyWord}&page=${page}&limit=${limit}&price[gte]=${price[0]}&price[lte]=${price[1]}&ratings[gte]=${ratings}`

        if(category && category !== "All"){
            link += `&category=${category}`
        }
        const { data } = await axios.get(link);
        return data;
    } catch (err) {
        return err.message;
    }
})



export const fetchProductById = createAsyncThunk("productDetails/fetchProductById", async (id) => {
    try {
        const { data } = await axios
        .get(`https://sixpackproject-qnef.onrender.comapi/v1/product/${id}`);
        return data.product;
    } catch (err) {
        return err.message;
    }
})

```
