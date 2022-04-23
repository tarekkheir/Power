import React from 'react';
import './ShopBox.css';
import { useNavigate } from 'react-router-dom';

const ShopBox = ({ ...props }) => {
  const navigate = useNavigate();
  const { name, location, type, open_hours, shop_id } = props;

  return (
    <div className='shopbox' onClick={() => navigate(`/shop/${shop_id}`)}>
      <h4>{name}</h4>
      <div className='image'></div>
      <ul className='shop-infos'>
        <li>{location}</li>
        <li>{open_hours}</li>
        <li>{type}</li>
      </ul>
    </div>
  );
};

export default ShopBox;