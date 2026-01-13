import React from 'react';
import { Outlet } from 'react-router';
import Navbar from './Components/Navbar/Navbar';
import { Toaster } from 'sonner';
import BottomMenu from './Components/BottomMenu/BottomMenu';





const App = () => {
  return (
    <div className='bg-[#1a1a1a] '>
      {' '}
      <Navbar />
      <Outlet />
      <Toaster position="top-right" richColors />
      <BottomMenu/>
    </div>
  );
};

export default App;
