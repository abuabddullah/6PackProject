import logo from './logo.svg';
import './App.css';
import Header from "./component/layout/Header/Header.js"
import { Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="App">
    <h1>Welcome to React Router!</h1>
    <Routes>
      <Route path="/" element={<Header />} />



      {/* <Route path="/" element={<Home />} /> */}
      {/* <Route path="about" element={<About />} /> */}
    </Routes>
    </div>
  );
}

export default App;
