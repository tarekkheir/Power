import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import ProductList from '../Products/ProductList';
import './Shop.css';

const Shop = () => {
  const params = useParams();
  const { id } = params;
  const location = useLocation();
  const { shop_name } = location.state;

  return (
    <div className='shop'>
      <h1>{shop_name}</h1>
      <ProductList shop_id={id} />
    </div>
  );
};

export default Shop;