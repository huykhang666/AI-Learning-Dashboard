import React, { useState } from 'react';

function UploadWidget({ onProcessAction, hideHeader }) {
    const [activeTab, setActiveTab] = useState("youtube");

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 w-full h-full flex flex-col">
            {/* Chỉ hiển thị Header có dấu chấm khi không có prop hideHeader */}
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
                    onClick={() => setActiveTab("file")} 
                    className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === "file" ? "bg-white shadow-sm text-gray-700" : "text-gray-400 hover:text-gray-600"}`}
                >
                    Upload File
                </button>
                <button 
                    onClick={() => setActiveTab("youtube")} 
                    className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === "youtube" ? "bg-white shadow-sm text-gray-700" : "text-gray-400 hover:text-gray-600"}`} 
                >
                    YouTube Link
                </button>
            </div>
            
            <div className="flex-1 flex flex-col justify-center mb-4">
                {activeTab === "youtube" ? (
                    <input 
                        type="text" 
                        placeholder="https://youtube.com/watch?v=..." 
                        className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-gray-500 outline-none focus:border-indigo-400" 
                    />
                ) : (
                    <div className="h-full min-h-[120px] border-2 border-dashed border-gray-200 rounded-xl p-6 sm:p-8 flex flex-col items-center justify-center gap-2 text-center transition-colors hover:bg-gray-50">
                        <p className="text-sm font-medium text-gray-600">Kéo & thả file video vào đây</p>
                        <button className="mt-2 border border-gray-300 text-sm px-5 py-2 rounded-lg text-gray-600 hover:bg-white shadow-sm transition">
                            Chọn file
                        </button>
                    </div>
                )}
            </div>
            
            <button 
                className="w-full bg-gradient-to-r from-blue-700 to-cyan-500 rounded-full py-3.5 text-white font-bold hover:from-indigo-600 hover:to-blue-500 transition mt-auto" 
                onClick={onProcessAction}
            >
                PROCESS VIDEO
            </button>
        </div>
    );
}

export default UploadWidget;