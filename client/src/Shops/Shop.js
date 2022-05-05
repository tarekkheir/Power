import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductList from '../Products/ProductList';
import axios from 'axios';

const Shop = () => {
  const [name, setName] = useState('Name');
  const params = useParams();
  const { id } = params;

  useEffect(() => {
    axios.get(`http://localhost:8080/shop/${id}`)
      .then((shop => {
        if (shop.data.success) {
          setName(shop.data.datas.name);
        } else alert(shop.data.message);
      }))
      .catch((err) => {
        console.log('error on axios get: ', err);
      })
  }, [id])

  return (
    <div className='shop'>
      <h1>{name}</h1>
      <ProductList shop_id={params.id} />
    </div>
  );
};

export default Shop;