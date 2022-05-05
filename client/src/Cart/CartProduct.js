import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CountdownTimer } from './CountDown';
import AppContext from '../App/AppContext';
import axios from 'axios';

const CartProduct = ({ targetDate, name, quantity, price, product_id, shop_id }) => {
  const navigate = useNavigate();
  const context = useContext(AppContext);
  const { user_id } = context;

  const deleteFromCart = (e) => {
    if (window.confirm('Are you sure to delete this product ?')) {
      e.preventDefault();

      axios.post('http://localhost:8080/delete_from_cart', { quantity, product_id, shop_id, user_id })
        .then((cart) => {
          if (cart.data.success) {
            alert(cart.data.message);
            window.location.reload();
          } else alert(cart.data.message);
        })
        .catch((err) => {
          console.log('error on axios delete cart: ', err);
        })
    }
  }

  return (
    <li className='list-cart-item' >
      <div className='list-cart-item-product'>
        <div className='list-cart-item-product-image'>
          <button id='delete-button' onClick={(e) => deleteFromCart(e)}>X</button>
        </div>
        <h3 id='cart-product-name' onClick={() => navigate(`/shop/${shop_id}/product/${product_id}`,
          { state: { product_id: product_id } })}>{name} ({quantity})
        </h3>
      </div>
      <div className='list-cart-item-countdown'>
        <CountdownTimer targetDate={targetDate} product_id={product_id} shop_id={shop_id} quantity={quantity} name={name} />
        <span id='cart-product-price'>{parseFloat(quantity * price).toFixed(2)} €</span>
      </div>
    </li>
  );
};

export default CartProduct;