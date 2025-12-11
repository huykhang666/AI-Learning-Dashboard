// src/App.jsx
import AppRouter from './routes'; 

function App() {
  return (
    // Đã xóa toàn bộ code mặc định và import CSS cũ
    <div className="app-root-container"> 
      {/* AppRouter sẽ được tạo ở bước sau */}
      <AppRouter />
    </div>
  );
}
export default App;