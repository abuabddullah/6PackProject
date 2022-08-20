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