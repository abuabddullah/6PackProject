# redux-toolkit (React Counter App)

### step-1 : Creating couterSlice.js file : [Redux-toolkit bangla tutorial 12 - 6df5g5df56gdfgd6g4df]

1. প্রথমে terminal দিয়ে **_react-redux-thunk-toolkit_** folder এ react readux এবং react redux tool kit টা আমাদের project এ install করে নিতে হবে

####

```http
[[FOLDERNAME : react-redux-thunk-toolkit/]
""""""""""""""""""""""""""""""""""""""""""""""""""
npm i react-redux  @reduxjs/toolkit
```

####

2. counter app এর জন্য react-redux-thunk-toolkit/src/components/counter/**_counterSlice.js_** file বানাতে হবে । এরপর **_createSlice_** কে import করে **_createSlice({name,initialState,reducers})_** method এর সাহায্যে counter app এর জন্য **_counterSlice_** variable বানাতে হবে

> > createSlice **_sliceName, initialStateOfREQUIREMENTS, actions, reducer_** গুলোকে redux-toolkit এর সাহায্যে একটু নতুন ধাচে একটা object এর key-value pair হিসেবে declare করতে হবে এবং **slice file** declare করার সময় অবশ্যই **_Slice.js_** word টা থাকতে হবে। এটা করার ফলে আমরা এই slice টা থেকে ২ টা জিনিস পাব **actions function** এবং **reducer function** এবং কোন **constant** type কে define করা লাগবে না
>
> > মনে রাখতে হবে এখানের ব্যবহৃত **_createSlice_** method এর কিছু fixed key আছে **({name, initialState, reducers})** আর reducers এর যে state parameter আছে তার value ও এর "name.initialState" । অর্থাৎ,
> >
> > > **_state.value == initialState.value_**

####

```http
[[FOLDERNAME : react-redux-thunk-toolkit/src/components/counter/counterSlice.js]
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
import {createSlice} from '@reduxjs/toolkit';

export const counterslice = createSlice({
    name: 'counter',
    initialState: {
        value: 0,
        by: 1
    },
    reducers: {
        increment: (state, action) => {
            state.value += state.by;
        },
        decrement: (state, action) => {
            state.value -= state.by;
        },
        incrementByAmount: (state, action) => {
            state.value += action.payload;
        },
        decrementByAmount: (state, action) => {
            state.value -= action.payload;
        },
        reset: (state, action) => {
            state.value = 0;
        },
    }
})

export const { increment, decrement, incrementByAmount, decrementByAmount, reset } = counterslice.actions;

export default counterslice.reducer;
```

####

3. এর পরে এই **counterSlice** ফাইল থেকে ৩ টা জিনিস কে export করতে হবে **(slice-variable,action-functions,reducer)** যাতে অন্যন্য component থেকে এদের access পাও্যা যায়,

### step-2 : Creating store.js file

4. এবার আমাদের react-redux-thunk-toolkit/src/app/**_store.js_** file এ **_configureStore_** method use করে **store** create করতে হবে । এজন্য **configureStore** কে import করে নিয়ে **_configureStore({reducer:{reducer1,reducer2}})_** method এর সাহায্যে একটা **store** variable বানাতে হবে এবং সবার শেষে একে **export default** করতে হবে যাতে অন্যন্য component থেকে এদের access পাও্যা যায়,

> > **_configureStore_** ই মূলত **vanilla Redux** এর **combine-reducers** এর কাজ করে
>
> > এখনো আমরা যেহেতু **_postReducer_** নিয়ে কাজ করছি না তাই একে **comment out** করে দিয়া হয়েছে

####

```http
[[FOLDERNAME : react-redux-thunk-toolkit/src/app/store.js]
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../components/counter/counterSlice";
import postsReducer from "../components/posts/postsSlice";

const store = configureStore({
    reducer: {
        counter: counterReducer,
        <!-- posts: postsReducer, -->
    }
})

export default store;
```

####

### step-3 : Providing store in index.js file

5. এবার **index.js** file এ **store** কে provide করার জন্য, **index.js** file এ **_Provider & store_** কে import করতে হবে তারপর **_APP_** component কে **_<Provider store={store}>_** component দিয়ে wrap করে দিতে হবে ।

> > **step 1** থেকে **step 3** পর্যন্ত আমরা **redux কে existence** এ এনেছি এবার আমাদের **redux এর store** থেকে data কে বিভিন্ন **components এ use** করার পালা

####

```http
[[FOLDERNAME : react-redux-thunk-toolkit/src/index.js]
""""""""""""""""""""""""""""""""""""""""""""""""""""""
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import store from './app/store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

```

####

### step-4 : **redux এর store** থেকে data কে বিভিন্ন **components এ use** করা

6. প্রথমে **_App.js_** file এ **_Counter_** component কে invoke করে এবার তার ভিতরে **layout-styling + reduxing** শুরু করব। এর জন্য **react-redux** থেকে **_useDispatch & useSelector_** এবং **counterSlice.js** file থেকে **_action-functions_** গুলো কে import করে নিব. তারপর নিম্নবর্নিত নিয়মানুযায়ি _redux_ implement করব

> > **useDispatch()** কে invoke করে **_dispatch_** functional-variable create করেছি যার সাহায্যে action-funcitons গুলো কে invoke করা হবে
>
> > > **useSelector** মুলত **_store.js_** file এ যত গুলা reducres আছে সবাইকে একসাথে তার **store** parameter এ return করে তাই optional chaining এর সাহায্যে specific reducer কে target করা হয়,
> >
> > > এই **useSelector** এর **_store.counter.value_** parameter এর **chaining** টা একটু বুঝার আছে,
> > >
> > > > store == reducer: {

        counter: counterReducer,
        posts: postsReducer,
    }

> > > > [[FILENAME : react-redux-thunk-toolkit/src/app/store.js]
> > >
> > > > store.counter == initialState: {

        value: 0,
        by: 1
    }

> > > > [[FILENAME : react-redux-thunk-toolkit/src/components/counter/counterSlice.js]
> > >
> > > > store.counter.value == 0
> > > >
> > > > [[FILENAME : react-redux-thunk-toolkit/src/components/counter/counterSlice.js]

####

```http
[[FOLDERNAME : react-redux-thunk-toolkit/src/components/counter/Counter.jsx]
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { decrement, decrementByAmount, increment, incrementByAmount, reset } from './counterSlice';

const Counter = () => {
    const dispatch = useDispatch();
    const counterValue = useSelector(store => {
        console.log(store)
        return store.counter.value;
    });

    const handleIncrement = () => dispatch(increment());
    const handleDecrement = () => dispatch(decrement());
    const handleReset = () => dispatch(reset());
    const handleIncrementByAmount = () => dispatch(incrementByAmount(5));
    const handleDecrementByAmount = () => dispatch(decrementByAmount(5));

    return (
        <div>
            <h1>Welcome to My Counter APP</h1>
            <h3>{counterValue}</h3>
            <div className='grid grid-cols-1'>
                <button onClick={handleIncrement}>increment</button>
                <button onClick={handleDecrement}>decrement</button>
                <button onClick={handleReset}>reset</button>
                <button onClick={handleIncrementByAmount}>incrementByAmount</button>
                <button onClick={handleDecrementByAmount}>decrementByAmount</button>
            </div>
        </div>
    );
};

export default Counter;
```

####

## redux-toolkit (fetching All Posts By GET API request)

### step-1 : Creating \_Slice.js file : [All same as CounterApp]

1. প্রথমে **_postsSlice.js_** file বানাতে হবে

> > **GET req** এর জন্য যে **_Slice.js_** file বানানো হয় আর normal just **props-handle** resolve করার জন্য যে **_Slice.js_** file বানানো হয় তাদের মাঝেকিছু পার্থক্য আছে,
> >
> > > **GET req** এর **_Slice.js_** file এ,
> > >
> > > > আলাদা করে উপরে **_action-function_** define করে দিতে হয় এই **_action-function_** এই আমরা মুলত API fetching এর কাজ করি,
> > > >
> > > > > **_action-function_** এ **_createAsyncThunk_** middleware use করা হয় যা দুটা parameter নেয়,
> > > > >
> > > > > > প্রথমটাকে বলে **key** যা গঠিত হয় ঃ **postsSlice এর name/action-function এর name**
> > > > >
> > > > > > ২য়টা হচ্ছে fetching করার **async function** । এই **async function** থেকে যাই return পাই তাই ই হচ্ছে **_reducers_** এর ভিতরের **_action_** parameter এর **_payload or error_** এর value. যদি request succesful হয় তাহলে **async function** থেকে যাই return পাই তা **_action.payload_** এ জমা হয় নইলে **_action.error_** এ জমা হয়
> > >
> > > > **_createSlice()_** method এর ভিতরে **fixed-key** হিসেবে **name, initialState,reducers** এর পাশাপাশি **extraReducers** থাকে যার value হচ্ছে একটা **_callBack_** function যা **_builder_** নামের parameter recieve করে যা একটা **object** এবং এর ভিতরের **_addCase_** key এর value আরেকটা function যা আরো দুটা parameter recieve করে,
> > > >
> > > > > প্রথমটা হচ্ছে **fetchPostsActionFunction** এর সাথে **_.pending or .fullfilled or .rejected_** method যুক্ত থাকে যা সাহয্যে **state** এর value গুলোকে modify করা হয়
> > > >
> > > > > 2য়টা হচ্ছে একটা **_callBack_** function যা **_state, action_** নামের ২টা parameter recieve করে যার ভিতরে **state** এর value গুলোকে modify করা হয়

####

```http
[[FOLDERNAME : react-redux-thunk-toolkit/src/components/posts/postsSlice.js]
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";



export const fetchPostsAction = createAsyncThunk("posts/fetchPostsAction", async () => {
    const { data } = await axios.get("https://jsonplaceholder.typicode.com/posts");
    return data;
})
const postsSlice = createSlice({
    name: "posts",
    initialState: {
        posts: [],
        isLoading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchPostsAction.pending, (state, action) => {
            state.isLoading = true;
        });
        builder.addCase(fetchPostsAction.fulfilled, (state, action) => {
            state.isLoading = false;
            state.posts = action.payload;
            state.error = null;
        });
        builder.addCase(fetchPostsAction.rejected, (state, action) => {
            state.isLoading = false;
            state.posts = [];
            state.error = action.error.message;
        });
    }
})

export default postsSlice.reducer;
```

####

### step-2 : Creating store.js file

4. এবার **_store.js_** file এ **_postsSlice_** এর জন্য store বানাতে হবে

> > যদিও আগেই বানানো ছিল এখন শুধু uncomment করে দিয়েছে

####

```http
[[FOLDERNAME : react-redux-thunk-toolkit/src/app/store.js]
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../components/counter/counterSlice";
import postsReducer from "../components/posts/postsSlice";

const store = configureStore({
    reducer: {
        counter: counterReducer,
        posts: postsReducer,
    }
})

export default store;
```

####

### step-3 : Providing store in index.js file [Already done during Counter App]

### step-4 : **redux এর store** থেকে data কে বিভিন্ন **components এ use** করা

6. প্রথমে **_App.js_** file এ **_Posts_** component কে invoke করে এবার তার ভিতরে **layout-styling + reduxing** শুরু করব। এর জন্য **react-redux** থেকে **_useDispatch & useSelector_** এবং **postsSlice.js** file থেকে **_action-function_** কে import করে নিব. তারপর নিম্নবর্নিত নিয়মানুযায়ি _redux_ implement করব

> > **useDispatch()** কে invoke করে **_dispatch_** functional-variable create করেছি যার সাহায্যে action-funcitons গুলো কে invoke করা হবে
>
> > > **useSelector** মুলত **_store.js_** file এ যত গুলা reducres আছে সবাইকে একসাথে তার **store** parameter এ return করে তাই optional chaining এর সাহায্যে specific reducer কে target করা হয়,
> >
> > > এই **useSelector** এর **_store.posts_** parameter এর **chaining** টা একটু বুঝার আছে,
> > >
> > > > store == reducer: {

        counter: counterReducer,
        posts: postsReducer,
    }

> > > > [[FILENAME : react-redux-thunk-toolkit/src/app/store.js]
> > >
> > > > store.posts == initialState: {

        posts: [],
        isLoading: false,
        error: null,
    }

> > > > [[FILENAME : react-redux-thunk-toolkit/src/components/posts/postsSlice.js]

####

```http
[[FOLDERNAME : react-redux-thunk-toolkit/src/components/posts/Posts.jsx]
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
import React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPostsAction } from './postsSlice';

const Posts = () => {
    const { isLoading, posts, error } = useSelector(store => store.posts);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchPostsAction());
    }, [dispatch])
    return (
        <div>
            <h1>Welcome to My Counter APP</h1>
            {isLoading ? <div>Loading...</div> : null}
            {error ? <div>Error</div> : null}
            <section className='grid  grid-cols-10'>
                {posts.map(post => <div key={post.id}
                    style={{ background: '#fafafa', padding: '1rem', borderRadius: '5px', margin: '1rem' }}
                >
                    <h4>{post.title}</h4>
                </div>)}
            </section>
        </div>
    );
};

export default Posts;
```

####

## redux-toolkit (fetching Single Post Details By GET API request)

> > যেহেতু যেই project এ আমি redux practice করছিলাম সেই project এ **react-router** install করা ছিল না তাই অন্য একটা project থেকে steps গুলো copy করা হয়েছে

### step-1 : Creating \_Actions.js file

> > এখানে **action function** থেকে data কে return করানোর সময় আমি **_data.product_** হিসেবে return করিয়েছি কারন আমি জানি database এ product এর information গুলো সরাসরি নেই বরন তার ভিতরের **product** নামক key এর ভিতরে আছে তাই এভাবে **chaining** করে return করেছি যাতে **_Slice.js_** file এ গিয়ে কাজ করতে সুবিধা হয়

####

```http
[[FILENAME : 6PP_Ecommerce/frontend/src/reducers/singleProductReducer/singleProductActions.js]
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";



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

### step-2 : Creating \_Slice.js file

####

```http
[[FILENAME : 6PP_Ecommerce/frontend/src/reducers/singleProductReducer/singleProductSlice.js]
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
import { createSlice } from '@reduxjs/toolkit';
import { fetchProductById } from './productsActions';

const singleProductSlice = createSlice({
    name: 'productDetails',
    initialState: {
        product: {},
        error: null,
        isLoading: false,
    },
    reducers: {
        clearFetchSingleProductErrors: (state, action) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchProductById.pending, (state, action) => {
            state.isLoading = true;
        });
        builder.addCase(fetchProductById.fulfilled, (state, action) => {
            state.product = action.payload;
            state.isLoading = false;
        });
        builder.addCase(fetchProductById.rejected, (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        });
    }

});

export const { clearFetchSingleProductErrors } = singleProductSlice.actions;
export default singleProductSlice.reducer;
```

####

### step-3 : Creating store.js fil

####

```http
[[FILENAME : 6PP_Ecommerce/frontend/src/app/store.js]
"""""""""""""""""""""""""""""""""""""""""""""""""""""
import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./../reducers/productsReducer/productsSlice";
import productDetailsReducer from "./../reducers/singleProductReducer/singleProductSlice";
const store = configureStore({
    reducer: {
        products: productsReducer,
        productDetails: productDetailsReducer,
    },
})

export default store;
```

####

### step-4 : Providing store in index.js file

####

```http
[[FILENAME : 6PP_Ecommerce/frontend/src/index.js]
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from './app/store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

```

####

### step-5 : **redux এর store** থেকে data কে বিভিন্ন **components এ use** করা

####

```http
[[FILENAME : 6PP_Ecommerce/frontend/src/component/Home/SingleProductDetails/SingleProductDetails.js]
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchProductById } from '../../reducers/singleProductReducer/singleProductActions';

const SingleProductDetails = () => {
    const { _id } = useParams();
    const dispatch = useDispatch();
    const { product, isLoading, error } = useSelector(store => store.productDetails);
    useEffect(() => {
        dispatch(fetchProductById(_id));
    }, [dispatch, _id])
    return (
        <div>
            Welcome to details of : {_id}
            <div>
                {product ? product.name : "Loading. . ."}
            </div>
        </div>
    );
};

export default SingleProductDetails;
```

####

# Redux for "cartItems" (MERN Watch Shop)

> cartItem vs fetchItem এর redux এর প্রয়োগটা একটু আলাদা
>
> > fetchItem এ আমরা কোন data কে backend থেকে API এর সাহায্যে forntend এ নিয়ে আসি এবং তারপর বিভিন্ন components এ প্রয়োজন মত ব্যাবহার করি
>
> > অন্যদিকে cartItem এ আমরা fetchItem থেকে আনা data মধ্যে থেকে নির্দিষ্ট কিছ্য data কে নিয়ে internal কোন state এ রাখি তারপর সেখান থেকে প্রয়োজন মত বিভিন্ন components এ ব্যাবহার করি

1. frontend\src\*\*_features_** folder এ frontend\src\features\ **_cartSlice.js_\*\* নামের একটা file বানাব যেখানে **createSlice** কে import করে তার সাহায্যে **cartSlice** বানাইয়ে তাকে সবার শেষে default export করে দিতে হবে
2. এরপর **createSlice** ভিতরে যথাযথ **name,initalState,reducers,extraReducers** দিতে হবে যার সাহয্যে cart এর কোণ কিছু **addTocart / removeFromCart / emptizeCart** etc action fucntion বানিয়ে নিচে export করে দিতে হবে
   > > initalState এ তিনটা জিনিস নিব
   > >
   > > > একটা **cartItems** array যেখানে click করে করে cart এর জন্য item যোগ হবে
   > >
   > > > **cartTotalAmmount** যে ammount টাই মূল payment
   > >
   > > > আর **cartTotalQuantity**
   >
   > > আবার reducers এর ভিতরেই যত carting করার fucntion দরকার তা সব declare করব

```http
filePath: frontend\src\features\cartSlice.js
"""""""""""""""""""""""""""""""""""""""

/** here "state = initialState" reffering to the current-state of initialState and "action.payload = product" which is the clicked item from the UI
 * for cartItems: if localstorage has cartItems then parse it to JSON and assign it to cartItems, else assign empty array to cartItems
 * for cartTotalQuantity: if localstorage has cartItems then parse it to JSON and assign it to cartItems, else assign 0 to cartTotalQuantity
 * for cartTotalAmmount: if localstorage has cartItems then parse it to JSON and assign it to cartItems, else assign 0 to cartTotalAmmount
 *   */

