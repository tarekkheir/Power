import NavBar from '../NavBar/NavBar';
import './App.css';
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import Login from '../Login/Login';
import Home from '../Home/Home';
import React from 'react';
import ProtectedRoute from '../Routes/ProtectedRoute';
import AppContext from './AppContext';
import SignUp from '../SignUp/SignUp';
import Shop from '../Shops/Shop';
import Product from '../Products/Product';
import Profil from '../Profil/Profil';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        username: '',
        role: '',
        password: ''
      },
      isLoggedIn: false
    }

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.setUser = this.setUser.bind(this);
  }

  login = () => { this.setState({ isLoggedIn: true }) };
  logout = () => { this.setState({ isLoggedIn: false }) };
  setUser = (username, password, role) => {
    this.setState({
      user: {
        username: username,
        role: role,
        password: password
      }
    })
  };


  render() {
    const { isLoggedIn, user } = this.state;
    return (
      <AppContext.Provider value={{ login: this.login, logout: this.logout, user: user, isLoggedIn: isLoggedIn, setUser: this.setUser }}>
        <div className="App">
          <BrowserRouter>
            <NavBar />
            <Routes>
              <Route element={<ProtectedRoute isLoggedIn={this.state.isLoggedIn} />}>
                <Route path='/' element={<Home />} />
                <Route path='/shop/:id' element={<Shop />} />
                <Route path='/shop/:id/product/:id' element={<Product />} />
                <Route path='/profil' element={<Profil />} />
              </Route>
              <Route path='/login' element={isLoggedIn ? <Navigate to='/' /> : <Login />} />
              <Route path='/signup' element={isLoggedIn ? <Navigate to='/' /> : <SignUp />} />
            </Routes>
          </BrowserRouter>
        </div >
      </AppContext.Provider >
    );
  }
}

export default App;
