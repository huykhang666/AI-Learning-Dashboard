import React, { useState } from 'react';
import axios from 'axios';

function UploadWidget({ onProcessAction, hideHeader }) {
    const [activeTab, setActiveTab] = useState("youtube");
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentStep, setCurrentStep] = useState(1);
    
    const [youtubeUrl, setYoutubeUrl] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);

    // --- 1. HÀM XỬ LÝ API (DÙNG FORMDATA ĐỂ KHỚP VỚI JAVA) ---
    const handleStartProcess = async () => {
        if (activeTab === "youtube" && !youtubeUrl.trim()) {
            alert("Khang dán link YouTube vào đã nhé!");
            return;
        }
        if (activeTab === "file" && !selectedFile) {
            alert("Khang chọn file video đã nhé!");
            return;
        }

        try {
            // HIỆN LẠI GIAO DIỆN LOAD Ở ĐÂY
            setIsProcessing(true);
            setProgress(5);
            setCurrentStep(1);

            const token = localStorage.getItem('token');
            const formData = new FormData();
            
            // Đóng gói cho đúng @RequestParam bên Java
            if (activeTab === "youtube") {
                formData.append('title', 'YouTube Lecture - ' + new Date().toLocaleDateString());
                formData.append('videoUrl', youtubeUrl);
            } else {
                formData.append('title', selectedFile.name);
                formData.append('file', selectedFile);
            }

            // Gọi API
            const response = await axios.post('http://localhost:8080/api/v1/sessions', formData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.data) {
                // Chạy thanh progress cho đẹp
                let p = 5;
                const interval = setInterval(() => {
                    p += 1;
                    setProgress(p);
                    if (p < 30) setCurrentStep(1);
                    else if (p < 65) setCurrentStep(2);
                    else if (p < 90) setCurrentStep(3);
                    else if (p < 100) setCurrentStep(4);
                    
                    if (p >= 100) {
                        clearInterval(interval);
                        setTimeout(() => {
                            if (onProcessAction) onProcessAction(response.data.result); 
                        }, 800);
                    }
                }, 40); 
            }

        } catch (error) {
            console.error("Lỗi API:", error.response?.data || error.message);
            alert("Lỗi kết nối Server rồi Khang ơi! Check lại Backend nhé.");
            setIsProcessing(false); // Trả về giao diện ban đầu nếu lỗi
        }
    };

    // --- 2. GIAO DIỆN LOAD LOAD (BẢN CHUẨN FONT) ---
    if (isProcessing) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 w-full h-full flex flex-col">
                <h2 className="text-blue-600 font-bold text-xs uppercase tracking-wider mb-6 text-left">Processing Your Lecture</h2>
                
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 overflow-hidden text-left">
                        <span className="text-gray-400">📄</span>
                        <span className="text-sm font-medium text-gray-700 truncate">
                            {activeTab === "youtube" ? "YouTube Video" : selectedFile?.name}
                        </span>
                    </div>
                    <button onClick={() => setIsProcessing(false)} className="text-gray-400 hover:text-red-500 transition">✕</button>
                </div>

                <div className="w-full bg-gray-100 h-1.5 rounded-full mb-1">
                    <div className="bg-blue-600 h-full rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                </div>
                <div className="text-right text-[10px] text-blue-600 font-bold mb-6">{progress}%</div>

                <div className="flex flex-col gap-4">
                    {[
                        { id: 1, label: "Uploaded Successfully" },
                        { id: 2, label: "Transcribing Audio (AI Whisper...)" },
                        { id: 3, label: "Summarizing Content (AI ViT5)" },
                        { id: 4, label: "Finalizing Session" }
                    ].map((step) => (
                        <div key={step.id} className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] border ${
                                currentStep >= step.id ? "bg-blue-50 border-blue-200 text-blue-600" : "bg-gray-50 border-gray-100 text-gray-400"
                            }`}>
                                {currentStep > step.id ? "✓" : step.id}
                            </div>
                            <span className={`text-sm ${currentStep >= step.id ? "text-gray-700 font-medium" : "text-gray-400"}`}>
                                {step.label}
                            </span>
                        </div>
                    ))}
                </div>
                <p className="mt-auto text-xs text-gray-400 italic text-center">Estimated time: ~2 minutes</p>
            </div>
        );
    }

    // --- 3. GIAO DIỆN NHẬP LIỆU BAN ĐẦU (GIỮ NGUYÊN FONT CỦA KHANG) ---
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 w-full h-full flex flex-col">
            {!hideHeader && (
                <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                    <span className="text-xs text-gray-400 font-medium">UPLOAD WIDGET</span>
                </div>
            )}
            
            <div className="flex gap-1 mb-4 bg-gray-100 p-1 rounded-xl">
                <button onClick={() => setActiveTab("file")} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === "file" ? "bg-white shadow-sm text-gray-700" : "text-gray-400 hover:text-gray-600"}`}>Upload File</button>
                <button onClick={() => setActiveTab("youtube")} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === "youtube" ? "bg-white shadow-sm text-gray-700" : "text-gray-400 hover:text-gray-600"}`}>YouTube Link</button>
            </div>
            
            <div className="flex-1 flex flex-col justify-center mb-4">
                {activeTab === "youtube" ? (
                    <input 
                        type="text" 
                        value={youtubeUrl}
                        onChange={(e) => setYoutubeUrl(e.target.value)}
                        placeholder="https://youtube.com/watch?v=..." 
                        className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-gray-500 outline-none focus:border-indigo-400" 
                    />
                ) : (
                    <div className="h-full min-h-[120px] border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center gap-2 text-center hover:bg-gray-50 cursor-pointer relative">
                        <input 
                            type="file" 
                            className="absolute inset-0 opacity-0 cursor-pointer" 
                            onChange={(e) => setSelectedFile(e.target.files[0])}
                        />
                        <p className="text-sm font-medium text-gray-600">
                            {selectedFile ? selectedFile.name : "Kéo & thả file video vào đây"}
                        </p>
                        {!selectedFile && <button className="mt-2 border border-gray-300 text-sm px-5 py-2 rounded-lg text-gray-600">Chọn file</button>}
                    </div>
                )}
            </div>
            
            <button 
                className="w-full bg-gradient-to-r from-blue-700 to-cyan-500 rounded-full py-3.5 text-white font-bold hover:from-indigo-600 hover:to-blue-500 transition mt-auto active:scale-95" 
                onClick={handleStartProcess}
            >
                PROCESS VIDEO
            </button>
        </div>
    );
}

export default UploadWidget;