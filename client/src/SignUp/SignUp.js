import React from 'react';
import './SignUp.css';
import axios from 'axios';
import AppContext from '../App/AppContext';

class SingUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      username: '',
      password: '',
      role: 'user' || 'moderator',
      enableSubmit: false
    }

    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleChangeUsername = this.handleChangeUsername.bind(this);
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.postUser = this.postUser.bind(this);
  }

  async postUser(event) {
    event.preventDefault();
    const { username, password, role, email } = this.state;
    try {
      await axios.post('http://localhost:8080/signup', { username: username, password: password, role: role, email: email })
        .then((res) => {
          const { isLoggedIn } = res.data;
          if (!isLoggedIn) alert(res.data.message);
          else {
            const { accessToken, username, role, user_id, money } = res.data;
            this.props.logIn(username, role, user_id, money, isLoggedIn, accessToken);
          }
        })
        .catch((err) => {
          console.log('axios error', err);
        })
    } catch (err) {
      console.log('error on try', err);
    }
  }

  handleChangeEmail(event) {
    if (event.target.value !== '' && this.state.password !== '') {
      this.setState({ enableSubmit: true });
    } else this.setState({ enableSubmit: false });

    this.setState({ email: event.target.value })
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

  handleRole(e) {
    e.preventDefault();

    if (e.target.value === 'user' || e.target.value === 'moderator')
      this.setState({ role: e.target.value });
  }


  render() {
    const { enableSubmit, username, password, email, role } = this.state;

    return (
      <div className='login'>
        <h1 id='title'>Sign Up</h1>
        <form className='form' onSubmit={(event) => this.postUser(event)}>
          <label>Email</label>
          <input
            id="email"
            type="email"
            name="email"
            value={email}
            onChange={(event) => this.handleChangeEmail(event)} />
          <label>Username</label>
          <input
            id='username'
            type='text'
            maxLength={12}
            value={username}
            onChange={(event) => this.handleChangeUsername(event)} />
          <label>Password</label>
          <input
            id="password"
            type="password"
            name="password"
            value={password}
            onChange={(event) => this.handleChangePassword(event)} />
          <select id='select-role' name="role" value={role} onChange={(e) => this.handleRole(e)}>
            <option value="user">User</option>
            <option value="moderator">Moderator</option>
          </select>
          <button type='submit' disabled={!enableSubmit} >Submit</button>
        </form>
      </div>
    );
  }
};

SingUp.contextType = AppContext;

export default SingUp;