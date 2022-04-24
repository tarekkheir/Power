import React from 'react';
import './Login.css';
import axios from 'axios';
import AppContext from '../App/AppContext';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      enableSubmit: false
    }

    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleChangeUsername = this.handleChangeUsername.bind(this);
    this.postUser = this.postUser.bind(this);
  }

  async postUser(event) {
    event.preventDefault();
    const { username, password } = this.state;
    try {
      await axios.post('http://localhost:8080/login', { username: username, password: password })
        .then((res) => {
          const { isLoggedIn } = res.data;
          console.log(res.data);
          if (!isLoggedIn) alert(res.data.message);
          else {
            const { accessToken, username, role, user_id } = res.data;
            sessionStorage.setItem('accessToken', `Bearer ${accessToken}`)
            sessionStorage.setItem('username', username);
            sessionStorage.setItem('role', role);
            sessionStorage.setItem('user_id', user_id);
            this.context.login();
            this.context.setUser(username, this.state.password, role, user_id);
          }
        })
        .catch((err) => {
          console.log('axios error', err);
        })
    } catch (err) {
      console.log('error on try', err);
    }
  }

  handleChangeUsername(event) {
    event.preventDefault();

    if (event.target.value !== '' && this.state.password !== '') {
      this.setState({ enableSubmit: true });
    } else this.setState({ enableSubmit: false });

    this.setState({ username: event.target.value })
  }

  handleChangePassword(event) {
    event.preventDefault();

    if (event.target.value !== '' && this.state.email !== '') {
      this.setState({ enableSubmit: true });
    } else this.setState({ enableSubmit: false });

    this.setState({ password: event.target.value })
  }


  render() {
    const { enableSubmit, username, password } = this.state;

    return (
      <div className='login'>
        <h1>Login</h1>
        <form className='form' onSubmit={(event) => this.postUser(event)}>
          <label>Username</label>
          <input
            id='username'
            type='text'
            value={username}
            onChange={(event) => this.handleChangeUsername(event)} />
          <label>Password</label>
          <input
            id="password"
            type="password"
            name="password"
            value={password}
            onChange={(event) => this.handleChangePassword(event)} />
          <button type='submit' disabled={!enableSubmit} >Submit</button>
        </form>
      </div>
    );
  }
};

Login.contextType = AppContext;

export default Login;