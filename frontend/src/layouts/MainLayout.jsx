// src/layouts/MainLayout.jsx
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f0f0f0' }}>
      <div style={{ padding: '20px', borderRight: '1px solid #ccc' }}>Sidebar Placeholder</div>
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header style={{ padding: '10px', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>Navbar Placeholder</header>
        
        <main style={{ flex: 1, padding: '20px' }}>
          <Outlet /> 
        </main>
      </div>
    </div>
  );
};

export default MainLayout;