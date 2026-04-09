const studyData = [
  1.5, 2, 1, 3, 2.5, 1.8, 0.5, 2, 3.5, 2, 1, 2.8, 3, 1.5, 2.5, 1, 3, 2.2, 1.8,
  2, 0.8, 3, 2.5, 1.5, 2, 3.2, 2.8, 1, 2, 1.5,
];

const maxHours = Math.max(...studyData);

export default function AnalyticsPage() {
  return (
    <div className="p-6">
      {/* Title */}
      <h1 className="text-2xl font-bold text-gray-800">
        Learning Analytics & Insights
      </h1>
      <p className="text-sm text-gray-400 mt-1 mb-6">
        Phân tích học tập của bạn
      </p>

      {/* Row 1 */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Study Time Trend */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <p className="text-sm font-semibold text-gray-700 mb-4">
            Study Time Trend (Last 30 Days)
          </p>
          <div className="flex items-end gap-[3px] h-24">
            {studyData.map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t"
                style={{
                  height: `${(h / maxHours) * 100}%`,
                  background:
                    i === studyData.length - 1 ? "#2563eb" : "#93c5fd",
                }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-[9px] text-gray-300">
            {[
              "Mon",
              "",
              "",
              "",
              "",
              "Tue",
              "",
              "",
              "",
              "",
              "Wed",
              "",
              "",
              "",
              "",
              "Thu",
              "",
              "",
              "",
              "",
              "Fri",
              "",
              "",
              "",
              "",
              "Sat",
              "",
              "",
              "",
              "",
            ].map((l, i) => (
              <span key={i}>{l}</span>
            ))}
          </div>
        </div>

        {/* Learning Focus */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <p className="text-sm font-semibold text-gray-700 mb-4">
            Learning Focus by Subject
          </p>
          <div className="flex items-center gap-6">
            <svg width="90" height="90" viewBox="0 0 90 90">
              <circle
                cx="45"
                cy="45"
                r="32"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="14"
              />
              <circle
                cx="45"
                cy="45"
                r="32"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="14"
                strokeDasharray={`${0.55 * 201} ${201}`}
                transform="rotate(-90 45 45)"
              />
              <circle
                cx="45"
                cy="45"
                r="32"
                fill="none"
                stroke="Green"
                strokeWidth="14"
                strokeDasharray={`${0.3 * 201} ${201}`}
                strokeDashoffset={`${-0.55 * 201}`}
                transform="rotate(-90 45 45)"
              />
              <circle
                cx="45"
                cy="45"
                r="32"
                fill="none"
                stroke="#F5F5F5"
                strokeWidth="14"
                strokeDasharray={`${0.15 * 201} ${201}`}
                strokeDashoffset={`${-0.85 * 201}`}
                transform="rotate(-90 45 45)"
              />
            </svg>
            <div className="text-xs space-y-2">
              {[
                { color: "#3b82f6", label: "Math", pct: "55%" },
                { color: "Green", label: "Computer Science", pct: "30%" },
                { color: "#F5F5F5", label: "Literature", pct: "15%" },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block"
                    style={{ background: s.color }}
                  />
                  <span className="text-gray-600">{s.label}</span>
                  <span className="ml-auto pl-3 text-gray-400">{s.pct}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-2 gap-4">
        {/* Keywords */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <p className="text-sm font-semibold text-gray-700 mb-4">
            Top Keywords this Month
          </p>
          <div className="flex flex-wrap gap-2 items-center">
            {[
              { text: "#Algorithms", size: "text-sm", color: "#8bc8fa" },
              {
                text: "#Algorithms",
                size: "text-xl font-bold",
                color: "#63aff1",
              },
              {
                text: "#GraphTheory",
                size: "text-2xl font-bold",
                color: "#81b5f8",
              },
              { text: "#LaiRelore", size: "text-base", color: "#81b9f8" },
            ].map((kw, i) => (
              <span
                key={i}
                className={kw.size}
                style={{ color: kw.color, cursor: "pointer" }}
              >
                {kw.text}
              </span>
            ))}
          </div>
        </div>

        {/* Goal Tracking */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <p className="text-sm font-semibold text-gray-700 mb-4">
            Goal Tracking
          </p>
          {[
            { label: "Weekly goal", value: 65 },
            { label: "Monthly goal", value: 40 },
          ].map((g) => (
            <div key={g.label} className="mb-4">
              <div className="flex justify-between text-xs text-gray-600 font-medium mb-1">
                <span>{g.label}</span>
                <span className="text-gray-400">{g.value}%</span>
              </div>
              <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full rounded-full bg-blue-500"
                  style={{ width: `${g.value}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-gray-300 mt-1">
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
