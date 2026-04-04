import React, { useState, useEffect } from 'react';
import UploadWidget from '../../components/common/UpLoadWidget';
import CourseCard from '../../components/common/CourseCard';
import { fetchDashboardData } from '../../api/dashboardApi';

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const result = await fetchDashboardData();
        setData(result);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu Dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  if (isLoading || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-slate-50">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-3"></div>
        <p className="text-gray-500 font-medium text-sm">Đang tải dữ liệu...</p>
      </div>
    );
  }

  const maxHours = Math.max(...data.weeklyActivity.map((item) => item.hours));

  return (
    /* FIX: p-4 trên mobile → sm:p-6 → lg:p-8, tránh padding quá lớn trên màn nhỏ */
    <div className="p-4 sm:p-6 lg:p-8 bg-slate-50 min-h-full w-full overflow-x-hidden">

      {/* Welcome */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          Welcome back, {data.user.fullName}!
        </h1>
        <p className="text-gray-500 mt-1 text-sm">Supercharge your learning.</p>
      </div>

      {/* Main grid: 1 cột → xl: 3 cột */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 lg:gap-6">

        {/* Upload Widget */}
        <div className="xl:col-span-1 flex flex-col">
          <h2 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">Upload Widget</h2>
          <div className="flex-1">
            <UploadWidget
              hideHeader={true}
              onProcessAction={() => alert("Gửi link lên Backend xử lý!")}
            />
          </div>
        </div>

        {/* Right column */}
        <div className="xl:col-span-2 flex flex-col gap-5 lg:gap-6">

          {/* Overview cards: 
              FIX: grid-cols-1 → sm:grid-cols-3 (bỏ md breakpoint giữa chừng gây ra layout lẻ)
              Trên mobile 1 cột thẳng, từ sm trở lên 3 cột đều nhau. */}
          <div>
            <h2 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">Learning Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

              <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 hover:-translate-y-1 transition-transform">
                <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-blue-600">{data.overview.totalStudyTime}</h3>
                <p className="text-sm font-medium text-gray-800 mt-1">Total Study Time</p>
                <p className="text-xs text-gray-400">Total All Time</p>
              </div>

              <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 hover:-translate-y-1 transition-transform">
                <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center mb-3">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-green-500">{data.overview.lecturesDone}</h3>
                <p className="text-sm font-medium text-gray-800 mt-1">Lectures Done</p>
                <p className="text-xs text-gray-400">Lectures</p>
              </div>

              <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 hover:-translate-y-1 transition-transform">
                <div className="w-9 h-9 rounded-full bg-pink-100 flex items-center justify-center mb-3">
                  <svg className="w-4 h-4 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-red-500">{data.overview.goalProgress}%</h3>
                <p className="text-sm font-medium text-gray-800 mt-1">Goal Progress</p>
                <p className="text-xs text-gray-400">100% goal</p>
              </div>
            </div>
          </div>

          {/* Charts row: 
              FIX: Bỏ overflow-x-auto ở wrapper ngoài, để nó stack thành 1 cột trên mobile.
              Chart bar thêm overflow-x-auto vào chính nó để scroll ngang nếu cần. */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            {/* Weekly Activity */}
            <div className="sm:col-span-2 bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 flex flex-col">
              <h3 className="text-sm font-medium text-gray-600 mb-4">Weekly Activity (Hours)</h3>
              <div className="overflow-x-auto">
                <div className="flex items-end justify-between h-32 gap-1.5 mt-auto min-w-[200px]">
                  {data.weeklyActivity.map((item, index) => {
                    const heightPercent = (item.hours / maxHours) * 100;
                    return (
                      <div key={index} className="flex flex-col items-center flex-1 gap-2 group">
                        <div className="w-full bg-gray-50 rounded-t-sm flex items-end justify-center h-full group-hover:bg-gray-100 transition-colors">
                          <div
                            className={`w-full rounded-t-sm transition-all duration-700 ease-out ${item.active ? "bg-blue-600" : "bg-blue-200 group-hover:bg-blue-300"}`}
                            style={{ height: `${heightPercent}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-gray-400 font-medium">{item.day}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Top Keywords */}
            <div className="sm:col-span-1 bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100">
              <h3 className="text-sm font-medium text-gray-600 mb-4">Top Keywords</h3>
              {/* FIX: Luôn flex-col, bỏ flex-row trên mobile (tránh keyword tràn ngang) */}
              <div className="flex flex-col gap-2">
                {data.topKeywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="text-[13px] font-semibold text-blue-600 cursor-pointer hover:text-blue-800 transition bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-100 truncate"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Courses */}
      <div className="mt-8 lg:mt-10">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Recent Courses</h2>
          <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline transition">
            View All →
          </a>
        </div>
        {/* FIX: grid-cols-1 → sm:grid-cols-2 → xl:grid-cols-3, tránh col-span lẻ gây vỡ layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
          {data.recentCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </div>
  );
}