import React from 'react';
import ShopList from '../Shops/ShopList';
import './Home.css';

const Home = () => {
  return (
    <React.Fragment>
      <div className='home'>
        <h1>Shops</h1>
        <ShopList />
      </div>
    </React.Fragment>
  );
};

export default Home;