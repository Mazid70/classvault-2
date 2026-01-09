import React from 'react';
import { Outlet } from 'react-router';
import Navbar from './Components/Navbar/Navbar';
import { Toaster } from 'sonner';





const App = () => {
  return (
    <div className='bg-[#1a1a1a]'>
      {' '}
      <Navbar />
      <Outlet />
      <Toaster position="top-right" richColors />
    </div>
  );
};

export default App;
