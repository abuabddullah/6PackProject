import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import WebFont from "webfontloader";
import './App.css';
import Home from "./component/Home/Home.js";
import Footer from "./component/layout/Footer/Footer.js";
import Header from "./component/layout/Header/Header.js";
import NotFound from "./component/layout/NotFound/NotFound.js";
import Products from './component/Product/Products.js';
import Search from './component/Product/Search.js';
import SingleProductDetails from './component/Product/SingleProductDetails';

import { ToastContainer } from 'react-toastify';
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





/* 
const parentObj = {
    name: "parent",
    child: {
        name: "immidateChild",
        age: 30,
        child: {
            name: "grandChild",
            age: 10,
        }},
      };

      const { name, child: { name: childName, age: childAge, child: { name: grandChildName, age: grandChildAge } } } = parentObj; */