/** steps for "addToCart" action-function
 * 1. find the clicked item in the cartItems array(if it exists)
 * 2. if it exists, then increase the quantity of that item
 * 3. if it doesn't exist, then duplicate the item and increase cartQuantity by 1 and add the item to the cartItems array
 * 4. then increase the cartTotalAmmount by the price of the clicked item
 * 6. then increase the cartTotalQuantity by 1
 * 5. then we need to add the cartItems in the localStorage
 *   */

/** steps for "removeFromCart" action-function
 * 1. segregate the non-clicked items from the cartItems array
 * 2. set the replace the previous items array with the segregated items in the cartItems array
 * 3. then decrease the cartTotalAmmount by the price of the clicked item's total pirce
 * 4. then decrease the cartTotalQuantity by the clicked item's total quantity
 * 5. then we need to add the cartItems in the localStorage
 *   */

/** steps for "increaseQuantityById" action-function
 * 1. find the index of the clicked item in the cartItems array
 * 2. increase the cartQuantity of the clicked item by 1
 * 3. then increase the cartTotalQuantity by 1
 * 4. then increase the cartTotalAmmount by the price of the clicked item
 * 5. then we need to add the cartItems in the localStorage
 *   */

/** steps for "decreaseQuantityById" action-function
 * 1. find the index of the clicked item in the cartItems array
 * 2. put condition if the cartQuantity of the clicked item is greater than 1 then decrease the cartQuantity of the clicked item by 1
 * 3. then decrease the cartTotalQuantity by 1
 * 4. then decrease the cartTotalAmmount by the price of the clicked item
 * 5. then we need to add the cartItems in the localStorage
 *   */


