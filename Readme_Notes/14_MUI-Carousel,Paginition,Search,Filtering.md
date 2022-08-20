## 14_MUI-Carousel,Paginition,Search,Filtering

>
>> using MUI to design component Paginition,Search,Filtering

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

>
>> এখানে **_Search.js_** component এ আপাতত কেবল একটা form নেয়া হয়েছে যেখানে **Search-button** click করলে input এর লিখাটা **console** এ দেখাবে

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

>
>> এখানে **_navigate_** কিন্তু **keyWord.trim()** এর উপর করা হয়েছে কারন এই **_.trime()_** method টা কোন **string** এর আগে ও পরের সব **whitespace** থাকে তা out করে দিয়ে exact keyword টা পেতে সাহায্যে করে
>
>> **_useHistory() & history.push()_** is replaced by **_useNavigate() & navigate()_**

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
import { clearFetchAllProductsErrors } from '../../reducers/productsReducer/productsSlice';
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
            dispatch(clearFetchAllProductsErrors());
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


7. তারপর **productsActions** file এর **_fetchAllProducts_** action-function এ **_keyWord_** parameter কে recive করাব আর এই **_keyWord_** এর সাপেক্ষেই **fetching**  করাব

>
>> আগে যখন সরাসরি all product fetching হচ্ছিল তখন কোন parameter দেয়া লাগে নাই কিন্তু এখন যেহেতু **search** feature implement করেছি তাই **_keyWord_** এর সাপেক্ষেই **fetching** করাতে হবে
>
>> **_keyWord_** parameter এর initial value **খালি string** দেয়া হয়েছে যাতে কোন keyWord না থাকলে automatically সব products চলে আসে কোন **error** না খায়

####

```http
[[FOLDERNAME : 6PP_ECOMMERCE/frontend\src\reducers\productsReducer\productsActions.js]
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
import { createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";



// export const fetchAllProducts = createAsyncThunk("products/fetchAllProducts", async () => {
//     const { data } = await axios.get("http://localhost:5000/api/v1/products");
//     return data;
// })

export const fetchAllProducts = createAsyncThunk("products/fetchAllProducts", async (keyWord="") => {
    try {
        const { data } = await axios.get(`http://localhost:5000/api/v1/products?keyword=${keyWord}`);
        return data;
    } catch (err) {
        return err.message;
    }
})



export const fetchProductById = createAsyncThunk("productDetails/fetchProductById", async (id) => {
    try {
        const { data } = await axios
        .get(`http://localhost:5000/api/v1/product/${id}`);
        return data.product;
    } catch (err) {
        return err.message;
    }
})
```
####