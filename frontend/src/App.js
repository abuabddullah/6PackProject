import './App.css';
import Header from "./component/layout/Header/Header.js"
import Footer from "./component/layout/Footer/Footer.js"
import { Route, Routes } from 'react-router-dom';
import WebFont from "webfontloader";
import { useEffect } from 'react';

function App() {
  //loading font from webfontloader  
  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      }
    });
  }, [])


  return (
    <div className="App56fg1h">
      <h1>Welcome to 6 Pack Projects!</h1>
      <Header />

      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        {/* <Route path="about" element={<About />} /> */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
