import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ShopBox from './ShopBox';
import './ShopList.css';

const ShopList = () => {
  const [shops, setShops] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/shops')
      .then((res) => {
        if (!res.data.message) {
          let datas = [];
          res.data.map((shop) => {
            console.log(shop);
            const { name, location, open_hours, type, id, boss_id } = shop;
            datas.push({ name: name, location: location, open_hours: open_hours, type: type, id: id, boss_id: boss_id });
            return 1;
          })
          setShops(datas);
        } else alert(res.data.message);
        console.log('done');
      })
      .catch((err) => {
        console.log('axios error', err);
      })
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
