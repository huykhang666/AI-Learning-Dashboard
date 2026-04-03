import React, { useState, useEffect } from 'react';
import UploadWidget from '../../components/common/UpLoadWidget';
import CourseCard from '../../components/common/CourseCard';
import { fetchDashboardData } from '../../api/dashboardApi';
 export default function App() {
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
          <div className="p-6 flex flex-col items-center justify-center min-h-screen bg-slate-50">
              <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-3"></div>
              <p className="text-gray-500 font-medium text-sm">Đang tải dữ liệu...</p>
          </div>
      );
    }

    const maxHours = Math.max(...data.weeklyActivity.map(item => item.hours));

    return (
      <div className="p-4 sm:p-6 lg:p-8 bg-slate-50 min-h-screen">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Welcome back, {data.user.fullName}!</h1>
          <p className="text-gray-500 mt-1.5 text-sm sm:text-base">Supercharge your learning.</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          <div className="xl:col-span-1 flex flex-col">
            <h2 className="text-xs sm:text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Upload Widget</h2>
            <UploadWidget hideHeader={true} onProcessAction={() => alert("Gửi link lên Backend xử lý!")} />
          </div>

          <div className="xl:col-span-2 flex flex-col gap-5 sm:gap-6 lg:gap-8">
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Learning Overview</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 lg:gap-5">
                  <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 transition-transform hover:-translate-y-1">
                      <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center mb-3.5">
                          <svg className="w-4.5 h-4.5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-bold text-blue-600">{data.overview.totalStudyTime}</h3>
                      <p className="text-sm font-medium text-gray-800 mt-1">Total Study Time</p>
                      <p className="text-[11px] sm:text-xs text-gray-400">Total All Time</p>
                  </div>

                  <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 transition-transform hover:-translate-y-1">
                      <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center mb-3.5">
                          <svg className="w-4.5 h-4.5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"></path></svg>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-bold text-green-500">{data.overview.lecturesDone}</h3>
                      <p className="text-sm font-medium text-gray-800 mt-1">Lectures Done</p>
                      <p className="text-[11px] sm:text-xs text-gray-400">Lectures</p>
                  </div>

                  <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 transition-transform hover:-translate-y-1 sm:col-span-2 md:col-span-1">
                      <div className="w-9 h-9 rounded-full bg-pink-100 flex items-center justify-center mb-3.5">
                          <svg className="w-4.5 h-4.5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-bold text-red-500">{data.overview.goalProgress}%</h3>
                      <p className="text-sm font-medium text-gray-800 mt-1">Goal Progress</p>
                      <p className="text-[11px] sm:text-xs text-gray-400">100% goal</p>
                  </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5">
              <div className="lg:col-span-2 bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 flex flex-col overflow-x-auto">
                  <h3 className="text-sm font-medium text-gray-600 mb-6 whitespace-nowrap">Weekly Activity (Hours)</h3>
                  <div className="flex items-end justify-between h-32 sm:h-36 gap-1.5 sm:gap-2 mt-auto min-w-[240px]">
                      {data.weeklyActivity.map((item, index) => {
                          const heightPercent = (item.hours / maxHours) * 100;
                          return (
                              <div key={index} className="flex flex-col items-center flex-1 gap-2 group">
                                  <div className="w-full max-w-[40px] bg-gray-50 rounded-t-sm flex items-end justify-center h-full group-hover:bg-gray-100 transition-colors">
                                      <div 
                                          className={`w-full rounded-t-sm transition-all duration-700 ease-out ${item.active ? 'bg-blue-600' : 'bg-blue-200 group-hover:bg-blue-300'}`}
                                          style={{ height: `${heightPercent}%` }}
                                      ></div>
                                  </div>
                                  <span className="text-[10px] sm:text-xs text-gray-400 font-medium">{item.day}</span>
                              </div>
                          )
                      })}
                  </div>
              </div>

              <div className="lg:col-span-1 bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100">
                  <h3 className="text-sm font-medium text-gray-600 mb-4">Top Keywords</h3>
                  <div className="flex flex-row lg:flex-col flex-wrap gap-2.5 sm:gap-3">
                      {data.topKeywords.map((keyword, index) => (
                          <span key={index} className="text-[12px] sm:text-[13px] font-semibold text-blue-600 cursor-pointer hover:text-blue-800 transition bg-blue-50 lg:bg-transparent px-3 py-1.5 lg:p-0 rounded-lg lg:rounded-none border border-blue-100 lg:border-none">
                              {keyword}
                          </span>
                      ))}
                  </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 sm:mt-10 lg:mt-12">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Recent Courses</h2>
              <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-800 transition hover:underline">View All &rarr;</a>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
              {data.recentCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
              ))}
          </div>
        </div>

      </div>
    );
}