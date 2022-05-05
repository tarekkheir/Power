import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AppContext from '../App/AppContext';
import './ProfilProduct.css';
import profil from '../images/profil.png';

const ProfilProduct = () => {
  const params = useParams();
  const { id } = params;
  const context = useContext(AppContext);
  const { user_id, username } = context;
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [type, setType] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [enableSubmit, setEnableSubmit] = useState(true);
  const [product, setProduct] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:8080/product/${id}`)
      .then((product) => {
        if (product.data.success) {
          const { name, price, type, quantity, id } = product.data;
          setName(name);
          setPrice(price);
          setQuantity(quantity);
          setType(type);
          setProduct({ name, price, type, quantity, id });
        } else {
          console.log(product.data.message);
          navigate('/profil');
        }
      })
      .catch((err) => {
        console.log('error on axios get product', err);
      })
  }, [id, navigate])

  const updateProduct = (e) => {
    e.preventDefault();
    const accessToken = sessionStorage.getItem('accessToken');
    const headers = { 'authorization': accessToken };
    const product_id = product.id;
    axios.post('http://localhost:8080/update_product', { name, quantity, price, type, product_id }, { headers: headers })
      .then((product) => {
        console.log(product);
        if (Object.keys(product.data).length > 1) {
          if (product.data.success) {
            alert(product.data.message);
            navigate('/profil/myshop');
          }
        } else console.log(product.data.message);
      })
      .catch((err) => {
        console.log('error on update', err);
      })
  }

  const deleteProduct = (e) => {
    if (window.confirm('Are you sure to delete this shop ?')) {
      e.preventDefault();
      const accessToken = sessionStorage.getItem('accessToken');
      const headers = { 'authorization': accessToken };
      axios.post('http://localhost:8080/delete_product', { id: id, boss_id: user_id }, { headers: headers })
        .then((product) => {
          if (product.data.success) {
            alert(product.data.message);
            navigate('/profil/myshop');
          } else console.log(product.data.message);
        })
        .catch((err) => {
          console.log('error on axios post delete: ', err);
        })
    }
  }

  const nameChange = (e) => {
    e.preventDefault();
    if (e.target.value !== product.name && e.target.value && price && quantity && type) {
      setEnableSubmit(false);
    } else setEnableSubmit(true);

    setName(e.target.value);
  }

  const priceChange = (e) => {
    e.preventDefault();
    if (e.target.value !== product.price && e.target.value && name && quantity && type) {
      setEnableSubmit(false);
    } else setEnableSubmit(true);

    setPrice(e.target.value);
  }

  const typeChange = (e) => {
    e.preventDefault();
    if (e.target.value !== product.type && e.target.value && name && price && quantity) {
      setEnableSubmit(false);
    } else setEnableSubmit(true);

    setType(e.target.value);
  }

  const quantityChange = (e) => {
    e.preventDefault();
    if (Number(e.target.value) !== product.quantity && e.target.value && name && price && type) {
      setEnableSubmit(false);
    } else setEnableSubmit(true);

    setQuantity(e.target.value);
  }

  return (
    <div className='profil-product'>
      <div className='profil-name'>
        <img src={profil} height='70' width='70' alt='profil' />
        <h1>{username}</h1>
      </div>
      <div className='profil-product-container'>
        <h2>{name}</h2>
        <form className='myproduct-list' onSubmit={(e) => updateProduct(e)}>
          <div className='myproduct-list-item'>
            <label>Shop Name</label>
            <input value={name} type='text' onChange={(e) => nameChange(e)} />
          </div>
          <div className='myproduct-list-item'>
            <label>Price €</label>
            <input value={price} type='text' onChange={(e) => priceChange(e)} />
          </div>
          <div className='myproduct-list-item'>
            <label>Type of product</label>
            <select value={type} onChange={(e) => typeChange(e)}>
              <option value='salt'>Salt</option>
              <option value='sweat'>Sweat</option>
            </select>
          </div>
          <div className='myproduct-list-item'>
            <label>Quantity</label>
            <input type='number' min='0' max='999' value={quantity} onChange={(e) => quantityChange(e)} />
          </div>
          <button type='submit' disabled={enableSubmit} id='submit-product-details' >Submit Changes</button>
        </form>
        <button id='submit-delete-product' onClick={(e) => deleteProduct(e)}>Delete Product</button>
      </div>
    </div>
  );
};

export default ProfilProduct;