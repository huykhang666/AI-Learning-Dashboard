"use client";

import React, { useState } from "react";
import axios from "axios";
import { motion, useReducedMotion, AnimatePresence } from "motion/react";
import {
  X,
  Check,
  Upload,
  AlertCircle,
  FileVideo,
  FileText
} from "lucide-react";
import { FaYoutube } from "react-icons/fa";

const isValidYoutubeUrl = (url) => {
  return /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}/.test(
    url.trim()
  );
};

const ACCEPTED_TYPES = [
  "video/mp4",
  "video/webm",
  "video/ogg",
  "audio/wav",
  "audio/mpeg",
  "audio/mp4",
];
const isValidFile = (file) => ACCEPTED_TYPES.includes(file.type);

const TABS = [
  { id: "file", label: "Tải File" },
  { id: "youtube", label: "YouTube Link" },
];

function SlidingTabs({ activeTab, onChange }) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative flex gap-1 rounded-2xl border border-zinc-200/60 bg-zinc-100/80 p-1">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`relative z-10 flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer select-none ${
              isActive ? "text-zinc-900" : "text-zinc-500 hover:text-zinc-800"
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="upload-widget-tab-pill"
                className="absolute inset-0 rounded-xl border border-white/80 bg-white shadow-[0_2px_12px_-4px_rgba(15,23,42,0.12)]"
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 420, damping: 32 }
                }
              />
            )}
            <span className="relative flex items-center gap-2">
              {tab.id === "file" ? (
                <FileVideo className={`h-3.5 w-3.5 ${isActive ? 'text-indigo-650' : 'text-zinc-400'}`} strokeWidth={2.2} />
              ) : (
                <FaYoutube className={`h-3.5 w-3.5 ${isActive ? 'text-red-500' : 'text-zinc-400'}`} />
              )}
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function ProcessButton({ onClick, children }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.button
      type="button"
      onClick={onClick}
      className="btn-glow-primary mt-auto w-full rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 py-4 text-sm font-bold text-white transition-[box-shadow,transform] duration-300 shadow-[0_4px_14px_rgba(79,70,229,0.3)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.4)] cursor-pointer"
      whileHover={
        reduceMotion ? undefined : { scale: 1.02, y: -0.5 }
      }
      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
    >
      {children}
    </motion.button>
  );
}

