import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ShopBox from './ShopBox';
import './ShopList.css';

const ShopList = () => {
  const [shops, setShops] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get('http://localhost:8080/shops');
        if (!res.data.message) {
          setShops(res.data);
        } else alert(res.data.message);
      } catch (err) {
        console.log('axios error', err);
      }
    }
    fetchData();
  }, []);


  return (
    <div className='shops-list'>
      {shops.length ? (
        shops.map((shop) => {
          const { name, type, location, open_hours, id, boss_id } = shop;
          return <ShopBox key={id} name={name} open_hours={open_hours} type={type} location={location} shop_id={id} boss_id={boss_id} />
        })
      ) : 'shops is null'}
    </div>
  );
};

export default ShopList;
