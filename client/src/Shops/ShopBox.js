import React, { useEffect, useRef } from 'react';
import './ShopBox.css';
import { useNavigate } from 'react-router-dom';

const ShopBox = ({ ...props }) => {
  const navigate = useNavigate();
  const { name, location, shop_id, image, open_hours, star_rating } = props;
  const ref = useRef();

  useEffect(() => {
    console.log(ref.current.style);
    ref.current.style.width = star_rating;
  })

  return (
    <div className='shopbox' onClick={() => navigate(`/shop/${shop_id}`, { state: { shop_name: name } })}>
      <div className='image'>
        <img src={image} alt='shop' />
      </div>
      <div className='details'>
        <div className='name'>
          <h4 className='text-align-start'>{name}</h4>
          <div className='text-align-end'>
            <div className="stars-outer">
              <div className="stars-inner" ref={ref}></div>
            </div>
          </div>
        </div>
        <ul className='shop-infos'>
          <li className='text-align-start'>{location}</li>
          <li className='text-align-end'><span>{open_hours}</span></li>
        </ul>
      </div>
    </div>
  );
};

export default ShopBox;