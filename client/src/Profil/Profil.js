import React, { useContext, useEffect, useState } from 'react';
import AppContext from '../App/AppContext';
import './Profil.css';
import axios from 'axios';
import ShopBox from '../Shops/ShopBox';
import { useNavigate } from 'react-router-dom';

const Profil = () => {
  const context = useContext(AppContext);
  const navigate = useNavigate();
  const { user: { username, user_id, role } } = context;
  const [new_name, setNew_name] = useState('');
  const [shop, setShop] = useState([]);

  useEffect(() => {
    if (role === 'moderator') {
      axios.get(`http://localhost:8080/myshop/${user_id}`)
        .then((res) => {
          if (res.data) {
            const { name, location, type, open_hours } = res.data;
            setShop({ name: name, location: location, open_hours: open_hours, type: type });
          }
          console.log('axios called');
        })
        .catch((err) => {
          console.log('error on axios get', err);
        })
    }
    console.log('you are a user');
  }, [user_id, role, setShop])


  const handleChangeUsername = (event) => {
    event.preventDefault();
    setNew_name({ new_name: event.target.value });
  }

  const changeUsername = (event) => {
    event.preventDefault();

    if (new_name !== username) {
      console.log('new username: ', new_name);
    } else console.log('Username don\'t change');
  }

  return (
    <div className='profil'>
      <h1>{username} profil !</h1>
      <div className='profil-container'>
        <div className='profil-details'>
          <h3>Details</h3>
          <ul className='profil-list center' onSubmit={(event) => changeUsername(event)}>
            <li className='profil-item'>
              <label>Username</label>
              <input value={new_name} type='text' onChange={(event) => handleChangeUsername(event)} />
            </li>
            <li className='profil-item'>
              <label>Password</label>
              <input value={new_name} type='text' onChange={(event) => handleChangeUsername(event)} />
            </li>
            <li className='profil-item'>
              <label>Email</label>
              <input value={new_name} type='text' onChange={(event) => handleChangeUsername(event)} />
            </li>
            <li className='profil-item'><button type='submit'>Submit changes</button></li>
          </ul>
        </div>

        {shop.lenght > 0 && role === 'moderator' ? (<div className='profil-shop'>
          <h3>My Shop</h3>
          <div className='shop-details'>
            <ShopBox name={shop.name} location={shop.location} open_hours={shop.open_hours} type={shop.type} />
          </div>
        </div>) : role === 'user' ? (<h3>History</h3>) : (
          <div>
            <h3>My Shop</h3>
            <button className='add-shop-button' onClick={() => navigate('/add_shop', { state: { boss_id: user_id } })}>+</button>
          </div>)}
      </div>
    </div>
  );
};

export default Profil;