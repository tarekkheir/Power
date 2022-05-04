import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CountdownTimer } from './CountDown';

const CartProduct = ({ targetDate, name, quantity, price, product_id, shop_id }) => {
  const navigate = useNavigate();

  return (
    <li className='list-cart-item' >
      <div className='list-cart-item-product'>
        <div className='list-cart-item-product-image'>
          <button id='delete-button'>X</button>
        </div>
        <h3 id='cart-product-name' onClick={() => navigate(`/shop/${shop_id}/product/${product_id}`, { state: { product_id: product_id } })}>{name} ({quantity})</h3>
      </div>
      <div className='list-cart-item-countdown'>
        <CountdownTimer targetDate={targetDate} />
        <span id='cart-product-price'>{parseFloat(quantity * price).toFixed(2)} €</span>
      </div>
    </li>
  );
};

export default CartProduct;