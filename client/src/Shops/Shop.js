import React from 'react';
import { useParams } from 'react-router-dom';
import ProductList from '../Products/ProductList';

const Shop = () => {
  const params = useParams();

  return (
    <div className='shop'>
      <h1>Shop page {params.id}</h1>
      <ProductList shop_id={params.id} />
    </div>
  );
};

export default Shop;