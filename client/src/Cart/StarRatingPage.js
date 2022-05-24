import React, { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductRating from './ProductRating';
import './StarRatingPage.css';
import axios from 'axios';


const StarRatingPage = () => {
  const location = useLocation();
  const { state: { products } } = location;
  const refs = useRef([]);
  const [productsData, setProductsData] = useState([]);
  const navigate = useNavigate();


  const postRating = () => {
    const accessToken = sessionStorage.getItem('accessToken');
    const headers = { 'authorization': accessToken };

    axios.post('http://localhost:8080/product_rating', { productsData }, { headers })
      .then((res) => {
        if (res.data.success) {
          alert(res.data.message)
          navigate('/');
        } else alert(res.data.message)
      })
      .catch((err) => {
        console.log('error on axios post rating: ', err);
      })
  }

  const getState = () => {
    const data = [];

    refs.current.map((ref) => {
      const rating = ref.getChildRating();
      const name = ref.getName();
      const product_id = ref.getProductId();

      data.push({ rating, name, product_id });
      return 1;
    })

    setProductsData(data);
    postRating();
  }


  return (
    <div className='star-rating-page'>
      {products.map((product, index) => {
        const { name, fileName, product_id } = product;

        return <ProductRating
          ref={(element) => { refs.current[index] = element }}
          name={name}
          fileName={fileName}
          product_id={product_id} />
      })}
      <button onClick={getState}>get state</button>
    </div>
  );
};


export default StarRatingPage;