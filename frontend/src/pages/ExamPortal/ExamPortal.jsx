/*
 * Design Read: Exam portal page for students, with a clean premium light-theme glassmorphism vibe,
 * leaning toward Tailwind v4 + motion/react + radial glow mesh layout.
 *
 * Dials:
 * DESIGN_VARIANCE: 7
 * MOTION_INTENSITY: 6
 * VISUAL_DENSITY: 4
 */

import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "motion/react";
import { 
  TbMath, TbAtom, TbFlask, TbSchool, 
  TbVideo, TbClock, TbListNumbers, TbConfetti, TbChevronRight, TbChevronLeft,
  TbInfoCircle, TbLock, TbAlertCircle, TbCheck, TbX, TbActivity,
  TbHelp, TbDeviceLaptop, TbAward
} from "react-icons/tb";
import { toast } from "react-toastify";
import { examApi } from "../../api/ExamApi";

// --- FALLBACK MOCK DATA FOR SEAMLESS TESTING ---
const fallbackExams = [
  {
    id: 1,
    title: "Đề thi thử THPT Quốc Gia - Môn Toán (Mã đề 101)",
    subject: "Toán học",
    questionCount: 3,
    durationMinutes: 15,
    description: "Khảo sát kiến thức tổng hợp phần Đại số, Giải tích và Hình học lớp 12 chuẩn cấu trúc đề thi thử quốc gia."
  },
  {
    id: 2,
    title: "Đề kiểm tra Chương 1: Động học chất điểm - Môn Vật Lý",
    subject: "Vật lý",
    questionCount: 3,
    durationMinutes: 10,
    description: "Đánh giá các kiến thức trọng tâm chuyển động cơ, biến đổi đều, rơi tự do và chuyển động tròn đều."
  },
  {
    id: 3,
    title: "Đề ôn tập giữa học kỳ II - Môn Hóa học",
    subject: "Hóa học",
    questionCount: 2,
    durationMinutes: 12,
    description: "Đề tổng ôn tập bao gồm lý thuyết Amin, Amino axit, Peptit, Protein và các dạng toán este hóa điển hình."
  }
];

const fallbackExamDetails = {
  1: {
    id: 1,
    title: "Đề thi thử THPT Quốc Gia - Môn Toán (Mã đề 101)",
    subject: "Toán học",
    durationMinutes: 15,
    questions: [
      {
        id: 1,
        questionType: "SINGLE_CHOICE",
        content: "Tìm tập xác định D của hàm số y = log2(x - 3).",
        options: [
          "A. D = [3; +∞)",
          "B. D = (3; +∞)",
          "C. D = (-∞; 3)",
          "D. D = R \\ {3}"
        ]
      },
      {
        id: 2,
        questionType: "TRUE_FALSE",
        content: "Xét tính đúng/sai của các mệnh đề sau về đồ thị hàm số y = x^3 - 3x^2 + 2:",
        subQuestions: [
          { key: "a", text: "Hàm số đồng biến trên khoảng (2; +∞)." },
          { key: "b", text: "Điểm cực tiểu của đồ thị hàm số là (2; -2)." },
          { key: "c", text: "Đường thẳng y = 2 cắt đồ thị hàm số tại đúng 2 điểm phân biệt." },
          { key: "d", text: "Giá trị lớn nhất của hàm số trên đoạn [0; 3] bằng 2." }
        ]
      },
      {
        id: 3,
        questionType: "SHORT_ANSWER",
        content: "Cho khối chóp S.ABC có đáy ABC là tam giác vuông tại B, AB = 3, BC = 4. Đường cao SA vuông góc với đáy và SA = 5. Tính thể tích V của khối chóp S.ABC."
      }
    ]
  },
  2: {
    id: 2,
    title: "Đề kiểm tra Chương 1: Động học chất điểm - Môn Vật Lý",
    subject: "Vật lý",
    durationMinutes: 10,
    questions: [
      {
        id: 1,
        questionType: "SINGLE_CHOICE",
        content: "Một chất điểm chuyển động dọc theo trục Ox có phương trình tọa độ x = 5 + 2t - t^2 (x tính bằng mét, t tính bằng giây). Chất điểm chuyển động đổi chiều tại thời điểm:",
        options: [
          "A. t = 1.0 giây",
          "B. t = 2.0 giây",
          "C. t = 0.5 giây",
          "D. t = 1.5 giây"
        ]
      },
      {
        id: 2,
        questionType: "TRUE_FALSE",
        content: "Xét một vật chuyển động thẳng biến đổi đều dọc theo trục Ox:",
        subQuestions: [
          { key: "a", text: "Gia tốc của vật có giá trị không đổi theo thời gian." },
          { key: "b", text: "Nếu vận tốc và gia tốc cùng dấu, vật chuyển động nhanh dần đều." },
          { key: "c", text: "Quãng đường đi được luôn tỉ lệ thuận với thời gian chuyển động." },
          { key: "d", text: "Vận tốc tức thời của vật là một hàm bậc nhất theo thời gian." }
        ]
      },
      {
        id: 3,
        questionType: "SHORT_ANSWER",
        content: "Một ô tô đang chạy với vận tốc 10 m/s thì hãm phanh chuyển động chậm dần đều và dừng lại sau 5 giây. Gia tốc của xe có độ lớn là bao nhiêu m/s^2?"
      }
    ]
  },
  3: {
    id: 3,
    title: "Đề ôn tập giữa học kỳ II - Môn Hóa học",
    subject: "Hóa học",
    durationMinutes: 12,
    questions: [
      {
        id: 1,
        questionType: "SINGLE_CHOICE",
        content: "Dung dịch chất nào sau đây làm quỳ tím chuyển sang màu xanh?",
        options: [
          "A. Anilin",
          "B. Etylamin",
          "C. Glyxin",
          "D. Axit glutamic"
        ]
      },
      {
        id: 2,
        questionType: "TRUE_FALSE",
        content: "Trong các phát biểu sau đây về amin và peptit, phát biểu nào đúng, phát biểu nào sai?",
        subQuestions: [
          { key: "a", text: "Tất cả các amin đều độc và đều tan vô hạn trong nước." },
          { key: "b", text: "Lực bazơ của metylamin mạnh hơn lực bazơ của anilin." },
          { key: "c", text: "Liên kết của nhóm CO với nhóm NH giữa hai đơn vị alpha-amino axit là liên kết peptit." },
          { key: "d", text: "Thủy phân hoàn toàn peptit Gly-Ala thu được hỗn hợp gồm 2 amino axit." }
        ]
      }
    ]
  }
};

const fallbackSubmitResult = {
  score: 6.67,
  correctCount: 2,
  totalPoints: 6.67,
  honestyScore: 100.0,
  results: {
    1: {
      isCorrect: true,
      userAnswer: "B",
      correctAnswer: "B",
      explanation: "Tập xác định của log2(x - 3) yêu cầu biểu thức trong logarit dương: x - 3 > 0 => x > 3. Do đó, tập xác định là D = (3; +∞)."
    },
    2: {
      isCorrect: true,
      userAnswer: { a: "T", b: "T", c: "F", d: "T" },
      correctAnswer: { a: "T", b: "T", c: "F", d: "T" },
      explanation: "a) Đúng: Vì y' = 3x^2 - 6x > 0 khi x > 2. b) Đúng: cực tiểu tại x=2 => y=-2. c) Sai: y=2 cắt tại 3 điểm phân biệt. d) Đúng: y(0)=2, y(3)=2, cực tiểu là -2, cực đại là 2. Vậy GTLN là 2."
    },
    3: {
      isCorrect: false,
      userAnswer: "12",
      correctAnswer: "10",
      explanation: "Diện tích đáy ABC vuông tại B: S = 1/2 * AB * BC = 1/2 * 3 * 4 = 6. Thể tích hình chóp V = 1/3 * SA * S_day = 1/3 * 5 * 6 = 10."
    }
  }
};

// --- ROBUST NORMALIZATION FOR SPRING BOOT ENTITIES (maps database columns/camelCase to frontend formats) ---
const normalizeExamDetail = (detail) => {
  if (!detail) return null;
  
  let questions = [];
  if (Array.isArray(detail.questions)) {
    questions = detail.questions;
  } else if (Array.isArray(detail)) {
    questions = detail;
  } else if (detail.data && Array.isArray(detail.data.questions)) {
    questions = detail.data.questions;
  } else if (detail.result && Array.isArray(detail.result.questions)) {
    questions = detail.result.questions;
  } else if (detail.data && Array.isArray(detail.data)) {
    questions = detail.data;
  } else if (detail.result && Array.isArray(detail.result)) {
    questions = detail.result;
  }

  const normalizedQuestions = questions.map((q) => {
    const newQ = { ...q };
    
    // Normalize fields (database column mappings)
    newQ.questionType = newQ.questionType || newQ.question_type;
    newQ.content = newQ.content || newQ.questionText || newQ.question_text || "";
    
    // Normalize options for SINGLE_CHOICE (converts {"A":"val", ...} or string JSON to array ["A. val", ...])
    if (newQ.questionType === "SINGLE_CHOICE") {
      let opts = newQ.options || newQ.optionsJson || newQ.options_json;
      if (typeof opts === "string") {
        try { opts = JSON.parse(opts); } catch(e) {}
      }
      if (opts && typeof opts === "object" && !Array.isArray(opts)) {
        newQ.options = Object.entries(opts)
          .map(([key, val]) => `${key}. ${val}`)
          .sort();
      } else if (Array.isArray(opts)) {
        newQ.options = opts.map((opt, index) => {
          const prefix = String.fromCharCode(65 + index); // A, B, C, D
          const optStr = opt !== null && opt !== undefined ? String(opt) : "";
          if (optStr.match(/^[A-D]\.\s/)) {
            return optStr;
          }
          return `${prefix}. ${optStr}`;
        });
      } else {
        newQ.options = newQ.options || [];
      }
    }
    
    // Normalize subQuestions for TRUE_FALSE (converts {"a":"statement", ...} to array of subquestions)
    if (newQ.questionType === "TRUE_FALSE") {
      let opts = newQ.options || newQ.optionsJson || newQ.options_json;
      if (typeof opts === "string") {
        try { opts = JSON.parse(opts); } catch(e) {}
      }
      if (opts && typeof opts === "object" && !Array.isArray(opts)) {
        newQ.subQuestions = Object.entries(opts)
          .map(([key, text]) => ({ key, text }))
          .sort((x, y) => x.key.localeCompare(y.key));
      } else if (Array.isArray(newQ.subQuestions)) {
        // Already structured correctly
      } else {
        newQ.subQuestions = [];
      }
    }
    
    return newQ;
  });
  
  return {
    ...detail,
    questions: normalizedQuestions
  };
};

