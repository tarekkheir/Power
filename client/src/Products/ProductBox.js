import React, { useEffect, useRef, useState } from 'react';
import './ProductBox.css';
import { useNavigate } from 'react-router-dom';
import heart from '../images/heart.png'
import red_heart from '../images/red_heart.png';
import axios from 'axios';

const ProductBox = ({ ...props }) => {
  const navigate = useNavigate();
  const { name, price, quantity, product_id, shop_id, image, ratingPourcentage, rating } = props;
  const ref = useRef();
  const [liked, setLiked] = useState(false);

  console.log(rating);

  useEffect(() => {
    console.log(ref.current.style);
    ref.current.style.width = `${ratingPourcentage}%`;
  })

  const handleLike = (e) => {
    if (window.confirm('Add this product to your favoris ?')) {
      e.preventDefault();

      const accessToken = sessionStorage.getItem('accessToken');
      const headers = { 'authorization': accessToken };

      axios.post('http://localhost:8080/add_favoris', { product_id, shop_id }, { headers })
        .then((res) => {
          if (res.data.success) {
            alert(res.data.message);
            setLiked(!liked);
          } else alert(res.data.message);
        })
        .catch((err) => {
          console.log('error on adding product to favoris: ', err);
        })

    }
  }

  const handleDisLike = (e) => {
    if (window.confirm('Remove this product from your favoris ?')) {
      e.preventDefault();
      setLiked(!liked);
    }
  }

  return (
    <div className='productbox'>
      <div className='image' onClick={() => navigate(`/shop/${shop_id}/product/${product_id}`, { state: { product_id: product_id } })}>
        <img src={image} alt='product' />
      </div>
      <ul className='product-infos'>
        <li onClick={() => navigate(`/shop/${shop_id}/product/${product_id}`, { state: { product_id: product_id } })}>
          <h4 className='productbox-name'>{name} ({quantity})</h4>
        </li>
        <li className='text-align-end'>
          <img
            id='heart'
            src={liked ? red_heart : heart}
            alt='heart'
            height={30}
            width={30}
            onClick={(e) => {
              if (liked) {
                handleDisLike(e);
              } else handleLike(e);
            }}
          />
        </li>

        <li>{price} €</li>
        <li className='stars-box'>
          <span className='text-align-end'>{!isNaN(rating) ? parseFloat(rating).toFixed(1) : null}</span>
          <div className="stars-outer">
            <div className="stars-inner" ref={ref}></div>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default ProductBox;