import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
  cartItems: localStorage.getItem("cartItems") ? JSON.parse(localStorage.getItem("cartItems")) : [],
  cartTotalQuantity: localStorage.getItem("cartItems") ? JSON.parse(localStorage.getItem("cartItems")).reduce((previousValue, item) => previousValue + Number(item.cartQuantity), 0) : 0,
  cartTotalAmmount: localStorage.getItem("cartItems") ? JSON.parse(localStorage.getItem("cartItems")).reduce((previousValue, item) => previousValue + Number(item.cartQuantity) * Number(item.price), 0) : 0,
};



const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const itemIndex = state.cartItems.findIndex(
        (item) => item.id === action.payload.id
      );
      if (itemIndex >= 0) {
        state.cartItems[itemIndex].cartQuantity += 1;
        toast.info(
          `"${state.cartItems[itemIndex].name}" cart Quantity : ${state.cartItems[itemIndex].cartQuantity}`,
          {
            position: "bottom-left",
            /* autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined, */
          }
        );
      } else {
        const temptItem = { ...action.payload, cartQuantity: 1 };
        state.cartItems.push(temptItem);
        toast.success(`${action.payload.name} added to cart`, {
          position: "bottom-left",
          /* autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined, */
        });
      }
      state.cartTotalQuantity += 1;
      state.cartTotalAmmount += Number(action.payload.price);
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    removeFromCart: (state, action) => {
      const restsItems = state.cartItems.filter( item => item.id !== action.payload.id);
      state.cartItems = restsItems;
      state.cartTotalQuantity -= action.payload.cartQuantity;
      state.cartTotalAmmount -= Number(action.payload.price) * Number(action.payload.cartQuantity);
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    increaseQuantityById: (state, action) => {
      const itemIndex = state.cartItems.findIndex(
        (item) => item.id === action.payload.id
      );
      state.cartItems[itemIndex].cartQuantity += 1;
      state.cartTotalQuantity += 1;
      state.cartTotalAmmount += Number(action.payload.price);
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    decreaseQuantityById: (state, action) => {
      const itemIndex = state.cartItems.findIndex(
        (item) => item.id === action.payload.id
      );
      if (state.cartItems[itemIndex].cartQuantity > 1) {
        state.cartItems[itemIndex].cartQuantity -= 1;
        state.cartTotalQuantity -= 1;
        state.cartTotalAmmount -= Number(action.payload.price);
        localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      }
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.cartTotalQuantity = 0;
      state.cartTotalAmmount = 0;
      localStorage.removeItem("cartItems");
    },
  },
  extraReducers: {},
});

