import React, { useContext } from 'react';
import AppContext from '../../App/AppContext';
import profil from '../../images/profil.png';
import './ProfilFavoris.css';

const ProfilFavoris = () => {
  const context = useContext(AppContext);
  const { user: { username } } = context;

  return (
    <div className='profil-favoris'>
      <div className='profil-name'>
        <img src={profil} height='70' width='70' alt='profil' />
        <h1>{username}</h1>
      </div>
      <div className='profil-favoris-container'>
      </div>
    </div>
  );
};

export default ProfilFavoris;