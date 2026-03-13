function HeroSection(){
    return (
        <section className="bg-gradient-to-br from-slate-100 to-blue-100">
            <div className="max-w-7xl mx-auto px-4 py-20 flex items-center justify-between">
                <div className="flex-1">
                    <div className="inline-flex items-center gap-2 bg-white border border-gray-200 px-4 py-1.5 rounded-full mb-6">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span className="text-sm text-blue-600">Made for Vietnamese Students</span>
                    </div>
                    <h1 className="text-5xl font-bold text-black-300 leading-tigh mb-4">
                        Biến video bài giảng <br />
                        thành kiến thức <br />
                        <span className="text-indigo-600">dễ nắm bắt</span>
                    </h1>
                    <p className="text-base text-gray-600 mb-8 max-w-md"> Up load video bài giảng - AI tự động bóc băng, tóm tắt và trả lời mọi câu hỏi. Học hiểu quả hơn gấp 3 lần!</p>
                    <div className="flex items-center gap-4">
                        <a href="#" className="bg-indigo-600 text-white text-base font-bold px-6 py-3 rounded-full hover:bg-indigo-700 hover:-translate-y-2 transition">Bắt đầu miễn phí</a>
                        <a href="#" className="bg-white text-black text-base font-bold px-5 py-3 rounded-full hover:-translate-y-2 transition">Xem tính năng</a>
                    </div>
                    {/* THỐNG KÊ */}
<div className="flex items-center gap-6 mt-10">

  {/* AVATAR */}
  <div className="flex items-center">
    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold -ml-0">A</div>
    <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold -ml-2">B</div>
    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold -ml-2">C</div>
    <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-white text-xs font-bold -ml-2">D</div>
    <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs font-bold -ml-2">E</div>
  </div>
  <span className="text-sm text-gray-600 font-medium">2.000+ sinh viên tin dùng</span>
  <span className="text-sm text-gray-600 font-medium">4.9/5</span>
  <span className="text-sm text-gray-600 font-medium">50K+ video đã xử lý</span>

</div>
                </div>
                <div className="flex-1">
                    Phai    
                </div>
            </div>
        </section>
    )
}
export default HeroSection