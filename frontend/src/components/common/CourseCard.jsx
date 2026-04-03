import React from 'react';
function CourseCard({ course = {
    title: "Đang tải...", lessons: 0, progress: 0, iconColor: "bg-[#3b82f6]", iconText: "..."
} }) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-md group">
            <div className="h-28 sm:h-32 bg-[#f4f6ff] flex items-center justify-center group-hover:bg-[#ebf0ff] transition-colors">
                <div className={`w-9 h-9 ${course.iconColor || 'bg-[#3b82f6]'} rounded flex items-center justify-center shadow-sm`}>
                    {course.iconText === "1234" ? <span className="text-white text-[10px] font-bold leading-[1.1] text-center tracking-tighter">12<br/>34</span> : <span className="text-lg">{course.iconText}</span>}
                </div>
            </div>
            <div className="p-4 sm:p-5 flex-1 flex flex-col">
                <h3 className="text-[14px] sm:text-[15px] font-bold text-gray-900 mb-4 sm:mb-6 line-clamp-2">{course.title}</h3>
                <div className="mt-auto">
                    <p className="text-[12px] sm:text-[13px] text-gray-500 mb-2">{course.lessons} Lessons</p>
                    <div className="w-full bg-[#f1f5f9] rounded-full h-1.5 mb-2 overflow-hidden">
                        <div className="bg-blue-600 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${course.progress}%` }}></div>
                    </div>
                    <p className="text-[12px] sm:text-[13px] font-medium text-blue-700 mb-4 sm:mb-5">{course.progress}% Complete</p>
                    <div className="flex flex-col min-[400px]:flex-row gap-2 sm:gap-3">
                        <button className="flex-1 border border-blue-600 text-blue-700 text-[12px] sm:text-[13px] font-medium py-2 rounded-lg hover:bg-blue-50 transition">
                            View Course
                        </button>
                        <button className="flex-1 bg-blue-600 text-white text-[12px] sm:text-[13px] font-medium py-2 rounded-lg hover:bg-blue-700 transition whitespace-nowrap">
                            Latest Lesson
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default CourseCard;