
## redux-toolkit  (React Counter App)

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


>
>> createSlice **_sliceName, initialStateOfREQUIREMENTS, actions, reducer_** গুলোকে redux-toolkit এর সাহায্যে একটু নতুন ধাচে একটা object এর key-value pair হিসেবে declare করতে হবে এবং **slice file** declare করার সময় অবশ্যই **_Slice.js_** word টা থাকতে হবে। এটা করার ফলে আমরা এই slice টা থেকে ২ টা জিনিস পাব **actions function** এবং **reducer function** এবং কোন **constant** type কে define করা লাগবে না
>
>> মনে রাখতে হবে এখানের ব্যবহৃত **_createSlice_** method এর কিছু fixed key আছে **({name, initialState, reducers})** আর reducers এর যে state parameter আছে তার value ও এর "name.initialState" । অর্থাৎ,
>>> **_state.value == initialState.value_**

        
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

>
>> **_configureStore_** ই মূলত **vanilla Redux** এর **combine-reducers** এর কাজ করে
>
>> এখনো আমরা যেহেতু **_postReducer_** নিয়ে কাজ করছি না তাই একে **comment out** করে দিয়া হয়েছে

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

>
>> **step 1** থেকে **step 3** পর্যন্ত আমরা **redux কে existence** এ এনেছি এবার আমাদের **redux এর store** থেকে data কে বিভিন্ন **components এ use** করার পালা 
        
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

6. প্রথমে **_App.js_** file এ **_Counter_** component কে invoke করে এবার তার ভিতরে **layout-styling + reduxing** শুরু করব। এর জন্য **react-redux** থেকে **_useDispatch & useSelector_** এবং **counterSlice.js** file থেকে **_action-functions_** গুলো কে import করে নিব. তারপর নিম্নবর্নিত নিয়মানুযায়ি *redux* implement করব

>
>> **useDispatch()** কে invoke করে **_dispatch_** functional-variable create করেছি যার সাহায্যে action-funcitons গুলো কে invoke করা হবে
>
>>
>>> **useSelector** মুলত **_store.js_** file এ যত গুলা reducres আছে সবাইকে একসাথে তার **store** parameter এ return করে তাই optional chaining এর সাহায্যে specific reducer কে target করা হয়,
>> 
>>> এই **useSelector** এর **_store.counter.value_** parameter এর **chaining**  টা একটু বুঝার আছে,
>>>
>>>> store == reducer: {
        counter: counterReducer,
        posts: postsReducer,
    }
>>>>
>>>> [[FILENAME : react-redux-thunk-toolkit/src/app/store.js]
>>>
>>>> store.counter == initialState: {
        value: 0,
        by: 1
    }
>>>>
>>>> [[FILENAME : react-redux-thunk-toolkit/src/components/counter/counterSlice.js]
>>>
>>>> store.counter.value == 0
>>>>
>>>> [[FILENAME : react-redux-thunk-toolkit/src/components/counter/counterSlice.js]
        
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










## redux-toolkit  (fetching All Posts By GET API request)

### step-1 : Creating _Slice.js file : [All same as CounterApp]

1. প্রথমে **_postsSlice.js_** file বানাতে হবে

>
>> **GET req** এর জন্য যে **_Slice.js_** file বানানো হয় আর normal just **props-handle** resolve করার জন্য যে **_Slice.js_** file বানানো হয় তাদের মাঝেকিছু পার্থক্য আছে,
>>> **GET req** এর **_Slice.js_** file এ,
>>>> আলাদা করে উপরে **_action-function_** define করে দিতে হয় এই **_action-function_** এই আমরা মুলত API fetching এর কাজ করি,
>>>>> **_action-function_**  এ **_createAsyncThunk_** middleware use করা হয় যা দুটা parameter নেয়,
>>>>>> প্রথমটাকে বলে **key** যা গঠিত হয় ঃ **postsSlice এর name/action-function এর name**
>>>>>
>>>>>> ২য়টা হচ্ছে fetching করার **async function** ।  এই **async function** থেকে যাই return পাই তাই ই হচ্ছে **_reducers_** এর ভিতরের **_action_** parameter এর **_payload or error_** এর value. যদি request succesful হয় তাহলে **async function** থেকে যাই return পাই তা **_action.payload_** এ জমা হয় নইলে **_action.error_** এ জমা হয়
>>>
>>>> **_createSlice()_** method এর ভিতরে **fixed-key** হিসেবে **name, initialState,reducers** এর পাশাপাশি **extraReducers** থাকে যার value হচ্ছে একটা **_callBack_** function যা **_builder_** নামের parameter recieve করে যা একটা **object** এবং এর ভিতরের **_addCase_** key এর value আরেকটা function যা আরো দুটা parameter recieve করে,
>>>>> প্রথমটা হচ্ছে **fetchPostsActionFunction** এর সাথে **_.pending or .fullfilled or .rejected_** method যুক্ত থাকে যা সাহয্যে **state** এর value গুলোকে modify করা হয়
>>>>
>>>>> 2য়টা হচ্ছে একটা **_callBack_** function যা **_state, action_** নামের ২টা parameter recieve করে যার ভিতরে **state** এর value গুলোকে modify করা হয়
        
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

>
>> যদিও আগেই বানানো ছিল এখন শুধু uncomment করে দিয়েছে

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

6. প্রথমে **_App.js_** file এ **_Posts_** component কে invoke করে এবার তার ভিতরে **layout-styling + reduxing** শুরু করব। এর জন্য **react-redux** থেকে **_useDispatch & useSelector_** এবং **postsSlice.js** file থেকে **_action-function_** কে import করে নিব. তারপর নিম্নবর্নিত নিয়মানুযায়ি *redux* implement করব

>
>> **useDispatch()** কে invoke করে **_dispatch_** functional-variable create করেছি যার সাহায্যে action-funcitons গুলো কে invoke করা হবে
>
>>
>>> **useSelector** মুলত **_store.js_** file এ যত গুলা reducres আছে সবাইকে একসাথে তার **store** parameter এ return করে তাই optional chaining এর সাহায্যে specific reducer কে target করা হয়,
>> 
>>> এই **useSelector** এর **_store.posts_** parameter এর **chaining**  টা একটু বুঝার আছে,
>>>
>>>> store == reducer: {
        counter: counterReducer,
        posts: postsReducer,
    }
>>>>
>>>> [[FILENAME : react-redux-thunk-toolkit/src/app/store.js]
>>>
>>>> store.posts == initialState: {
        posts: [],
        isLoading: false,
        error: null,
    }
>>>>
>>>> [[FILENAME : react-redux-thunk-toolkit/src/components/posts/postsSlice.js]
        
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











## redux-toolkit  (fetching Single Post Details By GET API request)

>
>> যেহেতু যেই project এ আমি redux practice করছিলাম সেই project এ **react-router** install করা ছিল না তাই অন্য একটা project থেকে steps গুলো copy করা হয়েছে

### step-1 : Creating _Actions.js file

>
>> এখানে **action function** থেকে data কে return করানোর সময় আমি **_data.product_** হিসেবে return করিয়েছি কারন আমি জানি database এ product এর information গুলো সরাসরি নেই বরন তার ভিতরের **product** নামক key এর ভিতরে আছে তাই এভাবে **chaining** করে return করেছি যাতে **_Slice.js_** file এ গিয়ে কাজ করতে সুবিধা হয়

####
```http
[[FILENAME : 6PP_Ecommerce/frontend/src/reducers/singleProductReducer/singleProductActions.js]
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";



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


### step-2 : Creating _Slice.js file
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

