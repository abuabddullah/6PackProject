// import React, { useEffect, useState } from 'react';
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
//     const { keyWord } = useParams();
//     const { productsCount, products, error, isLoading } = useSelector(store => store.products);
//     const dispatch = useDispatch();

//     const [page, setPage] = useState(0);
//     const [limit, setLimit] = useState(3);
//     const [noOfPages, setNoOfPages] = useState(0);

//     if (page > noOfPages) {
//         setPage(noOfPages - 1);
//     }
//     if (page < 0) {
//         setPage(0);
//     }

//     useEffect(() => {
//         if (error) {
//             toast.error(error, { id: 'fetchAllProducts_error' });
//             dispatch(clearFetchAllProductsErrors());
//         }
//         dispatch(fetchAllProducts({keyWord, page, limit}));

//         setNoOfPages(Math.ceil(productsCount / limit));

//     }, [dispatch, error, keyWord, page, limit, productsCount, noOfPages]);
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

//             {limit < productsCount && (
//                 <div className="pagination">
//                     <>
//                         <button
//                             onClick={() => setPage(0)}>First</button>
//                         <button
//                         disabled={page === 0}
//                             onClick={() => setPage(page - 1)}>«</button>
//                         {
//                             [...Array(noOfPages).keys()].map((pNum, index) => <button
//                                 key={index}
//                                 className={page === pNum ? "selected" : ""}
//                                 onClick={() => setPage(pNum)}
//                             >{pNum + 1}</button>)
//                         }
//                         <button
//                         disabled={page === noOfPages - 1}
//                             onClick={() => setPage(page + 1)}
//                             class="btn btn-primary text-white">»</button>
//                         <button
//                             onClick={() => setPage(noOfPages - 1)}>Last</button>
//                     </>
//                     <select onChange={e => setLimit(e.target.value)}>
//                         <option value="3" selected>3</option>
//                         <option value="6">6</option>
//                         <option value="9">9</option>
//                         <option value="12">12</option>
//                     </select>
//                 </div>
//             )}
//         </>
//     );
// };

// export default Products;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchAllProducts } from "../../reducers/productsReducer/productsActions";
import { clearFetchAllProductsErrors } from "../../reducers/productsReducer/productsSlice";
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

  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(3);
  const [noOfPages, setNoOfPages] = useState(0);

  if (page > noOfPages) {
    setPage(noOfPages - 1);
  }
  if (page < 0) {
    setPage(0);
  }

  useEffect(() => {
    if (error) {
      toast.error(error, { id: "fetchAllProducts_error" });
      dispatch(clearFetchAllProductsErrors());
    }
    dispatch(fetchAllProducts({ keyWord, page, limit }));

    setNoOfPages(Math.ceil(productsCount / limit));
  }, [dispatch, error, keyWord, page, limit, productsCount, noOfPages]);
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
