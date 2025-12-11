// src/App.jsx
import AppRouter from './routes';
// Import các Providers sau khi bạn tạo chúng trong context/
// import { UserProvider } from './context/UserContext'; 

function App() {
  // Thay thế nội dung mặc định bằng cấu trúc ứng dụng của bạn
  return (
    // Dùng min-h-screen để đảm bảo Tailwind hoạt động trên toàn bộ trang
    <div className="min-h-screen"> 
      
      {/* Ví dụ: Sau này bạn sẽ bọc Provider ở đây */}
      {/* <UserProvider> */}
        <AppRouter />
      {/* </UserProvider> */}
      
    </div>
  );
}

export default App;