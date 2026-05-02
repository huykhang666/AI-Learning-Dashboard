// Import component bạn vừa tạo (Nhớ kiểm tra lại đường dẫn import cho đúng với thư mục của bạn)
import { useTranslation } from "react-i18next";
import UploadWidget from "../common/UpLoadWidget";

function HeroSection({ onRegister }) {
  const { t } = useTranslation();
  // Đã xóa useState ở đây vì không còn cần thiết nữa

  return (
    <section
      className="bg-gradient-to-br from-slate-100 to-blue-100"
      id="HeroSection"
    >
      <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col md:flex-row items-center justify-between">
        {/* LEFT */}
        <div className="flex-1">
          {/* ... (Giữ nguyên toàn bộ code phần bên trái của bạn) ... */}
          <div className="inline-flex items-center gap-2 bg-white border border-gray-200 px-4 py-1.5 rounded-full mb-6">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span className="text-sm text-blue-600">{t("hero.made_for")}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-black-300 leading-tigh mb-4">
            {t("hero.title_line1")} <br />
            {t("hero.title_line2")} <br />
            <span className="bg-gradient-to-r from-blue-700 to-cyan-500 bg-clip-text text-transparent">
              {t("hero.title_span")}
            </span>
          </h1>
          <p className="text-base text-gray-600 mb-8 max-w-md">
            {t("hero.description")}
          </p>
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="bg-gradient-to-r from-blue-700 to-cyan-500 text-white text-base font-bold px-6 py-3 rounded-full hover:bg-indigo-700 hover:-translate-y-2 transition"
            >
              {t("hero.cta_free")}
            </a>
            <a
              href="#Feature"
              className="bg-white text-black text-base font-bold px-5 py-3 rounded-full hover:-translate-y-2 transition"
            >
              {t("hero.cta_feature")}
            </a>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 mt-10">
            {/* ... Các Avatar A B C D E và thống kê ... */}
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex-1 flex justify-center md:justify-end w-full mt-10 md:mt-0">
          {/* Bọc Widget trong 1 thẻ div có class md:w-96 để giới hạn chiều rộng ở trang Home */}
          <div className="w-full md:w-96">
            <UploadWidget onProcessAction={onRegister} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
