import React, { useEffect, useRef } from 'react';
import './ProductBox.css';
import { useNavigate } from 'react-router-dom';
import heart from '../images/heart.png'

const ProductBox = ({ ...props }) => {
  const navigate = useNavigate();
  const { name, price, quantity, product_id, shop_id, image } = props;
  const ref = useRef();

  useEffect(() => {
    console.log(ref.current.style);
    ref.current.style.width = "50%";
  })

  return (
    <div className='productbox'>
      <div className='image' onClick={() => navigate(`/shop/${shop_id}/product/${product_id}`, { state: { product_id: product_id } })}>
        <img src={image} alt='product' />
      </div>
      <ul className='product-infos'>
        <li onClick={() => navigate(`/shop/${shop_id}/product/${product_id}`, { state: { product_id: product_id } })}>
          <h4 className='productbox-name'>{name} ({quantity})</h4>
        </li>
        <li className='text-align-end'><img src={heart} alt='heart' height={30} width={30} /></li>
        <li>{price} €</li>
        <li className='text-align-end'>
          <div className="stars-outer">
            <div className="stars-inner" ref={ref}></div>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default ProductBox;