import React from 'react';
import Hero from './components/Hero';
import Services from './components/Services';

const Home = () => {
  return (
    <main className="xl:p-10  overflow-hidden">
      <Hero />
      <Services/>
    </main>
  );
};

export default Home;
