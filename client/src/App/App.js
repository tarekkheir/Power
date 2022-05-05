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


const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [user_id, setUser_id] = useState(0);
  const [role, setRole] = useState('');

  useEffect(() => {
    const session_username = sessionStorage.getItem('username');
    const session_user_id = sessionStorage.getItem('user_id');
    const session_role = sessionStorage.getItem('role');
    const session_isLoggedIn = sessionStorage.getItem('isLoggedIn');

    if (!session_isLoggedIn || !session_role || !session_user_id || !session_username) {
      console.log('Items in session are null');
    } else {
      setIsLoggedIn(session_isLoggedIn);
      setRole(session_role);
      setUsername(session_username);
      setUser_id(session_user_id);
    }

  }, [isLoggedIn, username, user_id, role])

  const logOut = () => {
    setUsername('');
    setRole('');
    setIsLoggedIn(false);
    setUser_id(0);
    sessionStorage.clear();
    window.location.reload();
  };

  const logIn = (username, role, user_id) => {
    setUsername(username);
    setRole(role);
    setIsLoggedIn(true);
    setUser_id(user_id);
  }
  return (
    <AppContext.Provider value={{ isLoggedIn, role, user_id, username }}>
      <div className="App">
        <BrowserRouter>
          <NavBar logOut={logOut} />
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route path='/' element={<Home />} />
              <Route path='/shop/:id' element={<Shop />} />
              <Route path='/shop/:id/product/:id' element={<Product />} />
              <Route path='/profil' element={<Profil />} />
              <Route path='/profil/myshop' element={<ProfilShop />} />
              <Route path='/profil/profil_details' element={<ProfilDetails />} />
              <Route path='/profil/myshop/add_shop' element={<AddShop />} />
              <Route path='/profil/myshop/add_product' element={<AddProduct />} />
              <Route path='/profil/myshop/product_details/:id' element={<ProfilProduct />} />
              <Route path='/profil/cart' element={<Cart />} />
            </Route>
            <Route path='/login' element={isLoggedIn ? <Navigate to='/' /> : <Login logIn={logIn} />} />
            <Route path='/signup' element={isLoggedIn ? <Navigate to='/' /> : <SignUp logIn={logIn} />} />
          </Routes>
        </BrowserRouter>
      </div >
    </AppContext.Provider >
  );
}

export default App;
