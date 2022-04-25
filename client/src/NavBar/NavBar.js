import React from 'react';
import './NavBar.css';
import { Link } from 'react-router-dom';

const NavBar = ({ logOut }) => {

  return (
    <div className='navbar center'>
      <ul className='links'>
        <li><Link to='/'>Home</Link></li>
        <li><Link to='/login'>Login</Link></li>
        <li><Link to='/signup'>SingUp</Link></li>
        <li><Link to='/profil'>Profil</Link></li>
        <li><button onClick={() => logOut()}>logout</button></li>
      </ul>
    </div>
  );
};

export default NavBar;