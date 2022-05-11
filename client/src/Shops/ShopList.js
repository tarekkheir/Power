import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ShopBox from './ShopBox';
import './ShopList.css';

const ShopList = () => {
  const [shops, setShops] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get('http://localhost:8080/shops');
        if (res.data.success) {
          setShops(res.data.data);
        } else alert(res.data.message);
      } catch (err) {
        console.log('axios error', err);
      }
    }
    fetchData();
  }, []);


  const handleFilter = (e) => {
    e.preventDefault();
    if (e.target.value !== filter) {
      setFilter(e.target.value);
    }
  }


  return (
    <div className='shops-list-container'>
      <div className='filter-bar'>
        <div className='filter-bar-item'>
          <label id='type-of-shop'>Type of Shop&nbsp;&nbsp;&nbsp;</label>
          <select id='select-option' value={filter} onChange={(e) => handleFilter(e)}>
            <option value=''>--- No Filter ---</option>
            <option value='Good Food'>Good Food</option>
            <option value='Fast Food'>Fast Food</option>
          </select>
        </div>
      </div>
      <div className='shops-list'>
        {shops.length ? (
          shops.map((shop) => {
            const { name, type, location, open_hours, id, boss_id } = shop;
            if (filter !== '' && type === filter) {
              return <ShopBox key={id} name={name} open_hours={open_hours} type={type} location={location} shop_id={id} boss_id={boss_id} />
            } else if (filter === '') {
              return <ShopBox key={id} name={name} open_hours={open_hours} type={type} location={location} shop_id={id} boss_id={boss_id} />
            } else return null;
          })
        ) : 'shops is null'}
      </div>
    </div>
  );
};

export default ShopList;
