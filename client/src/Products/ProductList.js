import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './ProductList.css';
import ProductBox from './ProductBox';

const ProductList = ({ shop_id }) => {
  const [products, setProducts] = useState([]);
  const [filterType, setFilter] = useState('');
  const [priceRange, setPriceRange] = useState(20);

  useEffect(() => {
    axios.get(`http://localhost:8080/shop/${shop_id}`)
      .then((res) => {
        if (res.data.success) {
          const datas = [];
          res.data.datas.map((product) => {
            const { name, type, price, quantity, id } = product;
            datas.push({ name: name, price: price, quantity: quantity, type: type, id: id });
            return 1;
          });
          setProducts(datas);
        }
      })
      .catch((err) => {
        console.log('axios error', err);
      })
  }, [shop_id]);


  const handleFilter = (e) => {
    e.preventDefault();
    if (e.target.value !== filterType) {
      setFilter(e.target.value);
    }
  }

  const handlePriceRange = (e) => {
    e.preventDefault();
    if (e.target.value !== priceRange) {
      setPriceRange(e.target.value);
    }
  }

  return (
    <div className='products-list-container'>
      <div className='filter-bar'>
        <div className='filter-bar-item'>
          <label id='type-of-shop'>Type of Shop&nbsp;&nbsp;&nbsp;</label>
          <select className='select-option' value={filterType} onChange={(e) => handleFilter(e)} >
            <option value=''>--- No Filter ----</option>
            <option value='salt'>Salt</option>
            <option value='sweat'>Sweat</option>
          </select>
        </div>
        <div className='filter-bar-item'>
          <div className="range-input">
            <span className='min-max'>0 €</span>
            <input type="range" className="range-max" min="0" max="50" value={priceRange} step="1" onChange={(e) => handlePriceRange(e)} />
            <span className='min-max'>{priceRange} €</span>
          </div>
        </div>
      </div>
      <div className='products-list'>
        {products.length ? (
          products.map((product) => {
            const { name, type, quantity, price, id } = product;
            if (filterType !== '' && filterType === type) {
              return <ProductBox key={id} name={name} price={price} type={type} quantity={quantity} shop_id={shop_id} product_id={id} />
            } else if (filterType === '') {
              return <ProductBox key={id} name={name} price={price} type={type} quantity={quantity} shop_id={shop_id} product_id={id} />
            } else return null;
          })
        ) : 'shops is null'}
      </div>
    </div>
  );
};

export default ProductList;