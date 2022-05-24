import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AppContext from '../../App/AppContext';
import './ProfilProduct.css';
import profil from '../../images/profil.png';

const ProfilProduct = () => {
  const params = useParams();
  const { id } = params;
  const context = useContext(AppContext);
  const { user: { user_id, username } } = context;
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [type, setType] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [enableSubmit, setEnableSubmit] = useState(true);
  const [product, setProduct] = useState([]);
  const [fileName, setFileName] = useState('');
  const [file, setFile] = useState(null);
  const [urlFile, setUrlFile] = useState(null);
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:8080/product/${id}`)
      .then((product) => {
        if (product.data.success) {
          const { name, price, type, quantity, id, shop_id, fileName, description } = product.data;
          setName(name);
          setPrice(price);
          setQuantity(quantity);
          setType(type);
          setFileName(fileName);
          setDescription(description);
          setProduct({ name, price, type, quantity, id, shop_id, fileName, description });
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
    const data = new FormData();

    data.append('file', file);
    data.append('name', name);
    data.append('quantity', quantity);
    data.append('price', price);
    data.append('type', type);
    data.append('product_id', product.id);
    data.append('description', description);
    data.append('boss_id', user_id);

    axios.post('http://localhost:8080/update_product', data, { headers: headers })
      .then((product) => {
        console.log(product);

        if (product.data.success) {
          if (product.data.success) {
            alert(product.data.message);
            navigate('/profil/myshop');
          }
        } else alert(product.data.message);
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

      axios.post('http://localhost:8080/delete_product',
        { id: id, boss_id: user_id, shop_id: product.shop_id, fileName: product.fileName },
        { headers: headers })
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

  const handleFileChange = (e) => {
    e.preventDefault();
    if (e.target.files[0].name !== product.fileName && name && price && type) {
      setEnableSubmit(false);
    } else setEnableSubmit(true);

    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
    setUrlFile(URL.createObjectURL(e.target.files[0]));
  }

  const descriptionChange = (e) => {
    e.preventDefault();
    if (e.target.value !== product.description && name && price && type && quantity) {
      setEnableSubmit(false);
    } else setEnableSubmit(true);

    setDescription(e.target.value);
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
          <div className='myproduct-list-item'>
            <label>Description</label>
            <textarea value={description} onChange={(e) => descriptionChange(e)} />
          </div>
          <div className='myproduct-list-item'>
            <label>Shop image</label>
            <div className='myshop-list-item-shop-image'>
              <span>
                <img src={urlFile === null ? `http://localhost:8080/products_images/${fileName}` : urlFile} alt='new product' height={'90%'} width={'90%'} />
              </span>
              <input className='text-align-center' type='file' onChange={(e) => handleFileChange(e)} />
            </div>
          </div>
          <button type='submit' disabled={enableSubmit} id='submit-product-details' >Submit Changes</button>
        </form>
        <button id='submit-delete-product' onClick={(e) => deleteProduct(e)}>Delete Product</button>
      </div>
    </div>
  );
};

export default ProfilProduct;