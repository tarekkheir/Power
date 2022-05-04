import React from 'react';
import './ProductBox.css';
import { useNavigate } from 'react-router-dom';

const ProductBox = ({ ...props }) => {
  const navigate = useNavigate();
  const { name, price, type, quantity, product_id, shop_id } = props;

  return (
    <div className='productbox' onClick={() => navigate(`/shop/${shop_id}/product/${product_id}`, { state: { product_id: product_id } })}>
      <h4>{name} ({quantity})</h4>
      <div className='image'></div>
      <ul className='product-infos'>
        <li>{price} €</li>
        <li>{type}</li>
      </ul>
    </div>
  );
};

export default ProductBox;