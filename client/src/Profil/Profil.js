import React, { useContext, useState } from 'react';
import AppContext from '../App/AppContext';

const Profil = () => {
  const context = useContext(AppContext);
  console.log(context);
  const { user: { username, role, password } } = context;
  const [new_name, setNew_name] = useState('');


  const handleChangeUsername = (event) => {
    event.preventDefault();
    setNew_name({ new_name: event.target.value });
  }

  const changeUsername = (event) => {
    event.preventDefault();

    if (new_name !== username) {
      console.log('new username: ', new_name);
    } else console.log('Username don\'t change');
  }

  return (
    <div className='profil'>
      <h1>{username} profil !</h1>
      <ul>
        <li>
          <form onSubmit={(event) => changeUsername(event)}>
            <label>Username</label>
            <input value={new_name} type='text' onChange={(event) => handleChangeUsername(event)} />
            <button type='submit'>submit</button>
          </form>
        </li>
        <li>Role: {role} <button>O</button></li>
        <li>Password: {password} <button>O</button></li>
      </ul>
    </div>
  );
};

export default Profil;