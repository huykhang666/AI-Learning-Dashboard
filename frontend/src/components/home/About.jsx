function About() {
    const members = [
    {
        avatar: "👨‍💼",
        name: "Nguyễn Huy Khang",
        role: "Backend",
        description: "Cựu kỹ sư Google, 10 năm kinh nghiệm AI/ML"
    },
    {
        avatar: "👨‍💼",
        name: "Nguyễn Trọng Hiểu",
        role: "Frontend",
        description: "PhD NLP, chuyên gia xử lý ngôn ngữ tự nhiên"
    },
    {
        avatar: "👨‍💼",
        name: "Lê Quang Chí",
        role: "Frontend",
        description: "Cựu Product Manager tại VNG và Tiki"
    }
    ]
  return (
    <section id="About" className="bg-gray-100 py-20" >
      <div className="max-w-7xl mx-auto px-4">
        {/* TIEU DE */}
        <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-indigo-500 font-medium text-2xl mb-4"> Về chúng tôi</div>
            <h2 className="text-gray-900 text-4xl font-bold mb-4">Chúng tôi xây dựng tương lai giáo dục</h2>
        </div>
        {/* CARD */}
        <div className="flex items-center gap-20 border-b-2 py-10 border-green-500">

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
        {/* DOi NGU */}
        <div className="mt-12">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
                Đội ngũ sáng lập
            </h2>
            <div className="grid grid-cols-3 gap-12">
                {members.map((member) => (
                <div key={member.name} className="bg-white border border-gray-200 rounded-2xl p-6 text-center hover:border-indigo-400 transition">
                    <div className="text-5xl mb-4">{member.avatar}</div>
                    <h3 className="font-bold text-gray-900 mb-1">{member.name}</h3>
                    <p className="text-indigo-500 text-sm font-medium mb-3">{member.role}</p>
                    <p className="text-gray-500 text-sm">{member.description}</p>
                </div>
                ))}
            </div>
        </div>
      </div>
    </section>
  )
}

export default About