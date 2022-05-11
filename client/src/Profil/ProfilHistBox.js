import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfilHistBox.css';

const ProfilHistBox = ({ day, time, prods, total }) => {
  const navigate = useNavigate();

  return (
    <div className='profil-historic-box'>
      <div className='date'>
        <h2 id='day'>{day}</h2>
        <h2 id='time'>{time}</h2>
      </div>
      <ul className='profil-historic-box-details'>
        {Object.keys(prods).map((p) => {
          const name = prods[p].name;
          const quantity = prods[p].quantity;
          const product_id = prods[p].product_id;
          const shop_id = prods[p].shop_id;

          return <li className='profil-historic-box-details-item' onClick={() => navigate(`/shop/${shop_id}/product/${product_id}`,
            { state: { product_id: product_id } })}>
            {name} &nbsp;({quantity})
          </li>
        })}
        <li id='total'>{total} €</li>
      </ul>
    </div>
  );
};

export default ProfilHistBox;