export const { addToCart,removeFromCart,increaseQuantityById,decreaseQuantityById,clearCart } = cartSlice.actions;

export default cartSlice.reducer;





```

3. এবার frontend\src\ **index.js** file এ **_cartReducer_** কে import করে **store** এর সাথে linked করে দিব

```http
filePath: frontend\src\index.js
"""""""""""""""""""""""""""""""""""""""

import { configureStore } from "@reduxjs/toolkit";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { productsAPI } from "./features/productsAPI";
import productsReducer, { fetchProducts } from "./features/productsSlice";
import cartReducer from "./features/cartSlice";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
    [productsAPI.reducerPath]: productsAPI.reducer, // x
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(productsAPI.middleware), // x
});

store.dispatch(fetchProducts());

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

```

4. frontend\src\Components\Home\*\*Home.js** file এর যেই button এর সাথে **carting functionality** engage করতে চাই সেখানে **onClick** এ **handleAddToCart(arg)** function add করব তারপর এর ভিতরে **_disPatch_** এর সাহায্যে **_addToCart(arg)_\*\* action-function কে call করব
   > > অবশ্যই অবশ্যই **_addToCart(arg)_** action-function কে **_disPatch_** করার পূর্বে **useDisPatch & addToCart** কে নিজ নিজ file থেকে import করে নিতে হবে

```http
filePath: frontend\src\Components\Home\Home.js
""""""""""""""""""""""""""""""""""""""""""""""


