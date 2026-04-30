import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import UploadWidget from "../../components/common/UpLoadWidget";
import CourseCard from "../../components/common/CourseCard";
import { dashboardApi } from "../../api/DashboardApi";
export default function DashboardPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        const result = await dashboardApi.getAnalytics();

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
        <p className="text-gray-500 font-medium text-sm">
          {t("dashboard.loading")}
        </p>
      </div>
    );
  }

  const maxHours = Math.max(
    ...data.weeklyActivity.map((item) => item.hours),
    1,
  );
  console.log("Dữ liệu tuần:", data.weeklyActivity);
  console.log("Max Hours hiện tại:", maxHours);

  return (
    /* FIX: p-4 trên mobile → sm:p-6 → lg:p-8, tránh padding quá lớn trên màn nhỏ */
    <div className="p-4 sm:p-6 lg:p-8 bg-slate-50 min-h-full w-full overflow-x-hidden">
      {/* Welcome */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          {t("dashboard.welcome", { name: data.user.fullName })}
        </h1>
        <p className="text-gray-500 mt-1 text-sm">{t("dashboard.subtitle")}</p>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 lg:gap-6">
        <div className="xl:col-span-1 flex flex-col">
          <h2 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">
            {t("dashboard.upload_widget")}
          </h2>
          <div className="flex-1">
            <UploadWidget
              hideHeader={true}
              onProcessAction={(sessionId) =>
                navigate(`/app/history/${sessionId}`)
              }
            />
          </div>
        </div>

        {/* Right column */}
        <div className="xl:col-span-2 flex flex-col gap-5 lg:gap-6">
          {/* Overview cards: 
              FIX: grid-cols-1 → sm:grid-cols-3 (bỏ md breakpoint giữa chừng gây ra layout lẻ)
              Trên mobile 1 cột thẳng, từ sm trở lên 3 cột đều nhau. */}
          <div>
            <h2 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">
              {t("dashboard.learning_overview")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 hover:-translate-y-1 transition-transform">
                <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                  <svg
                    className="w-4 h-4 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-blue-600">
                  {data.overview.totalStudyTime}
                </h3>
                <p className="text-sm font-medium text-gray-800 mt-1">
                  {t("dashboard.total_study_time")}
                </p>
                <p className="text-xs text-gray-400">
                  {t("dashboard.total_all_time")}
                </p>
              </div>

              <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 hover:-translate-y-1 transition-transform">
                <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center mb-3">
                  <svg
                    className="w-4 h-4 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-green-500">
                  {data.overview.lecturesDone}
                </h3>
                <p className="text-sm font-medium text-gray-800 mt-1">
                  {t("dashboard.lectures_done")}
                </p>
                <p className="text-xs text-gray-400">
                  {t("dashboard.lectures")}
                </p>
              </div>

              <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 hover:-translate-y-1 transition-transform">
                <div className="w-9 h-9 rounded-full bg-pink-100 flex items-center justify-center mb-3">
                  <svg
                    className="w-4 h-4 text-pink-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-red-500">
                  {data.overview.goalProgress}%
                </h3>
                <p className="text-sm font-medium text-gray-800 mt-1">
                  {t("dashboard.goal_progress")}
                </p>
                <p className="text-xs text-gray-400">
                  {t("dashboard.goal_label")}
                </p>
              </div>
            </div>
          </div>

          {/* Charts row: 
              FIX: Bỏ overflow-x-auto ở wrapper ngoài, để nó stack thành 1 cột trên mobile.
              Chart bar thêm overflow-x-auto vào chính nó để scroll ngang nếu cần. */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Weekly Activity */}
            <div className="sm:col-span-2 bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 flex flex-col">
              <h3 className="text-sm font-medium text-gray-600 mb-4">
                {t("dashboard.weekly_activity")}
              </h3>
              <div className="overflow-x-auto">
                <div className="flex items-end justify-between h-32 gap-1.5 mt-auto min-w-[200px]">
                  {data.weeklyActivity.map((item, index) => {
                    // 1. Tính % chiều cao dựa trên maxHours (10h)
                    const heightPercent = (item.hours / maxHours) * 100;

                    return (
                      <div
                        key={index}
                        className="flex flex-col items-center flex-1 gap-2 group h-full"
                      >
                        <div className="w-full bg-gray-50 rounded-t-sm flex items-end justify-center h-32 group-hover:bg-gray-100 transition-colors relative">
                          <div
                            className={`w-full rounded-t-sm transition-all duration-700 ease-out ${
                              item.active
                                ? "bg-blue-700 shadow-lg"
                                : "bg-blue-400 group-hover:bg-blue-500"
                            }`}
                            style={{
                              height: `${heightPercent}%`,
                              minHeight: item.hours > 0 ? "2px" : "0px",
                            }}
                          />

                          <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                            {item.hours}h
                          </div>
                        </div>

                        <span className="text-[10px] text-gray-400 font-medium">
                          {item.day}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Top Keywords */}
            <div className="sm:col-span-1 bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100">
              <h3 className="text-sm font-medium text-gray-600 mb-4">
                {t("dashboard.top_keywords")}
              </h3>
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
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">
            {t("dashboard.recent_courses")}
          </h2>
          <a
            href="#"
            className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline transition"
          >
            {t("dashboard.view_all")}
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
