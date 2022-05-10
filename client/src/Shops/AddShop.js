import React, { useContext, useState } from 'react';
import './AddShop.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AppContext from '../App/AppContext';

const AddShop = () => {
  const [name, setName] = useState('');
  const [type, setType] = useState('Fast Food');
  const [location, setLocation] = useState('');
  const [openHour, setOpenHour] = useState('');
  const [closeHour, setCloseHour] = useState('');
  const [enableSubmit, setEnableSubmit] = useState(true);
  const navigate = useNavigate();
  const context = useContext(AppContext);
  const boss_id = context.id;


  const postShop = (e) => {
    e.preventDefault();
    const open_hours = `${openHour} - ${closeHour}`;
    const accessToken = sessionStorage.getItem('accessToken');
    const headers = { 'authorization': accessToken };
    axios.post('http://localhost:8080/add_shop', { name, type, location, open_hours, boss_id }, { headers })
      .then((res) => {
        console.log(res);
        const { message } = res.data;
        alert(message);
        navigate('/profil/myshop');
      })
      .catch((err) => {
        console.log('error on axios add shop post', err);
      })
  }


  const nameChange = (e) => {
    e.preventDefault();
    if (e.target.value && location && openHour && closeHour) {
      setEnableSubmit(false);
    } else setEnableSubmit(true);

    setName(e.target.value);
  }

  const locationChange = (e) => {
    e.preventDefault();
    if (e.target.value && name && openHour && closeHour) {
      setEnableSubmit(false);
    } else setEnableSubmit(true);

    setLocation(e.target.value);
  }

  const typeChange = (e) => {
    e.preventDefault();
    if (e.target.value && name && location && openHour && closeHour) {
      setEnableSubmit(false);
    } else setEnableSubmit(true);

    setType(e.target.value);
  }

  const openhourChange = (e) => {
    e.preventDefault();
    if (e.target.value && name && location && closeHour) {
      setEnableSubmit(false);
    } else setEnableSubmit(true);

    setOpenHour(e.target.value);
  }

  const closeHourChange = (e) => {
    if (e.target.value && name && location && type && openHour) {
      setEnableSubmit(false);
    } else setEnableSubmit(true);

    setCloseHour(e.target.value);
  }

  return (
    <div className='addshop'>
      <h1>Add Shop</h1>
      <form className='addshop-details' onSubmit={(e) => postShop(e)}>
        <label>Shop Name</label>
        <input type='text' onChange={(e) => nameChange(e)} />
        <label>Location</label>
        <input type='text' onChange={(e) => locationChange(e)} />
        <label>Open Hours</label>
        <div className='openhours'>
          <input type="time" id="open" name="open"
            min="00:00" max="23:59" required onChange={(e) => openhourChange(e)} />
          <input type="time" id="close" name="close"
            min="00:00" max="23:59" required onChange={(e) => closeHourChange(e)} />
        </div>
        <label>Type of shop</label>
        <select value='fast food' onChange={(e) => typeChange(e)}>
          <option value='fast food'>Fast Food</option>
          <option value='good food'>Good Food</option>
        </select>
        <button disabled={enableSubmit} >Submit</button>
      </form>
    </div>
  );
};

export default AddShop;