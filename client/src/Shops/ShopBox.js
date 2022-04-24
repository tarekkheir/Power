import React, { useContext } from 'react';
import './ShopBox.css';
import { useNavigate } from 'react-router-dom';
import AppContext from '../App/AppContext';

const ShopBox = ({ ...props }) => {
  const navigate = useNavigate();
  const context = useContext(AppContext);
  const { user: { user_id } } = context;
  const { name, location, type, open_hours, shop_id, boss_id } = props;
  console.log('user_id', user_id);
  console.log('boss_id', boss_id);

  return (
    <div className='shopbox' onClick={() => navigate(`/shop/${shop_id}`)}>
      <h4>{name}</h4>
      {user_id === boss_id ? <h4>X</h4> : 'not boss shop'}
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