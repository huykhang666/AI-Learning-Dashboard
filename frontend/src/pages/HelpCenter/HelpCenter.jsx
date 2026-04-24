import { useState } from "react";


const topics = [
  { icon: "🚀", label: "Getting Started", bg: "#fff3e0" },
  { icon: "📤", label: "Upload & AI Processing", bg: "#e3f2fd" },
  { icon: "💬", label: "Chatbot Assistance", bg: "#f3e5f5" },
  { icon: "💳", label: "Account & Billing", bg: "#e8f5e9" },
];

const faqs = [
  {
    q: "How to upload a file?",
    a: "Click the upload button on the dashboard or drag and drop your file. Supported formats include PDF, MP4, and YouTube links.",
  },
  {
    q: "What is Premium?",
    a: "Premium gives you unlimited uploads, faster AI processing, and access to advanced chatbot features.",
  },
  {
    q: "How long does AI processing take?",
    a: "Most files are processed within 1–3 minutes depending on size and server load.",
  },
  {
    q: "Can I upload YouTube links?",
    a: "Yes! Paste a YouTube URL in the upload box and the system will automatically fetch and process the video.",
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
          How Can We Help?
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
            placeholder="Search for help, tutorials, FAQs..."
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
          Popular help topic
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 14,
            marginBottom: 36,
          }}
        >
          {topics.map((t) => (
            <div
              key={t.label}
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
                  background: t.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 26,
                }}
              >
                {t.icon}
              </div>
              <span
                style={{
                  fontSize: 13,
                  color: "#374151",
                  textAlign: "center",
                  lineHeight: 1.4,
                }}
              >
                {t.label}
              </span>
            </div>
          ))}
        </div>

        {/* FAQs */}
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontSize: 25, color: "#0a0a0a", marginBottom: 14 }}>
            Popular FAQs
          </p>
          {faqs.map((faq) => (
            <FAQItem key={faq.q} q={faq.q} a={faq.a} />
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
            Contact Support
          </h3>
          <p
            style={{
              color: "rgba(255,255,255,0.75)",
              fontSize: 13,
              marginBottom: 20,
            }}
          >
            Link you or with a live chat
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
            Start Live Chat
          </button>
        </div>
      </div>
    </div>
  );
}
