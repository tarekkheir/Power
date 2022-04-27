import React from 'react';
import './ShopBox.css';
import { useNavigate } from 'react-router-dom';

const ShopBox = ({ ...props }) => {
  const navigate = useNavigate();
  const { name, location, type, shop_id } = props;

  return (
    <div className='shopbox' onClick={() => navigate(`/shop/${shop_id}`)}>
      <div className='image'></div>
      <div className='details'>
        <div className='name'>
          <h4>{name}</h4>
          <span>&#11088;&#11088;&#11088;&#11088;&#11088;</span>
        </div>
        <ul className='shop-infos'>
          <li>{location}</li>
          <li>{type}</li>
        </ul>
      </div>
    </div>
  );
};

export default ShopBox;