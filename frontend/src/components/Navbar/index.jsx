// src/components/Navbar/index.jsx
import React from 'react';
import { Search, Bell, User, Settings, LogOut } from 'lucide-react';
import './style.css'; 

const Navbar = () => {
  return (
    // Dùng tên class trực tiếp (Không dùng styles.class)
    <nav className="navbarContainer">
      
      {/* 1. Thanh Search */}
      <div className="searchContainer">
        <Search className="searchIcon" />
        <input 
          type="text" 
          placeholder="Search..." 
          className="searchInput"
        />
      </div>
      
      {/* 2. Các Icons và Profile */}
      <div className="navIcons">
        
        {/* Nút Notifications */}
        <button className="navButton" title="Notifications">
          <Bell size={20} color="#333" />
        </button>
        
        {/* Profile Dropdown Trigger */}
        <div className="profileDropdown">
            <img 
              src="https://via.placeholder.com/35"
              alt="User Profile"
              className="profileImage"
              title="Profile"
            />
            {/* Đây là nội dung Dropdown (Tạm ẩn) */}
            <div className="dropdownContent">
                <div className="dropdownItem">
                    <User size={16} /> Profile
                </div>
                <div className="dropdownItem">
                    <Settings size={16} /> Settings
                </div>
                <div className="dropdownItem">
                    <LogOut size={16} /> Sign Out
                </div>
            </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;