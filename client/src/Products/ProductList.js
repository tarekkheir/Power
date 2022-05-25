import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './ProductList.css';
import ProductBox from './ProductBox';

const ProductList = ({ shop_id }) => {
  const [products, setProducts] = useState([]);
  const [filterType, setFilter] = useState('');
  const [priceRange, setPriceRange] = useState(50);
  const [favorites, setFavorites] = useState([]);
  const url = 'http://localhost:8080/products_images/';

  useEffect(() => {
    const accessToken = sessionStorage.getItem('accessToken');
    const headers = { 'authorization': accessToken };

    axios.get(`http://localhost:8080/shop/${shop_id}`)
      .then((res) => {
        if (res.data.success) {
          const datas = [];
          res.data.datas.map((product) => {
            const { name, type, price, quantity, id, fileName, reviews, star_rating } = product;
            datas.push({ name, price, quantity, type, id, fileName, reviews, star_rating });
            return 1;
          });
          setProducts(datas);

        }
      })
      .catch((err) => {
        console.log('axios error', err);
      })

    axios.get('http://localhost:8080/get_favorites', { headers })
      .then((fav) => {
        if (fav.data.success) {
          const fav_data = [];

          fav.data.data.map((f) => {
            const { product_id } = f;
            fav_data.push(product_id);
            return 1;
          })

          setFavorites(fav_data);
        } else console.log(fav.data.message);
      })
      .catch((err) => {
        console.log('error on axios get favorites: ', err);
      })

  }, [shop_id]);

  console.log('products: ', products, products.length);
  console.log('favorites: ', favorites, favorites.length);


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
          <label id='type-of-shop'>Type of Product&nbsp;&nbsp;&nbsp;</label>
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
            const image = url + fileName;
            const rating = parseFloat((Number(star_rating) / Number(reviews))).toFixed(2);
            const ratingPourcentage = (rating / 5) * 100;

            if (favorites.includes(id)) {
              console.log('ok: ', name);
            }

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
                rating={rating}
                fav={favorites.includes(id)} />
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
                rating={rating}
                fav={favorites.includes(id)} />
            } else return null;
          })
        ) : <h2>No products available...</h2>}
      </div>
    </div>
  );
};

export default ProductList;