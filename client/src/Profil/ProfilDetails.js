import axios from 'axios';
import React, { useContext, useState } from 'react';
import { useLocation } from 'react-router-dom';
import AppContext from '../App/AppContext';
import profil from '../images/profil.png';
import './ProfilDetails.css';

const ProfilDetails = () => {
  const location = useLocation();
  const { username, role } = location.state;
  const [myRole, setMyRole] = useState(role);
  const [myUsername, setMyUsername] = useState(username);
  const [enableSubmit, setEnableSubmit] = useState(true);
  const context = useContext(AppContext);
  const { user_id } = context;


  const postUpdates = (e) => {
    e.preventDefault();
    const accessToken = sessionStorage.getItem('accessToken');
    const headers = { 'authorization': accessToken };
    axios.post('http://localhost:8080/update_user_details', { username: myUsername, role: myRole }, { headers })
      .then((user) => {
        console.log(Object.keys(user.data).length, user.data);
        if (Object.keys(user.data).length > 1) {
          const { accessToken, user_id, role, username, isLoggedIn } = user.data;
          sessionStorage.setItem('accessToken', 'Bearer ' + accessToken);
          sessionStorage.setItem('user_id', user_id);
          sessionStorage.setItem('username', username);
          sessionStorage.setItem('role', role);
          sessionStorage.setItem('isLoggedIn', isLoggedIn);

          if (isLoggedIn) {
            alert('Updates done successfully !');
            window.location.assign('http://localhost:3000/');
          }
        } else alert(user.data.message);
      })
      .catch((err) => {
        console.log('error on axios post: ', err);
      })
  }

  const handleRole = (e) => {
    e.preventDefault();
    if (e.target.value !== role && myUsername !== '') {
      setEnableSubmit(false)
    } else setEnableSubmit(true);

    setMyRole(e.target.value);
  }

  const handleUsername = (e) => {
    e.preventDefault();
    if (e.target.value !== username && e.target.value !== '') {
      setEnableSubmit(false);
    } else setEnableSubmit(true);

    setMyUsername(e.target.value);
  }

  return (
    <div className='profil-details'>
      <div className='profil-details-container'>
        <div className='profil-name'>
          <img src={profil} height='70' width='70' alt='profil' />
          <h1>{username}</h1>
        </div>
        <form className='profil-details-list' onSubmit={(e) => postUpdates(e)}>
          <div className='profil-details-list-item'>
            <label>User Name</label>
            <input value={myUsername} onChange={(e) => handleUsername(e)} />
          </div>
          <div className='profil-details-list-item'>
            <label>Role</label>
            <select value={myRole} name='role' onChange={(e) => handleRole(e)} >
              <option value='user'>User</option>
              <option value='moderator'>Moderator</option>
              {Number(user_id) === 1 ? <option value='admin'>Admin</option> : null}
            </select>
          </div>
          <button type='submit' id='submit-user-details' disabled={enableSubmit}>Submit Changes</button>
        </form>
      </div>
    </div>
  );
};

export default ProfilDetails;