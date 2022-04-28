import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './ProductList.css';
import ProductBox from './ProductBox';

const ProductList = ({ shop_id }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:8080/shop/${shop_id}`)
      .then((res) => {
        if (!res.data.message) {
          const datas = [];
          res.data.map((product) => {
            const { name, type, price, quantity, id } = product;
            datas.push({ name: name, price: price, quantity: quantity, type: type, id: id });
            return 1;
          });
          setProducts(datas);
        }
        console.log('axios done');
      })
      .catch((err) => {
        console.log('axios error', err);
      })
  }, [shop_id]);

  return (
    <div className='products-list'>
      {products.length ? (
        products.map((product) => {
          const { name, type, quantity, price, id } = product;
          return <ProductBox key={id} name={name} price={price} type={type} quantity={quantity} shop_id={shop_id} product_id={id} />
        })
      ) : 'shops is null'}
    </div>
  );
};

export default ProductList;