function UploadWidget({ onProcessAction, hideHeader, variant = "embedded" }) {
  const [activeTab, setActiveTab] = useState("youtube");
  const [isProcessing, setIsProcessing] = useState(false);
  const [displayProgress, setDisplayProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [inputError, setInputError] = useState("");
  const [isDragActive, setIsDragActive] = useState(false);
  const reduceMotion = useReducedMotion();

  const shellClass =
    variant === "hero"
      ? "rounded-[2rem] border border-zinc-200/60 bg-white/80 p-6 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.06),0_4px_12px_-4px_rgba(0,0,0,0.03),inset_0_1px_1px_rgba(255,255,255,0.9)] backdrop-blur-xl"
      : "rounded-2xl border border-zinc-200/60 bg-white/70 p-5 shadow-sm backdrop-blur-md";

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      setInputError("");
    }
  };

  const handleStartProcess = async () => {
    setInputError("");

    if (activeTab === "youtube") {
      if (!youtubeUrl.trim()) {
        setInputError("Vui lòng dán link YouTube vào!");
        return;
      }
      if (!isValidYoutubeUrl(youtubeUrl)) {
        setInputError(
          "Link YouTube không hợp lệ. Ví dụ: https://youtube.com/watch?v=xxxx"
        );
        return;
      }
    }

    if (activeTab === "file") {
      if (!selectedFile) {
        setInputError("Vui lòng chọn hoặc kéo thả file video vào!");
        return;
      }
      if (!isValidFile(selectedFile)) {
        setInputError(
          "Định dạng không hỗ trợ. Vui lòng chọn file MP4, WebM, WAV hoặc MP3."
        );
        return;
      }
    }

    setIsProcessing(true);
    setCurrentStep(1);
    setDisplayProgress(0);

    let fakeTimerId = null;
    let stopped = false;

    fakeTimerId = setInterval(() => {
      if (stopped) {
        clearInterval(fakeTimerId);
        return;
      }
      setDisplayProgress((prev) => {
        if (prev >= 75) {
          stopped = true;
          clearInterval(fakeTimerId);
          return 75;
        }
        const inc = Math.random() * 1 + 0.5;
        const next = Math.min(prev + inc, 75);
        if (next > 15) setCurrentStep(2);
        if (next > 45) setCurrentStep(3);
        return next;
      });
    }, 400);

    try {
      const token = localStorage.getItem("accessToken");
      const formData = new FormData();

      if (activeTab === "youtube") {
        formData.append("title", "YouTube Lecture");
        formData.append("videoUrl", youtubeUrl);
      } else {
        formData.append("title", selectedFile.name);
        formData.append("file", selectedFile);
      }

      const response = await axios.post(
        "http://localhost:8080/api/v1/sessions",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data && response.data.result) {
        const { sessionId } = response.data.result;

        const checkStatusInterval = setInterval(async () => {
          try {
            const statusRes = await axios.get(
              `http://localhost:8080/api/v1/jobs/${sessionId}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            const { status } = statusRes.data.result;

            if (status === "COMPLETED") {
              stopped = true;
              clearInterval(fakeTimerId);
              clearInterval(checkStatusInterval);

              const finishTimer = setInterval(() => {
                setDisplayProgress((prev) => {
                  if (prev >= 100) {
                    clearInterval(finishTimer);
                    setCurrentStep(4);
                    setTimeout(() => onProcessAction(sessionId), 1000);
                    return 100;
                  }
                  return prev + 2;
                });
              }, 50);
            } else if (status === "FAILED") {
              stopped = true;
              clearInterval(fakeTimerId);
              clearInterval(checkStatusInterval);
              setCurrentStep(-1);
              setIsProcessing(false);
            }
          } catch (err) {
            console.error("Lỗi khi kiểm tra trạng thái job:", err);
          }
        }, 3000);
      }
    } catch (error) {
      stopped = true;
      clearInterval(fakeTimerId);
      console.error("Lỗi tạo session:", error.response?.data || error.message);
      setCurrentStep(-1);
      setIsProcessing(false);
    }
  };

  if (isProcessing) {
    return (
      <div
        className={`${shellClass} flex h-full w-full flex-col items-center justify-center p-6 text-center sm:p-8 bg-white/95 backdrop-blur-xl border border-zinc-200/60 rounded-[2rem] shadow-xl`}
      >
        <div className="relative mb-6 flex items-center justify-center">
          {/* Pulsing ring background */}
          <div className="absolute h-20 w-20 rounded-full border border-indigo-100 bg-indigo-50/30 animate-pulse" />
          <div className="h-16 w-16 rounded-full border border-zinc-150 bg-white shadow-sm flex items-center justify-center" />
          
          <svg className="absolute h-16 w-16 -rotate-90">
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="#f4f4f5"
              strokeWidth="3.5"
              fill="transparent"
            />
            <motion.circle
              cx="32"
              cy="32"
              r="28"
              stroke="url(#progress-grad)"
              strokeWidth="3.5"
              fill="transparent"
              strokeDasharray={176}
              strokeDashoffset={176 - (176 * displayProgress) / 100}
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="progress-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4f46e5" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>
          <span className="absolute text-sm font-extrabold text-indigo-650">
            {Math.round(displayProgress)}%
          </span>
        </div>

        <h2 className="mb-5 text-[11px] font-black uppercase tracking-[0.18em] text-indigo-650">
          Processing Your Lecture
        </h2>

        <div className="mb-3.5 flex w-full items-center justify-between bg-zinc-50 p-2.5 rounded-xl border border-zinc-150">
          <div className="flex min-w-0 items-center gap-2 text-left">
            <FileVideo className="h-4 w-4 shrink-0 text-indigo-500" strokeWidth={2} />
            <span className="truncate text-xs font-semibold text-zinc-700">
              {activeTab === "youtube" ? "YouTube Video Link" : selectedFile?.name}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsProcessing(false)}
            className="rounded-lg p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-red-500 cursor-pointer"
            aria-label="Hủy"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        <div className="flex w-full flex-col gap-3 text-left bg-zinc-50/50 p-4 rounded-2xl border border-zinc-100">
          {[
            { id: 1, label: "Uploaded Successfully" },
            { id: 2, label: "Transcribing Audio (AI Whisper...)" },
            { id: 3, label: "Summarizing Content (AI ViT5)" },
            { id: 4, label: "Finalizing Session" },
          ].map((step) => (
            <div key={step.id} className="flex items-center gap-3">
              <div
                className={`flex h-5 w-5 items-center justify-center rounded-full border text-[10px] font-bold ${
                  currentStep >= step.id
                    ? "border-indigo-200 bg-indigo-50 text-indigo-600"
                    : "border-zinc-200 bg-zinc-100 text-zinc-400"
                }`}
              >
                {currentStep > step.id ? (
                  <Check className="h-3 w-3" strokeWidth={2.5} />
                ) : (
                  step.id
                )}
              </div>
              <span
                className={`text-xs font-semibold ${
                  currentStep >= step.id
                    ? "text-zinc-800"
                    : "text-zinc-400"
                }`}
              >
                {step.label}
              </span>
              {currentStep === step.id && displayProgress < 100 && (
                <div className="ml-auto h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-500" />
              )}
            </div>
          ))}
        </div>

        <p className="mt-5 text-[10px] font-medium text-zinc-400">
          Estimated completion time: ~2 minutes
        </p>
      </div>
    );
  }

  if (currentStep === -1) {
    return (
      <div
        className={`${shellClass} flex h-full w-full flex-col items-center justify-center gap-4 p-6 text-center sm:p-8`}
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-red-200/80 bg-red-50 text-red-500 shadow-sm animate-bounce">
          <AlertCircle className="h-7 w-7" strokeWidth={2} />
        </div>
        <div>
          <h2 className="mb-1 text-sm font-bold uppercase tracking-wider text-red-500">
            Processing Failed
          </h2>
          <p className="text-xs leading-relaxed text-zinc-500">
            Đã xảy ra lỗi trong quá trình xử lý.
            <br />
            Vui lòng kiểm tra lại đường truyền hoặc thử lại.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setCurrentStep(1);
            setDisplayProgress(0);
          }}
          className="mt-2 rounded-xl border border-red-200 px-6 py-2.5 text-xs font-bold text-red-650 bg-white hover:bg-red-50 transition-colors shadow-sm cursor-pointer"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div
      className={`${shellClass} flex h-full w-full flex-col`}
    >
      {!hideHeader && (
        <div className="mb-4 flex items-center justify-between">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-400/90" />
            <div className="h-2.5 w-2.5 rounded-full bg-amber-400/90" />
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/90" />
          </div>
          <span className="text-[9px] font-black uppercase tracking-[0.18em] text-zinc-400">
            AI Uploader v1.0
          </span>
        </div>
      )}

      <SlidingTabs
        activeTab={activeTab}
        onChange={(id) => {
          setActiveTab(id);
          setInputError("");
        }}
      />

      <div className="mb-5 mt-5 flex flex-1 flex-col justify-center gap-2">
        <AnimatePresence mode="wait">
          {activeTab === "youtube" ? (
            <motion.div
              key="youtube"
              initial={reduceMotion ? false : { opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, x: -8 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-2"
            >
              <div className="relative">
                <input
                  type="text"
                  value={youtubeUrl}
                  onChange={(e) => {
                    setYoutubeUrl(e.target.value);
                    setInputError("");
                  }}
                  placeholder="https://youtube.com/watch?v=..."
                  className={`w-full rounded-xl border bg-white/80 pl-10 pr-4 py-3.5 text-sm text-zinc-700 outline-none transition-all placeholder:text-zinc-400 focus:ring-4 focus:ring-indigo-500/10 ${
                    inputError
                      ? "border-red-300 focus:border-red-400"
                      : "border-zinc-200/80 focus:border-indigo-400 focus:bg-white"
                  }`}
                />
                <FaYoutube className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              </div>
              {inputError && (
                <p className="flex items-center gap-1 text-xs text-red-500">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
                  {inputError}
                </p>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="file"
              initial={reduceMotion ? false : { opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, x: -8 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-2"
            >
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`relative flex min-h-[140px] cursor-pointer flex-col items-center justify-center gap-2.5 rounded-xl border-2 border-dashed p-6 text-center transition-all ${
                  inputError
                    ? "border-red-300 bg-red-50/40"
                    : isDragActive
                    ? "border-indigo-500 bg-indigo-50/30 scale-[1.02]"
                    : "border-zinc-200 bg-zinc-50/50 hover:border-indigo-300 hover:bg-indigo-50/10"
                }`}
              >
                <input
                  type="file"
                  accept=".mp4,.webm,.ogg,.wav,.mp3,.m4a"
                  className="absolute inset-0 cursor-pointer opacity-0"
                  onChange={(e) => {
                    setSelectedFile(e.target.files[0]);
                    setInputError("");
                  }}
                />
                <Upload
                  className="h-6 w-6 text-indigo-500/80 animate-pulse"
                  strokeWidth={2}
                />
                <p className="text-xs font-bold text-zinc-600">
                  {selectedFile
                    ? selectedFile.name
                    : "Kéo & thả file video bài giảng vào đây"}
                </p>
                {!selectedFile && (
                  <span className="mt-1 rounded-lg border border-zinc-200 bg-white px-3 py-1 text-[10px] font-bold text-zinc-500 shadow-sm hover:bg-zinc-50 transition-colors">
                    Chọn file cục bộ
                  </span>
                )}
              </div>
              {inputError && (
                <p className="flex items-center gap-1 text-xs text-red-500">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
                  {inputError}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ProcessButton onClick={handleStartProcess}>Tải lên ngay</ProcessButton>
    </div>
  );
}

export default UploadWidget;
