import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaClock, FaCheckCircle, FaBolt, FaCrown, FaExclamationTriangle } from "react-icons/fa";
import UploadWidget from "../../components/common/UpLoadWidget";
import CourseCard from "../../components/common/CourseCard";
import { dashboardApi } from "../../api/DashboardApi";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [uploadCount, setUploadCount] = useState(0);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const result = await dashboardApi.getAnalytics();
        setData(result);

        const count = result?.user?.uploadCount ?? 0;
        const premiumStatus = result?.user?.isPremium ?? false;

        setUploadCount(count);
        setIsPremium(premiumStatus);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu Dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const handleWSUpdate = (event) => {
      const notiData = event.detail;
      
      if (notiData && typeof notiData.currentUploadCount !== "undefined") {
        setUploadCount(notiData.currentUploadCount);
      }
      
      if (notiData && notiData.type === "PREMIUM_UPGRADE_SUCCESS") {
        setIsPremium(true);
      }
    };

    window.addEventListener("ws-notification", handleWSUpdate);
    return () => window.removeEventListener("ws-notification", handleWSUpdate);
  }, [uploadCount, isPremium]);

  if (isLoading || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-slate-50">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-3"></div>
        <p className="text-gray-500 font-medium text-sm">
          {t("dashboard.loading")}
        </p>
      </div>
    );
  }

  const maxHours = Math.max(
    ...data.weeklyActivity.map((item) => item.hours),
    8,
  );

  const isLimitReached = !isPremium && uploadCount >= 10;

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-slate-50 min-h-full w-full overflow-x-hidden">
      {/* Welcome */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            {t("dashboard.welcome", { name: data.user.fullName })}
          </h1>
          <p className="text-gray-500 mt-1 text-sm">{t("dashboard.subtitle")}</p>
        </div>

        {/* Banner Giới hạn & Phối màu mới */}
        <div className="shrink-0 flex flex-col items-end gap-2">
          <div className={`px-4 py-2.5 rounded-2xl border text-sm font-medium flex items-center gap-3 shadow-sm transition-all ${
            isPremium 
              ? "bg-blue-600 text-white border-transparent" 
              : isLimitReached
                ? "bg-red-50 border-red-200 text-red-700"
                : "bg-indigo-50 border-indigo-100 text-indigo-700"
          }`}>
            <span className="flex h-2 w-2 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isPremium ? 'bg-green-300' : isLimitReached ? 'bg-red-400' : 'bg-indigo-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isPremium ? 'bg-green-500' : isLimitReached ? 'bg-red-500' : 'bg-indigo-600'}`}></span>
            </span>
            <div className="flex items-center gap-2">
              {isPremium ? (
                <span className="font-bold flex items-center gap-1.5">
                  <FaCrown className="text-yellow-300" /> {t("dashboard_extra.premium_unlimited")}
                </span>
              ) : (
                <span className="flex items-center gap-1.5" dangerouslySetInnerHTML={{ __html: `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" class="text-orange-400" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M0 464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V192H0v272zm64-192c0-8.8 7.2-16 16-16h288c8.8 0 16 7.2 16 16v64c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16v-64zM400 64h-48V16c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v48H160V16c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v48H48C21.5 64 0 85.5 0 112v48h448v-48c0-26.5-21.5-48-48-48z"></path></svg> ` + t("dashboard_extra.limit_status", { used: uploadCount }) }} />
              )}
            </div>
          </div>

          {!isPremium && (
            <button
              onClick={() => navigate("/app/premium")}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl border border-blue-100 transition-all shadow-sm active:scale-95 flex items-center gap-1.5"
            >
              <FaCrown /> {t("dashboard_extra.upgrade_more")}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 lg:gap-6">
        {/* Left column: Upload area */}
        <div className="xl:col-span-1 flex flex-col">
          <h2 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">
            {t("dashboard.upload_widget")}
          </h2>
          
          <div className="flex-1 relative rounded-3xl overflow-hidden group">
            <div className={`h-full w-full transition-all duration-300 ${isLimitReached ? "pointer-events-none select-none blur-[4px] opacity-60" : ""}`}>
              <UploadWidget
                hideHeader={true}
                onProcessAction={(sessionId) =>
                  navigate(`/app/history/${sessionId}`)
                }
              />
            </div>

            {/* Premium Gate Overlay */}
            {isLimitReached && (
              <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[3px] flex flex-col items-center justify-center p-6 text-center z-10 rounded-3xl border-2 border-dashed border-red-200">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-3 shadow-md">
                  <FaExclamationTriangle className="text-red-600 text-xl" />
                </div>
                <h3 className="text-base font-bold text-slate-950">{t("dashboard_extra.limit_reached_title")}</h3>
                <p className="text-xs text-gray-600 mt-1.5 max-w-[220px] leading-relaxed">
                  {t("dashboard_extra.limit_reached_desc")}
                </p>
                <button 
                  onClick={() => navigate("/app/premium")}
                  className="mt-4 px-5 py-2.5 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 text-white font-bold text-xs rounded-xl shadow-lg hover:opacity-95 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <FaCrown /> {t("dashboard_extra.upgrade_now")}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="xl:col-span-2 flex flex-col gap-5 lg:gap-6">
          {/* Overview cards */}
          <div>
            <h2 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">
              {t("dashboard.learning_overview")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 hover:-translate-y-1 transition-transform">
                <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                  <FaClock className="text-gray-600 text-base" />
                </div>
                <h3 className="text-2xl font-bold text-blue-600">{data.overview.totalStudyTime}</h3>
                <p className="text-sm font-medium text-gray-800 mt-1">{t("dashboard.total_study_time")}</p>
                <p className="text-xs text-gray-400">{t("dashboard.total_all_time")}</p>
              </div>

              <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 hover:-translate-y-1 transition-transform">
                <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center mb-3">
                  <FaCheckCircle className="text-purple-600 text-base" />
                </div>
                <h3 className="text-2xl font-bold text-green-500">{data.overview.lecturesDone}</h3>
                <p className="text-sm font-medium text-gray-800 mt-1">{t("dashboard.lectures_done")}</p>
                <p className="text-xs text-gray-400">{t("dashboard.lectures")}</p>
              </div>

              <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 hover:-translate-y-1 transition-transform">
                <div className="w-9 h-9 rounded-full bg-pink-100 flex items-center justify-center mb-3">
                  <FaBolt className="text-pink-500 text-base" />
                </div>
                <h3 className="text-2xl font-bold text-red-500">{data.overview.goalProgress}%</h3>
                <p className="text-sm font-medium text-gray-800 mt-1">{t("dashboard.goal_progress")}</p>
                <p className="text-xs text-gray-400">{t("dashboard.goal_label")}</p>
              </div>
            </div>
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Weekly Activity */}
            <div className="sm:col-span-2 bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 flex flex-col">
              <h3 className="text-sm font-medium text-gray-600 mb-4">{t("dashboard.weekly_activity")}</h3>
              <div className="overflow-x-auto">
                <div className="flex items-end justify-between h-32 gap-1.5 mt-auto min-w-[200px]">
                  {data.weeklyActivity.map((item, index) => {
                    const heightPercent = (item.hours / maxHours) * 100;
                    return (
                      <div key={index} className="flex flex-col items-center flex-1 gap-2 group h-full">
                        <div className="w-full bg-gray-50 rounded-t-sm flex items-end justify-center h-32 group-hover:bg-gray-100 transition-colors relative">
                          <div
                            className={`w-full rounded-t-sm transition-all duration-700 ease-out ${item.active ? "bg-blue-700 shadow-lg" : "bg-blue-400 group-hover:bg-blue-500"}`}
                            style={{ height: `${heightPercent}%`, minHeight: item.hours > 0 ? "2px" : "0px" }}
                          />
                          <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                            {item.hours}h
                          </div>
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
              <h3 className="text-sm font-medium text-gray-600 mb-4">{t("dashboard.top_keywords")}</h3>
              <div className="flex flex-col gap-2">
                {data.topKeywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="text-[13px] font-semibold text-blue-600 cursor-pointer hover:text-blue-800 transition bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-100 truncate"
                  >
                    #{keyword}
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
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">{t("dashboard.recent_courses")}</h2>
          <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline transition">
            {t("dashboard.view_all")}
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
          {data.recentCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </div>
  );
}