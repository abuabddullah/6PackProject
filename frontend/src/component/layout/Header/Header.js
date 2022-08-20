import React from 'react';
import { ReactNavbar } from "overlay-navbar"
import logo from "./../../../images/logo2.png"
import { FaCartPlus, FaSearch, FaUserAlt } from "react-icons/fa";


const options = {
    burgerColor: "rgba(115, 114, 114,1)",
    burgerColorHover: "#eb4034", // এটা menuIcon এ hover effect দেয়


    // logo related options
    logo: logo,
    logoWidth: "20vmax",
    logoHoverSize: "10px",
    logoHoverColor: "#eb4034",

    // navColor options
    navColor1: "rgba(255, 255, 255,.75)",
    navColor2: "rgba(255, 255, 255,.75)",
    navColor3: "rgba(255, 255, 255,.75)",
    navColor4: "rgba(255, 255, 255,.75)",

    // navContent postining options
    nav1justifyContent: "flex-end",
    nav2justifyContent: "flex-end",
    nav3justifyContent: "flex-start",
    nav4justifyContent: "flex-start",

    // link related options
    link1Text: "Home",
    link1Url: "/",
    link1Size: "1.3vmax",
    link1Color: "rgba(35, 35, 35,0.8)",
    link1ColorHover: "#eb4034",
    link1Margin: "1vmax",
    link2Text: "Products",
    link2Url: "/products",
    link3Text: "Contact",
    link3Url: "/contact",
    link4Text: "About",
    link4Url: "/about",


}


const Header = () => {
    return (
        <ReactNavbar {...options}

            // icons related optios
            profileIcon={true}
            ProfileIconElement={FaUserAlt}
            profileIconUrl="/login"
            profileIconColor="rgba(35, 35, 35,0.8)"
            profileIconColorHover="#eb4034"

            searchIcon={true}
            SearchIconElement={FaSearch}
            searchIconColor="rgba(35, 35, 35,0.8)"
            searchIconColorHover="#eb4034"

            cartIcon={true}
            CartIconElement={FaCartPlus}
            cartIconColor="rgba(35, 35, 35,0.8)"
            cartIconColorHover="#eb4034"
            cartIconMargin="1vmax"
        />
    );
};

export default Header;