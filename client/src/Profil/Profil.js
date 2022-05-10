import React, { useContext, useEffect, useState } from 'react';
import AppContext from '../App/AppContext';
import './Profil.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import profil from '../images/profil.png';
import shop_icon from '../images/shop.png';
import historical from '../images/historical.png';
import user from '../images/user.png';
import cart from '../images/cart.png';

const Profil = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();
  const { user: { username, user_id, role } } = context;
  const [shop, setShop] = useState([]);

  useEffect(() => {
    if (role === 'moderator') {
      axios.get(`http://localhost:8080/myshop/${user_id}`)
        .then((res) => {
          if (res.data) {
            const { name, location, type, open_hours, boss_id } = res.data;
            setShop({ name: name, location: location, open_hours: open_hours, type: type, boss_id: boss_id });
          }
          console.log('axios called');
        })
        .catch((err) => {
          console.log('error on axios get', err);
        })
    }
    console.log('you are a user');
  }, [user_id, role, setShop])

  console.log('shop: ', shop);
  console.log('shop length: ', Object.keys(shop).length > 0);
  console.log('role: ', role);

  return (
    <div className='profil'>
      <div className='profil-name'>
        <img src={profil} height='70' width='70' alt='profil' />
        <h1>{username}</h1>
      </div>
      <div className='list-container'>
        <ul className='profil-list'>
          <li className='list-item' onClick={() => navigate('/profil/profil_details')}>
            <img src={user} height='50' width='50' alt='user' />
            <h2>Profil</h2>
            <p>Modify your profil details</p>
          </li>
          <li className='list-item' onClick={() => navigate('/')}>
            <img src={historical} height='50' width='50' alt='historic' />
            <h2>Historical</h2>
            <p>Follow my current and past transaction</p>
          </li>
          <li className='list-item' onClick={() => navigate('/profil/cart')}>
            <img src={cart} height='50' width='50' alt='cart' />
            <h2>Cart</h2>
            <p>Manage your cart and transaction</p>
          </li>
          {role === 'moderator' || role === 'admin' ?
            <li className='list-item' onClick={() => navigate('/profil/myshop')}>
              <img src={shop_icon} height='50' width='50' alt='shop' />
              <h2>Shop</h2>
              <p>Manage your shop details and products</p>
            </li> : (null)}
        </ul>
      </div>
    </div>
  );
};

export default Profil;
