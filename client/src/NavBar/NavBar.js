import React, { useContext } from 'react';
import './NavBar.css';
import { Link } from 'react-router-dom';
import AppContext from '../App/AppContext';

const NavBar = () => {
  const context = useContext(AppContext);
  const { login, logout } = context;

  return (
    <div className='navbar center'>
      <ul className='links'>
        <li><Link to='/'>Home</Link></li>
        <li><Link to='/login'>Login</Link></li>
        <li><Link to='/signup'>SingUp</Link></li>
        <li><Link to='/profil'>Profil</Link></li>
        <li><button onClick={() => login()}>login</button></li>
        <li><button onClick={() => logout()}>logout</button></li>
      </ul>
    </div>
  );
};

export default NavBar;