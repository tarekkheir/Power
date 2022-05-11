import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import AppContext from '../App/AppContext';
import ProfilHistBox from './ProfilHistBox';
import profil from '../images/profil.png';
import './ProfilHistoric.css';

const ProfilHistoric = () => {
  const [products, setProducts] = useState([]);
  const context = useContext(AppContext);
  const { user: { username } } = context;

  useEffect(() => {
    const accessToken = sessionStorage.getItem('accessToken');
    const headers = { 'authorization': accessToken };
    axios.get('http://localhost:8080/historic', { headers: headers })
      .then((historic) => {
        if (historic.data.success) {
          const data = [];
          historic.data.data.map((h) => {
            console.log('h: ', h);
            const date = h.createdAt.split('T');
            const time = date[1].split('.')[0];
            const day_str = date[0].split('-');
            const day_obj = new Date(day_str[0], day_str[1], day_str[2]);
            const day = day_obj.toDateString();
            const prods = h.products;
            const total = h.total;

            data.push({ prods, time, day, total });
            return 1;
          })
          setProducts(data);
        } else console.log(historic.data.message);
      })
      .catch((err) => {
        console.log('error on axios historic: ', err);
      })
  }, [])

  console.log('products: ', products);

  return (
    <div className='historic'>
      <div className='profil-name'>
        <img src={profil} height='70' width='70' alt='profil' />
        <h1>{username}</h1>
      </div>
      {products.length > 0 ? (
        <div className='historic-list'>
          {products.reverse().map((p, index) => {
            console.log(p);
            const t = p.time.split(':');
            const time = `${t[0]}:${t[1]}`;
            const key = Math.random() + index;
            console.log(key);

            return <ProfilHistBox key={key} prods={p.prods} time={time} day={p.day} total={p.total} />
          })}
        </div>
      ) : <h2 id='no-historic'>No Command past...</h2>}
    </div>
  );
};

export default ProfilHistoric;