import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Table, Button, Modal, Pagination } from 'antd';
import { ToastContainer, toast } from 'react-toastify';
import { FileSearchOutlined } from '@ant-design/icons';
import axios from 'axios';

const PAGE_SIZE = 10;
const MAX_PRODUCTS_TO_COMPARE = 4;

const CompareProduct = () => {
  const location = useLocation();
  const [products, setProducts] = useState(location.state?.products || []);
  const [allProducts, setAllProducts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await axios.get('https://dummyjson.com/products', {
          params: {
            limit: PAGE_SIZE,
            skip: (page - 1) * PAGE_SIZE,
          },
        });
        setAllProducts(response.data.products);
        setTotalProducts(response.data.total);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };
    fetchAllProducts();
  }, [page]);

  const handleAddMore = () => {
    if (products.length >= MAX_PRODUCTS_TO_COMPARE) {
      toast.error(`You can only compare up to ${MAX_PRODUCTS_TO_COMPARE} products at a time.`);
      return;
    }
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    if (selectedProducts.length === 0) {
      toast.warning('Please select at least one product.');
      return;
    }
    const newProducts = selectedProducts.filter(sp => !products.find(p => p.id === sp.id));
    if (newProducts.length === 0) {
      toast.error('Selected products are already in the comparison list.');
    } else if (products.length + newProducts.length > MAX_PRODUCTS_TO_COMPARE) {
      toast.error(`You can only compare up to ${MAX_PRODUCTS_TO_COMPARE} products at a time.`);
    } else {
      setProducts(prev => [...prev, ...newProducts]);
      toast.success('Products added successfully!');
    }
    setIsModalVisible(false);
    setSelectedProducts([]);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSelectedProducts([]);
  };

  const handleProductSelect = (product) => {
    if (selectedProducts.find(p => p.id === product.id)) {
      setSelectedProducts(prev => prev.filter(p => p.id !== product.id));
    } else {
      setSelectedProducts(prev => [...prev, product]);
    }
  };

  const handleRemoveProduct = (productId) => {
    setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
    toast.success('Product removed successfully!');
  };

  const compareColumns = [
    {
      key: 'attribute',
      render: (_, record) => record.attribute,
    },
    ...products.map(product => ({
      title: (
        <div>
          <img
            src={product.thumbnail}
            alt={product.title}
            style={{ width: '100%', maxWidth: 100, height: 'auto', objectFit: 'cover' }}
          />
        </div>
      ),
      key: product.id,
      render: (_, record) => (
        record.values[product.id] || (
          record.attribute === 'Remove' ? (
            <button
              className="btn btn-danger text-nowrap"
              onClick={() => handleRemoveProduct(product.id)}
              type="button"
            >
              Remove Product
            </button>
          ) : '-'
        )
      ),
    })),
  ];

  const data = [
    { attribute: 'Name', values: products.reduce((acc, p) => ({ ...acc, [p.id]: p.title }), {}) },
    { attribute: 'Price', values: products.reduce((acc, p) => ({ ...acc, [p.id]: p.price }), {}) },
    { attribute: 'Category', values: products.reduce((acc, p) => ({ ...acc, [p.id]: p.category }), {}) },
    { attribute: 'Rating', values: products.reduce((acc, p) => ({ ...acc, [p.id]: p.rating }), {}) },
    { attribute: 'Discount Percentage', values: products.reduce((acc, p) => ({ ...acc, [p.id]: p.discountPercentage }), {}) },
    { attribute: 'Warranty Information', values: products.reduce((acc, p) => ({ ...acc, [p.id]: p.warrantyInformation }), {}) },
    { attribute: 'Availability Status', values: products.reduce((acc, p) => ({ ...acc, [p.id]: p.availabilityStatus }), {}) },
    { attribute: 'Remove', values: {} },
  ];

  const modalColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Brand',
      dataIndex: 'brand',
      key: 'brand',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
    },
    {
      title: 'Select',
      key: 'select',
      render: (text, record) => (
        <Button
          type={selectedProducts.find(p => p.id === record.id) ? "default" : "primary"}
          onClick={() => handleProductSelect(record)}
        >
          {selectedProducts.find(p => p.id === record.id) ? "Deselect" : "Select"}
        </Button>
      ),
    },
  ];

  return (
    <div className='p-3'>
      <div className="row align-items-center mb-4">
        <div className="col-md-6">
          <h2>Product Comparison</h2>
        </div>
        <div className="col-md-6 d-flex justify-content-md-end">
          <button
            type="button"
            onClick={handleAddMore}
            className='btn btn-primary px-5 py-2'
          >
            Add More
          </button>
        </div>
      </div>

      {products.length > 0 ? (
        <div className="table-responsive pt-5">
          <Table
            columns={compareColumns}
            dataSource={data}
            pagination={false}
            rowKey="attribute"
            bordered
            size="middle"
          />
        </div>
      ) : (
        <div className="d-flex justify-content-center align-items-center pt-5">
          <div className="text-center">
            <FileSearchOutlined style={{ fontSize: '100px' }} />
            <h4 className="mt-3">No data has been selected for comparison</h4>
          </div>
        </div>
      )}

      <Modal
        title="Select Product to Compare"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Add"
        cancelText="Cancel"
        width="90%"
        footer={
          <div className='gap-4'>
            <button className='btn btn-secondary px-5' onClick={handleModalCancel}>Cancel</button>
            <button className='btn btn-primary px-5 ms-4' onClick={handleModalOk}>Add</button>
          </div>
        }
      >
        <div className="table-responsive">
          <Table
            columns={modalColumns}
            dataSource={allProducts}
            rowKey="id"
            pagination={false}
          />
        </div>
        <Pagination
          current={page}
          pageSize={PAGE_SIZE}
          total={totalProducts}
          onChange={(newPage) => setPage(newPage)}
          className="mt-3"
        />
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default CompareProduct;
