import { useState } from "react";
import { useTranslation } from "react-i18next";

const topics = [
  { icon: "🚀", labelKey: "help_center.topics.getting_started", bg: "#fff3e0" },
  { icon: "📤", labelKey: "help_center.topics.upload", bg: "#e3f2fd" },
  { icon: "💬", labelKey: "help_center.topics.chatbot", bg: "#f3e5f5" },
  { icon: "💳", labelKey: "help_center.topics.account_billing", bg: "#e8f5e9" },
];

const faqs = [
  {
    qKey: "help_center.faqs.upload.q",
    aKey: "help_center.faqs.upload.a",
  },
  {
    qKey: "help_center.faqs.premium.q",
    aKey: "help_center.faqs.premium.a",
  },
  {
    qKey: "help_center.faqs.processing.q",
    aKey: "help_center.faqs.processing.a",
  },
  {
    qKey: "help_center.faqs.youtube.q",
    aKey: "help_center.faqs.youtube.a",
  },
];

function SearchIcon({ size = 16, color = "#9ca3af" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <circle cx="7" cy="7" r="5" stroke={color} strokeWidth="1.5" />
      <path
        d="M11 11l3 3"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 10,
        marginBottom: 10,
        overflow: "hidden",
        background: "#fff",
      }}
    >
      <div
        onClick={() => setOpen(!open)}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "18px 20px",
          cursor: "pointer",
          background: open ? "#f9fafb" : "#fff",
        }}
      >
        <span style={{ fontSize: 15, color: "#111827", fontWeight: 400 }}>
          {q}
        </span>
        <span
          style={{
            fontSize: 18,
            color: "#9ca3af",
            transition: "transform 0.2s",
            display: "inline-block",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            userSelect: "none",
            lineHeight: 1,
          }}
        >
          ⌄
        </span>
      </div>
      {open && (
        <div style={{ padding: "0 20px 16px" }}>
          <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.7 }}>{a}</p>
        </div>
      )}
    </div>
  );
}

export default function HelpCenter() {
  const { t } = useTranslation();
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "40px 24px",
      }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <h1
          style={{
            fontSize: 32,
            fontWeight: 700,
            color: "#0a0a0a",
            marginBottom: 28,
          }}
        >
          {t("help_center.title")}
        </h1>

        {/* Search bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            border: "1px solid #e5e7eb",
            borderRadius: 10,
            padding: "12px 16px",
            marginBottom: 36,
            background: "#fff",
          }}
        >
          <SearchIcon color="#9ca3af" size={16} />
          <input
            placeholder={t("help_center.search_placeholder")}
            style={{
              border: "none",
              background: "transparent",
              fontSize: 15,
              color: "#111827",
              outline: "none",
              width: "100%",
            }}
          />
        </div>

        {/* Popular topics */}
        <p style={{ fontSize: 25, color: "#0a0a0a", marginBottom: 14 }}>
          {t("help_center.popular_topics")}
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 14,
            marginBottom: 36,
          }}
        >
          {topics.map((topic) => (
            <div
              key={topic.labelKey}
              style={{
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: 10,
                padding: "24px 12px 18px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
                cursor: "pointer",
                transition: "box-shadow 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)")
              }
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 12,
                  background: topic.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 26,
                }}
              >
                {topic.icon}
              </div>
              <span
                style={{
                  fontSize: 13,
                  color: "#374151",
                  textAlign: "center",
                  lineHeight: 1.4,
                }}
              >
                {t(topic.labelKey)}
              </span>
            </div>
          ))}
        </div>

        {/* FAQs */}
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontSize: 25, color: "#0a0a0a", marginBottom: 14 }}>
            {t("help_center.popular_faqs")}
          </p>
          {faqs.map((faq) => (
            <FAQItem key={faq.qKey} q={t(faq.qKey)} a={t(faq.aKey)} />
          ))}
        </div>

        {/* Contact Support */}
        <div
          style={{
            background: "#2563eb",
            borderRadius: 14,
            padding: "32px 24px",
            textAlign: "center",
          }}
        >
          <h3
            style={{
              color: "#fff",
              fontSize: 17,
              fontWeight: 600,
              marginBottom: 6,
            }}
          >
            {t("help_center.contact_support")}
          </h3>
          <p
            style={{
              color: "rgba(255,255,255,0.75)",
              fontSize: 13,
              marginBottom: 20,
            }}
          >
            {t("help_center.contact_description")}
          </p>
          <button
            style={{
              background: "rgba(255,255,255,0.2)",
              border: "1.5px solid rgba(255,255,255,0.6)",
              borderRadius: 20,
              color: "#fff",
              padding: "10px 28px",
              fontSize: 14,
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            {t("help_center.start_live_chat")}
          </button>
        </div>
      </div>
    </div>
  );
}
