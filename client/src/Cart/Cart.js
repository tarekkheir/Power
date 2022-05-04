import React, { useContext, useEffect, useState } from 'react';
import AppContext from '../App/AppContext';
import './Cart.css';
import profil from '../images/profil.png';
import axios from 'axios';
import CartProduct from './CartProduct';


const Cart = () => {
  const context = useContext(AppContext);
  const [products, setProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const { username, user_id } = context;


  useEffect(() => {
    axios.get(`http://localhost:8080/mycart/${user_id}`)
      .then((products) => {
        if (products.data.success) {
          console.log('products: ', products.data);
          const datas = [];
          products.data.datas.map((product) => {
            const { quantity, expire_date, name, price, product_id, shop_id } = product;
            datas.push({ quantity, name, expire_date, price, product_id, shop_id });
            return 1;
          })
          setProducts(datas);
          let total = 0;
          datas.map((data) => {
            const { price, quantity } = data;
            total = total + (price * quantity);
            return 1;
          })
          setTotalPrice(total);
        }
      })
      .catch((err) => {
        console.log('error on axios get cart: ', err);
      })
  }, [user_id])

  console.log('products: ', products);

  return (
    <div className='cart'>
      <div className='profil-name'>
        <img src={profil} height='70' width='70' alt='profil' />
        <h1>{username}</h1>
      </div>
      <ul className='list-cart'>
        {products.length > 0 ? (
          products.map((product) => {
            const { expire_date, name, quantity, price, product_id, shop_id } = product;
            return <CartProduct key={expire_date} targetDate={expire_date} name={name} quantity={quantity} price={price} product_id={product_id} shop_id={shop_id} />
          })
        ) : <h2>No products in your Cart...</h2>}
      </ul>
      <h3>Total :&nbsp;&nbsp;&nbsp;&nbsp;{totalPrice.toFixed(2)} €</h3>
    </div >
  );
};

export default Cart;