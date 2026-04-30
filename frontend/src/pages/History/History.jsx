import {
  Search,
  Layers,
  CheckCircle,
  Clock,
  Calendar,
  ChevronRight,
  ChevronLeft,
  Loader,
} from "lucide-react";
import { dashboardApi } from "../../api/DashboardApi";
import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LoadingScreen from "../../components/common/LoadingScreen";

const smoothScrollTo = (element, to, duration) => {
  const start = element.scrollTop;
  const change = to - start;
  const startTime = performance.now();

  const animate = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease =
      progress < 0.5
        ? 2 * progress * progress
        : -1 + (4 - 2 * progress) * progress;

    element.scrollTop = start + change * ease;
    if (elapsed < duration) requestAnimationFrame(animate);
  };

  requestAnimationFrame(animate);
};

const StudyHistory = () => {
  const { t } = useTranslation();
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSwitchingPage, setIsSwitchingPage] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const handleItemClick = (id) => {
    navigate(`/app/history/${id}`);
  };

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await dashboardApi.getAllHistory();
        if (Array.isArray(data)) {
          const sorted = data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
          );
          setLectures(sorted);
        }
      } catch (error) {
        setLectures([]);
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const filteredData = useMemo(() => {
    return (lectures || []).filter((item) =>
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [lectures, searchTerm]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const currentItems = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredData.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredData, currentPage]);

  const stats = useMemo(
    () => [
      {
        label: t("history.stats.total_lectures"),
        value: lectures.length,
        icon: Layers,
        color: "text-blue-500",
        bgColor: "bg-blue-50",
      },
      {
        label: t("history.stats.completed"),
        value: lectures.filter((l) => l.progress >= 100).length,
        icon: CheckCircle,
        color: "text-green-500",
        bgColor: "bg-green-50",
      },
    ],
    [lectures, t],
  );

  const handlePageChange = (newPage) => {
    if (isSwitchingPage) return;
    setIsSwitchingPage(true);
    setCurrentPage(newPage);

    requestAnimationFrame(() => {
      let el = containerRef.current?.parentElement;
      while (el) {
        if (el.scrollTop > 0) {
          smoothScrollTo(el, 0, 1000);
          break;
        }
        el = el.parentElement;
      }
    });

    setTimeout(() => setIsSwitchingPage(false), 500);
  };

  if (loading) return <LoadingScreen />;

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-800"
    >
      <div className="max-w-6xl mx-auto">
        {/* Overlay spinner khi chuyển trang */}
        {isSwitchingPage && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/5 backdrop-blur-[1px]">
            <Loader
              className="w-8 h-8 text-slate-400 animate-spin opacity-40"
              strokeWidth={1}
            />
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {t("history.title")}
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">
              {filteredData.length} {t("history.lectures_count")}
            </p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder={t("history.search_placeholder")}
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm w-full md:w-64 focus:ring-2 focus:ring-blue-500/20 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Thống kê */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4"
            >
              <div
                className={`${stat.bgColor} w-12 h-12 rounded-xl flex items-center justify-center`}
              >
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">
                  {stat.value}
                </div>
                <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Danh sách bài giảng */}
        <div
          className={`space-y-4 mb-8 transition-opacity duration-300 ${isSwitchingPage ? "opacity-30" : "opacity-100"}`}
        >
          {currentItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className="group bg-white rounded-2xl border border-slate-100 p-4 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex items-center gap-4 cursor-pointer"
            >
              {/* Icon trái */}
              <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0">
                <Layers
                  className={`w-6 h-6 ${item.progress >= 100 ? "text-green-500" : "text-slate-400"}`}
                />
              </div>

              <div className="flex-grow">
                {/* Row 1: Title + Badge type */}
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors uppercase text-sm">
                    {item.title}
                  </h3>
                  <span className="px-2 py-0.5 bg-slate-50 border border-slate-100 text-slate-500 text-[10px] rounded-md font-medium flex-shrink-0 ml-2">
                    {item.type}
                  </span>
                </div>

                {/* Row 2: Meta info — ngày + thời lượng video */}
                <div className="flex items-center gap-x-4 mt-1.5 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.duration
                      ? `${Math.floor(item.duration / 60)} ${t("history.duration_minutes")} ${item.duration % 60 > 0 ? `${item.duration % 60} ${t("history.duration_seconds")}` : ""}`
                      : t("history.duration_missing")}
                  </span>
                </div>

                {/* Row 3: Progress bar + % + trạng thái */}
                <div className="mt-3 flex items-center gap-3">
                  {/* Progress bar */}
                  <div className="flex-grow h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        item.progress >= 100
                          ? "bg-green-500"
                          : item.progress >= 50
                            ? "bg-blue-500"
                            : "bg-orange-400"
                      }`}
                      style={{ width: `${Math.min(item.progress || 0, 100)}%` }}
                    />
                  </div>

                  {/* % số */}
                  <span
                    className={`text-[10px] font-bold w-8 text-right ${
                      item.progress >= 100
                        ? "text-green-500"
                        : item.progress >= 50
                          ? "text-blue-500"
                          : "text-orange-400"
                    }`}
                  >
                    {Math.round(Math.min(item.progress || 0, 100))}%
                  </span>

                  {/* Badge trạng thái */}
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
                      item.progress >= 70
                        ? "bg-green-50 text-green-600"
                        : item.progress >= 50
                          ? "bg-blue-50 text-blue-600"
                          : item.progress > 0
                            ? "bg-orange-50 text-orange-500"
                            : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {item.progress >= 70
                      ? t("history.status.completed")
                      : item.progress >= 50
                        ? t("history.status.in_progress")
                        : item.progress > 0
                          ? t("history.status.started")
                          : t("history.status.not_started")}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Empty state */}
          {currentItems.length === 0 && (
            <div className="text-center py-16 text-slate-400">
              <Layers className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">{t("history.no_results")}</p>
            </div>
          )}
        </div>

        {/* Phân trang */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 py-6">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || isSwitchingPage}
              className="p-2 rounded-xl bg-white border border-slate-200 shadow-sm disabled:opacity-20 hover:bg-slate-50 transition-all"
            >
              <ChevronLeft className="w-5 h-5 text-slate-500" />
            </button>
            <div className="flex items-center gap-1.5 text-sm font-bold">
              <span className="text-slate-700">{currentPage}</span>
              <span className="text-slate-400">/ {totalPages}</span>
            </div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || isSwitchingPage}
              className="p-2 rounded-xl bg-white border border-slate-200 shadow-sm disabled:opacity-20 hover:bg-slate-50 transition-all"
            >
              <ChevronRight className="w-5 h-5 text-slate-500" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyHistory;
