import React, { useState, useRef, useEffect } from "react";
import { Send, Zap, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";

const AIChatBox = ({ onClose, sessionId, courseDetailApi, aiApi }) => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ role: "ai", content: t("ai_chat.welcome") }]);
    }
  }, [t, messages.length]);

  /* ========================
       LOAD HISTORY
    ======================== */
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = await courseDetailApi.getChatHistory(sessionId);

        if (history?.content?.length) {
          const formattedMsgs = history.content.map((m) => ({
            role: m.isAi ? "ai" : "user",
            content: m.content,
          }));

          setMessages((prev) => [...prev, ...formattedMsgs]);
        }
      } catch (err) {
        console.error("Không lấy được lịch sử chat", err);
      }
    };

    loadHistory();
  }, [sessionId]);

  /* ========================
       AUTO SCROLL
    ======================== */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, loading]);

  /* ========================
       SEND MESSAGE
    ======================== */
  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: "user", content: input };

    // 👉 snapshot messages tránh lệch state async
    const currentMessages = [...messages, userMsg];

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // 1. Lưu vào Java (optional)
      await courseDetailApi.sendMessage(sessionId, input);

      // 2. Gọi AI Python
      const res = await aiApi.chat(sessionId, input, currentMessages);

      console.log("AI RESPONSE:", res);

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: res?.answer || t("ai_chat.not_answer"),
        },
      ]);
    } catch (err) {
      console.error(err);

      setMessages((prev) => [
        ...prev,
        { role: "ai", content: t("ai_chat.error_message") },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[400px] h-[550px] bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] flex flex-col border border-slate-100 overflow-hidden animate-in slide-in-from-bottom-5">
      {/* HEADER */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
        <h2 className="font-bold text-sm tracking-wide uppercase italic">
          AI Learning DashBoard
        </h2>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* MESSAGES */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30 custom-scrollbar"
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            {/* AVATAR */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0 shadow-md ${
                msg.role === "user" ? "bg-slate-800" : "bg-blue-600"
              }`}
            >
              {msg.role === "user" ? (
                <span className="text-[10px]">ME</span>
              ) : (
                <Zap size={16} fill="currentColor" />
              )}
            </div>

            {/* MESSAGE */}
            <div
              className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-line ${
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-tr-none"
                  : "bg-white text-slate-600 border border-slate-100 rounded-tl-none"
              }`}
            >
              {msg.role === "ai" ? (
                <ReactMarkdown
                  components={{
                    p: (props) => <p className="mb-2" {...props} />,
                    li: (props) => <li className="ml-4 list-disc" {...props} />,
                    strong: (props) => (
                      <strong
                        className="font-semibold text-slate-800"
                        {...props}
                      />
                    ),
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}

        {/* LOADING */}
        {loading && (
          <div className="text-[10px] font-bold text-slate-400 uppercase animate-pulse">
            {t("ai_chat.analysis")}
          </div>
        )}
      </div>

      {/* INPUT */}
      <div className="p-4 bg-white border-t border-slate-100">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder={t("ai_chat.placeholder")}
            className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleSendMessage}
            disabled={loading}
            className="bg-blue-600 text-white p-2.5 rounded-xl shadow-md active:scale-95 flex items-center justify-center disabled:bg-slate-300"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChatBox;
