// src/services/user.service.js

// Giả lập trạng thái người dùng (Có thể thay bằng gọi API thật sau này)
const mockUser = {
  id: 'user-123',
  name: 'Huy Khang',
  email: 'huykhang@example.com',
  isLoggedIn: true,
  role: 'student',
};

const login = async (username, password) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500)); 
  
  if (username === 'test' && password === '123') {
    // Save token/user info to localStorage if successful
    localStorage.setItem('user', JSON.stringify(mockUser));
    return mockUser;
  }
  throw new Error('Tên đăng nhập hoặc mật khẩu không đúng.');
};

const logout = async () => {
  await new Promise(resolve => setTimeout(resolve, 200)); 
  localStorage.removeItem('user');
  return true;
};

const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const userService = {
  login,
  logout,
  getCurrentUser,
};