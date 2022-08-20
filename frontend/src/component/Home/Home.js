import React, { useEffect } from 'react';
import { CgMouse } from 'react-icons/cg';
import PageTitle from '../layout/PageTitle/PageTitle';
import "./Home.css"
import ProductCard from "./ProductCard.js";
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllProducts } from '../../reducers/productsReducer/productsActions';
import Loader from '../layout/Loader/Loader';
import { toast } from 'react-toastify';
import { clearFetchAllProductsErrors } from '../../reducers/productsReducer/productsSlice';



const Home = () => {
    const { resultPerPage, productsCount, products, error, isLoading } = useSelector(store => store.products);
    const dispatch = useDispatch();

    useEffect(() => {
        if (error) {
            toast.error(error, { id: 'fetchAllProducts_error' });
            dispatch(clearFetchAllProductsErrors());
        }
        dispatch(fetchAllProducts());
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
                        products.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                </div>
            </>}
        </>
    );
};

export default Home;