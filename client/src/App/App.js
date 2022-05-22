import NavBar from '../NavBar/NavBar';
import './App.css';
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import Login from '../Login/Login';
import Home from '../Home/Home';
import React, { useEffect, useState } from 'react';
import ProtectedRoute from '../Routes/ProtectedRoute';
import AppContext from './AppContext';
import SignUp from '../SignUp/SignUp';
import Shop from '../Shops/Shop';
import Product from '../Products/ProductPage';
import Profil from '../Profil/Profil';
import AddShop from '../Shops/AddShop';
import ProfilDetails from '../Profil/ProfilDetails';
import ProfilShop from '../Profil/ProfilShop';
import AddProduct from '../Products/AddProduct';
import ProfilProduct from '../Profil/ProfilProduct';
import Cart from '../Cart/Cart';
import axios from 'axios';
import ProfilHistoric from '../Profil/ProfilHistoric';
import StarRatingPage from '../Cart/StarRatingPage';


const App = () => {
  const [user, setUser] = useState({
    isLoggedIn: false,
    user_id: 0,
    username: '',
    role: '',
    money: 0,
  });

  useEffect(() => {
    const session_isLoggedIn = sessionStorage.getItem('isLoggedIn');
    if (session_isLoggedIn) {
      const session_user_id = sessionStorage.getItem('user_id');
      const session_accessToken = sessionStorage.getItem('accessToken');
      const headers = { 'authorization': session_accessToken };
      axios.get('http://localhost:8080/user_details', { headers: headers })
        .then((user) => {
          if (user.data.success) {
            const { role, username, money } = user.data;
            setUser({
              accessToken: session_accessToken,
              isLoggedIn: session_isLoggedIn,
              user_id: session_user_id,
              role: role,
              username: username,
              money: money
            });
          } else console.log(user.data);
        })
        .catch((err) => {
          console.log('App axios error get user details: ', err);
        })
    }
  }, [])

  const logOut = () => {
    setUser({ isLoggedIn: false, role: '', username: '', user_id: 0, accessToken: '', money: 0 });
    sessionStorage.clear();
    window.location.reload();
  };

  const logIn = (username, role, user_id, money, isLoggedIn, accessToken) => {
    setUser({ isLoggedIn: isLoggedIn, role: role, username: username, user_id: user_id, money: money });
    sessionStorage.setItem('accessToken', `Bearer ${accessToken}`);
    sessionStorage.setItem('user_id', user_id);
    sessionStorage.setItem('isLoggedIn', isLoggedIn);
  }

  const update_details = (role, username, money) => {
    setUser({ role: role, username: username, money: money });
  }


  return (
    <AppContext.Provider value={{ user, update_details, logIn }}>
      <div className="App">
        <BrowserRouter>
          <NavBar logOut={logOut} />
          <Routes>
            <Route element={<ProtectedRoute isLoggedIn={user.isLoggedIn} />}>
              <Route path='/' element={<Home />} />
              <Route path='/shop/:id' element={<Shop />} />
              <Route path='/shop/:id/product/:id' element={<Product />} />
              <Route path='/profil' element={<Profil />} />
              <Route path='/profil/myshop' element={<ProfilShop />} />
              <Route path='/profil/profil_details' element={<ProfilDetails />} />
              <Route path='/profil/historic' element={<ProfilHistoric />} />
              <Route path='/profil/myshop/add_shop' element={<AddShop />} />
              <Route path='/profil/myshop/add_product' element={<AddProduct />} />
              <Route path='/profil/myshop/product_details/:id' element={<ProfilProduct />} />
              <Route path='/profil/cart' element={<Cart />} />
              <Route path='/profil/cart/star_rating' element={<StarRatingPage />} />
            </Route>
            <Route path='/login' element={user.isLoggedIn ? <Navigate to='/' /> : <Login logIn={logIn} />} />
            <Route path='/signup' element={user.isLoggedIn ? <Navigate to='/' /> : <SignUp logIn={logIn} />} />
          </Routes>
        </BrowserRouter>
      </div >
    </AppContext.Provider >
  );
}

export default App;
