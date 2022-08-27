// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useParams } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import { fetchAllProducts } from '../../reducers/productsReducer/productsActions';
// import { clearFetchAllProductsErrors } from '../../reducers/productsReducer/productsSlice';
// import ProductCard from '../Home/ProductCard';
// import Loader from '../layout/Loader/Loader';
// import PageTitle from '../layout/PageTitle/PageTitle';
// import "./Products.css";

// const Products = () => {
//     const {keyWord} = useParams();
//     const { resultPerPage, productsCount, products, error, isLoading } = useSelector(store => store.products);
//     const dispatch = useDispatch();

//     useEffect(() => {
//         if (error) {
//             toast.error(error, { id: 'fetchAllProducts_error' });
//             dispatch(clearFetchAllProductsErrors());
//         }
//         dispatch(fetchAllProducts(keyWord));
//     }, [dispatch, error,keyWord]);
//     return (
//         <>
//             {isLoading ? <Loader /> : <>
//                 <PageTitle title="PRODUCTS" />
//                 <h2 className="productsHeading">Products</h2>

//                 <div className="products">
//                     {products &&
//                         products.map((product) => (
//                             <ProductCard key={product._id} product={product} />
//                         ))}
//                 </div>
//             </>}
//         </>
//     );
// };
// export default Products;









import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { fetchAllProducts } from '../../reducers/productsReducer/productsActions';
import { clearFetchAllProductsErrors } from '../../reducers/productsReducer/productsSlice';
import ProductCard from '../Home/ProductCard';
import Loader from '../layout/Loader/Loader';
import PageTitle from '../layout/PageTitle/PageTitle';
import "./Products.css";
import Pagination from "react-js-pagination";

const Products = () => {
    const { keyWord } = useParams();
    const { productsCount, products, error, isLoading } = useSelector(store => store.products);
    const dispatch = useDispatch();

    const [currentPage, setCurrentPage] = useState(0);
    const [resultPerPage, setResultPerPage] = useState(3);
    const [noOfPages, setNoOfPages] = useState(0);

    if (currentPage > noOfPages) {
        setCurrentPage(noOfPages - 1);
    }
    if (currentPage < 0) {
        setCurrentPage(0);
    }

    useEffect(() => {
        if (error) {
            toast.error(error, { id: 'fetchAllProducts_error' });
            dispatch(clearFetchAllProductsErrors());
        }
        dispatch(fetchAllProducts({keyWord, currentPage, resultPerPage}));


        setNoOfPages(Math.ceil(productsCount / resultPerPage));


    }, [dispatch, error, keyWord, currentPage, resultPerPage, productsCount, noOfPages]);
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

            {resultPerPage < productsCount && (
                <div className="pagination">
                    <>
                        <button
                            onClick={() => setCurrentPage(0)}>First</button>
                        <button
                        disabled={currentPage === 0}
                            onClick={() => setCurrentPage(currentPage - 1)}>«</button>
                        {
                            [...Array(noOfPages).keys()].map((pNum, index) => <button
                                key={index}
                                className={currentPage === pNum ? "selected" : ""}
                                onClick={() => setCurrentPage(pNum)}
                            >{pNum + 1}</button>)
                        }
                        <button
                        disabled={currentPage === noOfPages - 1}
                            onClick={() => setCurrentPage(currentPage + 1)}
                            class="btn btn-primary text-white">»</button>
                        <button
                            onClick={() => setCurrentPage(noOfPages - 1)}>Last</button>
                    </>
                    <select onChange={e => setResultPerPage(e.target.value)}>
                        <option value="3" selected>3</option>
                        <option value="6">6</option>
                        <option value="9">9</option>
                        <option value="12">12</option>
                    </select>
                </div>
            )}
        </>
    );
};

export default Products;