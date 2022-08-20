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