import React from 'react';
import './NavBar.css';
import { Link } from 'react-router-dom';
import home from '../images/home.png';


const NavBar = ({ logOut }) => {

  return (
    <div className='navbar center'>
      <ul className='links'>
        <li className='links-item'>
          <Link to='/' className='link'>
            <img id='home' src={home} alt='home' height='40' width='40' />
            <span id='home-text'>Home</span>
          </Link>
        </li>
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