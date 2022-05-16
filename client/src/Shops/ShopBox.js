import React from 'react';
import './ShopBox.css';
import { useNavigate } from 'react-router-dom';

const ShopBox = ({ ...props }) => {
  const navigate = useNavigate();
  const { name, location, shop_id, image } = props;

  return (
    <div className='shopbox' onClick={() => navigate(`/shop/${shop_id}`, { state: { shop_name: name } })}>
      <div className='image'>
        <img src={image} alt='shop' />
      </div>
      <div className='details'>
        <div className='name'>
          <h4 className='text-align-start'>{name}</h4>
          <span className='text-align-end'>&#11088;&#11088;&#11088;&#11088;&#11088;</span>
        </div>
        <ul className='shop-infos'>
          <li className='text-align-start'>{location}</li>
        </ul>
      </div>
    </div>
  );
};

export default ShopBox;