import React from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../features/cartSlice";
import { useGetAllProductsQuery } from "./../../features/productsAPI";

const Home = () => {
  const { data, error, isLoading } = useGetAllProductsQuery();
  const dispatch = useDispatch();

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  return (
    <div className="home-container">
      {isLoading ? (
        <p>Loading . . .</p>
      ) : error ? (
        <p>An Error Occured</p>
      ) : (
        <>
          <h2>All Collections are available</h2>
          <hr />
          <div className="products">
            {data &&
              data.map((product) => (
                <div key={product.id} className="product">
                  <h3>{product.name}</h3>
                  <img src={product.image} alt={product.name} />
                  <div className="details">
                    <span>Price</span>
                    <span className="price">{product.price}</span>
                  </div>
                  <button onClick={() => handleAddToCart(product)}>
                    Add to Cart
                  </button>
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;



```

5. frontend\src\Components\Cart\ **_Cart.js_** file এর যেই button এর সাথে **clearCart functionality** engage করতে চাই সেখানে **onClick** এ **handleClearCart()** function add করব তারপর এর ভিতরে **_disPatch_** এর সাহায্যে \*\*_clearCart()_\*\* action-function কে call করব
   > > অবশ্যই অবশ্যই **_clearCart()_** action-function কে **_disPatch_** করার পূর্বে **useDisPatch & clearCart** কে নিজ নিজ file থেকে import করে নিতে হবে

```http
filePath: frontend\src\Components\Cart\Cart.js
""""""""""""""""""""""""""""""""""""""""""""""


import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { Link } from "react-router-dom";
import CartItemComponent from "./CartItemComponent";
import { clearCart } from "../../features/cartSlice";

const Cart = () => {
  const { cartItems, cartTotalQuantity, cartTotalAmmount } = useSelector(
    (state) => state.cart
  );
  const dispatch = useDispatch();
  const handleClearCart = () => {
    dispatch(clearCart());
  };
  return (
    <div className="cart-container">
      <h2>Shopping Cart</h2>
      {!cartItems.length ? (
        <div className="cart-empty">
          <img
            src="https://i.ibb.co/BjBJQJw/boy-mother-shopping-grocery-jpg.jpg"
            height="200"
            alt="empty-cart-ho-home"
          />
          <h3>Your cart is empty</h3>
          <p>Looks like you haven't added anything yet</p>
          <div className="start-shopping">
            <Link to="/home">
              <BsArrowLeft />
              <span>Start Shopping</span>
            </Link>
          </div>
        </div>
      ) : (
        <div>
          <div className="titles">
            <h3 className="product-title">Product</h3>
            <h3 className="price">Price</h3>
            <h3 className="quantity">Quantity</h3>
            <h3 className="total">Total</h3>
          </div>
          <div className="cart-items borderTop">
            {cartItems?.map((cartItem) => (
              <CartItemComponent key={cartItem.id} cartItem={cartItem} />
            ))}
          </div>
          <div className="cart-summary">
            <button className="clear-cart" onClick={() => handleClearCart()}>
              Clear Cart
            </button>
            <div className="cart-checkout">
              <div className="subtotal">
                <span>Subtotal</span>
                <span className="ammount">${cartTotalAmmount}</span>
              </div>
              <p>Taxes and Shipping Calculate at Checkout</p>
              <button>Checkout</button>
              <div className="continue-shopping">
                <Link to="/home">
                  <BsArrowLeft />
                  <span>Continue Shopping</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;




```

6. frontend\src\Components\Cart\ **_CartItemComponent.js_** file এর যেই button এর সাথে **decreaseQuantityById, increaseQuantityById, removeFromCart functionality** engage করতে চাই সেখানে **onClick** এ **handleRemoveFromCart(cartItem),handleIncreaseQtyById(cartItem),handleDecreaseQtyById(cartItem)** function add করব তারপর এর ভিতরে **_disPatch_** এর সাহায্যে \*\*_decreaseQuantityById(cartItem),increaseQuantityById(cartItem),removeFromCart(cartItem)_\*\* action-function কে call করব
   > > অবশ্যই অবশ্যই **_decreaseQuantityById(cartItem),increaseQuantityById(cartItem),removeFromCart(cartItem)_** action-function কে **_disPatch_** করার পূর্বে **useDisPatch & decreaseQuantityById,increaseQuantityById,removeFromCart** কে নিজ নিজ file থেকে import করে নিতে হবে

```http
filePath: frontend\src\Components\Cart\CartItemComponent.js
""""""""""""""""""""""""""""""""""""""""""""""


import React from "react";
import { useDispatch } from "react-redux";
import { decreaseQuantityById, increaseQuantityById, removeFromCart } from "../../features/cartSlice";

const CartItemComponent = ({ cartItem }) => {
  const dispatch = useDispatch();
  const handleRemoveFromCart = (cartItem) => {
    dispatch(removeFromCart(cartItem));
  };
  const handleIncreaseQtyById = (cartItem) => {
    dispatch(increaseQuantityById(cartItem));
  };
  const handleDecreaseQtyById = (cartItem) => {
    dispatch(decreaseQuantityById(cartItem));
  };
  return (
    <div className="cart-item">
      <div className="cart-product">
        <div className="">
          <img className="" src={cartItem.image} alt={cartItem.name} />
          <div>
            <h3>{cartItem.name}</h3>
            <p>{cartItem.desc.slice(0, 40) + "..."}</p>
            <button onClick={() => handleRemoveFromCart(cartItem)}>
              Remove
            </button>
          </div>
        </div>
        <div className="cart-product-price ">${cartItem.price}</div>
        <div className="cart-product-quantity ">
          <button
          onClick={() => handleDecreaseQtyById(cartItem)}
          >-</button>
          <div className="count">{cartItem.cartQuantity}</div>
          <button
          onClick={() => handleIncreaseQtyById(cartItem)}
          >+</button>
        </div>
        <div className="cart-product-total-price ">
          ${cartItem.price * cartItem.cartQuantity}
        </div>
      </div>
    </div>
  );
};

export default CartItemComponent;





```

####

# Redux RTK Query for "fetchItem" (MERN Watch Shop)

> > Redux **RTK Query** মূলত redux tool kit এরই একটা advanced feature so এটা use করতে হলে পূর্বে বর্ণনা অনুযায়ী **redux tool kit** implemented থাকতে হবে
>
> > source: https://redux-toolkit.js.org/rtk-query/api/createApi

## Redux RTK Query (fetching All Posts By GET API request)

1. steps to fetch all products by RTK Query
   > > frontend\src\ **_features_** folder এ frontend\src\features\ **_productsAPI.js_** file নামের একটা file বানাবো
   >
   > > প্রথমে **createApi, fetchBaseQuery** কে import করে নিব
   >
   > > **createApi** এর সাহায্যে **_productsAPI_** নামের একটা function বানাব যেটা পাশাপাশি inline exported হবে
   > >
   > > > এই function এর ভিতরে **_reducerPath_** key এর value হিসেবে **_productsAPI_** ই দিতে হবে
   > >
   > > > **_baseUrl_** এর value হিসবে deploy করার আগপর্যন্ত আমাদের lolcalHost এর **https://sixpackproject-qnef.onrender.com** হবে
   > >
   > > > তারপর **_endspoints_** এর callback function ভিতরে একটা custom key দিব **_getAllProducts_** নামের [**এটা মুলত কাজের উপরে ভিত্তি করে naming করতে হবে**]এর ভিতরে **query** তে **products** লিখব [**এটা মূলত full link এর last এর route কে দিতে হবে।**]
   > > >
   > > > > যদি full link: **_https://sixpackproject-qnef.onrender.comproducts/_** হয় তাহলে,
   > > > >
   > > > > > base URL : **_https://sixpackproject-qnef.onrender.com_**
   > > > >
   > > > > > route : **_products/_**
   >
   > > তারপর নিচে একটা **_productsAPI_** এর সাহায্যে একটা custom hook [**যা কাজের উপর ভিত্তি করে naming করেনিতে হবে**] তা inline export করব

```http
filePath: frontend\src\features\productsAPI.js
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''

// Need to use the React-specific entry point to allow generating React hooks
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const productsAPI = createApi({ // x
  reducerPath: "productsAPI", // x
  baseQuery: fetchBaseQuery({ baseUrl: "https://sixpackproject-qnef.onrender.com" }), // x
  endpoints: (builder) => ({
    getAllProducts: builder.query({ // x
      query: () => `products`, // x
    }),
  }),
});

// Export hooks for usage in function components, which are
// auto-generated based on the defined endpoints
export const { useGetAllProductsQuery } = productsAPI;


```

2. steps to fetch all products by RTK Query
   > > frontend\src\ **_index.js_** file এ প্রথমে **_productsAPI_** কে import করে নিব তারপর
   >
   > > store এর ভিতরে নিচের মতকরে **_reducerPath & middleweare_** বানাব
   > >
   > > > খেয়াল রাখতে হবে যে **middleweare** বানানোর সময় যেন **_getDefaultMiddleware_** টা যাতে **_@reduxjs/toolkit_** থেকে auto import হয়ে না যায়

```http
filePaths: frontend\src\index.js
""""""""""""""""""""""""""""""
import { configureStore } from "@reduxjs/toolkit";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { productsAPI } from "./features/productsAPI";
import productsReducer, { fetchProducts } from "./features/productsSlice";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

const store = configureStore({
  reducer: {
    products: productsReducer,
    [productsAPI.reducerPath]: productsAPI.reducer, // x
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(productsAPI.middleware), // x
});

store.dispatch(fetchProducts());

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();


```

5. এবার frontend\src\Components\Home\ **_Home.js_** file এ **_useGetAllProductsQuery_** কে import করে নিয়ে Home component এর ভিতরে একে destructure করে আমাদের কাংক্ষিত **_{ data, error, isLoading }_** products কে পেয়ে যাব

```http
filePath: frontend\src\Components\Home\Home.js
"""""""""""""""""""""""""""""""""""""""""""""""""
import React from 'react';
import { useGetAllProductsQuery } from './../../features/productsAPI';

const Home = () => {
    const { data, error, isLoading } = useGetAllProductsQuery();
    return (
        <div>
            its <b>Home</b> page
        </div>
    );
};

export default Home;
```

4. এবার frontend এবং backend এর both terminal run আছে কিনা ensure করে নিব তাহলেই browser এর **_Redux Dev Tool_** extension এ আমরা আমাদের কাংক্ষিত data পেয়ে যাব

###

# Redux Tool Kit for POST API request [for login-register]

> > create actions for posting by the help of **createAsyncThunk,thunkAPI i.e {rejectWithValue}**
>
> > create slice file but in **extrareducers** put different different builder function for seperate **acitions-function**
>
> > dispatch actions-functions

## Actions file for POST API request [for login-register]

> > for **loginUser**,
> >
> > > **_userInfo_** parameter will be recieved while dispatching **_loginUser_** action-function in frontend\src\component\user\ **_LoginSignUp.js_** file
> >
> > > and _*{ rejectWithValue }*_ is destructured from the parameter named **_thunkAPI_**
> > >
> > > > i.e **_const { rejectWithValue } = thunkAPI_**
> >
> > for **registerNewUser**,
> >
> > > **"Content-Type": "multipart/form-data"** cause during registration we are going to use **cloudniary and multiple image file could be upload**
> > >
> > > > basically, যদি আমরা frontend থেকে কোন image,video ইত্যাদি file backend এ পাঠিয়ে থাকি তাহলে **_"Content-Type": "multipart/form-data"_** হবেনইলে **_"Content-Type": "application/json"_**

```http
filepath: frontend\src\reducers\productsReducer\userActions.js
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const loginUser = createAsyncThunk(
    "user/loginUser",
    async (userInfo, { rejectWithValue }) => {
        try {
            const config = { headers: { "Content-Type": "application/json" } };
            const { data } = await axios.post(
                "https://sixpackproject-qnef.onrender.comapi/v1/login",
                userInfo,
                config,
            );
            return data.user;
        } catch (err) {
            return rejectWithValue(err.response.data.message);
        }
    }

)

export const registerNewUser = createAsyncThunk(
    "user/registerNewUser",
    async (userData, { rejectWithValue }) => {
        try {
            const config = { headers: { "Content-Type": "multipart/form-data" } };
            const { data } = await axios.post(
                "https://sixpackproject-qnef.onrender.comapi/v1/register",
                userData,
                config,
            );
            return data.user;
        } catch (err) {
            return rejectWithValue(err.response.data.message);
        }
    }

)



```

## userSlice file for POST API request [for login-register]

```http
filepath: frontend\src\reducers\productsReducer\userSlice.js
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

import { createSlice } from "@reduxjs/toolkit";
import { loginUser, registerNewUser } from "./userActions";

const initialState = {
  userInfo: {},
  error: null,
  loading: false,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    clearUserErrors: (state, action) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    /* * for login purpose * */
    // Do something while pending if you want.
    builder.addCase(loginUser.pending, (state, action) => {
        state.loading = true;
        state.isAuthenticated = false;
    });
    // Do something when passes.
    builder.addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.userInfo = action.payload;
    });
    // Do something if fails.
    builder.addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.userInfo = null;
        state.error = action.payload;
    });


    /* * for registerUser purpose * */
    // Do something while pending if you want.
    builder.addCase(registerNewUser.pending, (state, action) => {
        state.loading = true;
        state.isAuthenticated = false;
    });
    // Do something when passes.
    builder.addCase(registerNewUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.userInfo = action.payload;
    });
    // Do something if fails.
    builder.addCase(registerNewUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.userInfo = null;
        state.error = action.payload;
    });
  },
});

