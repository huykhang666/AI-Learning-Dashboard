// src/layouts/MainLayout.jsx
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import '../layouts/MainLayout.jsx';

const MainLayout = () => {
  return (
    <div className="mainLayoutContainer"> 
      <Navbar/>
      <div className="contentWrapper">
        
        <main className="pageContent">
          
        </main>
      </div>
    </div>
  );
};

export default MainLayout;