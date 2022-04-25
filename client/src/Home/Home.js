import React, { useContext } from 'react';
import AppContext from '../App/AppContext';
import ShopList from '../Shops/ShopList';
import './Home.css';

const Home = () => {
  const context = useContext(AppContext);
  const { username } = context;

  return (
    <React.Fragment>
      <div className='home'>
        <h1>Welcome {username} !</h1>
        <ShopList />
      </div>
    </React.Fragment>
  );
};

export default Home;