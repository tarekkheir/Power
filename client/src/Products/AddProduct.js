import React, { useContext, useState } from 'react';
import './AddProduct.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AppContext from '../App/AppContext';

const AddProduct = () => {
  const [name, setName] = useState('');
  const [type, setType] = useState('salt');
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [enableSubmit, setEnableSubmit] = useState(true);
  const [file, setFile] = useState();
  const [description, setDescription] = useState('');
  const navigate = useNavigate();
  const context = useContext(AppContext);
  const boss_id = context.user.user_id;


  const postProduct = (e) => {
    e.preventDefault();
    const accessToken = sessionStorage.getItem('accessToken');
    const headers = { 'authorization': accessToken };
    const data = new FormData();

    data.append('file', file);
    data.append('boss_id', boss_id);
    data.append('name', name);
    data.append('description', description);
    data.append('price', price);
    data.append('quantity', quantity);
    data.append('type', type);

    console.log(data);

    axios.post('http://localhost:8080/add_product', data, { headers })
      .then((res) => {
        console.log(res.data);
        if (res.data.success) {
          const { message } = res.data;
          alert(message);
          navigate('/profil/myshop');
        } else alert(res.data.message);
      })
      .catch((err) => {
        console.log('error on axios add shop post', err);
      })
  }


  const nameChange = (e) => {
    e.preventDefault();
    if (e.target.value && price > 0 && type && file && description) {
      setEnableSubmit(false);
    } else setEnableSubmit(true);

    setName(e.target.value);
  }

  const priceChange = (e) => {
    e.preventDefault();
    if (e.target.value > 0 && name && type && file && description) {
      setEnableSubmit(false);
    } else setEnableSubmit(true);

    setPrice(e.target.value);
  }

  const typeChange = (e) => {
    e.preventDefault();
    if (e.target.value && name && price > 0 && file && description) {
      setEnableSubmit(false);
    } else setEnableSubmit(true);

    setType(e.target.value);
  }

  const quantityChange = (e) => {
    e.preventDefault();
    if (e.target.value && name && price > 0 && type && file && description) {
      setEnableSubmit(false);
    } else setEnableSubmit(true);

    setQuantity(e.target.value);
  }

  const handleFileChange = (e) => {
    e.preventDefault();
    if (e.target.value && name && price > 0 && type && description) {
      setEnableSubmit(false);
    } else setEnableSubmit(true);

    setFile(e.target.files[0]);
  }

  const handleDescriptionChange = (e) => {
    e.preventDefault();
    if (e.target.value && name && price > 0 && type && file) {
      setEnableSubmit(false);
    } else setEnableSubmit(true);
    setDescription(e.target.value)
  }

  console.log('file: ', file);

  return (
    <div className='addshop'>
      <h1>Add Product</h1>
      <form className='addshop-details' onSubmit={(e) => postProduct(e)}>
        <div className='addshop-details-item'>
          <label className='addshop-details-item-label text-align-start'>Product Name</label>
          <input className='addshop-details-item-input' maxLength={35} value={name} type='text' onChange={(e) => nameChange(e)} />
        </div>
        <div className='addshop-details-item-values'>
          <div className='type-of-product text-align-start'>
            <label className='addshop-details-item-label text-align-start'>Type of Product</label>
            <select className='addshop-details-item-select text-align-center' value={type} onChange={(e) => typeChange(e)}>
              <option value='salt'>Salt</option>
              <option value='sweat'>Sweat</option>
            </select>
          </div>
          <div className='upload-picture text-align-center'>
            <label className='addshop-details-item-label text-align-center'>Product Image</label>
            <input className='text-align-center' type='file' onChange={(e) => handleFileChange(e)} />
          </div>
        </div>
        <div className='addshop-details-item-values'>
          <div className='add-price'>
            <label className='text-align-start addshop-details-item-label'>Price</label>
            <div className='input-price'>
              <input
                className='addshop-details-item-input-number text-align-start'
                type="number"
                min="0.00"
                max="100.00"
                step="0.01"
                value={price}
                onChange={(e) => priceChange(e)} />
              <span id='euro'>€</span>
            </div>
          </div>
          <div className='add-quantity'>
            <label className='text-align-start addshop-details-item-label'>Quantity</label>
            <input
              className='addshop-details-item-input-number text-align-start'
              type='number'
              min='0'
              max='999'
              value={quantity}
              onChange={(e) => quantityChange(e)} />
          </div>
        </div>
        <div className='addshop-details-item'>
          <label className='text-align-start addshop-details-item-label'>Description</label>
          <textarea className='textarea-product' minLength={20} value={description} onChange={(e) => handleDescriptionChange(e)} />
        </div>
        <button type='submit' className='addshop-details-button' disabled={enableSubmit} >ADD PRODUCT</button>
      </form>
    </div>
  );
};

export default AddProduct;