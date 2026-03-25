import React from 'react';
import HeroSection from '../components/home/HeroSection';
import Feature from '../components/home/Feature';
import About from '../components/home/About';
import Pricing from '../components/home/Pricing';
import FAQ from '../components/home/FAQ';
import Footer from '../components/home/Footer'
import Navbar from '../components/layout/Navbar'

const Home = ({onLogin, onRegister}) => {
  return (
    <main>
        <Navbar 
          onLogin={onLogin} 
          onRegister={onRegister} 
        />
        <HeroSection 
            onRegister={onRegister}
        />
        <Feature />
        <Pricing 
            onRegister={onRegister}
        />
        <About />
        <FAQ />
        <Footer
            onRegister={onRegister}
        />
    </main>
  );
};

export default Home;