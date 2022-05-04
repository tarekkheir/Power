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
  const context = useContext(AppContext);
  const { user_id, username } = context;
  const [shop, setShop] = useState([]);
  const [products, setProducts] = useState([]);
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

          axios.get(`http://localhost:8080/shop/${id}`)
            .then((products) => {
              console.log('products from axios: ', products.data.length);
              if (products.data.length > 0) {
                const productsDatas = [];
                products.data.map((product) => {
                  const { name, type, price, quantity, id, boss_id } = product;
                  productsDatas.push({ name: name, type: type, quantity: quantity, id: id, boss_id: boss_id, price: price });
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
    axios.post('http://localhost:8080/update_shop_details', { name, location, type, open_hours }, { headers: headers })
      .then((shop) => {
        if (Object.keys(shop.data).length > 1) {
          if (shop.data.success) {
            alert(shop.data.message);
            navigate('/profil');
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
      console.log('yes he want to delete this shop');
      const accessToken = sessionStorage.getItem('accessToken');
      const headers = { 'authorization': accessToken };
      axios.post('http://localhost:8080/delete_shop', { boss_id: user_id }, { headers: headers })
        .then((shop) => {
          if (Object.keys(shop.data).length > 1) {
            if (shop.data.success) {
              alert(shop.data.message);
              navigate('/myshop');
            } else alert('delete didn\'t success...');
          } else alert(shop.data.message);
        })
        .catch((err) => {
          console.log('error on axios delete: ', err);
        })
    } else {
      console.log('no he love he\'s shop');
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

  console.log('shop: ', shop);
  console.log('products: ', products);

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
              <button type='submit' disabled={enableSubmit} id='submit-shop-details' >Submit Changes</button>
            </form>
            <button id='submit-delete-shop' onClick={(e) => deleteShop(e)}>Delete Shop</button>
          </div>
        ) : (
          <div>
            <h3>You have no shop registered</h3>
            <button onClick={() => navigate('/add_shop')}>Add Shop</button>
          </div>
        )}
        {Object.keys(shop).length > 0 && Object.keys(products).length > 0 ? (
          <div className='myshop-products'>
            <h2>Products</h2>
            <ul className='myshop-products-list'>
              <button key={12345} id='myshop-products-button' onClick={() => navigate('/add_product')}>+</button>
              {products.map((product) => {
                return <li key={product.id} className='myshop-products-list-item' onClick={() => navigate(`/product_details/${product.id}`)}>
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
            <button onClick={() => navigate('/add_product')}>add product</button>
          </div>
        ) : (null)}
      </div>
    </div>
  );
};

export default ProfilShop;