export const { clearUserErrors } = userSlice.actions;
export default userSlice.reducer;

```

## dispatch the registerNewUser+loginUser action-functions for POST API request [for login-register]

> > এখানে ফর্ম এ **_encType="multipart/form-data"_** দেয়া হয়েছে কারন এই form এর সাহায্যে আমরা image upload করব

```http
filepath: frontend\src\component\user\LoginSignUp.js
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
import FaceIcon from "@mui/icons-material/Face";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginUser, registerNewUser } from "../../reducers/productsReducer/userActions";
import { clearUserErrors } from "../../reducers/productsReducer/userSlice";
import Loader from "../layout/Loader/Loader";

const LoginSignUp = () => {
const navigate = useNavigate()

  // for reducer related to login and register
  const dispatch = useDispatch();
  const { userInfo, error, loading, isAuthenticated } = useSelector(
    (state) => state.userDetails
  );

  // for login form
  const loginTab = useRef(null);
  const registerTab = useRef(null);
  const switcherTab = useRef(null);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // for register form
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { name, email, password } = user;
  const [avatar, setAvatar] = useState("/Profile.png");
  const [avatarPreview, setAvatarPreview] = useState("/Profile.png");

  // api post handler
  useEffect(() => {
    if (error) {
      toast.error(error, { id: "loginUser_error" });
      dispatch(clearUserErrors());
    }
    if(isAuthenticated){
      navigate("/account")
    }
  }, [dispatch,error,navigate,isAuthenticated]);

  // for login form
  const switchTabs = (e, tab) => {
    if (tab === "login") {
      switcherTab.current.classList.add("shiftToNeutral");
      switcherTab.current.classList.remove("shiftToRight");

      registerTab.current.classList.remove("shiftToNeutralForm");
      loginTab.current.classList.remove("shiftToLeft");
    }
    if (tab === "register") {
      switcherTab.current.classList.add("shiftToRight");
      switcherTab.current.classList.remove("shiftToNeutral");

      registerTab.current.classList.add("shiftToNeutralForm");
      loginTab.current.classList.add("shiftToLeft");
    }
  };

  const loginSubmit = (e) => {
    e.preventDefault();
    console.log(loginEmail, loginPassword);
    dispatch(loginUser({ email: loginEmail, password: loginPassword }));
  };

  // for register form
  const registerSubmit = (e) => {
    e.preventDefault();
    const registerForm = new FormData();

    registerForm.set("name", name);
    registerForm.set("email", email);
    registerForm.set("password", password);
    registerForm.set("avatar", avatar);
    dispatch(registerNewUser(registerForm));
  };

  /** for uploading image preview
   * step 1: create a reader
   * step 2: create a function to read the file during "onload"
   * step 3: if file-loading done set the reader to read the file (like for preview)
   *      onload has 3 readyState:= 0: not started / initial, 1: loading, 2: done
   * step 4: set the reader to read the file as a data url
   */
  const registerDataChange = (e) => {
    if (e.target.name === "avatar") {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          setAvatar(reader.result);
        }
      };

      reader.readAsDataURL(e.target.files[0]);
    } else {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="LoginSignUpContainer">
            <div className="LoginSignUpBox">
              <div>
                <div className="login_signUp_toggle">
                  <p onClick={(e) => switchTabs(e, "login")}>LOGIN</p>
                  <p onClick={(e) => switchTabs(e, "register")}>REGISTER</p>
                </div>
                <button ref={switcherTab}></button>
              </div>
              <form className="loginForm" ref={loginTab} onSubmit={loginSubmit}>
                <div className="loginEmail">
                  <MailOutlineIcon />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                </div>
                <div className="loginPassword">
                  <LockOpenIcon />
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                </div>
                <Link to="/password/forgot">Forget Password ?</Link>
                <input type="submit" value="Login" className="loginBtn" />
              </form>
              <form
                className="signUpForm"
                ref={registerTab}
                encType="multipart/form-data"
                onSubmit={registerSubmit}
              >
                <div className="signUpName">
                  <FaceIcon />
                  <input
                    type="text"
                    placeholder="Name"
                    required
                    name="name"
                    value={name}
                    onChange={registerDataChange}
                  />
                </div>
                <div className="signUpEmail">
                  <MailOutlineIcon />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    name="email"
                    value={email}
                    onChange={registerDataChange}
                  />
                </div>
                <div className="signUpPassword">
                  <LockOpenIcon />
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    name="password"
                    value={password}
                    onChange={registerDataChange}
                  />
                </div>

                <div id="registerImage">
                  <img src={avatarPreview} alt="Avatar Preview" />
                  <input
                    type="file"
                    name="avatar"
                    accept="image/*"
                    onChange={registerDataChange}
                  />
                </div>
                <input type="submit" value="Register" className="signUpBtn" />
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default LoginSignUp;



```
