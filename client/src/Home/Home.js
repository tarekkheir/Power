import React, { useContext } from 'react';
import AppContext from '../App/AppContext';
import ShopList from '../Shops/ShopList';
import './Home.css';

const Home = () => {
  const context = useContext(AppContext);
  const { user: { username } } = context;

  return (
    <div className='home'>
      <h1>Welcome {username} !</h1>
      <ShopList />
    </div>
  );
};

export default Home;