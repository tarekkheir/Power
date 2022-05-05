import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  console.log('enter to protected route');
  const session_isLoggedIn = sessionStorage.getItem('isLoggedIn');

  if (!session_isLoggedIn) {
    console.log('isLoggedIn is false in protected route');
    return (<Navigate to='/login' replace />);
  }

  return <Outlet />;
};

export default ProtectedRoute;