import FeatureCard from "./FeatureCard"
function Feature() { 
    const features = [
    {
        icon: "🎙️",
        title: "Bóc băng AI Whisper",
        description: "Chuyển giọng nói thành văn bản với độ chính xác 95%+. Hỗ trợ tiếng Việt, tiếng Anh và 50+ ngôn ngữ."
    },
    {
        icon: "✨",
        title: "Tóm tắt thông minh",
        description: "AI tự động rút ra ý chính, công thức và từ khóa quan trọng từ bài giảng."
    },
    {
        icon: "💬",
        title: "Chat AI hỏi đáp",
        description: "Đặt câu hỏi về bất kỳ nội dung nào trong video. AI trả lời dựa trên transcript."
    },
    {
        icon: "📈",
        title: "Theo dõi tiến độ",
        description: "Biểu đồ học tập hàng tuần, thống kê giờ học và mục tiêu cá nhân."
    },
    {
        icon: "🔗",
        title: "Hỗ trợ YouTube",
        description: "Chỉ cần dán link YouTube, hệ thống tự tải và xử lý video cho bạn."
    },
    {
        icon: "📄",
        title: "Export PDF",
        description: "Xuất toàn bộ transcript và tóm tắt ra file PDF để ôn tập offline."
    },
    {
        icon: "🏷️",
        title: "Từ khóa thông minh",
        description: "Tự động nhận diện và gắn tag các thuật ngữ quan trọng trong bài học."
    },
    {
        icon: "🔒",
        title: "Bảo mật dữ liệu",
        description: "Video và transcript được mã hóa và chỉ bạn mới truy cập được."
    },
    ]
    const action = [
    {
        icon:"↑",
        title:"Upload video",
        description: "Upload file MP4 hoặc dán link Youtube vào hệ thống"

    },{
        icon: "⚙️",
        title:"AI xử lý",
        description:"Whisper AI bóc băng -> ViT5 tóm tắt nội dung trong 2-5 phút "
    },{
        icon:"🎓",
        title:"Học thông minh",
        description:"xem transcript, chat hỏi đáp với AI, theo dõi tiến độ học tập"
    }
    ]
    return(
        <section className="bg-gray-100 py-20" id="Feature">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 text-indigo-500 font-medium text-2xl mb-4">TÍNH NĂNG</div>
                    <h2 className="text-gray-900 text-4xl font-bold mb-4">
                        Tất cả công cụ bạn cần có để học thông minh
                    </h2>
                    <p className="text-gray-700 text-base max-w-xl mx-auto">Từ bóc băng tự động đến chat AI thông minh - mọi thứ trong một nền tảng duy nhất. </p>
                </div>
                <div className="grid grid-cols-4 gap-6">
                    {features.map((item) => (
                        <FeatureCard
                            key={item.title}
                            icon={item.icon}
                            title={item.title}
                            description={item.description}
                        />
                    ))}
                </div>
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 text-indigo-500 font-medium text-2xl mb-4 mt-20"> CÁCH HOẠT ĐỘNG </div>
                    <h2 className="text-gray-900 font-bold text-4xl mb-4">Chỉ 3 bước đơn giản</h2>
                </div>
                <div className="grid grid-cols-3 gap-8">
                    {action.map((item) => (
                        <FeatureCard
                            key={item.title}
                            icon={item.icon}
                            title={item.title}
                            description={item.description}
                        />
                ))}
                </div>
            </div>
        </section>
    )
}
export default Feature