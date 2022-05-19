import React, { useContext } from 'react';
import ShopList from '../Shops/ShopList';
import './Home.css';
import AppContext from '../App/AppContext';
import smile from '../images/smile.png';

const Home = () => {
  const context = useContext(AppContext);
  const { user: { username } } = context;

  return (
    <div className='home'>
      <h1 className='home-shops'>
        <span className='home-welcome '>Welcome</span>
        <div className='home-username center'>
          <span id='home-username'>{username}</span>
        </div>
        <img id='smile' src={smile} alt='smile' height={60} width={60} />
      </h1>
      <ShopList />
    </div>
  );
};

export default Home;