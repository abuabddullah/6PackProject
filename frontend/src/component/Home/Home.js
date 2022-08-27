// import React, { useEffect } from 'react';
// import { CgMouse } from 'react-icons/cg';
// import PageTitle from '../layout/PageTitle/PageTitle';
// import "./Home.css"
// import ProductCard from "./ProductCard.js";
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchAllProducts } from '../../reducers/productsReducer/productsActions';
// import Loader from '../layout/Loader/Loader';
// import { toast } from 'react-toastify';
// import { clearFetchAllProductsErrors } from '../../reducers/productsReducer/productsSlice';
// import { useNavigate } from 'react-router-dom';



// const Home = () => {
//     const navigate = useNavigate();
//     const { resultPerPage, productsCount, products, error, isLoading } = useSelector(store => store.products);
//     const dispatch = useDispatch();

//     useEffect(() => {
//         if (error) {
//             toast.error(error, { id: 'fetchAllProducts_error' });
//             dispatch(clearFetchAllProductsErrors());
//         }
//         dispatch(fetchAllProducts());
//     }, [dispatch, error]);

//     return (
//         <>
//             {isLoading ? <Loader /> : <>
//                 <PageTitle
//                     title={'Home'}
//                 />
//                 <div className="banner">
//                     <p>Welcome to</p>
//                     <h1>6 Pack Projects</h1>
//                     <a href="#displayContainer">
//                         <button>
//                             Scroll <CgMouse />
//                         </button>
//                     </a>
//                 </div>

//                 <h2 className="homeHeading">Featured Products</h2>

//                 <div className="displayContainer" id="displayContainer">
//                     {products &&
//                         products.slice(0, 4).map((product) => (
//                             <ProductCard key={product._id} product={product} />
//                         ))}
//                 </div>

//                 <p style={{ textAlign: "center" }}>
//                     <button 
//                     className="submitReview"
//                     onClick={() => navigate('/products')}
//                     >
//                         See more ...
//                     </button>
//                 </p>
//             </>}
//         </>
//     );
// };

// export default Home;











import React, { useEffect } from 'react';
import { CgMouse } from 'react-icons/cg';
import PageTitle from '../layout/PageTitle/PageTitle';
import "./Home.css"
import ProductCard from "./ProductCard.js";
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllProducts, fetchAllProductsAtHome } from '../../reducers/productsReducer/productsActions';
import Loader from '../layout/Loader/Loader';
import { toast } from 'react-toastify';
import { clearFetchAllProductsErrors } from '../../reducers/productsReducer/productsSlice';
import { useNavigate } from 'react-router-dom';
import { clearFetchAllProducts4HomeErrors } from '../../reducers/productsReducer/products4HomeSlice';



const Home = () => {
    const navigate = useNavigate();
    const { productsCount, products, error, isLoading } = useSelector(store => store.products4Home);
    const dispatch = useDispatch();

    useEffect(() => {
        if (error) {
            toast.error(error, { id: 'fetchAllProducts_error' });
            dispatch(clearFetchAllProducts4HomeErrors());
        }
        dispatch(fetchAllProductsAtHome());
    }, [dispatch, error]);

    return (
        <>
            {isLoading ? <Loader /> : <>
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
                        products.slice(0, 4).map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                </div>

                <p style={{ textAlign: "center" }}>
                    <button 
                    className="submitReview"
                    onClick={() => navigate('/products')}
                    >
                        See more ...
                    </button>
                </p>
            </>}
        </>
    );
};

export default Home;