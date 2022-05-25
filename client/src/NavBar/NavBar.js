import React from 'react';
import './NavBar.css';
import { Link } from 'react-router-dom';

const NavBar = ({ logOut }) => {

  return (
    <div className='navbar center'>
      <ul className='links'>
        <li className='links-item'><Link to='/' className='link'>Home</Link></li>
        <li className='links-item'><Link to='/login'>Login</Link></li>
        <li className='links-item'><Link to='/signup'>SingUp</Link></li>
        <li className='links-item'><Link to='/profil'>Profil</Link></li>
        <li className='links-item'><Link to='/profil/cart'>Cart</Link></li>
        <li className='links-item'><button onClick={() => logOut()}>logout</button></li>
      </ul>
    </div>
  );
};

export default NavBar;