import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FaChartBar, FaChartPie, FaTags, FaBullseye, FaClock } from "react-icons/fa"; // 🌟 Đã sửa thành FaChartPie
import { dashboardApi } from "../../api/DashboardApi";

export default function AnalyticsPage() {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        const result = await dashboardApi.getAnalytics();
        setData(result);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu phân tích:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (isLoading || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-slate-50">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-3"></div>
        <p className="text-gray-500 font-medium text-sm">{t("dashboard.loading")}</p>
      </div>
    );
  }

  const maxHours = Math.max(
    ...data.weeklyActivity.map((item) => item.hours),
    8
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-slate-50 min-h-full w-full overflow-x-hidden">
      {/* Tiêu đề trang */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FaChartBar className="text-blue-600 shrink-0" /> {t("analytics.title")}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {t("analytics.subtitle")}
        </p>
      </div>

      {/* Row 1: Biểu đồ tuần & Tỷ trọng danh mục */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6 mb-6">
        
        {/* Cột 1: Xu hướng học tập tuần */}
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 text-gray-700 font-bold text-sm mb-6">
            <FaClock className="text-blue-500" />
            <span>{t("analytics.study_time_trend")} (Giờ)</span>
          </div>
          
          <div className="flex items-end gap-2 sm:gap-3 h-36 px-2 mt-auto">
            {data.weeklyActivity.map((item, i) => {
              const heightPercent = (item.hours / maxHours) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full">
                  <div className="w-full bg-slate-50 rounded-t-xl flex items-end justify-center h-full group-hover:bg-slate-100 transition-colors relative">
                    <div
                      className={`w-full rounded-t-xl transition-all duration-700 ease-out ${
                        item.active 
                          ? "bg-blue-600 shadow-md shadow-blue-200" 
                          : "bg-blue-300 group-hover:bg-blue-400"
                      }`}
                      style={{ height: `${heightPercent}%`, minHeight: item.hours > 0 ? "4px" : "0px" }}
                    />
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-sm">
                      {item.hours} giờ
                    </div>
                  </div>
                  <span className={`text-xs font-semibold ${item.active ? "text-blue-600" : "text-gray-400"}`}>
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cột 2: Tỷ trọng danh mục bài giảng */}
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 text-gray-700 font-bold text-sm mb-6">
            <FaChartPie className="text-purple-500" /> {/* 🌟 Đã dùng FaChartPie chuẩn thư viện */}
            <span>{t("analytics.learning_focus")}</span>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 py-2">
            <div 
              className="w-28 h-28 rounded-full shadow-inner flex items-center justify-center relative shrink-0"
              style={{ background: 'conic-gradient(#2563eb 0% 100%)' }}
            >
              <div className="w-16 h-16 bg-white rounded-full absolute flex items-center justify-center shadow-sm">
                <span className="text-xs font-bold text-gray-800">20 Bài</span>
              </div>
            </div>

            <div className="text-sm space-y-3 flex-1 w-full">
              <div className="flex items-center gap-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="w-3 h-3 rounded-full bg-blue-600 inline-block shrink-0" />
                <span className="text-gray-700 font-medium">Bài giảng công nghệ</span>
                <span className="ml-auto font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg text-xs">100%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Từ khóa hàng đầu & Tiến độ mục tiêu */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
        
        {/* Cột 1: Từ khóa nổi bật */}
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 text-gray-700 font-bold text-sm mb-4">
            <FaTags className="text-amber-500" />
            <span>{t("analytics.top_keywords")}</span>
          </div>
          
          <div className="flex flex-wrap gap-2.5 items-center py-2">
            {data.topKeywords.length > 0 ? (
              data.topKeywords.map((kw, i) => (
                <span
                  key={i}
                  className="text-xs font-bold text-blue-600 bg-blue-50/60 hover:bg-blue-100 border border-blue-100/70 px-3 py-2 rounded-2xl transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  #{kw}
                </span>
              ))
            ) : (
              <p className="text-gray-400 text-xs italic py-4">Chưa có từ khóa nào được phân tích</p>
            )}
          </div>
        </div>

        {/* Cột 2: Theo dõi mục tiêu tuần */}
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 text-gray-700 font-bold text-sm mb-4">
            <FaBullseye className="text-red-500" />
            <span>{t("analytics.goal_tracking")}</span>
          </div>
          
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col gap-2.5 my-auto">
            <div className="flex justify-between text-xs text-gray-700 font-bold">
              <span>{t("analytics.goals.weekly")}</span>
              <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg text-[11px]">{data.overview.goalProgress}%</span>
            </div>
            
            <div className="bg-slate-200 rounded-full h-3 overflow-hidden shadow-inner w-full">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-1000 ease-out shadow-md"
                style={{ width: `${data.overview.goalProgress}%` }}
              />
            </div>
            
            <div className="flex justify-between text-[10px] font-medium text-gray-400 mt-0.5">
              <span>0%</span>
              <span>Đạt mục tiêu (10h)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}