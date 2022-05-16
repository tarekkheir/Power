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
  const [file, setFile] = useState();
  const navigate = useNavigate();
  const context = useContext(AppContext);
  const boss_id = context.user.user_id;


  const postShop = (e) => {
    e.preventDefault();
    const open_hours = `${openHour} - ${closeHour}`;
    const accessToken = sessionStorage.getItem('accessToken');
    const headers = { 'authorization': accessToken };
    const data = new FormData();

    data.append('file', file);
    data.append('boss_id', boss_id);
    data.append('name', name);
    data.append('location', location);
    data.append('open_hours', open_hours);
    data.append('type', type);

    axios.post('http://localhost:8080/add_shop', data, { headers })
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
    if (e.target.value && location && openHour && closeHour && type && file) {
      setEnableSubmit(false);
    } else setEnableSubmit(true);

    setName(e.target.value);
  }

  const locationChange = (e) => {
    e.preventDefault();
    if (e.target.value && name && openHour && closeHour && type && file) {
      setEnableSubmit(false);
    } else setEnableSubmit(true);

    setLocation(e.target.value);
  }

  const typeChange = (e) => {
    e.preventDefault();
    if (e.target.value && name && location && openHour && closeHour && file) {
      setEnableSubmit(false);
    } else setEnableSubmit(true);

    setType(e.target.value);
  }

  const openhourChange = (e) => {
    e.preventDefault();
    if (e.target.value && name && location && closeHour && type && file) {
      setEnableSubmit(false);
    } else setEnableSubmit(true);

    setOpenHour(e.target.value);
  }

  const closeHourChange = (e) => {
    if (e.target.value && name && location && type && openHour && file) {
      setEnableSubmit(false);
    } else setEnableSubmit(true);

    setCloseHour(e.target.value);
  }

  const handleFileChange = (e) => {
    e.preventDefault();
    if (e.target.value && name && location && type && openHour && closeHour) {
      setEnableSubmit(false);
    } else setEnableSubmit(true);

    setFile(e.target.files[0]);
  }

  return (
    <div className='addshop'>
      <h1>Add Shop</h1>
      <form className='addshop-details' onSubmit={(e) => postShop(e)}>
        <div className='addshop-details-item'>
          <label className='addshop-details-item-label text-align-start'>Shop Name</label>
          <input className='addshop-details-item-input' type='text' onChange={(e) => nameChange(e)} />
        </div>
        <div className='addshop-details-item'>
          <label className='addshop-details-item-label text-align-start'>Location</label>
          <input className='addshop-details-item-input' type='text' onChange={(e) => locationChange(e)} />
        </div>
        <div className='addshop-details-item-triple'>
          <div className='add-hours'>
            <label className='addshop-details-item-label text-align-center'>Open Hours</label>
            <div className='openhours'>
              <input className='addshop-details-item-input-hours' type="time" id="open" name="open"
                min="00:00" max="23:59" required onChange={(e) => openhourChange(e)} />
              <input className='addshop-details-item-input-hours' type="time" id="close" name="close"
                min="00:00" max="23:59" required onChange={(e) => closeHourChange(e)} />
            </div>
          </div>
          <div className='upload-picture text-align-center shadow-left'>
            <label className='addshop-details-item-label text-align-center'>Product Image</label>
            <input className='text-align-center' type='file' onChange={(e) => handleFileChange(e)} />
          </div>
          <div className='upload-picture shadow-left'>
            <label className='addshop-details-item-label text-align-center'>Type of shop</label>
            <select className='addshop-details-item-select text-align-center' value={type} onChange={(e) => typeChange(e)}>
              <option value='Fast Food'>Fast Food</option>
              <option value='Good Food'>Good Food</option>
            </select>
          </div>
        </div>
        <button type='submit' className='addshop-details-button' disabled={enableSubmit} >ADD SHOP</button>
      </form>
    </div>
  );
};

export default AddShop;