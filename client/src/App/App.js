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
import AddShop from '../Shops/AddShop';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        username: '',
        role: '',
        password: '',
        user_id: 0
      },
      isLoggedIn: false
    }

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.setUser = this.setUser.bind(this);
  }

  login = () => { this.setState({ isLoggedIn: true }) };
  logout = () => {
    this.setState({ isLoggedIn: false })
    sessionStorage.removeItem('accessToken')
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('user_id');
  };

  setUser = (username, password, role, user_id) => {
    this.setState({
      user: {
        username: username,
        role: role,
        password: password,
        user_id: user_id
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
                <Route path='/add_shop' element={<AddShop />} />
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
