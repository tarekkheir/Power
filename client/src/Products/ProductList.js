import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './ProductList.css';
import ProductBox from './ProductBox';

const ProductList = ({ shop_id }) => {
  const [products, setProducts] = useState([]);
  const [filterType, setFilter] = useState('');
  const [priceRange, setPriceRange] = useState(50);
  const url = 'http://localhost:8080/products_images/';

  useEffect(() => {
    axios.get(`http://localhost:8080/shop/${shop_id}`)
      .then((res) => {
        if (res.data.success) {
          const datas = [];
          res.data.datas.map((product) => {
            const { name, type, price, quantity, id, fileName, reviews, star_rating } = product;
            console.log(reviews);
            console.log(star_rating);
            datas.push({ name, price, quantity, type, id, fileName, reviews, star_rating });
            return 1;
          });
          setProducts(datas);
        }
      })
      .catch((err) => {
        console.log('axios error', err);
      })

  }, [shop_id]);

  console.log('products: ', products);


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
        <div>
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
            const { name, type, quantity, price, id, fileName, reviews, star_rating } = product;
            console.log(product);
            const image = url + fileName;
            const rating = parseFloat((Number(star_rating) / Number(reviews))).toFixed(2);
            const ratingPourcentage = (rating / 5) * 100;

            if (filterType !== '' && filterType === type && Number(price) <= priceRange) {
              return <ProductBox
                key={id}
                name={name}
                price={price}
                type={type}
                quantity={quantity}
                shop_id={shop_id}
                product_id={id}
                image={image}
                ratingPourcentage={ratingPourcentage}
                rating={rating} />
            } else if (filterType === '' && Number(price) <= priceRange) {
              return <ProductBox
                key={id}
                name={name}
                price={price}
                type={type}
                quantity={quantity}
                shop_id={shop_id}
                product_id={id}
                image={image}
                ratingPourcentage={ratingPourcentage}
                rating={rating} />
            } else return null;
          })
        ) : <h2>No products available...</h2>}
      </div>
    </div>
  );
};

export default ProductList;