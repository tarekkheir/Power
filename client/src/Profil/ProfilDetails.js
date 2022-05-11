import axios from 'axios';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppContext from '../App/AppContext';
import profil from '../images/profil.png';
import './ProfilDetails.css';

const ProfilDetails = () => {
  const context = useContext(AppContext);
  const { user: { user_id, username, role, money }, logIn } = context;
  const [myRole, setMyRole] = useState(role);
  const [myUsername, setMyUsername] = useState(username);
  const [myMoney, setMyMoney] = useState(money);
  const [enableSubmit, setEnableSubmit] = useState(true);
  const navigate = useNavigate();


  const postUpdates = (e) => {
    e.preventDefault();
    const accessToken = sessionStorage.getItem('accessToken');
    const headers = { 'authorization': accessToken };
    axios.post('http://localhost:8080/update_user_details', { username: myUsername, role: myRole, money: myMoney }, { headers: headers })
      .then((user) => {
        if (user.data.success) {
          const { role, username, money, accessToken, isLoggedIn, user_id } = user.data;
          // sessionStorage.setItem('accessToken', `Bearer ${accessToken}`);
          // update_details(role, username, money, isLoggedIn, user_id);
          logIn(username, role, user_id, money, isLoggedIn, accessToken);
          alert('Updates done successfully !');
          navigate('/profil');
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
    if (e.target.value !== username && e.target.value !== '' && myRole !== '') {
      setEnableSubmit(false);
    } else setEnableSubmit(true);

    setMyUsername(e.target.value);
  }

  const handleMoney = (e) => {
    e.preventDefault();
    if (e.target.value !== money && e.target.value !== '' && myUsername !== '' && myRole !== '') {
      setEnableSubmit(false);
    } else setEnableSubmit(true);

    setMyMoney(e.target.value);
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
          <div className='profil-details-list-item'>
            <label>Money €</label>
            <input maxLength={4} value={myMoney} onChange={((e) => handleMoney(e))} />
          </div>
          <button type='submit' id='submit-user-details' disabled={enableSubmit}>Submit Changes</button>
        </form>
      </div>
    </div>
  );
};

export default ProfilDetails;