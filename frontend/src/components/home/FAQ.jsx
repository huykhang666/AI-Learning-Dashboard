import { useState } from "react"

function FAQ() {
  const [openIndex, setOpenIndex] = useState(0)
    const faqs = [
    {
        question: "AI-Learning DashBoard hoạt động như thế nào?",
        answer: "Bạn upload video bài giảng (MP4) hoặc dán link YouTube. Hệ thống dùng AI Whisper để chuyển giọng nói thành văn bản, sau đó dùng mô hình ViT5 để tóm tắt nội dung. Toàn bộ quá trình chỉ mất 2-5 phút."
    },
    {
        question: "Tôi có thể dùng miễn phí không?",
        answer: "Có! Gói Free cho phép xử lý 4 video/ngày, lưu tối đa 10 bài, chat AI 10 tin/ngày. Không cần thẻ tín dụng."
    },
    {
        question: "Hỗ trợ những ngôn ngữ nào?",
        answer: "AI Whisper hỗ trợ 50+ ngôn ngữ bao gồm tiếng Việt, tiếng Anh, tiếng Nhật với độ chính xác cao."
    },
    {
        question: "Dữ liệu video có được bảo mật không?",
        answer: "Hoàn toàn. Video được mã hóa khi upload và chỉ bạn mới có quyền truy cập. Chúng tôi tuân thủ GDPR."
    },
    {
        question: "Tôi có thể hủy Premium bất kỳ lúc nào không?",
        answer: "Có, bạn có thể hủy bất kỳ lúc nào từ trang Cài đặt. Không có phí hủy."
    },
    {
        question: "Thanh toán qua những hình thức nào?",
        answer: "Hỗ trợ MoMo, VNPay, Visa/MasterCard và ATM nội địa. Tất cả được bảo mật SSL."
    }
    ]
  return (
    <section id="faq" className="bg-white py-20">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-700 to-cyan-500 bg-clip-text text-transparent font-medium text-2xl mb-4"> FAQ</div>
          <h2 className="text-gray-900 text-4xl font-bold mb-4">Câu hỏi thường gặp </h2>
        </div>

        <div className="flex flex-col gap-3">
            {faqs.map((faq, index) => (
                <div
                key={faq.question}
                className={`border rounded-2xl px-6 py-4 cursor-pointer transition ${
                    openIndex === index
                    ? "border-indigo-300 bg-indigo-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                >
                <div className="flex items-center justify-between">
                    <h3 className={`font-bold text-base ${
                    openIndex === index ? "text-indigo-600" : "text-gray-900"
                    }`}>
                    {faq.question}
                    </h3>
                    <span className="text-gray-400 text-sm ml-4">
                    {openIndex === index ? "^" : "v"}
                    </span>
                </div>

                {openIndex === index && (
                    <p className="text-gray-500 text-sm mt-3 leading-relaxed">
                    {faq.answer}
                    </p>
                )}

                </div>
            ))}
        </div>

      </div>
    </section>
  )
}

export default FAQ