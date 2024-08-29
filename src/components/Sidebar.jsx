import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ isOpen }) => {
  return (
    <aside id="sidebar" className={`sidebar ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <ul className="sidebar-nav" id="sidebar-nav">
        <li className="nav-item">
          <Link className="nav-link" to="/product-details">
            <i className="bi bi-grid"></i>
            <span>Product Details</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/compare-product">
            <i class="bi bi-box-seam"></i>
            <span>Compare Product</span>
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
