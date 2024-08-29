import React, { useCallback, useEffect, useState } from 'react';
import { Table, Button, Pagination } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

const PAGE_SIZE = 10;

const ProductDetails = () => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [averagePrice, setAveragePrice] = useState(0);
  const [highestRatedProduct, setHighestRatedProduct] = useState(null);
  const [highestDiscountProduct, setHighestDiscountProduct] = useState(null);

  const navigate = useNavigate();

  const fetchData = useCallback(async (page) => {
    setLoading(true);
    try {
      const response = await axios.get('https://dummyjson.com/products', {
        params: {
          limit: PAGE_SIZE,
          skip: (page - 1) * PAGE_SIZE,
        },
      });
      const products = response.data.products;
      setData(products);
      setTotal(response.data.total);

      // Calculate statistics
      const avgPrice = products.reduce((sum, product) => sum + product.price, 0) / products.length;
      setAveragePrice(avgPrice);

      const highestDiscount = products.reduce((max, product) => product.discountPercentage > max.discountPercentage ? product : max, products[0]);
      setHighestDiscountProduct(highestDiscount);

      const highestRated = products.reduce((max, product) => product.rating > max.rating ? product : max, products[0]);
      setHighestRatedProduct(highestRated);

    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData(current);
  }, [fetchData, current]);

  const handleSelectProduct = (product) => {
    if (selectedProducts.length >= 4 && !selectedProducts.find(p => p.id === product.id)) {
      toast.warning("You can only compare up to 4 products.");
      return;
    }

    setSelectedProducts(prevSelected => {
      if (prevSelected.find(p => p.id === product.id)) {
        return prevSelected.filter(p => p.id !== product.id);
      }
      return [...prevSelected, product];
    });
  };

  const handleCompare = () => {
    if (selectedProducts.length >= 2) {
      navigate('/compare-product', { state: { products: selectedProducts } });
    } else {
      toast.warning("Please select at least 2 products to compare.");
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: 'Image',
      dataIndex: 'thumbnail',
      key: 'thumbnail',
      render: (thumbnail) => (
        <img
          src={thumbnail}
          alt="Product Thumbnail"
          style={{ width: 70, height: 70, objectFit: 'cover' }}
        />
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      sorter: (a, b) => a.description.localeCompare(b.description),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: 'Discount Percentage',
      dataIndex: 'discountPercentage',
      key: 'discountPercentage',
      sorter: (a, b) => a.discountPercentage - b.discountPercentage,
    },
    {
      title: 'Brand',
      dataIndex: 'brand',
      key: 'brand',
      sorter: (a, b) => a.brand.localeCompare(b.brand),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      sorter: (a, b) => a.category.localeCompare(b.category),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Button
          onClick={() => handleSelectProduct(record)}
          type="primary"
          style={{ marginRight: '8px' }}
        >
          {selectedProducts.find(p => p.id === record.id) ? 'Remove' : 'Select'}
        </Button>
      ),
    },
  ];

  const handlePageChange = (page) => {
    setCurrent(page);
  };

  return (
    <div className='p-2'>
      <h2 className='mb-4 mt-2'>Product Details</h2>
      <div className='row mb-5'>
        <div className='col-lg-3 col-md-3 col-12 mt-3 mt-lg-0 mt-md-0'>
          <div className="card bg-light border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="card-title text-muted">Total Products</h6>
                  <h4 className="card-text">{total}</h4>
                </div>
                <div
                  className="btn btn-lg rounded-circle fs-6 d-flex align-items-center justify-content-center bg-success bg-opacity-50 text-light"
                >
                  <i class="bi bi-box-seam"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='col-lg-3 col-md-3 col-12 mt-3 mt-lg-0 mt-md-0'>
          <div className="card bg-light border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="card-title text-muted">Average Price</h6>
                  <h4 className="card-text">{averagePrice.toFixed(2)}</h4>
                </div>
                <div
                  className="btn btn-lg rounded-circle fs-6 d-flex align-items-center justify-content-center bg-primary bg-opacity-50 text-light"
                >
                  <i class="bi bi-currency-dollar"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='col-lg-3 col-md-3 col-12 mt-3 mt-lg-0 mt-md-0'>
          <div className="card bg-light border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="card-title text-muted">Highest Rated Product</h6>
                  {highestRatedProduct ? (
                    <h4 className="card-text">{highestRatedProduct.rating}</h4>
                  ) : (
                    <p className="card-text">No data available</p>
                  )}
                </div>
                <div
                  className="btn btn-lg rounded-circle fs-6 d-flex align-items-center justify-content-center bg-danger bg-opacity-50 text-light"
                >
                  <i class="bi bi-star-fill"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='col-lg-3 col-md-3 col-12 mt-3 mt-lg-0 mt-md-0'>
          <div className="card bg-light border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="card-title text-muted">Highest Discount Product</h6>
                  {highestDiscountProduct ? (
                    <h4 className="card-text">{highestDiscountProduct.discountPercentage} %</h4>
                  ) : (
                    <p className="card-text">No data available</p>
                  )}
                </div>
                <div
                  className="btn btn-lg rounded-circle fs-6 d-flex align-items-center justify-content-center bg-warning bg-opacity-50 text-light"
                >
                  <i class="bi bi-percent"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed-header-table">
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          pagination={false}
        />
      </div>

      <div className="row mt-3">
        <div className="col-lg-6 col-md-6 col-12">
          <Pagination
            current={current}
            pageSize={PAGE_SIZE}
            total={total}
            onChange={handlePageChange}
            showSizeChanger={false}
          />
        </div>
        <div className="col-lg-6 col-md-6 col-12 text-end">
          <Button
            type="primary"
            onClick={handleCompare}
            disabled={selectedProducts.length < 2}
          >
            Compare Selected Products
          </Button>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default ProductDetails;
