import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppContext from '../App/AppContext';
import './ProfilShop.css';
import profil from '../images/profil.png';

const ProfilShop = () => {
  const [name, setName] = useState('');
  const [type, setType] = useState('Fast Food');
  const [location, setLocation] = useState('');
  const [openHour, setOpenHour] = useState('');
  const [closeHour, setCloseHour] = useState('');
  const [enableSubmit, setEnableSubmit] = useState(true);
  const context = useContext(AppContext);
  const { user_id, username } = context;
  const [shop, setShop] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:8080/myshop/${user_id}`)
      .then((shop) => {
        if (Object.keys(shop.data).length > 1) {
          const { name, location, open_hours, id, type } = shop.data;
          const hours = open_hours.split(' - ');
          const open = hours[0];
          const close = hours[1];
          setShop({ name, location, open, close, id, type });
          setName(name);
          setType(type);
          setLocation(location);
          setOpenHour(open);
          setCloseHour(close);

        } else console.log(shop.data.message);
      })
      .catch((err) => {
        console.log('error on axios get myshop: ', err);
      })
  }, [user_id])


  const updateShop = (e) => {
    e.preventDefault();
    console.log('Update shop function called');
  }

  const nameChange = (e) => {
    e.preventDefault();
    if (e.target.value !== shop.name && e.target.value && location && openHour && closeHour) {
      setEnableSubmit(false);
    } else setEnableSubmit(true);

    setName(e.target.value);
  }

  const locationChange = (e) => {
    e.preventDefault();
    if (e.target.value !== shop.location && e.target.value && name && openHour && closeHour) {
      setEnableSubmit(false);
    } else setEnableSubmit(true);

    setLocation(e.target.value);
  }

  const typeChange = (e) => {
    e.preventDefault();
    if (e.target.value !== shop.type && e.target.value && name && location && openHour && closeHour) {
      setEnableSubmit(false);
    } else setEnableSubmit(true);

    setType(e.target.value);
  }

  const openhourChange = (e) => {
    e.preventDefault();
    if (e.target.value !== shop.open && e.target.value && name && location && closeHour) {
      console.log('enter to enable');
      setEnableSubmit(false);
    } else setEnableSubmit(true);

    setOpenHour(e.target.value);
  }

  const closeHourChange = (e) => {
    if (e.target.value !== shop.close && e.target.value && name && location && type && openHour) {
      setEnableSubmit(false);
    } else setEnableSubmit(true);

    setCloseHour(e.target.value);
  }

  console.log(shop);

  return (
    <div className='profil-shop'>
      <div className='profil-name'>
        <img src={profil} height='70' width='70' alt='profil' />
        <h1>{username}</h1>
      </div>
      <div className='profil-shop-container'>
        {Object.keys(shop).length > 0 ? (
          <div className='myshop'>
            <h2>{shop.name}</h2>
            <form className='myshop-list' onSubmit={(e) => updateShop(e)}>
              <div className='myshop-list-item'>
                <label>Shop Name</label>
                <input value={name} type='text' onChange={(e) => nameChange(e)} />
              </div>
              <div className='myshop-list-item'>
                <label>Location</label>
                <input value={location} type='text' onChange={(e) => locationChange(e)} />
              </div>
              <div className='myshop-list-item'>
                <label>Open Hours</label>
                <div className='myshop-openhours'>
                  <input value={openHour} type="time" id="open" name="open"
                    min="00:00" max="23:59" required onChange={(e) => openhourChange(e)} />
                  <input value={closeHour} type="time" id="close" name="close"
                    min="00:00" max="23:59" required onChange={(e) => closeHourChange(e)} />
                </div>
              </div>
              <div className='myshop-list-item'>
                <label>Type of shop</label>
                <select value={type} onChange={(e) => typeChange(e)}>
                  <option value='fast food'>Fast Food</option>
                  <option value='good food'>Good Food</option>
                </select>
              </div>
              <button disabled={enableSubmit} id='submit-shop-details' >Submit Changes</button>
            </form>
          </div>
        ) : (
          <div>
            <h3>You have no shop registered</h3>
            <button onClick={() => navigate('/add_shop')}>Add Shop</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilShop;