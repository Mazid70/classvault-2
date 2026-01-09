import React, { useContext } from 'react';
import { AuthContext } from './AuthProvider';
import { Navigate, useLocation } from 'react-router';
import Loader from '../Components/Loader/Loader';

const AdminCr = ({ children }) => {
   const { isLoading, user } = useContext(AuthContext);
  const location = useLocation();
  if (isLoading) return <Loader />
  if(user?.role=='admin'||user?.role=='cr')return children
  return <Navigate state={location.pathname} to ='/'/>
};

export default AdminCr;