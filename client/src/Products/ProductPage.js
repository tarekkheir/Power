import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AppContext from '../App/AppContext';
import './ProductPage.css';

const Product = () => {
  const location = useLocation();
  const { product_id } = location.state;
  const [count, setCount] = useState(0);
  const [disabled, setDisabled] = useState(true);
  const context = useContext(AppContext);
  const { user_id } = context;
  const navigate = useNavigate();
  const [product, setProduct] = useState({ name: '', price: 0, quantity: 0, shop_id: 0 })


  useEffect(() => {
    if (count) setDisabled(false);
    else setDisabled(true)

    axios.get(`http://localhost:8080/product/${product_id}`)
      .then((product) => {
        if (product.data.success) {
          const { name, price, quantity, shop_id } = product.data;
          setProduct({ name: name, price: price, quantity: quantity, shop_id: shop_id });
        } else alert(product.data.message);
      })
  }, [product_id, count, setDisabled]);

  const addCart = (e) => {
    e.preventDefault();
    const THIRTY_MINUTES_IN_MS = 30 * 60 * 1000;
    const NOW_IN_MS = new Date().getTime();
    const targetDate = NOW_IN_MS + THIRTY_MINUTES_IN_MS;
    console.log(product);

    axios.post('http://localhost:8080/add_to_cart', {
      name: product.name,
      quantity: count,
      product_id: product_id,
      shop_id: product.shop_id,
      user_id: user_id,
      expire_date: targetDate,
      price: product.price
    })
      .then((cart) => {
        if (cart.data.success) {
          alert(cart.data.message);
          navigate(`/profil/cart`);
        } else alert(cart.data.message);
      })
      .catch((err) => {
        console.log('error on adding product to the cart: ', err);
      })
    setCount(0);
  }

  const plus = () => {
    if (count < product.quantity) {
      setCount(count + 1);
    }
  }

  const minus = () => {
    if (count) {
      setCount(count - 1);
    }
  }

  return (
    <div className='productpage'>
      <div className='product-image'>image</div>
      <div className='product-description'>
        <h1>{product.name} ({product.quantity})</h1>
        <h3>Description</h3>
        <p>Le lorem ipsum est, en imprimerie, une suite de mots sans
          signification utilisée à titre provisoire pour calibrer
          une mise en page, le texte définitif venant remplacer le
          faux-texte dès qu'il est prêt ou que la mise en page est achevée.
          Généralement, on utilise un texte en faux latin, le Lorem ipsum ou Lipsum.</p>
        <h4>{product.price} €</h4>
        <div className='count'>
          <button onClick={() => minus()}>-</button>
          <h4>{count}</h4>
          <button onClick={() => plus()}>+</button>
        </div>
        <button disabled={disabled} className='cart-button' onClick={(e) => addCart(e)}>
          <span>{count * product.price} €</span>
        </button>
      </div>
    </div >
  );
};

export default Product;
