import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronUp, ChevronDown } from "lucide-react";

function FAQ() {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState(null);
  const faqData = t("faq.items", { returnObjects: true });
  const faqs = Array.isArray(faqData) ? faqData : [];

  return (
    <section id="FAQ" className="bg-white py-20">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-700 to-cyan-500 bg-clip-text text-transparent font-medium text-2xl mb-4">
            {t("faq.title")}
          </div>
          <h2 className="text-gray-900 text-4xl font-bold mb-4">
            {t("faq.section_title")}
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {faqs.map((faq, index) => (
            <div
              key={faq.question}
              className={`border rounded-2xl px-6 py-4 cursor-pointer transition ${
                openIndex === index
                  ? "border-indigo-300 bg-indigo-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <div className="flex items-center justify-between">
                <h3
                  className={`font-bold text-base ${
                    openIndex === index ? "text-indigo-600" : "text-gray-900"
                  }`}
                >
                  {faq.question}
                </h3>
                <span className="text-gray-400 ml-4 flex-shrink-0">
                  {openIndex === index ? (
                    <ChevronUp size={18} />
                  ) : (
                    <ChevronDown size={18} />
                  )}
                </span>
              </div>

              {openIndex === index && (
                <p className="text-gray-500 text-sm mt-3 leading-relaxed">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FAQ;