import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import AppContext from '../App/AppContext';
import './ProfilShop.css';
import profil from '../images/profil.png';
import { useNavigate } from 'react-router-dom';

const ProfilShop = () => {
  const [name, setName] = useState('');
  const [type, setType] = useState('Fast Food');
  const [location, setLocation] = useState('');
  const [openHour, setOpenHour] = useState('');
  const [closeHour, setCloseHour] = useState('');
  const [enableSubmit, setEnableSubmit] = useState(true);
  const [shop, setShop] = useState([]);
  const [products, setProducts] = useState([]);
  const [fileName, setFileName] = useState('');
  const [file, setFile] = useState(null);
  const context = useContext(AppContext);
  const { user: { user_id, username } } = context;
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:8080/myshop/${user_id}`)
      .then((shop) => {
        if (shop.data.success) {
          const { name, location, open_hours, id, type, fileName } = shop.data;
          console.log(open_hours);
          const hours = open_hours.split(' - ');
          const open = hours[0];
          const close = hours[1];
          setShop({ name, location, open, close, id, type });
          setName(name);
          setType(type);
          setLocation(location);
          setOpenHour(open);
          setCloseHour(close);
          setFileName(fileName);

          axios.get(`http://localhost:8080/shop/${id}`)
            .then((products) => {
              if (products.data.success) {
                const productsDatas = [];
                products.data.datas.map((product) => {
                  const { name, type, price, quantity, id, boss_id, fileName } = product;
                  productsDatas.push({ name, type, quantity, id, boss_id, price, fileName });
                  return 1;
                })
                setProducts(productsDatas);
              } else console.log(products.data.message);
            })
            .catch((err) => {
              console.log('axios get products error: ', err);
            })

        } else console.log(shop.data.message);
      })
      .catch((err) => {
        console.log('error on axios get myshop: ', err);
      })
  }, [user_id])



  const updateShop = (e) => {
    e.preventDefault();
    const open_hours = openHour + ' - ' + closeHour;
    const accessToken = sessionStorage.getItem('accessToken');
    const headers = { 'authorization': accessToken };

    const data = new FormData();

    data.append('file', file);
    data.append('name', name);
    data.append('location', location);
    data.append('type', type);
    data.append('open_hours', open_hours);
    data.append('boss_id', user_id);

    axios.post('http://localhost:8080/update_shop_details', data, { headers: headers })
      .then((shop) => {
        if (shop.data.success) {
          if (shop.data.success) {
            alert(shop.data.message);
            window.location.reload();
          } else alert('update didn\'t success...')
        } else alert(shop.data.message);
      })
      .catch((err) => {
        console.log('error on axios update: ', err);
      })
  }

  const deleteShop = (e) => {
    if (window.confirm('Are you sure to delete this shop ?')) {
      e.preventDefault();
      const accessToken = sessionStorage.getItem('accessToken');
      const headers = { 'authorization': accessToken };

      axios.post('http://localhost:8080/delete_shop', { boss_id: user_id, shop_id: shop.id, products: products, fileName }, { headers: headers })
        .then((shop) => {
          if (shop.data.success) {
            alert(shop.data.message);
            window.location.reload();
          } else alert(shop.data.message);
        })
        .catch((err) => {
          console.log('error on axios delete: ', err);
        })
    }
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

  const handleFileChange = (e) => {
    e.preventDefault();
    if (e.target.files[0].name !== fileName && name && location && type && openHour && closeHour) {
      setEnableSubmit(false);
    } else setEnableSubmit(true);

    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name)
  }

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
                  <option value='Fast Food'>Fast Food</option>
                  <option value='Good Food'>Good Food</option>
                </select>
              </div>
              <div className='myshop-list-item'>
                <label>Shop image</label>
                <span>{fileName}</span>
                <input className='text-align-center' type='file' onChange={(e) => handleFileChange(e)} />
              </div>
              <button type='submit' disabled={enableSubmit} id='submit-shop-details' >Submit Changes</button>
            </form>
            <button id='submit-delete-shop' onClick={(e) => deleteShop(e)}>Delete Shop</button>
          </div>
        ) : (
          <div>
            <h3>You have no shop registered</h3>
            <button onClick={() => navigate('/profil/myshop/add_shop')}>Add Shop</button>
          </div>
        )}
        {Object.keys(shop).length > 0 && Object.keys(products).length > 0 ? (
          <div className='myshop-products'>
            <h2>Products</h2>
            <ul className='myshop-products-list'>
              <button key={12345} id='myshop-products-button' onClick={() => navigate('/profil/myshop/add_product')}>+</button>
              {products.map((product) => {
                return <li key={product.id} className='myshop-products-list-item' onClick={() => navigate(`/profil/myshop/product_details/${product.id}`)}>
                  <div className='myshop-product-list-item-image'></div>
                  <div className='myshop-product-list-item-description'>
                    <h4>{product.name} ({product.quantity})</h4>
                    <span>Price {product.price} €</span>
                  </div>
                </li>
              })}
            </ul>
          </div>
        ) : Object.keys(shop).length > 0 && Object.keys(products).length === 0 ? (
          <div className='myshop-products'>
            <h2>No products...</h2>
            <button onClick={() => navigate('/profil/myshop/add_product')}>add product</button>
          </div>
        ) : (null)}
      </div>
    </div>
  );
};

export default ProfilShop;