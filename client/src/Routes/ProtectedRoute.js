import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ isLoggedIn, children }) => {

  if (!isLoggedIn) {
    console.log('enter');
    return (<Navigate to='/login' replace />);
  }

  return <Outlet />;
};

export default ProtectedRoute;