import React from 'react';
// 1. XÓA dòng import useNavigate đi Khang nhé
import HeroSection from '../components/home/HeroSection';
import Feature from '../components/home/Feature';
import About from '../components/home/About';
import Pricing from '../components/home/Pricing';
import FAQ from '../components/home/FAQ';
import Footer from '../components/home/Footer'
import Navbar from '../components/layout/Navbar'

// 2. Nhận onLogin và onRegister từ App.jsx truyền xuống
const Home = ({ onLogin, onRegister }) => { 
  
  return (
    <main>
        {/* 3. Truyền trực tiếp các hàm prop xuống các component con */}
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