import React, { useContext } from 'react';
import { AuthContext } from './AuthProvider';
import { Navigate, useLocation } from 'react-router';
import Loader from '../Components/Loader/Loader';

const ValidUser = ({children}) => {
  const { user, isLoading } = useContext(AuthContext);
  const location = useLocation();
  if (isLoading) return <Loader />;
  if (user) return children;
  return <Navigate state={location.pathname} to='/signin'/>
};

export default ValidUser;