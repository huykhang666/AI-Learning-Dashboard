import React, { useState } from 'react';
import axios from 'axios';

// Validate YouTube URL
const isValidYoutubeUrl = (url) => {
    return /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}/.test(url.trim());
};

// Validate file type — chỉ cho phép video/audio phổ biến
const ACCEPTED_TYPES = ['video/mp4', 'video/webm', 'video/ogg', 'audio/wav', 'audio/mpeg', 'audio/mp4'];
const isValidFile = (file) => ACCEPTED_TYPES.includes(file.type);

function UploadWidget({ onProcessAction, hideHeader }) {
    const [activeTab, setActiveTab] = useState("youtube");
    const [isProcessing, setIsProcessing] = useState(false);
    const [displayProgress, setDisplayProgress] = useState(0);
    const [currentStep, setCurrentStep] = useState(1);
    const [youtubeUrl, setYoutubeUrl] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [inputError, setInputError] = useState(""); 

    // Xử lý khi user bấm "PROCESS VIDEO":
    // - Validate input, bật màn hình loading
    // - Gọi API tạo session, sau đó poll trạng thái job mỗi 3 giây
    // - Khi job COMPLETED thì chạy progress từ 75% lên 100% rồi chuyển trang
    const handleStartProcess = async () => {
        setInputError("");

        if (activeTab === "youtube") {
            if (!youtubeUrl.trim()) {
                setInputError("Vui lòng dán link YouTube vào!");
                return;
            }
            if (!isValidYoutubeUrl(youtubeUrl)) {
                setInputError("Link YouTube không hợp lệ. Ví dụ: https://youtube.com/watch?v=xxxx");
                return;
            }
        }

        if (activeTab === "file") {
            if (!selectedFile) {
                setInputError("Vui lòng chọn file video!");
                return;
            }
            if (!isValidFile(selectedFile)) {
                setInputError("Định dạng không hỗ trợ. Vui lòng chọn file MP4, WebM, WAV hoặc MP3.");
                return;
            }
        }

        setIsProcessing(true);
        setCurrentStep(1);
        setDisplayProgress(0);

        let fakeTimerId = null;
        let stopped = false;

        fakeTimerId = setInterval(() => {
            if (stopped) {
                clearInterval(fakeTimerId);
                return;
            }
            setDisplayProgress(prev => {
                if (prev >= 75) {
                    stopped = true;
                    clearInterval(fakeTimerId);
                    return 75;
                }
                const inc = Math.random() * 1 + 0.5;
                const next = Math.min(prev + inc, 75);
                if (next > 15) setCurrentStep(2);
                if (next > 45) setCurrentStep(3);
                return next;
            });
        }, 400);

        try {
           const token = localStorage.getItem('accessToken'); 


            const formData = new FormData();

            if (activeTab === "youtube") {
                formData.append('title', 'YouTube Lecture');
                formData.append('videoUrl', youtubeUrl);
            } else {
                formData.append('title', selectedFile.name);
                formData.append('file', selectedFile);
            }

            const response = await axios.post('http://localhost:8080/api/v1/sessions', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data && response.data.result) {
                const { sessionId } = response.data.result;

                // Poll trạng thái job mỗi 3 giây cho đến khi COMPLETED hoặc FAILED
                const checkStatusInterval = setInterval(async () => {
                    try {
                        const statusRes = await axios.get(`http://localhost:8080/api/v1/jobs/${sessionId}`, {
                            headers: { Authorization: `Bearer ${token}` }
                        });

                        const { status } = statusRes.data.result;

                        if (status === 'COMPLETED') {
                            stopped = true;
                            clearInterval(fakeTimerId);
                            clearInterval(checkStatusInterval);

                            const finishTimer = setInterval(() => {
                                setDisplayProgress(prev => {
                                    if (prev >= 100) {
                                        clearInterval(finishTimer);
                                        setCurrentStep(4);
                                        setTimeout(() => onProcessAction(sessionId), 1000);
                                        return 100;
                                    }
                                    return prev + 2;
                                });
                            }, 50);

                        } else if (status === 'FAILED') {
                            stopped = true;
                            clearInterval(fakeTimerId);
                            clearInterval(checkStatusInterval);
                            setCurrentStep(-1); // -1 = trạng thái lỗi
                            setIsProcessing(false);
                        }
                    } catch (err) {
                        console.error("Lỗi khi kiểm tra trạng thái job:", err);
                    }
                }, 3000);
            }

        } catch (error) {
            stopped = true;
            clearInterval(fakeTimerId);
            console.error("Lỗi tạo session:", error.response?.data || error.message);
            setCurrentStep(-1); 
            setIsProcessing(false);
        }
    };

    // Màn hình loading — hiển thị khi đang xử lý video
    if (isProcessing) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 w-full h-full flex flex-col items-center justify-center text-center">
                <div className="mb-6 relative flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full border-4 border-gray-100"></div>
                    <div className="absolute w-16 h-16 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
                    <span className="absolute text-blue-600 font-bold text-sm">{Math.round(displayProgress)}%</span>
                </div>

                <h2 className="text-blue-600 font-bold text-xs uppercase tracking-wider mb-6">Processing Your Lecture</h2>

                <div className="flex items-center justify-between mb-2 w-full">
                    <div className="flex items-center gap-2 overflow-hidden text-left">
                        <span className="text-gray-400">📄</span>
                        <span className="text-sm font-medium text-gray-700 truncate">
                            {activeTab === "youtube" ? "YouTube Video" : selectedFile?.name}
                        </span>
                    </div>
                    <button onClick={() => setIsProcessing(false)} className="text-gray-400 hover:text-red-500 transition">✕</button>
                </div>

                <div className="w-full bg-gray-100 h-1.5 rounded-full mb-1">
                    <div
                        className="bg-blue-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${displayProgress}%` }}
                    ></div>
                </div>
                <div className="text-right text-[10px] text-blue-600 font-bold mb-6 w-full">{Math.round(displayProgress)}%</div>

                <div className="flex flex-col gap-4 w-full text-left">
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
                            {currentStep === step.id && displayProgress < 100 && (
                                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse ml-auto"></div>
                            )}
                        </div>
                    ))}
                </div>

                <p className="mt-auto text-xs text-gray-400 italic text-center">Estimated time: ~2 minutes</p>
            </div>
        );
    }

    // Màn hình lỗi — hiển thị khi job thất bại hoặc không tạo được session
    if (currentStep === -1) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 w-full h-full flex flex-col items-center justify-center text-center gap-4">
                <div className="w-14 h-14 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-2xl">✕</div>
                <div>
                    <h2 className="text-red-500 font-bold text-sm uppercase tracking-wider mb-1">Processing Failed</h2>
                    <p className="text-gray-400 text-xs">Đã xảy ra lỗi trong quá trình xử lý.<br />Vui lòng kiểm tra lại đường truyền hoặc thử lại.</p>
                </div>
                <button
                    onClick={() => { setCurrentStep(1); setDisplayProgress(0); }}
                    className="mt-2 border border-red-300 text-red-500 text-sm px-6 py-2 rounded-lg hover:bg-red-50 transition"
                >
                    Thử lại
                </button>
            </div>
        );
    }

    // Màn hình nhập liệu — cho phép user chọn YouTube link hoặc upload file
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
                <button
                    onClick={() => { setActiveTab("file"); setInputError(""); }}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === "file" ? "bg-white shadow-sm text-gray-700" : "text-gray-400 hover:text-gray-600"}`}
                >Tải File</button>
                <button
                    onClick={() => { setActiveTab("youtube"); setInputError(""); }}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === "youtube" ? "bg-white shadow-sm text-gray-700" : "text-gray-400 hover:text-gray-600"}`}
                >YouTube Link</button>
            </div>

            <div className="flex-1 flex flex-col justify-center mb-4 gap-2">
                {activeTab === "youtube" ? (
                    <>
                        <input
                            type="text"
                            value={youtubeUrl}
                            onChange={(e) => { setYoutubeUrl(e.target.value); setInputError(""); }}
                            placeholder="https://youtube.com/watch?v=..."
                            className={`w-full border rounded-xl px-4 py-3.5 text-sm text-gray-500 outline-none transition ${
                                inputError ? "border-red-400 focus:border-red-400" : "border-gray-200 focus:border-indigo-400"
                            }`}
                        />
                        {/* Thông báo lỗi inline */}
                        {inputError && (
                            <p className="text-red-500 text-xs flex items-center gap-1">
                                <span>✕</span> {inputError}
                            </p>
                        )}
                    </>
                ) : (
                    <>
                        <div className={`h-full min-h-[120px] border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-2 text-center hover:bg-gray-50 cursor-pointer relative transition ${
                            inputError ? "border-red-300 bg-red-50" : "border-gray-200"
                        }`}>
                            <input
                                type="file"
                                accept=".mp4,.webm,.ogg,.wav,.mp3,.m4a"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={(e) => { setSelectedFile(e.target.files[0]); setInputError(""); }}
                            />
                            <p className="text-sm font-medium text-gray-600">
                                {selectedFile ? selectedFile.name : "Kéo & thả file video vào đây"}
                            </p>
                            {!selectedFile && (
                                <button className="mt-2 border border-gray-300 text-sm px-5 py-2 rounded-lg text-gray-600">Chọn file</button>
                            )}
                        </div>
                        {/* Thông báo lỗi inline */}
                        {inputError && (
                            <p className="text-red-500 text-xs flex items-center gap-1">
                                <span>✕</span> {inputError}
                            </p>
                        )}
                    </>
                )}
            </div>

            <button
                className="w-full bg-gradient-to-r from-blue-700 to-cyan-500 rounded-full py-3.5 text-white font-bold hover:from-indigo-600 hover:to-blue-500 transition mt-auto active:scale-95"
                onClick={handleStartProcess}
            >
                Hiện video
            </button>
        </div>
    );
}

export default UploadWidget;