import Sidebar from './components/Sidebar';

function App() {
  return (
    <div className="flex min-h-screen bg-[#F0F7FF]"> {/* Màu nền xanh nhạt giống mẫu */}
      {/* Sidebar cố định bên trái */}
      <Sidebar />

      {/* Nội dung bên phải */}
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Chào mừng */}
          <div className="bg-blue-600 text-white p-6 rounded-2xl mb-8 shadow-md">
            <h1 className="text-2xl font-medium">Chào mừng bạn, hôm nay bạn học gì mới?</h1>
          </div>

          {/* Khu vực chứa 3 cái Card con số sẽ code ở đây */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {/* Tạm thời để trống để bạn xem kết quả Sidebar trước */}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;