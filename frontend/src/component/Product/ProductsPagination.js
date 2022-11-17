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
