import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ShopBox from './ShopBox';
import './ShopList.css';

const ShopList = () => {
  const [shops, setShops] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/shops')
      .then((res) => {
        if (res.data) {
          let datas = [];
          res.data.map((shop, index) => {
            const { name, location, open_hours, type, id } = shop;
            datas.push({ name: name, location: location, open_hours: open_hours, type: type, id: id });
            return 1;
          })
          setShops(datas);
        }
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
          const { name, type, location, open_hours, id } = shop;
          return <ShopBox key={id} name={name} open_hours={open_hours} type={type} location={location} shop_id={id} />
        })
      ) : 'shops is null'}
    </div>
  );
};

export default ShopList;