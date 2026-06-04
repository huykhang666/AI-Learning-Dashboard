"use client";

import React, { useState } from "react";
import axios from "axios";
import { motion, useReducedMotion, AnimatePresence } from "motion/react";
import {
  X,
  FileText,
  Check,
  Upload,
  Link2,
  AlertCircle,
} from "lucide-react";

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
            className={`relative z-10 flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-medium transition-colors ${
              isActive ? "text-zinc-900" : "text-zinc-500 hover:text-zinc-700"
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
            <span className="relative flex items-center gap-1.5">
              {tab.id === "file" ? (
                <Upload className="h-3.5 w-3.5" strokeWidth={2} />
              ) : (
                <Link2 className="h-3.5 w-3.5" strokeWidth={2} />
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
      className="btn-glow-primary mt-auto w-full rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 py-3.5 text-sm font-semibold text-white transition-[box-shadow,transform] duration-300"
      whileHover={
        reduceMotion ? undefined : { scale: 1.02, y: -1 }
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
  const reduceMotion = useReducedMotion();

  const shellClass =
    variant === "hero"
      ? "glass-panel rounded-3xl"
      : "glass-panel-embedded rounded-2xl";

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
        setInputError("Vui lòng chọn file video!");
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
        className={`${shellClass} flex h-full w-full flex-col items-center justify-center p-5 text-center sm:p-7`}
      >
        <div className="relative mb-6 flex items-center justify-center">
          <div className="h-16 w-16 rounded-full border border-zinc-200/80 bg-zinc-50" />
          <div className="absolute h-16 w-16 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          <span className="absolute text-sm font-semibold text-indigo-600">
            {Math.round(displayProgress)}%
          </span>
        </div>

        <h2 className="mb-6 text-xs font-semibold uppercase tracking-[0.14em] text-indigo-600">
          Processing Your Lecture
        </h2>

        <div className="mb-2 flex w-full items-center justify-between">
          <div className="flex min-w-0 items-center gap-2 text-left">
            <FileText className="h-4 w-4 shrink-0 text-zinc-400" strokeWidth={2} />
            <span className="truncate text-sm font-medium text-zinc-700">
              {activeTab === "youtube" ? "YouTube Video" : selectedFile?.name}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsProcessing(false)}
            className="rounded-lg p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-red-500"
            aria-label="Hủy"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        <div className="mb-1 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-cyan-500"
            initial={false}
            animate={{ width: `${displayProgress}%` }}
            transition={
              reduceMotion ? { duration: 0 } : { duration: 0.35, ease: [0.16, 1, 0.3, 1] }
            }
          />
        </div>
        <div className="mb-6 w-full text-right text-[10px] font-semibold text-indigo-600">
          {Math.round(displayProgress)}%
        </div>

        <div className="flex w-full flex-col gap-3.5 text-left">
          {[
            { id: 1, label: "Uploaded Successfully" },
            { id: 2, label: "Transcribing Audio (AI Whisper...)" },
            { id: 3, label: "Summarizing Content (AI ViT5)" },
            { id: 4, label: "Finalizing Session" },
          ].map((step) => (
            <div key={step.id} className="flex items-center gap-3">
              <div
                className={`flex h-5 w-5 items-center justify-center rounded-full border text-[10px] ${
                  currentStep >= step.id
                    ? "border-indigo-200 bg-indigo-50 text-indigo-600"
                    : "border-zinc-100 bg-zinc-50 text-zinc-400"
                }`}
              >
                {currentStep > step.id ? (
                  <Check className="h-3 w-3" strokeWidth={2.5} />
                ) : (
                  step.id
                )}
              </div>
              <span
                className={`text-sm ${
                  currentStep >= step.id
                    ? "font-medium text-zinc-700"
                    : "text-zinc-400"
                }`}
              >
                {step.label}
              </span>
              {currentStep === step.id && displayProgress < 100 && (
                <div className="ml-auto h-2 w-2 animate-pulse rounded-full bg-indigo-400" />
              )}
            </div>
          ))}
        </div>

        <p className="mt-auto pt-6 text-center text-xs italic text-zinc-400">
          Estimated time: ~2 minutes
        </p>
      </div>
    );
  }

  if (currentStep === -1) {
    return (
      <div
        className={`${shellClass} flex h-full w-full flex-col items-center justify-center gap-4 p-5 text-center sm:p-7`}
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-red-200/80 bg-red-50 text-red-500">
          <AlertCircle className="h-7 w-7" strokeWidth={2} />
        </div>
        <div>
          <h2 className="mb-1 text-sm font-semibold uppercase tracking-[0.12em] text-red-500">
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
          className="mt-2 rounded-xl border border-red-200 px-6 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div
      className={`${shellClass} flex h-full w-full flex-col p-5 sm:p-6`}
    >
      {!hideHeader && (
        <div className="mb-5 flex items-center justify-between">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-400/90" />
            <div className="h-2.5 w-2.5 rounded-full bg-amber-400/90" />
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/90" />
          </div>
          <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-400">
            Upload
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
              <input
                type="text"
                value={youtubeUrl}
                onChange={(e) => {
                  setYoutubeUrl(e.target.value);
                  setInputError("");
                }}
                placeholder="https://youtube.com/watch?v=..."
                className={`w-full rounded-xl border bg-white/80 px-4 py-3.5 text-sm text-zinc-700 outline-none transition placeholder:text-zinc-400 focus:ring-2 focus:ring-indigo-500/20 ${
                  inputError
                    ? "border-red-300 focus:border-red-400"
                    : "border-zinc-200/90 focus:border-indigo-400"
                }`}
              />
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
                className={`relative flex min-h-[128px] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
                  inputError
                    ? "border-red-300/80 bg-red-50/50"
                    : "border-zinc-200/90 bg-zinc-50/50 hover:border-indigo-300/60 hover:bg-indigo-50/30"
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
                  className="h-6 w-6 text-zinc-400"
                  strokeWidth={1.75}
                />
                <p className="text-sm font-medium text-zinc-600">
                  {selectedFile
                    ? selectedFile.name
                    : "Kéo & thả file video vào đây"}
                </p>
                {!selectedFile && (
                  <span className="mt-1 rounded-lg border border-zinc-200 bg-white px-4 py-1.5 text-xs font-medium text-zinc-600">
                    Chọn file
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

      <ProcessButton onClick={handleStartProcess}>Hiện video</ProcessButton>
    </div>
  );
}

export default UploadWidget;
