import { useState} from "react"
function HeroSection({onRegister}){
    const [activeTab, setActiveTab] = useState("youtube")
    return (
        <section className="bg-gradient-to-br from-slate-100 to-blue-100" id="HeroSection">
            <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col md:flex-row items-center justify-between">
                {/* LEFT */}
                <div className="flex-1">
                    <div className="inline-flex items-center gap-2 bg-white border border-gray-200 px-4 py-1.5 rounded-full mb-6">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span className="text-sm text-blue-600">Made for Vietnamese Students</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold text-black-300 leading-tigh mb-4">
                        Biến video bài giảng <br />
                        thành kiến thức <br />
                        <span className="bg-gradient-to-r from-blue-700 to-cyan-500 bg-clip-text text-transparent">dễ nắm bắt</span>
                    </h1>
                    <p className="text-base text-gray-600 mb-8 max-w-md"> Up load video bài giảng - AI tự động bóc băng, tóm tắt và trả lời mọi câu hỏi. Học hiểu quả hơn gấp 3 lần!</p>
                    <div className="flex items-center gap-4">
                        <a href="#" className="bg-gradient-to-r from-blue-700 to-cyan-500 text-white text-base font-bold px-6 py-3 rounded-full hover:bg-indigo-700 hover:-translate-y-2 transition">Bắt đầu miễn phí</a>
                        <a href="#Feature" className="bg-white text-black text-base font-bold px-5 py-3 rounded-full hover:-translate-y-2 transition">Xem tính năng</a>
                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 mt-10">
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
                {/* RIGHT */}
                <div className="flex-1 flex justify-center md:justify-end w-full">
                    <div className="bg-white rounded-2xl shadow-lg p-6 w-full md:w-96">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                            </div>
                            <span className="text-xs text-gray-400 font-medium">UPLOAD WIDGET</span>
                        </div>
                        <div className="flex gap-1 mb-4 bg-gray-100 p-1 rounded-xl">
                            <button onClick={() => setActiveTab("file")} className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${ activeTab === "file" ? "bg-white shadow-sm text-gray-700" : "text-gray-400 hover:text-gray-600"}`}>
                                Upload File
                            </button>
                            <button onClick={() => setActiveTab("youtube")} className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${ activeTab === "youtube" ? "bg-white shadow-sm text-gray-700" : "text-gray-400 hover:text-gray-600" }`} >
                                YouTube Link
                            </button>
                        </div>
                        {activeTab === "youtube" ? (
                            <input type="text" placeholder="https://youtube.com/watch?v=..." className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-500 outline-none focus:border-indigo-400 mb-4"/>
                        ) : (
                            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 mb-4 flex flex-col items-center justify-center gap-2">
                                <p className="text-sm font-medium text-gray-600">Kéo & thả file video vào đây</p>
                                <button className="mt-2 border border-gray-300 text-sm px-4 py-1.5 rounded-lg text-gray-600 hover:bg-gray-50">
                                    Chọn file
                                </button>
                            </div>
                        )}
                        <button className="w-full bg-gradient-to-r from-blue-700 to-cyan-500 rounded-full py-4 text-white font-bold hover:from-indigo-600 hover:to-blue-500 transition " onClick={onRegister}>PROCESS VIDEO</button>
                        <p className="text-center text-xs text-gray-400 mt-3"> Miễn phí · Không cần thẻ tín dụng </p>
                    </div>  
                </div>
            </div>
        </section>
    )
}
export default HeroSection