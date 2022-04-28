import NavBar from '../NavBar/NavBar';
import './App.css';
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import Login from '../Login/Login';
import Home from '../Home/Home';
import React from 'react';
import ProtectedRoute from '../Routes/ProtectedRoute';
import AppContext, { user } from './AppContext';
import SignUp from '../SignUp/SignUp';
import Shop from '../Shops/Shop';
import Product from '../Products/ProductPage';
import Profil from '../Profil/Profil';
import AddShop from '../Shops/AddShop';
import ProfilDetails from '../Profil/ProfilDetails';
import ProfilShop from '../Profil/ProfilShop';
import AddProduct from '../Products/AddProduct';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user
    }

    this.logIn = this.logIn.bind(this);
    this.logOut = this.logOut.bind(this);
  }

  componentDidMount() {
    const username = sessionStorage.getItem('username');
    const role = sessionStorage.getItem('role');
    const user_id = sessionStorage.getItem('user_id');
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');

    this.setState({
      user: {
        username: username,
        role: role,
        user_id: user_id,
        isLoggedIn: isLoggedIn
      }
    })
  }

  logOut = () => {
    this.setState({ user })
    sessionStorage.clear();
  };

  logIn = (username, role, user_id) => {
    this.setState({
      user: {
        isLoggedIn: true,
        username: username,
        role: role,
        user_id: user_id
      }
    })
  }


  render() {
    console.log('App rendering');
    const { user: { isLoggedIn } } = this.state;
    return (
      <AppContext.Provider value={this.state.user}>
        <div className="App">
          <BrowserRouter>
            <NavBar logOut={this.logOut} />
            <Routes>
              <Route element={<ProtectedRoute isLoggedIn={isLoggedIn} />}>
                <Route path='/' element={<Home />} />
                <Route path='/shop/:id' element={<Shop />} />
                <Route path='/shop/:id/product/:id' element={<Product />} />
                <Route path='/profil' element={<Profil />} />
                <Route path='/profil_details' element={<ProfilDetails />} />
                <Route path='/add_shop' element={<AddShop />} />
                <Route path='/myshop' element={<ProfilShop />} />
                <Route path='add_product' element={<AddProduct />} />
              </Route>
              <Route path='/login' element={isLoggedIn ? <Navigate to='/' /> : <Login logIn={this.logIn} />} />
              <Route path='/signup' element={isLoggedIn ? <Navigate to='/' /> : <SignUp logIn={this.logIn} />} />
            </Routes>
          </BrowserRouter>
        </div >
      </AppContext.Provider >
    );
  }
}

export default App;
