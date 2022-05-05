import React from 'react';
import './ShopBox.css';
import { useNavigate } from 'react-router-dom';

const ShopBox = ({ ...props }) => {
  const navigate = useNavigate();
  const { name, location, type, shop_id } = props;

  return (
    <div className='shopbox' onClick={() => navigate(`/shop/${shop_id}`, { state: { shop_name: name } })}>
      <div className='image'></div>
      <div className='details'>
        <div className='name'>
          <h4>{name}</h4>
          <span>&#11088;&#11088;&#11088;&#11088;&#11088;</span>
        </div>
        <ul className='shop-infos'>
          <li>{type}</li>
          <li>{location}</li>
        </ul>
      </div>
    </div>
  );
};

export default ShopBox;