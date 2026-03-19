function About() {
  return (
    <section id="ve-chung-toi" className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-indigo-500 font-medium text-2xl mb-4"> Về chúng tôi</div>
            <h2 className="text-gray-900 text-4xl font-bold mb-4">Chúng tôi xây dựng tương lai giáo dục</h2>
        </div>

        <div className="flex items-center gap-20">
            <div className="flex-1">
                <p className="text-gray-500 text-base mb-4">
                    AI-Learning DashBoard được thành lập năm 2024 bởi những kỹ sư đam mê giáo dục và AI. Chúng tôi tin rằng mọi sinh viên đều xứng đáng có công cụ học tập thông minh nhất.
                </p>
                <p className="text-gray-500 text-base mb-8">
                    Sứ mệnh của chúng tôi là giúp sinh viên Việt Nam tiếp cận nội dung bài giảng một cách hiệu quả hơn, tiết kiệm thời gian và nâng cao chất lượng học tập thông qua công nghệ AI tiên tiến nhất.
                </p>
                <div className="grid grid-cols-2 gap-4">
                    <div className="border border-gray-200 rounded-2xl p-4">
                        <p className="text-2xl font-black text-indigo-600">2.000+</p>
                        <p className="text-sm text-gray-500">Sinh viên</p>
                    </div>
                    <div className="border border-gray-200 rounded-2xl p-4">
                        <p className="text-2xl font-black text-indigo-600">50.000+</p>
                        <p className="text-sm text-gray-500">Video xử lý</p>
                    </div>
                    <div className="border border-gray-200 rounded-2xl p-4">
                        <p className="text-2xl font-black text-indigo-600">95%</p>
                        <p className="text-sm text-gray-500">Độ chính xác AI</p>
                    </div>
                    <div className="border border-gray-200 rounded-2xl p-4">
                        <p className="text-2xl font-black text-indigo-600">4.9 ⭐</p>
                        <p className="text-sm text-gray-500">Đánh giá TB</p>
                    </div>
                </div>
            </div>
    
            <div className="flex-1">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-8 text-white">
                <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full text-sm font-medium mb-6">
                🎯 TẦM NHÌN
                </div>
                <h3 className="text-2xl font-bold mb-4 leading-snug">
                "Mỗi bài giảng đều có thể trở thành tài nguyên học tập không giới hạn."
                </h3>
                <p className="text-indigo-100 text-sm mb-8 leading-relaxed">
                Chúng tôi hướng đến việc xóa bỏ rào cản trong việc tiếp cận và ôn tập nội dung học tập. Không còn phải tua đi tua lại video — chỉ cần hỏi AI và nhận câu trả lời ngay lập tức.
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-white/20 text-white text-xs font-medium px-3 py-1.5 rounded-full">
                    🏆 Top EdTech 2024
                </span>
                <span className="bg-white/20 text-white text-xs font-medium px-3 py-1.5 rounded-full">
                    🇻🇳 Made in Vietnam
                </span>
                <span className="bg-white/20 text-white text-xs font-medium px-3 py-1.5 rounded-full">
                    🔒 GDPR Compliant
                </span>
                </div>

            </div>
            </div>
        </div>

      </div>
    </section>
  )
}

export default About