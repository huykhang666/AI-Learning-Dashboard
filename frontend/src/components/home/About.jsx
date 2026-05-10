import { useTranslation } from "react-i18next";
import { FaUserTie } from "react-icons/fa";

function About() {
  const { t } = useTranslation();

  const members = [
    {
      name: "Nguyễn Huy Khang",
      role: t("about.team.roles.backend"),
      description: t("about.team.description"),
    },
    {
      name: "Nguyễn Trọng Hiểu",
      role: t("about.team.roles.frontend"),
      description: t("about.team.description"),
    },
    {
      name: "Lê Quang Chí",
      role: t("about.team.roles.frontend"),
      description: t("about.team.description"),
    },
    {
      name: "Trần Minh Huấn",
      role: t("about.team.roles.frontend"),
      description: t("about.team.description"),
    },
  ];

  return (
    <section id="About" className="bg-gray-100 py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-700 to-cyan-500 bg-clip-text text-transparent font-medium text-2xl mb-4">
            {t("about.title")}
          </div>
          <h2 className="text-gray-900 text-2xl md:text-4xl font-bold mb-4">
            {t("about.heading")}
          </h2>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-20 border-b-2 py-10 border-green-500">
          <div className="flex-1">
            <p className="text-gray-500 text-base mb-4">
              {t("about.description.line1")}
            </p>
            <p className="text-gray-500 text-base mb-8">
              {t("about.description.line2")}
            </p>
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div className="border border-gray-200 rounded-2xl p-4">
                <p className="text-2xl font-black text-indigo-600">2.000+</p>
                <p className="text-sm text-gray-500">
                  {t("about.stats.students")}
                </p>
              </div>
              <div className="border border-gray-200 rounded-2xl p-4">
                <p className="text-2xl font-black text-indigo-600">50.000+</p>
                <p className="text-sm text-gray-500">
                  {t("about.stats.videos")}
                </p>
              </div>
              <div className="border border-gray-200 rounded-2xl p-4">
                <p className="text-2xl font-black text-indigo-600">95%</p>
                <p className="text-sm text-gray-500">
                  {t("about.stats.accuracy")}
                </p>
              </div>
              <div className="border border-gray-200 rounded-2xl p-4">
                <p className="text-2xl font-black text-indigo-600">4.9 ⭐</p>
                <p className="text-sm text-gray-500">
                  {t("about.stats.rating")}
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="bg-gradient-to-r from-blue-700 to-cyan-500 rounded-3xl p-8 text-white">
              <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full text-sm font-medium mb-6">
                {t("about.vision.tag")}
              </div>
              <h3 className="text-2xl font-bold mb-4 leading-snug">
                {t("about.vision.heading")}
              </h3>
              <p className="text-indigo-100 text-sm mb-8 leading-relaxed">
                {t("about.vision.description")}
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-white/20 text-white text-xs font-medium px-3 py-1.5 rounded-full">
                  {t("about.badges.edtech")}
                </span>
                <span className="bg-white/20 text-white text-xs font-medium px-3 py-1.5 rounded-full">
                  {t("about.badges.vietnam")}
                </span>
                <span className="bg-white/20 text-white text-xs font-medium px-3 py-1.5 rounded-full">
                  {t("about.badges.gdpr")}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
            {t("about.team.title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {members.map((member) => (
              <div
                key={member.name}
                className="bg-white border border-gray-200 rounded-2xl p-6 text-center hover:border-indigo-400 transition"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-14 h-14 rounded-full bg-indigo-50 flex items-center justify-center">
                    <FaUserTie size={28} className="text-indigo-500" />
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-indigo-500 text-sm font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-gray-500 text-sm">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;