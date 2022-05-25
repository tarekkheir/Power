import React, { useContext, useEffect, useState } from 'react';
import AppContext from '../../App/AppContext';
import profil from '../../images/profil.png';
import './ProfilFavoris.css';
import axios from 'axios';
import ProductBox from '../../Products/ProductBox';

const ProfilFavoris = () => {
  const context = useContext(AppContext);
  const { user: { username } } = context;
  const [products, setProducts] = useState([]);
  const url = 'http://localhost:8080/products_images/'

  useEffect(() => {
    const accessToken = sessionStorage.getItem('accessToken');
    const headers = { 'authorization': accessToken };

    axios.get('http://localhost:8080/get_favorites', { headers })
      .then((res) => {
        if (res.data.success) {
          const data = [];

          res.data.data.map((product) => {
            const { product_id } = product;

            axios.get(`http://localhost:8080/product/${product_id}`)
              .then((product) => {
                if (product.data.success) {
                  const { name, price, type, quantity, description, fileName, reviews, star_rating } = product.data;
                  data.push({ name, price, type, quantity, description, fileName, reviews, star_rating });

                } else alert(product.data.message);
              })
              .catch((err) => {
                console.log('error on axios get product: ', err);
              })

            return 1;
          })
          setProducts(data)

        } else alert(res.data.message);
      })
      .catch((err) => {
        console.log('error on axios get favorites: ', err);
      });

  }, []);

  return (
    <div className='profil-favoris'>
      <div className='profil-name'>
        <img src={profil} height='70' width='70' alt='profil' />
        <h1>{username}</h1>
      </div>
      <div className='products-list'>
        {products.length > 0 ? (
          products.map((product) => {
            const { name, type, quantity, price, id, fileName, reviews, star_rating } = product;
            console.log(product);
            const image = url + fileName;
            const rating = parseFloat((Number(star_rating) / Number(reviews))).toFixed(2);
            const ratingPourcentage = (rating / 5) * 100;

            return <ProductBox
              key={id}
              name={name}
              price={price}
              type={type}
              quantity={quantity}
              product_id={id}
              image={image}
              ratingPourcentage={ratingPourcentage}
              rating={rating} />

          })
        ) : <h2>No products available...</h2>}
      </div>
    </div>
  );
};

export default ProfilFavoris;