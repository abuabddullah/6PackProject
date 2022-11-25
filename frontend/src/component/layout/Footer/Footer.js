import React from 'react';
import "./Footer.css"
import googlePlay from "./../../../images/google-play.png"
import appleStore from "./../../../images/app-store.png"
const Footer = () => {
    return (
        <footer className="footer">
            <div className="container footer-content">

                <div className="leftFooter">
                    <h5>Download our App for Android & IOS mobile Phone</h5>
                    <div>
                        <a href="#" target="_blank"><img src={googlePlay} alt="googlePlay" /></a>
                        <a href="#" target="_blank"><img src={appleStore} alt="appleStore" /></a>
                    </div>
                </div>

                <div className="midFooter">
                    <h1>road to 6pack</h1>
                </div>
                
                <div className="rightFooter">
                    <h5>Follow Us</h5>
                    <ul>
                        <li><a href="#" target="_blank">Youtube</a></li>
                        <li><a href="#" target="_blank">Facebook</a></li>
                        <li><a href="#" target="_blank">Instagram</a></li>
                    </ul>
                </div>
            </div>
            <p>All rights reserved @2022</p>
        </footer>
    );
};

export default Footer;