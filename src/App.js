import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ProductDetails from './components/ProductDetails';
import CompareProduct from './components/CompareProduct';
import './style.css';


const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Router>
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} />
      <main id="main" className={`main ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`} style={{ minHeight: '100vh' }}>
        <Routes>
          <Route path="/" element={<ProductDetails />} />
          <Route path="/product-details" element={<ProductDetails />} />
          <Route path="/compare-product" element={<CompareProduct />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;