export default function ExamPortal() {
  const { t } = useTranslation();

  const getNormalizedSubjectGroup = (subjectName) => {
    if (!subjectName) return "Khác";
    const name = subjectName.toLowerCase().trim();
    if (name === "tất cả" || name === "all") return "Tất cả";
    if (name.includes("toán")) return "Toán học";
    if (name.includes("lý") || name.includes("vật lý")) return "Vật lý";
    if (name.includes("hóa")) return "Hóa học";
    if (name.includes("văn") || name.includes("ngữ văn")) return "Ngữ văn";
    if (name.includes("anh") || name.includes("tiếng anh")) return "Tiếng Anh";
    return "Khác";
  };

  const getSubjectLabel = (subject) => {
    const normalized = getNormalizedSubjectGroup(subject);
    switch (normalized) {
      case "Tất cả":
        return t("exam_portal.filter_all");
      case "Toán học":
        return t("exam_portal.filter_math");
      case "Vật lý":
        return t("exam_portal.filter_physics");
      case "Hóa học":
        return t("exam_portal.filter_chemistry");
      case "Ngữ văn":
        return t("exam_portal.filter_literature", { defaultValue: "Ngữ văn" });
      case "Tiếng Anh":
        return t("exam_portal.filter_english", { defaultValue: "Tiếng Anh" });
      default:
        return subject;
    }
  };

  const getGradeLabel = (grade) => {
    switch (grade) {
      case "Tất cả":
        return t("exam_portal.filter_all");
      case "Đại học / THPT QG":
        return t("exam_portal.filter_university_prep", { defaultValue: "Đại học / THPT QG" });
      case "Lớp 12":
        return t("exam_portal.filter_grade_12", { defaultValue: "Lớp 12" });
      case "Lớp 11":
        return t("exam_portal.filter_grade_11", { defaultValue: "Lớp 11" });
      case "Lớp 10":
        return t("exam_portal.filter_grade_10", { defaultValue: "Lớp 10" });
      default:
        return grade;
    }
  };

  const getReasonLabel = (reason) => {
    switch (reason) {
      case "Thoát chế độ toàn màn hình":
        return t("exam_portal.reason_exit_fullscreen", { defaultValue: "Thoát chế độ toàn màn hình" });
      case "Chuyển sang tab khác":
        return t("exam_portal.reason_switch_tab", { defaultValue: "Chuyển sang tab khác" });
      case "Rời con trỏ ngoài cửa sổ thi":
        return t("exam_portal.reason_cursor_leave", { defaultValue: "Rời con trỏ ngoài cửa sổ thi" });
      default:
        return reason;
    }
  };

  // --- STATE MANAGEMENT ---
  const [exams, setExams] = useState([]);
  const [isLoadingExams, setIsLoadingExams] = useState(true);
  const [activeTab, setActiveTab] = useState("portal"); // "portal", "testing", "result"
  
  // Selected Exam States
  const [selectedExam, setSelectedExam] = useState(null);
  const [examDetail, setExamDetail] = useState(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
    // Grace period, Subjects, Grades and Leaderboard states
  const isReadyForMonitoringRef = useRef(false);
  const [selectedSubject, setSelectedSubject] = useState("Tất cả");
  const [selectedGrade, setSelectedGrade] = useState("Tất cả");
  const [isGradeDropdownOpen, setIsGradeDropdownOpen] = useState(false);
  const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);
  const [gradeSearch, setGradeSearch] = useState("");
  const [subjectSearch, setSubjectSearch] = useState("");
  const [currentUserName, setCurrentUserName] = useState("Học viên ẩn danh");
  const [leaderboard, setLeaderboard] = useState(() => {
    try {
      const stored = localStorage.getItem("examLeaderboards");
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return {};
  });

  useEffect(() => {
    try {
      localStorage.setItem("examLeaderboards", JSON.stringify(leaderboard));
    } catch (e) {}
  }, [leaderboard]);

  const [answers, setAnswers] = useState({}); // { [qId]: answerValue }
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  
  // Results states
  const [submitResult, setSubmitResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // DOM References
  const examContainerRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(null);
  
  // AI monitored and scoring states
  const [honestyScore, setHonestyScore] = useState(100.0);
  const [mockExamMode, setMockExamMode] = useState(false);
  const [flashActive, setFlashActive] = useState(false);
  const [aiMonitoredExams, setAiMonitoredExams] = useState({});

  const getExamLeaderboard = (examId) => {
    return leaderboard[examId] || [];
  };



  const getNormalizedGrade = (exam) => {
    if (!exam) return "Khác";
    const text = `${exam.title || ""} ${exam.description || ""} ${exam.subject || ""}`.toLowerCase();
    
    if (text.includes("thpt quốc gia") || text.includes("thpt qg") || text.includes("đại học") || text.includes("thptqg")) {
      return "Đại học / THPT QG";
    }
    if (text.includes("lớp 12") || text.includes("lớp học 12") || text.includes("12") || text.includes("este") || text.includes("amin") || text.includes("hóa học")) {
      return "Lớp 12";
    }
    if (text.includes("lớp 11") || text.includes("lớp học 11") || text.includes("11")) {
      return "Lớp 11";
    }
    if (text.includes("lớp 10") || text.includes("lớp học 10") || text.includes("10") || text.includes("động học chất điểm") || text.includes("vật lý")) {
      return "Lớp 10";
    }
    
    return "Khác";
  };

  const [currentPage, setCurrentPage] = useState(1);
  const EXAMS_PER_PAGE = 12;

  const filteredExams = React.useMemo(() => {
    return exams.filter((exam) => {
      // 1. Grade/Level Filter
      if (selectedGrade !== "Tất cả") {
        const grade = getNormalizedGrade(exam);
        if (grade !== selectedGrade) return false;
      }
      
      // 2. Subject Filter
      if (selectedSubject !== "Tất cả") {
        const sub = getNormalizedSubjectGroup(exam.subject);
        if (sub !== selectedSubject) return false;
      }
      
      return true;
    });
  }, [exams, selectedGrade, selectedSubject]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedSubject, selectedGrade]);

  const indexOfLastExam = currentPage * EXAMS_PER_PAGE;
  const indexOfFirstExam = indexOfLastExam - EXAMS_PER_PAGE;
  const paginatedExams = filteredExams.slice(indexOfFirstExam, indexOfLastExam);
  const totalPages = Math.ceil(filteredExams.length / EXAMS_PER_PAGE);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const mainContent = document.querySelector("main") || document.querySelector(".overflow-y-auto");
    if (mainContent) {
      mainContent.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentPage]);

  useEffect(() => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const u = JSON.parse(userStr);
        setCurrentUserName(u.name || u.fullName || u.username || "Học viên ẩn danh");
      }
    } catch (e) {}
  }, []);

  // --- AUDIO GENERATOR (Web Audio API) ---
  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const playTone = (time, freq) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = "sine";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.12, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.18);
        osc.start(time);
        osc.stop(time + 0.18);
      };
      playTone(audioCtx.currentTime, 860);
      playTone(audioCtx.currentTime + 0.15, 860);
    } catch (e) {
      console.warn("[Audio] Lỗi không thể phát âm thanh cảnh báo:", e);
    }
  };

  // --- FETCH EXAMS LIST ---
  useEffect(() => {
    const fetchExamsList = async () => {
      try {
        setIsLoadingExams(true);
        const data = await examApi.getExams();
        console.log("Raw getExams API response:", data);
        
        // Robust extraction covering raw array, data wrapping, result wrapping, content wrapping (Pageable)
        let actualData = null;
        if (Array.isArray(data)) {
          actualData = data;
        } else if (data) {
          if (Array.isArray(data.data)) actualData = data.data;
          else if (Array.isArray(data.result)) actualData = data.result;
          else if (Array.isArray(data.content)) actualData = data.content;
          else if (data.data && Array.isArray(data.data.content)) actualData = data.data.content;
          else if (data.result && Array.isArray(data.result.content)) actualData = data.result.content;
        }
        
        setExams(actualData || fallbackExams);
      } catch (err) {
        console.warn("[ExamApi] Kết nối API thất bại, sử dụng dữ liệu giả lập.", err);
        setExams(fallbackExams);
      } finally {
        setIsLoadingExams(false);
      }
    };
    fetchExamsList();
  }, []);

  // --- COUNTDOWN TIMER ---
  useEffect(() => {
    if (activeTab === "testing" && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleAutoSubmit(honestyScore);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeTab, timeLeft]);

  // --- WEBCAM MONITORING EFFECT ---
  useEffect(() => {
    if (activeTab === "testing" && mockExamMode) {
      navigator.mediaDevices.getUserMedia({ video: { width: 200, height: 200 } })
        .then((stream) => {
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.warn("[Webcam] Không thể mở webcam:", err);
          toast.error(t("exam_portal.proctoring_toast_camera_required", { defaultValue: "Vui lòng cấp quyền truy cập Camera để kích hoạt chế độ Giám sát AI!" }));
        });
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    }
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [activeTab, mockExamMode]);

  // --- STRICT FULLSCREEN & TAB ACTIVE DETECTORS (MOCK EXAM MODE) ---
  useEffect(() => {
    if (activeTab !== "testing" || !mockExamMode) return;

    // Detect exiting fullscreen
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        triggerCheatingViolation("Thoát chế độ toàn màn hình");
      }
    };

    // Detect tab switching
    const handleVisibilityChange = () => {
      if (document.hidden) {
        triggerCheatingViolation("Chuyển sang tab khác");
      }
    };

    // Detect browser window blur
    const handleWindowBlur = () => {
      triggerCheatingViolation("Rời con trỏ ngoài cửa sổ thi");
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
    };
  }, [activeTab, mockExamMode]);

  // --- ANTI-COPY-PASTE & RIGHT-CLICK ---
  useEffect(() => {
    if (activeTab !== "testing") return;

    const handleContextMenu = (e) => {
      e.preventDefault();
      toast.error(t("exam_portal.proctoring_toast_right_click_blocked", { defaultValue: "Hành vi kích chuột phải đã bị chặn trong kỳ thi!" }));
    };

    const handleKeyDown = (e) => {
      const isCtrlC = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "c";
      const isCtrlV = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "v";
      const isCtrlA = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "a";
      
      if (isCtrlC || isCtrlV || isCtrlA) {
        e.preventDefault();
        toast.error(t("exam_portal.proctoring_toast_copy_paste_blocked", { defaultValue: "Không được phép sao chép/dán trong lúc làm bài!" }));
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeTab]);

  // --- VIOLATION TRIGGER ---
  const triggerCheatingViolation = (reason) => {
    if (!isReadyForMonitoringRef.current) {
      console.log(`[AI Monitor] Bỏ qua cảnh báo vi phạm [${reason}] trong thời gian chuẩn bị phòng thi.`);
      return;
    }
    
    playBeep();
    setFlashActive(true);
    setTimeout(() => setFlashActive(false), 600);
    
    toast.error(t("exam_portal.proctoring_violation_alert", { reason: getReasonLabel(reason), defaultValue: "CẢNH BÁO: Phát hiện hành vi [{{reason}}]! Điểm trung thực giảm 15%." }));
    
    setHonestyScore((prev) => {
      const nextScore = Math.max(0, prev - 15);
      if (nextScore < 50) {
        // Run auto-submit directly with delay
        setTimeout(() => {
          handleAutoSubmit(nextScore);
        }, 300);
      }
      return nextScore;
    });
  };

  // --- PREVIEW EXAM & LOAD DETAILS ---
  const handleSelectExamForPreview = async (exam) => {
    setSelectedExam(exam);
    setIsLoadingDetail(true);
    setActiveTab("preview");

    try {
      const detail = await examApi.getExamDetail(exam.id);
      console.log("Raw getExamDetail API response:", detail);
      
      let unwrapped = null;
      if (detail) {
        if (Array.isArray(detail.questions)) {
          unwrapped = detail;
        } else if (detail.data && Array.isArray(detail.data.questions)) {
          unwrapped = detail.data;
        } else if (detail.result && Array.isArray(detail.result.questions)) {
          unwrapped = detail.result;
        } else if (Array.isArray(detail)) {
          unwrapped = { questions: detail };
        } else if (detail.data && Array.isArray(detail.data)) {
          unwrapped = { questions: detail.data };
        } else if (detail.result && Array.isArray(detail.result)) {
          unwrapped = { questions: detail.result };
        } else {
          const possibleKeys = ["questionList", "examQuestions", "listQuestion", "content"];
          for (const key of possibleKeys) {
            if (Array.isArray(detail[key])) {
              unwrapped = { ...detail, questions: detail[key] };
              break;
            }
            if (detail.data && Array.isArray(detail.data[key])) {
              unwrapped = { ...detail.data, questions: detail.data[key] };
              break;
            }
            if (detail.result && Array.isArray(detail.result[key])) {
              unwrapped = { ...detail.result, questions: detail.result[key] };
              break;
            }
          }
        }
      }
      
      const rawDetail = unwrapped || fallbackExamDetails[exam.id];
      setExamDetail(normalizeExamDetail(rawDetail));
    } catch (err) {
      console.warn("[ExamApi] Không tải được chi tiết đề, sử dụng dữ liệu giả lập.", err);
      const rawDetail = fallbackExamDetails[exam.id] || fallbackExamDetails[1];
      setExamDetail(normalizeExamDetail(rawDetail));
    } finally {
      setIsLoadingDetail(false);
    }
  };

  // --- EXAM START/START ROOM ACTION ---
  const handleStartExam = async (exam) => {
    isReadyForMonitoringRef.current = false;
    setTimeout(() => {
      isReadyForMonitoringRef.current = true;
    }, 6000); // 6 seconds grace period
    
    // Check if AI monitor toggle was active
    const isAiMode = !!aiMonitoredExams[exam.id];
    setMockExamMode(isAiMode);
    setHonestyScore(100.0);
    setAnswers({});
    setActiveQuestionIndex(0);
    const duration = exam.durationMinutes || exam.duration || 15;
    setTimeLeft(duration * 60);
    
    setActiveTab("testing");
    
    // Enter Fullscreen if AI monitor enabled
    if (isAiMode) {
      setTimeout(() => {
        try {
          if (examContainerRef.current) {
            if (examContainerRef.current.requestFullscreen) {
              examContainerRef.current.requestFullscreen();
            }
          }
        } catch (err) {
          console.warn(t("exam_portal.proctoring_warn_fullscreen_failed", { defaultValue: "Không thể tự động kích hoạt Fullscreen:" }), err);
        }
      }, 500);
    }
  };

  // --- AUTO SUBMISSION PROCESS ---
  const handleAutoSubmit = async (finalHonesty) => {
    if (isSubmitting || activeTab !== "testing") return;
    
    // Tắt giám sát trước khi thoát fullscreen
    isReadyForMonitoringRef.current = false;
    
    toast.error(t("exam_portal.proctoring_toast_exam_locked", { defaultValue: "KỲ THI ĐÃ KHÓA: Điểm trung thực quá thấp hoặc hết thời gian. Đang nộp bài tự động..." }));
    
    // Exit Fullscreen if active
    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch (err) {
        console.warn(err);
      }
    }
    
    await executeSubmission(finalHonesty);
  };

  // --- SUBMIT CONFIRM BUTTON CLICK ---
  const handleManualSubmit = async () => {
    // Tắt giám sát trước khi hiện confirm modal (nó sẽ làm mất focus trình duyệt)
    isReadyForMonitoringRef.current = false;

    if (window.confirm("Bạn có chắc chắn muốn nộp bài thi ngay bây giờ?")) {
      if (document.fullscreenElement) {
        try {
          await document.exitFullscreen();
        } catch (err) {
          console.warn(err);
        }
      }
      await executeSubmission(honestyScore);
    } else {
      // Nếu hủy nộp bài, kích hoạt lại giám sát sau 1 giây
      setTimeout(() => {
        isReadyForMonitoringRef.current = true;
      }, 1000);
    }
  };

  // --- EXECUTING SUBMISSION API CALL ---
  const executeSubmission = async (finalHonesty) => {
    setIsSubmitting(true);
    
    // Format answers matching backend expectation
    const formattedAnswers = {};
    Object.keys(answers).forEach((qId) => {
      formattedAnswers[qId] = answers[qId];
    });

    const payload = {
      answers: formattedAnswers,
      honestyScore: finalHonesty
    };

    try {
      const result = await examApi.submitExam(selectedExam.id, payload);
      console.log("Raw submitExam API response:", result);
      
      const apiData = result?.data || result?.result || result;
      let normalizedResult = null;
      
      if (apiData && (apiData.details || apiData.score !== undefined)) {
        const detailsArray = apiData.details || [];
        const resultsMap = {};
        
        detailsArray.forEach((d) => {
          let uAns = d.userAnswer;
          if (typeof uAns === "string" && (uAns.startsWith("{") || uAns.startsWith("["))) {
            try { uAns = JSON.parse(uAns); } catch(e) {}
          }
          let cAns = d.correctAnswer;
          if (typeof cAns === "string" && (cAns.startsWith("{") || cAns.startsWith("["))) {
            try { cAns = JSON.parse(cAns); } catch(e) {}
          }
          resultsMap[d.questionId] = {
            isCorrect: d.isCorrect,
            userAnswer: uAns,
            correctAnswer: cAns,
            explanation: d.explanation
          };
        });
        
        normalizedResult = {
          score: apiData.score,
          correctCount: apiData.correctCount,
          totalPoints: apiData.score,
          honestyScore: apiData.honestyScore,
          status: apiData.status,
          results: resultsMap
        };
      } else {
        const unwrappedResult = result?.results 
          ? result 
          : (result?.data?.results 
              ? result.data 
              : (result?.result?.results ? result.result : null));
              
        normalizedResult = unwrappedResult || fallbackSubmitResult;
        if (normalizedResult && !normalizedResult.results && normalizedResult.resultsMap) {
          normalizedResult = {
            ...normalizedResult,
            results: normalizedResult.resultsMap
          };
        }
      }
      
      setSubmitResult(normalizedResult);
      
      // Calculate time spent
      const durationMinutes = selectedExam ? (selectedExam.durationMinutes || selectedExam.duration || 15) : 15;
      const timeSpentSeconds = durationMinutes * 60 - timeLeft;
      const finalScore = normalizedResult?.score !== undefined ? normalizedResult.score : fallbackSubmitResult.score;
      
      // Add result to exam-specific leaderboard
      const newLeaderboardEntry = {
        name: currentUserName || "Học viên ẩn danh",
        score: finalScore,
        timeSeconds: timeSpentSeconds,
        date: "Vừa xong"
      };

      setLeaderboard((prev) => {
        const examId = selectedExam.id;
        const currentList = prev[examId] || [];
        const updated = [...currentList, newLeaderboardEntry];
        const sorted = updated.sort((a, b) => {
          if (Number(b.score) !== Number(a.score)) {
            return Number(b.score) - Number(a.score);
          }
          return Number(a.timeSeconds) - Number(b.timeSeconds);
        });
        return {
          ...prev,
          [examId]: sorted
        };
      });
    } catch (err) {
      console.warn("[ExamApi] Lỗi kết nối gửi bài, sử dụng kết quả giả lập.", err);
      setSubmitResult(fallbackSubmitResult);
    } finally {
      setIsSubmitting(false);
      setActiveTab("result");
    }
  };

  // --- FORM INPUT UTILITIES ---
  const handleSelectSingleChoice = (questionId, optionKey) => {
    // optionKey is "A", "B", "C", "D"
    setAnswers({
      ...answers,
      [questionId]: optionKey
    });
  };

  const handleSelectTrueFalse = (questionId, subKey, value) => {
    // value is "T" or "F"
    const currentAns = { ...(answers[questionId] || {}) };
    currentAns[subKey] = value;
    setAnswers({
      ...answers,
      [questionId]: currentAns
    });
  };

  const handleSelectShortAnswer = (questionId, textVal) => {
    setAnswers({
      ...answers,
      [questionId]: textVal
    });
  };

  const toggleAiMode = (examId) => {
    setAiMonitoredExams((prev) => ({
      ...prev,
      [examId]: !prev[examId]
    }));
  };

  // Helpers for Icons & Backgrounds
  const getSubjectColor = (subject) => {
    const normalized = getNormalizedSubjectGroup(subject);
    switch (normalized) {
      case "Toán học":
        return { bg: "bg-blue-50 text-blue-600 border-blue-100", icon: <TbMath size={18} /> };
      case "Vật lý":
        return { bg: "bg-indigo-50 text-indigo-600 border-indigo-100", icon: <TbAtom size={18} /> };
      case "Hóa học":
        return { bg: "bg-emerald-50 text-emerald-600 border-emerald-100", icon: <TbFlask size={18} /> };
      default:
        return { bg: "bg-zinc-50 text-zinc-600 border-zinc-150", icon: <TbSchool size={18} /> };
    }
  };

  const formatSeconds = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="relative min-h-[90vh] bg-slate-50/40 px-4 py-8 md:px-8 md:py-12 overflow-hidden font-sans">
      {/* Background radial glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-[125px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-[125px] pointer-events-none" />

      {/* FLASH ON CHEATING ATTEMPT */}
      <AnimatePresence>
        {flashActive && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 border-8 border-red-500 bg-red-600/10 pointer-events-none"
          />
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* ========================================================================= */}
        {/* LUỒNG 1: TRANG CHỦ BENTO CHỌN ĐỀ THI                                      */}
        {/* ========================================================================= */}
        {activeTab === "portal" && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-10"
          >
            {/* Header Content */}
            <div className="flex flex-col gap-2">
              <span className="text-sm font-black tracking-[0.2em] text-indigo-600 uppercase flex items-center gap-1.5">
                <TbActivity size={14} className="animate-pulse" />
                {t("exam_portal.national_system", { defaultValue: "Hệ Thống Khảo Thí Quốc Gia" })}
              </span>
              <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight">
                {t("exam_portal.title")}
              </h1>
              <p className="text-[15px] text-slate-605 max-w-[65ch] leading-relaxed">
                {t("exam_portal.subtitle")}
              </p>
            </div>

            {/* Glassmorphism Bento Grid Layout */}
            <div className="grid grid-cols-12 gap-6 items-stretch">
              
              {/* Top Horizontal AI Monitoring Bento Tile (col-span-12) */}
              <div className="col-span-12 bg-white/70 backdrop-blur-md border border-slate-200/50 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-indigo-500/10 blur-2xl group-hover:scale-125 transition-transform duration-500 pointer-events-none" />
                
                <div className="flex flex-col lg:flex-row gap-6 justify-between items-stretch">
                  {/* Left part: Title & Intro */}
                  <div className="flex-1 min-w-[280px] flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                          <TbAlertCircle size={22} />
                        </div>
                        <h3 className="text-[19px] font-black text-slate-800">{t("exam_portal.ai_monitor_title")}</h3>
                      </div>
                      <p className="text-[14px] text-slate-600 leading-relaxed">
                        {t("exam_portal.ai_monitor_desc")}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2.5 pt-2 lg:pt-0">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-bold text-slate-500">{t("exam_portal.proctoring_environment_status", { defaultValue: "Môi trường thi trực tuyến an toàn" })}</span>
                    </div>
                  </div>

                  {/* Right part: Features Grid */}
                  <div className="flex-[2] grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-2xl bg-indigo-50/20 border border-indigo-100/30 flex gap-3 items-start">
                      <div className="w-7 h-7 rounded-lg bg-emerald-55 flex items-center justify-center text-emerald-600 shrink-0">
                        <TbCheck size={16} />
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[12.5px] font-black text-indigo-600 block">{t("exam_portal.camera_monitoring_label", { defaultValue: "GIÁM SÁT CAMERA" })}</span>
                        <p className="text-[12px] text-slate-655 leading-normal">{t("exam_portal.camera_monitoring_desc", { defaultValue: "Giám sát camera ghi hình liên tục trong suốt phòng thi." })}</p>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-indigo-50/20 border border-indigo-100/30 flex gap-3 items-start">
                      <div className="w-7 h-7 rounded-lg bg-emerald-55 flex items-center justify-center text-emerald-600 shrink-0">
                        <TbCheck size={16} />
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[12.5px] font-black text-indigo-600 block">{t("exam_portal.anti_cheat_label", { defaultValue: "CHỐNG GIAN LẬN" })}</span>
                        <p className="text-[12px] text-slate-655 leading-normal">{t("exam_portal.anti_cheat_desc", { defaultValue: "Cảnh báo nếu đổi tab, rời màn hình, nhấp chuột phải." })}</p>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-indigo-50/20 border border-indigo-100/30 flex gap-3 items-start">
                      <div className="w-7 h-7 rounded-lg bg-emerald-55 flex items-center justify-center text-emerald-600 shrink-0">
                        <TbCheck size={16} />
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[12.5px] font-black text-indigo-600 block">{t("exam_portal.honesty_score_label", { defaultValue: "ĐIỂM TRUNG THỰC" })}</span>
                        <p className="text-[12px] text-slate-655 leading-normal">{t("exam_portal.honesty_score_desc", { defaultValue: "Chấm điểm trung thực và tự động nộp bài khi vi phạm nhiều lần." })}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Exam Cards Bento Grid (col-span-12) */}
              <div className="col-span-12 space-y-6">
                
                {/* Dropdown Selection Filter Panel */}
                <div className="flex flex-col sm:flex-row gap-4 bg-white/70 backdrop-blur-md border border-slate-200/50 rounded-2xl p-4.5 shadow-sm relative z-30">
                  
                  {/* Grade Dropdown Select */}
                  <div className="flex-1 relative">
                    <label className="block text-[11px] font-black uppercase text-indigo-600 tracking-wider mb-1.5">
                      {t("exam_portal.grade_filter_label", { defaultValue: "Phân loại lớp" })}
                    </label>
                    <button
                      onClick={() => {
                        setIsGradeDropdownOpen(!isGradeDropdownOpen);
                        setIsSubjectDropdownOpen(false);
                      }}
                      className={`w-full bg-white border rounded-xl px-4.5 py-2.5 text-[15px] md:text-[16px] font-black flex items-center justify-between transition-all cursor-pointer ${
                        isGradeDropdownOpen
                          ? "border-indigo-500 text-indigo-600 ring-4 ring-indigo-500/10 bg-indigo-50/20"
                          : selectedGrade !== "Tất cả"
                            ? "border-indigo-500 text-indigo-600 bg-indigo-50/10 shadow-sm"
                            : "border-slate-200 hover:border-indigo-400 text-slate-700"
                      }`}
                    >
                      <span>{getGradeLabel(selectedGrade)}</span>
                      <span className={`transition-transform duration-200 ${
                        isGradeDropdownOpen 
                          ? "transform rotate-180 text-indigo-600" 
                          : selectedGrade !== "Tất cả"
                            ? "text-indigo-500 font-bold"
                            : "text-slate-400"
                      }`}>▼</span>
                    </button>

                    {isGradeDropdownOpen && (
                      <div className="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-50 max-h-[280px] overflow-y-auto p-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="p-1 mb-1.5">
                          <input
                            type="text"
                            placeholder={t("exam_portal.grade_search_placeholder", { defaultValue: "Tìm kiếm lớp..." })}
                            value={gradeSearch}
                            onChange={(e) => setGradeSearch(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 font-bold text-slate-700"
                          />
                        </div>
                        {["Tất cả", "Đại học / THPT QG", "Lớp 12", "Lớp 11", "Lớp 10"]
                          .filter(g => getGradeLabel(g).toLowerCase().includes(gradeSearch.toLowerCase()))
                          .map((grade) => {
                            const isSelected = selectedGrade === grade;
                            return (
                              <button
                                key={getGradeLabel(grade)}
                                onClick={() => {
                                    setSelectedGrade(grade);
                                    setIsGradeDropdownOpen(false);
                                    setGradeSearch("");
                                }}
                                className={`w-full text-left px-3.5 py-2 text-[14.5px] md:text-[15px] font-extrabold rounded-lg transition-all cursor-pointer ${
                                  isSelected
                                    ? "bg-indigo-50 text-indigo-600 font-black"
                                    : "text-slate-700 hover:bg-indigo-50/50 hover:text-indigo-600"
                                }`}
                              >
                                {getGradeLabel(grade)}
                              </button>
                            );
                          })}
                      </div>
                    )}
                  </div>

                  {/* Subject Dropdown Select */}
                  <div className="flex-1 relative">
                    <label className="block text-[11px] font-black uppercase text-indigo-600 tracking-wider mb-1.5">
                      {t("exam_portal.details_subject")}
                    </label>
                    <button
                      onClick={() => {
                        setIsSubjectDropdownOpen(!isSubjectDropdownOpen);
                        setIsGradeDropdownOpen(false);
                      }}
                      className={`w-full bg-white border rounded-xl px-4.5 py-2.5 text-[15px] md:text-[16px] font-black flex items-center justify-between transition-all cursor-pointer ${
                        isSubjectDropdownOpen
                          ? "border-indigo-500 text-indigo-600 ring-4 ring-indigo-500/10 bg-indigo-50/20"
                          : selectedSubject !== "Tất cả"
                            ? "border-indigo-500 text-indigo-600 bg-indigo-50/10 shadow-sm"
                            : "border-slate-200 hover:border-indigo-400 text-slate-700"
                      }`}
                    >
                      <span>{getSubjectLabel(selectedSubject)}</span>
                      <span className={`transition-transform duration-200 ${
                        isSubjectDropdownOpen 
                          ? "transform rotate-180 text-indigo-600" 
                          : selectedSubject !== "Tất cả"
                            ? "text-indigo-500 font-bold"
                            : "text-slate-400"
                      }`}>▼</span>
                    </button>

                    {isSubjectDropdownOpen && (
                      <div className="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-50 max-h-[280px] overflow-y-auto p-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="p-1 mb-1.5">
                          <input
                            type="text"
                            placeholder={t("exam_portal.subject_search_placeholder", { defaultValue: "Tìm kiếm môn học..." })}
                            value={subjectSearch}
                            onChange={(e) => setSubjectSearch(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 font-bold text-slate-700"
                          />
                        </div>
                        {["Tất cả", "Toán học", "Vật lý", "Hóa học", "Ngữ văn", "Tiếng Anh"]
                          .filter(s => getSubjectLabel(s).toLowerCase().includes(subjectSearch.toLowerCase()))
                          .map((subject) => {
                            const isSelected = selectedSubject === subject;
                            return (
                              <button
                                key={getSubjectLabel(subject)}
                                onClick={() => {
                                  setSelectedSubject(subject);
                                  setIsSubjectDropdownOpen(false);
                                  setSubjectSearch("");
                                }}
                                className={`w-full text-left px-3.5 py-2 text-[14.5px] md:text-[15px] font-extrabold rounded-lg transition-all cursor-pointer ${
                                  isSelected
                                    ? "bg-indigo-50 text-indigo-600 font-black"
                                    : "text-slate-700 hover:bg-indigo-50/50 hover:text-indigo-600"
                                }`}
                              >
                                {getSubjectLabel(subject)}
                              </button>
                            );
                          })}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                  {isLoadingExams ? (
                    <div className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col items-center justify-center p-12 bg-white/70 backdrop-blur-md border border-slate-200/50 rounded-3xl min-h-[300px]">
                      <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
                      <span className="text-xs font-semibold text-slate-500">{t("exam_portal.loading_exams")}</span>
                    </div>
                  ) : (
                    <>
                      {filteredExams.length === 0 ? (
                        <div className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col items-center justify-center p-12 bg-white/70 backdrop-blur-md border border-slate-200/50 rounded-3xl min-h-[300px]">
                          <span className="text-xs font-semibold text-slate-500">{t("exam_portal.no_exams")}</span>
                        </div>
                      ) : (
                        paginatedExams.map((exam, index) => {
                          const theme = getSubjectColor(exam.subject);
                          const isAiEnabled = !!aiMonitoredExams[exam.id];
                          
                          return (
                            <motion.div
                              key={exam.id}
                              initial={{ opacity: 0, y: 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.08 }}
                              className="bg-white/70 backdrop-blur-md border border-slate-200/50 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-slate-300/60 transition-all duration-300 flex flex-col justify-between"
                            >
                              <div className="space-y-4">
                                {/* Subject Badge */}
                                <div className="flex justify-between items-center">
                                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${theme.bg}`}>
                                    {theme.icon}
                                    {getSubjectLabel(exam.subject)}
                                  </span>
                                  <span className="text-xs text-slate-500 font-bold flex items-center gap-1">
                                    <TbClock size={13} /> {exam.durationMinutes || exam.duration} {t("exam_portal.exam_card.duration_unit", { defaultValue: "phút" })}
                                  </span>
                                </div>

                                {/* Title */}
                                <h3 className="text-[19px] md:text-[20px] font-black text-slate-800 leading-snug group-hover:text-indigo-600 transition-colors">
                                  {exam.title}
                                </h3>

                                {/* Description */}
                                <p className="text-[14.5px] text-slate-600 leading-relaxed line-clamp-2">
                                  {exam.description}
                                </p>

                                {/* Meta items */}
                                <div className="flex items-center gap-3 text-[13px] text-slate-500 font-bold pt-1">
                                  <span className="flex items-center gap-1"><TbListNumbers size={13} /> {exam.questionCount || exam.questions?.length || 0} {t("exam_portal.exam_card.questions_unit", { defaultValue: "Câu hỏi" })}</span>
                                  <span>•</span>
                                  <span>{t("exam_portal.exam_card.max_score", { defaultValue: "Thang điểm 10.0" })}</span>
                                </div>
                              </div>

                              {/* Switch Toggle and Action */}
                              <div className="mt-6 pt-5 border-t border-slate-100 space-y-4">
                                {/* Toggle AI Monitor Switch */}
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-bold text-slate-655 flex items-center gap-1.5 select-none">
                                    <TbVideo size={14} className={isAiEnabled ? "text-emerald-500 animate-pulse" : "text-slate-400"} />
                                    {t("exam_portal.details_proctoring")}
                                  </span>
                                  
                                  {/* Custom Toggle Switch */}
                                  <button
                                    onClick={() => toggleAiMode(exam.id)}
                                    className={`w-10 h-5.5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none relative flex items-center ${
                                      isAiEnabled ? "bg-emerald-500" : "bg-slate-200"
                                    }`}
                                  >
                                    <motion.div 
                                      layout
                                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                      className="w-4.5 h-4.5 bg-white rounded-full shadow-sm"
                                      style={{
                                        position: 'absolute',
                                        left: isAiEnabled ? '21px' : '3px'
                                      }}
                                    />
                                  </button>
                                </div>

                                {/* Play Exam Button */}
                                <button
                                  onClick={() => handleSelectExamForPreview(exam)}
                                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm py-3.5 rounded-2xl shadow-sm hover:shadow-md hover:shadow-indigo-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                >
                                  {t("exam_portal.exam_card.start_btn")} <TbChevronRight size={14} />
                                </button>
                              </div>
                            </motion.div>
                          );
                        })
                      )}

                      {/* Pagination Controls */}
                      {totalPages > 1 && (
                        <div className="col-span-1 md:col-span-2 lg:col-span-3 flex items-center justify-center gap-2 mt-8 z-10">
                          <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                              currentPage === 1
                                ? "bg-slate-50 text-slate-350 border-slate-200 cursor-not-allowed"
                                : "bg-white hover:bg-slate-50 text-slate-700 border-slate-250 active:scale-95 shadow-sm"
                            }`}
                          >
                            <TbChevronLeft size={16} />
                          </button>

                          {Array.from({ length: totalPages }).map((_, i) => {
                            const pageNum = i + 1;
                            const isCurrent = currentPage === pageNum;
                            return (
                              <button
                                key={pageNum}
                                onClick={() => setCurrentPage(pageNum)}
                                className={`w-10 h-10 rounded-xl font-black text-sm flex items-center justify-center transition-all cursor-pointer ${
                                  isCurrent
                                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20 border-none"
                                    : "bg-white hover:bg-slate-50 text-slate-700 border border-slate-250 active:scale-95 shadow-sm"
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          })}

                          <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                              currentPage === totalPages
                                ? "bg-slate-50 text-slate-350 border-slate-200 cursor-not-allowed"
                                : "bg-white hover:bg-slate-50 text-slate-700 border-slate-250 active:scale-95 shadow-sm"
                            }`}
                          >
                            <TbChevronRight size={16} />
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* LUỒNG 1.5: TRANG PREVIEW CHI TIẾT & BẢNG XẾP HẠNG TỪNG BÀI                 */}
        {/* ========================================================================= */}
        {activeTab === "preview" && selectedExam && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300"
          >
            {/* Header / Back Action */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/60">
              <button
                onClick={() => {
                  setActiveTab("portal");
                  setSelectedExam(null);
                  setExamDetail(null);
                }}
                className="flex items-center gap-2 text-sm font-black text-slate-650 hover:text-slate-900 transition-all cursor-pointer bg-white px-4 py-2.5 rounded-xl border border-slate-200 hover:shadow-sm"
              >
                ← {t("exam_portal.results.exit_btn")}
              </button>
              <span className="text-xs font-black uppercase tracking-wider text-indigo-600">
                {t("exam_portal.details_card")}
              </span>
            </div>

            {isLoadingDetail ? (
              <div className="flex flex-col items-center justify-center p-12 bg-white/70 backdrop-blur-md border border-slate-200/50 rounded-3xl min-h-[400px]">
                <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
                <span className="text-xs font-semibold text-slate-500">{t("exam_portal.loading_detail", { defaultValue: "Đang chuẩn bị phòng thi và nạp đề..." })}</span>
              </div>
            ) : (
              <div className="grid grid-cols-12 gap-6 items-stretch">
                {/* Left Column: Leaderboard for this specific exam */}
                {getExamLeaderboard(selectedExam.id).length > 0 && (
                  <div className="col-span-12 lg:col-span-4 flex flex-col justify-between bg-white/70 backdrop-blur-md border border-slate-200/50 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group min-h-[460px]">
                    <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-indigo-500/10 blur-2xl group-hover:scale-125 transition-transform duration-500" />
                    
                    <div className="space-y-6">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider flex items-center gap-1">
                          <TbAward size={12} /> {t("exam_portal.leaderboard")}
                        </span>
                        <h3 className="text-xl font-black text-slate-800 mt-1">{t("exam_portal.leaderboard_title", { defaultValue: "Bảng Vàng Thủ Khoa" })}</h3>
                        <p className="text-xs text-slate-500 mt-1">
                          {t("exam_portal.leaderboard_desc", { defaultValue: "Vinh danh những thành tích xuất sắc nhất của bài thi này." })}
                        </p>
                      </div>

                      <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
                        {getExamLeaderboard(selectedExam.id).map((user, idx) => {
                          const isTop3 = idx < 3;
                          const rankIcons = ["🥇", "🥈", "🥉"];
                          const isCurrentUser = user.name === currentUserName || user.name.includes("Bạn");

                          return (
                            <div
                              key={idx}
                              className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                                isCurrentUser
                                  ? "bg-indigo-50/50 border-indigo-200 shadow-sm"
                                  : "bg-white/40 border-slate-150 hover:bg-white/80"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-lg w-6 text-center">
                                  {isTop3 ? rankIcons[idx] : `${idx + 1}`}
                                </span>
                                <div className="space-y-0.5">
                                  <span className={`text-[13.5px] font-black block leading-none ${
                                    isCurrentUser ? "text-indigo-700" : "text-slate-800"
                                  }`}>
                                    {user.name}
                                  </span>
                                  <span className="text-[10px] text-slate-450 block font-semibold">
                                    {user.date || "Vừa xong"}
                                  </span>
                                </div>
                              </div>

                              <div className="text-right space-y-0.5">
                                <span className="text-sm font-black text-indigo-600 block leading-none">
                                  {user.score.toFixed(1)} {t("exam_portal.score_unit", { defaultValue: "đ" })}
                                </span>
                                <span className="text-[10px] text-slate-550 block font-bold">
                                  {Math.floor(user.timeSeconds / 60)}m {user.timeSeconds % 60}s
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100 mt-6 flex justify-between items-center text-xs text-slate-500 font-semibold">
                      <span>{t("exam_portal.leaderboard_criteria_label", { defaultValue: "Tiêu chí xếp thứ hạng:" })}</span>
                      <span className="text-indigo-600 font-black">{t("exam_portal.leaderboard_criteria_value", { defaultValue: "Điểm cao → Thời gian ít" })}</span>
                    </div>
                  </div>
                )}

                {/* Right Column: Detailed Exam Info & Rules & Camera Config */}
                <div className={`col-span-12 ${
                  getExamLeaderboard(selectedExam.id).length > 0 ? "lg:col-span-8" : ""
                } bg-white/70 backdrop-blur-md border border-slate-200/50 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col justify-between`}>
                  <div className="space-y-6">
                    {/* Subject and Time badges */}
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-2">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getSubjectColor(selectedExam.subject).bg}`}>
                          {getSubjectColor(selectedExam.subject).icon}
                          {getSubjectLabel(selectedExam.subject)}
                        </span>
                        <h2 className="text-2xl md:text-3xl font-black text-slate-800 leading-tight">
                          {selectedExam.title}
                        </h2>
                      </div>
                      
                      <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-indigo-100 bg-indigo-50 text-indigo-600 text-sm font-extrabold shrink-0">
                        <TbClock size={16} />
                        <span>{selectedExam.durationMinutes || selectedExam.duration || 15} {t("exam_portal.exam_card.duration_unit", { defaultValue: "phút" })}</span>
                      </div>
                    </div>

                    <p className="text-[15.5px] text-slate-655 leading-relaxed">
                      {selectedExam.description}
                    </p>

                    <div className="border-t border-slate-100 pt-6 space-y-4">
                      <h4 className="text-sm font-black uppercase text-slate-400 tracking-wider">
                        {t("exam_portal.rules_title", { defaultValue: "Thông tin & Quy chế phòng thi" })}
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* AI monitoring rules card */}
                        <div className="p-4 rounded-2xl bg-indigo-50/30 border border-indigo-100/50 space-y-2">
                          <span className="text-xs font-black text-indigo-600 uppercase tracking-wider block">
                            {t("exam_portal.details_proctoring")}
                          </span>
                          <p className="text-[13px] text-slate-600 leading-relaxed">
                            {t("exam_portal.proctoring_warn_desc", { defaultValue: "Yêu cầu bật Camera để hệ thống theo dõi hành vi làm bài của bạn. Hệ thống sẽ phát cảnh báo nếu phát hiện vi phạm." })}
                          </p>
                        </div>

                        {/* Anti-cheat guidelines card */}
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/50 space-y-2">
                          <span className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                            {t("exam_portal.rules_subtitle", { defaultValue: "Nội quy phòng thi" })}
                          </span>
                          <ul className="text-[12.5px] text-slate-600 space-y-1.5 font-bold">
                            <li className="text-slate-600">• {t("exam_portal.rule_no_switch", { defaultValue: "Không chuyển tab hoặc rời trình duyệt" })}</li>
                            <li className="text-slate-600">• {t("exam_portal.rule_no_right_click", { defaultValue: "Không kích chuột phải, sao chép hoặc dán" })}</li>
                            <li className="text-slate-600">• {t("exam_portal.rule_keep_face", { defaultValue: "Giữ khuôn mặt luôn trong khung hình camera" })}</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Toggle AI Mode inside preview */}
                    <div className="pt-5 flex items-center justify-between border-t border-slate-100">
                      <div className="space-y-0.5">
                        <span className="text-sm font-black text-slate-800 flex items-center gap-1.5">
                          <TbVideo size={16} className={aiMonitoredExams[selectedExam.id] ? "text-emerald-500 animate-pulse" : "text-slate-400"} />
                          {t("exam_portal.activate_proctoring_label", { defaultValue: "Kích hoạt Giám Sát Camera AI" })}
                        </span>
                        <span className="text-xs text-slate-500 block">
                          {t("exam_portal.activate_proctoring_desc", { defaultValue: "Yêu cầu cấp quyền và hiển thị radar giám sát trong phòng thi." })}
                        </span>
                      </div>

                      <button
                        onClick={() => toggleAiMode(selectedExam.id)}
                        className={`w-12 h-6.5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none relative flex items-center cursor-pointer ${
                          aiMonitoredExams[selectedExam.id] ? "bg-emerald-500" : "bg-slate-200"
                        }`}
                      >
                        <motion.div
                          layout
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          className="w-5.5 h-5.5 bg-white rounded-full shadow-sm"
                          style={{
                            position: "absolute",
                            left: aiMonitoredExams[selectedExam.id] ? "23px" : "3px"
                          }}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={() => {
                        setActiveTab("portal");
                        setSelectedExam(null);
                        setExamDetail(null);
                      }}
                      className="w-full sm:flex-1 bg-white hover:bg-slate-50 border border-slate-250 text-slate-700 font-black text-sm py-4 rounded-2xl transition-all cursor-pointer text-center"
                    >
                      {t("register_page.back")}
                    </button>
                    
                    <button
                      onClick={() => handleStartExam(selectedExam)}
                      className="w-full sm:flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm py-4 rounded-2xl shadow-sm hover:shadow-indigo-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {t("exam_portal.details_start")} <TbChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* LUỒNG 2: PHÒNG THI BẢO MẬT CAO                                            */}
        {/* ========================================================================= */}
        {activeTab === "testing" && examDetail && (
          <div ref={examContainerRef} className="bg-slate-50 min-h-screen p-4 md:p-6 flex flex-col justify-between select-none relative overflow-y-auto">
            {/* Top status bar inside room */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-slate-200/50 rounded-2xl p-4 shadow-sm backdrop-blur-md mb-6">
              <div>
                <span className="text-xs font-black uppercase text-indigo-600 tracking-wider">{t("exam_portal.testing_room")}</span>
                <h2 className="text-lg md:text-xl font-black text-slate-800 leading-snug mt-0.5">{examDetail.title}</h2>
              </div>
              
              <div className="flex items-center gap-4 self-end md:self-center">
                {/* Honesty widget */}
                {mockExamMode && (
                  <div className="flex items-center gap-2 border border-emerald-100 bg-emerald-50/50 rounded-xl px-3 py-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-sm font-bold text-slate-600">{t("exam_portal.results.honesty")}:</span>
                    <span className={`text-sm font-black ${honestyScore < 70 ? "text-red-500 animate-pulse" : "text-emerald-600"}`}>
                      {honestyScore}%
                    </span>
                  </div>
                )}

                {/* Clock countdown widget */}
                <div className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-sm font-extrabold ${
                  timeLeft < 180 
                    ? "bg-red-50 text-red-500 border-red-100 animate-pulse" 
                    : "bg-indigo-50 text-indigo-600 border-indigo-100"
                }`}>
                  <TbClock size={16} />
                  <span>{formatSeconds(timeLeft)}</span>
                </div>
              </div>
            </div>

            {/* Split Grid for Questions & Sidebar */}
            <div className="grid grid-cols-12 gap-6 items-start flex-1 min-h-0">
              
              {/* Question Screen Container (col-span-8) */}
              <div className="col-span-12 lg:col-span-8 bg-white border border-slate-200/50 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col justify-between min-h-[420px]">
                
                {/* Question Info Header */}
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                    <span className="text-sm font-black text-indigo-600 uppercase">
                      {t("exam_portal.testing_question", { defaultValue: "CÂU HỎI" })} {activeQuestionIndex + 1} / {examDetail.questions.length}
                    </span>
                    <span className="text-xs text-slate-450 font-bold bg-slate-100 px-3 py-1 rounded-md">
                      {examDetail.questions[activeQuestionIndex].questionType === "SINGLE_CHOICE" && t("exam_portal.type_single", { defaultValue: "Trắc nghiệm chọn một" })}
                      {examDetail.questions[activeQuestionIndex].questionType === "TRUE_FALSE" && t("exam_portal.type_true_false", { defaultValue: "Chọn Đúng/Sai ma trận" })}
                      {examDetail.questions[activeQuestionIndex].questionType === "SHORT_ANSWER" && t("exam_portal.type_short", { defaultValue: "Điền đáp số ngắn" })}
                    </span>
                  </div>

                  {/* Question Content */}
                  <div className="space-y-6">
                    <h3 className="text-[20px] md:text-[22px] font-black text-slate-800 leading-relaxed">
                      {examDetail.questions[activeQuestionIndex].content}
                    </h3>

                    {/* Question Interactive Options */}
                    <div className="pt-2">
                      
                      {/* TYPE 1: SINGLE_CHOICE */}
                      {examDetail.questions[activeQuestionIndex].questionType === "SINGLE_CHOICE" && (
                        <div className="space-y-3.5">
                          {examDetail.questions[activeQuestionIndex].options.map((option) => {
                            const optionKey = option.charAt(0); // "A", "B", "C", "D"
                            const isSelected = answers[examDetail.questions[activeQuestionIndex].id] === optionKey;
                            
                            return (
                              <button
                                key={option}
                                onClick={() => handleSelectSingleChoice(examDetail.questions[activeQuestionIndex].id, optionKey)}
                                className={`w-full text-left px-6 py-4.5 rounded-2xl border text-[17px] md:text-[18px] font-medium transition-all duration-200 flex items-center justify-between active:scale-[0.99] cursor-pointer ${
                                  isSelected 
                                    ? "bg-indigo-50/70 text-indigo-700 border-indigo-300 shadow-sm"
                                    : "bg-white/60 hover:bg-slate-50 text-slate-700 border-slate-200/70"
                                }`}
                              >
                                <span>{option}</span>
                                {isSelected && (
                                  <span className="w-5.5 h-5.5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                                    <TbCheck size={12} strokeWidth={3} />
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* TYPE 2: TRUE_FALSE */}
                      {examDetail.questions[activeQuestionIndex].questionType === "TRUE_FALSE" && (
                        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
                          <table className="w-full border-collapse text-left">
                            <thead>
                              <tr className="bg-slate-50 text-xs font-black text-slate-400 uppercase tracking-wider border-b border-slate-200/70">
                                <th className="py-3.5 px-4">{t("exam_portal.subquestion_label", { defaultValue: "Ý hỏi" })}</th>
                                <th className="py-3.5 px-4 text-center w-28">{t("exam_portal.true_label", { defaultValue: "Đúng (T)" })}</th>
                                <th className="py-3.5 px-4 text-center w-28">{t("exam_portal.false_label", { defaultValue: "Sai (F)" })}</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-[16px] md:text-[17px] text-slate-800 font-medium">
                              {examDetail.questions[activeQuestionIndex].subQuestions.map((subQ) => {
                                const qId = examDetail.questions[activeQuestionIndex].id;
                                const userSubAnswers = answers[qId] || {};
                                const isTrue = userSubAnswers[subQ.key] === "T";
                                const isFalse = userSubAnswers[subQ.key] === "F";

                                return (
                                  <tr key={subQ.key} className="hover:bg-slate-50/20">
                                    <td className="py-4 px-4 font-medium">{subQ.key}. {subQ.text}</td>
                                    <td className="py-3 px-4 text-center">
                                      <button
                                        onClick={() => handleSelectTrueFalse(qId, subQ.key, "T")}
                                        className={`w-20 py-2.5 rounded-xl text-[15px] font-black border transition-all active:scale-[0.98] cursor-pointer ${
                                          isTrue
                                            ? "bg-emerald-50 text-emerald-600 border-emerald-300"
                                            : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                                        }`}
                                      >
                                        {t("exam_portal.testing_true")}
                                      </button>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                      <button
                                        onClick={() => handleSelectTrueFalse(qId, subQ.key, "F")}
                                        className={`w-20 py-2.5 rounded-xl text-[15px] font-black border transition-all active:scale-[0.98] cursor-pointer ${
                                          isFalse
                                            ? "bg-rose-50 text-rose-600 border-rose-300"
                                            : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                                        }`}
                                      >
                                        {t("exam_portal.testing_false")}
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {/* TYPE 3: SHORT_ANSWER */}
                      {examDetail.questions[activeQuestionIndex].questionType === "SHORT_ANSWER" && (
                        <div className="space-y-3">
                          <label className="block text-sm font-black uppercase text-slate-400 tracking-wider">
                            {t("exam_portal.short_answer_label", { defaultValue: "Đáp án / Kết số:" })}
                          </label>
                          <input
                            type="text"
                            placeholder={t("exam_portal.testing_short_placeholder", { defaultValue: "Nhập câu trả lời ngắn của bạn ở đây..." })}
                            value={answers[examDetail.questions[activeQuestionIndex].id] || ""}
                            onChange={(e) => handleSelectShortAnswer(examDetail.questions[activeQuestionIndex].id, e.target.value)}
                            className="w-full border border-slate-200 rounded-2xl px-6 py-4.5 text-[17px] md:text-[18px] text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 bg-slate-50/20 hover:bg-slate-50/50 transition-all font-medium"
                          />
                          <p className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                            <TbInfoCircle size={13} /> Nhập kết số nguyên hoặc số thực thập phân, không chứa ký tự chữ.
                          </p>
                        </div>
                      )}

                    </div>
                  </div>
                </div>

                {/* Question Footer Buttons */}
                <div className="flex justify-between items-center pt-8 border-t border-slate-100 mt-10">
                  <button
                    disabled={activeQuestionIndex === 0}
                    onClick={() => setActiveQuestionIndex(prev => prev - 1)}
                    className="px-5 py-3 border border-slate-250 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none rounded-xl text-sm font-black text-slate-655 transition-all cursor-pointer"
                  >
                    {t("exam_portal.prev_btn", { defaultValue: "Câu Trước" })}
                  </button>

                  <button
                    onClick={() => {
                      if (activeQuestionIndex < examDetail.questions.length - 1) {
                        setActiveQuestionIndex(prev => prev + 1);
                      } else {
                        handleManualSubmit();
                      }
                    }}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-black shadow-sm active:scale-95 transition-all cursor-pointer"
                  >
                    {activeQuestionIndex === examDetail.questions.length - 1 ? "Nộp Bài Thi" : "Câu Tiếp Theo"}
                  </button>
                </div>
              </div>

              {/* Secure Exam Room Right Panel (col-span-4) */}
              <div className="col-span-12 lg:col-span-4 space-y-6">
                
                {/* WEBCAM MONITORING HOVER BOX */}
                {mockExamMode && (
                  <div className="bg-white border border-slate-200/50 rounded-3xl p-5 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden">
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-600 mb-4 flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                      {t("exam_portal.camera_realtime_label", { defaultValue: "Camera AI Giám Sát Realtime" })}
                    </span>
                    
                    {/* Circle Video container with radar border */}
                    <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-emerald-500 shadow-lg bg-slate-900 flex items-center justify-center z-10">
                      {/* Radar sweep effect */}
                      <div className="absolute inset-0 border-2 border-emerald-400/30 rounded-full animate-ping pointer-events-none" />
                      <div className="absolute inset-2 border border-emerald-500/20 rounded-full animate-pulse pointer-events-none" />
                      
                      <video 
                        ref={videoRef}
                        autoPlay 
                        playsInline 
                        muted 
                        className="w-full h-full object-cover transform -scale-x-100"
                      />
                    </div>
                    
                    <p className="text-xs text-slate-500 font-semibold mt-4">
                      {t("exam_portal.camera_realtime_desc", { defaultValue: "Vui lòng giữ khuôn mặt thẳng chính diện với camera, không rời khung hình thi." })}
                    </p>
                  </div>
                )}

                {/* QUESTION MAP DIRECT JUMP */}
                <div className="bg-white border border-slate-200/50 rounded-3xl p-5 shadow-sm">
                  <h3 className="text-sm font-black uppercase text-slate-400 tracking-wider mb-4">{t("exam_portal.testing_card_title")}</h3>
                  <div className="flex flex-wrap gap-2.5">
                    {examDetail.questions.map((q, idx) => {
                      const isAnswered = answers[q.id] !== undefined && answers[q.id] !== "";
                      const isActive = activeQuestionIndex === idx;
                      
                      return (
                        <button
                          key={q.id}
                          onClick={() => setActiveQuestionIndex(idx)}
                          className={`w-10 h-10 rounded-xl text-sm font-black border transition-all active:scale-[0.9] flex items-center justify-center cursor-pointer ${
                            isActive
                              ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/10"
                              : isAnswered
                                ? "bg-indigo-50 text-indigo-600 border-indigo-200 font-bold"
                                : "bg-slate-50/50 text-slate-500 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          {idx + 1}
                        </button>
                      );
                    })}
                  </div>
                  
                  <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold">
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-indigo-600 inline-block" /> {t("exam_portal.legend_active", { defaultValue: "Đang chọn" })}</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-indigo-50 border border-indigo-200 inline-block" /> {t("exam_portal.legend_answered", { defaultValue: "Đã trả lời" })}</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-slate-50 border border-slate-200 inline-block" /> {t("exam_portal.legend_unanswered", { defaultValue: "Chưa làm" })}</span>
                  </div>
                </div>

                {/* SUBMIT WIDGET DIRECT */}
                <div className="bg-white border border-slate-200/50 rounded-3xl p-5 shadow-sm text-center">
                  <p className="text-sm text-slate-655 font-bold mb-4">{t("exam_portal.submit_widget_title", { defaultValue: "Hoàn thành bài thi sớm?" })}</p>
                  <button
                    onClick={handleManualSubmit}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm py-3.5 rounded-2xl shadow-sm active:scale-95 transition-all cursor-pointer"
                  >
                    {t("exam_portal.testing_submit_btn")}
                  </button>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* LUỒNG 3: MÀN HÌNH KẾT QUẢ & LỜI GIẢI CHI TIẾT                             */}
        {/* ========================================================================= */}
        {activeTab === "result" && submitResult && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8 animate-in fade-in zoom-in-95 duration-300"
          >
            {/* Success Confetti Header */}
            <div className="text-center space-y-3 py-6 relative">
              <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-2 shadow-inner">
                <TbConfetti size={32} className="animate-bounce" />
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">{t("exam_portal.results.completed_title", { defaultValue: "Hoàn Thành Bài Thi!" })}</h2>
              <p className="text-xs text-slate-500">{t("exam_portal.results.sync_desc", { defaultValue: "Kết quả điểm số đã được đồng bộ về học bạ cá nhân của bạn." })}</p>
            </div>

            {/* Results Grid Dashboard (Bento Grid) */}
            <div className="grid grid-cols-12 gap-6 items-stretch">
              
              {/* Score card (col-span-4) */}
              <div className="col-span-12 md:col-span-4 bg-white/70 backdrop-blur-md border border-slate-200/50 rounded-3xl p-6 text-center flex flex-col justify-between shadow-sm">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400">{t("exam_portal.results.score")}</span>
                <div className="my-6">
                  <span className="text-6xl font-black text-indigo-600 leading-none">{submitResult.score}</span>
                  <span className="text-lg font-bold text-slate-400"> / 10.0</span>
                </div>
                <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-sm font-semibold text-slate-500">
                  <span>{t("exam_portal.results.outcome_label", { defaultValue: "Kết quả:" })}</span>
                  <span className={`font-bold ${submitResult.score >= 5 ? "text-green-600" : "text-rose-500"}`}>
                    {submitResult.score >= 5 
                      ? t("exam_portal.results.status_passed", { defaultValue: "ĐẠT YÊU CẦU" }) 
                      : t("exam_portal.results.status_failed", { defaultValue: "KHÔNG ĐẠT" })}
                  </span>
                </div>
              </div>

              {/* Statistics details (col-span-4) */}
              <div className="col-span-12 md:col-span-4 bg-white/70 backdrop-blur-md border border-slate-200/50 rounded-3xl p-6 flex flex-col justify-between shadow-sm">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400 text-center block">{t("exam_portal.results.correct_ratio")}</span>
                <div className="space-y-4 my-auto">
                  <div className="flex justify-between items-center text-[15px]">
                    <span className="text-slate-500 font-medium">{t("exam_portal.results.correct")}</span>
                    <span className="text-slate-800 font-bold">{submitResult.correctCount} {t("exam_portal.exam_card.questions_unit", { defaultValue: "câu" })}</span>
                  </div>
                  <div className="flex justify-between items-center text-[15px]">
                    <span className="text-slate-500 font-medium">{t("exam_portal.results.total_weight", { defaultValue: "Tổng điểm trọng số" })}</span>
                    <span className="text-slate-800 font-bold">{submitResult.totalPoints} / 10.0</span>
                  </div>
                  <div className="flex justify-between items-center text-[15px]">
                    <span className="text-slate-500 font-medium">{t("exam_portal.details_duration")}</span>
                    <span className="text-slate-800 font-bold">{selectedExam ? (selectedExam.durationMinutes || selectedExam.duration) : 15} {t("exam_portal.exam_card.duration_unit", { defaultValue: "phút" })}</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-100 text-xs text-slate-400 font-semibold text-center">
                  {t("exam_portal.results.update_time_label", { defaultValue: "Cập nhật lúc:" })} {new Date().toLocaleTimeString()}
                </div>
              </div>

              {/* Honesty Gauge card (col-span-4) */}
              <div className="col-span-12 md:col-span-4 bg-white/70 backdrop-blur-md border border-slate-200/50 rounded-3xl p-6 text-center flex flex-col justify-between shadow-sm">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400">{t("exam_portal.results.honesty")}</span>
                <div className="my-6 space-y-2">
                  <div className="text-5xl font-black tracking-tight" style={{
                    color: submitResult.honestyScore >= 80 ? "#10B981" : submitResult.honestyScore >= 50 ? "#F59E0B" : "#EF4444"
                  }}>
                    {submitResult.honestyScore}%
                  </div>
                  
                  {/* Gauge Bar */}
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mt-3 max-w-[200px] mx-auto">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${submitResult.honestyScore}%`,
                        backgroundColor: submitResult.honestyScore >= 80 ? "#10B981" : submitResult.honestyScore >= 50 ? "#F59E0B" : "#EF4444"
                      }}
                    />
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-sm font-semibold text-slate-500">
                  <span>{t("admin.user_management.table.status")}:</span>
                  <span className={`font-black ${
                    submitResult.honestyScore >= 80 ? "text-emerald-600" : submitResult.honestyScore >= 50 ? "text-amber-600" : "text-rose-500 animate-pulse"
                  }`}>
                    {submitResult.honestyScore >= 80 ? t("exam_portal.results.honesty_good", { defaultValue: "Chấp hành tốt" }) : submitResult.honestyScore >= 50 ? t("exam_portal.results.honesty_warn", { defaultValue: "Cảnh báo vi phạm" }) : t("exam_portal.results.honesty_voided", { defaultValue: "Bị hủy kết quả" })}
                  </span>
                </div>
              </div>

            </div>

            {/* Questions detailed corrections review */}
            <div className="space-y-6 pt-6">
              <h3 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
                <TbListNumbers size={20} /> {t("exam_portal.results.explanation")}
              </h3>
              
              <div className="space-y-5">
                {examDetail && examDetail.questions.map((q, idx) => {
                  const itemResult = submitResult.results[q.id] || { isCorrect: false, correctAnswer: "", userAnswer: "", explanation: t("exam_portal.results.no_explanation", { defaultValue: "Chưa cập nhật giải thích." }) };
                  const isCorrect = itemResult.isCorrect;
                  
                  return (
                    <div 
                      key={q.id}
                      className={`bg-white border rounded-3xl p-6 shadow-sm transition-all duration-300 ${
                        isCorrect ? "border-emerald-200/60" : "border-rose-200/60"
                      }`}
                    >
                      <div className="flex justify-between items-start gap-4 pb-3 border-b border-slate-100 mb-4">
                        <span className="text-sm font-black text-slate-450 uppercase">
                          {t("exam_portal.testing_question", { defaultValue: "CÂU HỎI" })} {idx + 1}
                        </span>
                        
                        {isCorrect ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                            <TbCheck size={14} /> {t("exam_portal.results.correct")}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-100">
                            <TbX size={14} /> {t("exam_portal.results.incorrect")}
                          </span>
                        )}
                      </div>

                      {/* Question content */}
                      <p className="text-[18px] md:text-[19px] font-black text-slate-800 leading-relaxed mb-4">
                        {q.content}
                      </p>

                      {/* User answer vs correct answer */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[15px] md:text-[16px] font-bold bg-slate-50/50 border border-slate-100 rounded-2xl p-4 mb-4">
                        <div className="space-y-1">
                          <span className="text-slate-400 block uppercase tracking-wider text-[11px]">{t("exam_portal.results.your_ans")}</span>
                          <span className={isCorrect ? "text-emerald-600 font-extrabold" : "text-rose-500 font-extrabold"}>
                            {itemResult.userAnswer === null || itemResult.userAnswer === undefined || itemResult.userAnswer === "null" || itemResult.userAnswer === ""
                              ? t("exam_portal.results.unanswered")
                              : typeof itemResult.userAnswer === "object"
                                ? JSON.stringify(itemResult.userAnswer)
                                : itemResult.userAnswer}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-slate-400 block uppercase tracking-wider text-[11px]">{t("exam_portal.results.correct_ans")}</span>
                          <span className="text-indigo-600 font-extrabold">
                            {typeof itemResult.correctAnswer === "object" 
                              ? JSON.stringify(itemResult.correctAnswer)
                              : itemResult.correctAnswer}
                          </span>
                        </div>
                      </div>

                      {/* Explanation box */}
                      {itemResult.explanation && (
                        <div className="bg-indigo-50/30 border border-indigo-100/50 rounded-2xl p-4 text-[16px] text-slate-700 leading-relaxed">
                          <span className="text-xs font-black uppercase text-indigo-600 tracking-wider block mb-1.5 flex items-center gap-1">
                            <TbInfoCircle size={14} /> {t("exam_portal.results.explanation")}
                          </span>
                          {itemResult.explanation}
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>
            </div>

            {/* Back action */}
            <div className="flex justify-center pt-8">
              <button
                onClick={() => {
                  setActiveTab("portal");
                  setSelectedExam(null);
                  setExamDetail(null);
                  setSubmitResult(null);
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm px-8 py-3.5 rounded-2xl shadow-sm hover:shadow active:scale-95 transition-all cursor-pointer"
              >
                {t("exam_portal.results.exit_btn")}
              </button>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
