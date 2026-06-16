# AI Learning Dashboard - Hệ Thống Học Tập Thông Minh Tích Hợp AI

AI Learning Dashboard là một nền tảng E-learning thông minh tích hợp Trí tuệ Nhân tạo (AI) giúp tối ưu hóa trải nghiệm học tập của học viên và tự động hóa quy trình chuẩn bị học liệu của giảng viên. Hệ thống được thiết kế theo kiến trúc Microservices/Services-oriented, tích hợp giám sát hệ thống (Monitoring) và các cổng thanh toán trực tuyến hàng đầu tại Việt Nam.

---

## 📖 Mục lục
1. [Giới thiệu & Mô tả chi tiết](#-giới-thiệu--mô-tả-chi-tiết)
2. [Công nghệ sử dụng (Tech Stack)](#-công-nghệ-sử-dụng-tech-stack)
3. [Cấu trúc thư mục chương trình](#-cấu-trúc-thư-mục-chương-trình)
4. [Các API đặc trưng (Characteristic APIs)](#-các-api-đặc-trưng-characteristic-apis)
5. [Hướng dẫn tạo File cấu hình môi trường (.env)](#-hướng-dẫn-tạo-file-cấu-hình-môi-trường-env)
6. [Hướng dẫn cài đặt & Khởi chạy ứng dụng](#-hướng-dẫn-cài-đặt--khởi-chạy-ứng-dụng)

---

## 🌟 Giới thiệu & Mô tả chi tiết

Hệ thống cung cấp một giải pháp toàn diện cho việc học tập trực tuyến, nổi bật với khả năng tương tác thông minh nhờ vào các mô hình ngôn ngữ lớn (LLM):

*   **Học tập và Tương tác Video**: Học viên có thể xem các bài giảng video. Hệ thống hỗ trợ cả video tải lên trực tiếp và video từ Youtube.
*   **Tự động bóc băng Video (Transcription)**: Khi bài giảng được tải lên, dịch vụ AI sẽ tự động phân tích và chuyển đổi giọng nói thành văn bản (Speech-to-Text) có gắn mốc thời gian (timestamps) chính xác, hỗ trợ cả tiếng Anh và tiếng Việt.
*   **Trợ lý học tập thông minh (Chatbot RAG)**: Mỗi bài học có một Chatbot riêng biệt. Học viên có thể đặt câu hỏi xoay quanh nội dung bài giảng. Chatbot sử dụng kỹ thuật RAG (Retrieval-Augmented Generation) để truy vấn thông tin chính xác từ văn bản bóc băng của chính bài học đó.
*   **Tự động tạo câu hỏi ôn tập (Quiz Generator)**: Giảng viên có thể yêu cầu AI tự động tạo các câu hỏi trắc nghiệm (bao gồm các phương án lựa chọn và giải thích chi tiết đáp án) dựa trên nội dung bài giảng vừa học.
*   **Hệ thống thi cử trực tuyến (Exam Service)**: Dịch vụ độc lập cung cấp các bài thi thử, lưu trữ lịch sử làm bài và thống kê điểm số trực quan.
*   **Tích hợp thanh toán số**: Hỗ trợ thanh toán các khóa học mất phí hoặc đăng ký tài khoản Premium thông qua **VNPay** và **MoMo**. Tự động mở khóa khóa học sau khi thanh toán thành công, ghi nhận lịch sử giao dịch và hỗ trợ xuất hóa đơn điện tử dạng PDF.
*   **Giám sát Hệ thống (System Monitoring)**: Tích hợp Prometheus và Grafana để thu thập thông số (metrics) của backend Spring Boot, trực quan hóa sức khỏe hệ thống, RAM, CPU, số lượng request và các hoạt động của hệ thống theo thời gian thực.

---

## 🛠 Công nghệ sử dụng (Tech Stack)

 Dưới đây là danh sách chi tiết các công nghệ được sử dụng trong toàn bộ hệ thống:

### 1. Frontend
*   **Core**: [React 19](https://react.dev/) & [Vite](https://vitejs.dev/) (Tối ưu tốc độ build và hot-reload).
*   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (Hệ thống CSS utility-first hiện đại).
*   **Routing & Network**: `react-router-dom` (V7), [Axios](https://axios-http.com/) (Kết nối API).
*   **Realtime Communication**: `sockjs-client` & `@stomp/stompjs` (WebSockets cho hệ thống chat và thông báo thời gian thực).
*   **Hiệu ứng & Giao diện**: `motion` (Framer Motion v12 cho micro-animations mượt mà), `lucide-react` & `react-icons`.
*   **Đa ngôn ngữ & Markdown**: `i18next` & `react-i18next` (Chuyển đổi ngôn ngữ Anh - Việt), `react-markdown` (Hiển thị văn bản định dạng markdown từ AI).

### 2. Backend (Main API Service)
*   **Core**: [Java 21](https://www.oracle.com/java/) & [Spring Boot 3.3.5](https://spring.io/projects/spring-boot).
*   **Security & Auth**: Spring Security, OAuth2 Client, OAuth2 Resource Server (JWT tự cấp phát sử dụng thư viện `nimbus-jose-jwt`).
*   **Database & Caching**: PostgreSQL (Lưu trữ dữ liệu quan hệ), Redis Cache (Caching danh sách khóa học, token thu hồi, session).
*   **Tích hợp & Xử lý bất đồng bộ**: Spring WebFlux (WebClient để gọi dịch vụ AI bất đồng bộ), WebSockets (STOMP broker).
*   **Tiện ích bổ sung**: MapStruct (Mapping Object DTO-Entity), Lombok (Giảm thiểu boilerplate code), OpenPDF (Xuất hóa đơn PDF), Spring Mail.

### 3. AI Service (Python FastAPI)
*   **Core**: [Python 3.10+](https://www.python.org/) & [FastAPI](https://fastapi.tiangolo.com/) (Hiệu năng cao, tự động sinh tài liệu Swagger).
*   **Mô hình AI & LLM**: [Groq SDK](https://groq.com/) (Sử dụng model `whisper-large-v3` để bóc băng và `llama-3.3-70b-versatile` cho sinh câu hỏi/chatbot).
*   **RAG & Vector Database**: FAISS / ChromaDB (Lưu trữ và tìm kiếm ngữ cảnh dựa trên độ tương đồng cosine), LangChain / LlamaIndex (Hỗ trợ cấu trúc RAG).
*   **Audio Processing**: FFmpeg & FFprobe (Được nhúng để nén và chia nhỏ file âm thanh dung lượng lớn trước khi gửi qua API của Groq).
*   **Scraping**: `youtube-transcript-api` (Lấy transcript có sẵn từ Youtube làm fallback).

### 4. Exam Service (Microservice phụ trợ)
*   **Core**: Spring Boot 3.x, H2 Database / PostgreSQL phục vụ riêng cho nghiệp vụ thi cử trực tuyến độc lập.

### 5. Infrastructure & DevOps
*   **Containerization**: Docker & Docker Compose (Cấu hình chạy đa môi trường Dev/Prod).
*   **Web Server**: Nginx (Làm Reverse Proxy, cân bằng tải, cấu hình HTTPS Let's Encrypt, gzip nén tài nguyên).
*   **Monitoring Suite**: Prometheus (Thu thập metrics từ actuator endpoint của backend) & Grafana (Vẽ biểu đồ dashboard trực quan hóa chỉ số).

---

## 📁 Cấu trúc thư mục chương trình

```bash
AI-Learning-Dashboard/
│
├── backend/                        # Mã nguồn Backend (Spring Boot)
│   ├── src/main/java/com/ai/learning/backend/
│   │   ├── config/                 # Cấu hình Spring Security, CORS, WebClient, Redis
│   │   ├── controller/             # REST Controllers (Auth, Course, Lesson, User...)
│   │   ├── dto/                    # Data Transfer Objects (Requests & Responses)
│   │   ├── entity/                 # JPA Entities mapping với PostgreSQL
│   │   ├── enums/                  # Các Enum định nghĩa trạng thái và vai trò
│   │   ├── mapper/                 # MapStruct interfaces chuyển đổi Entity <-> DTO
│   │   ├── payment/                # Module thanh toán (VNPay & MoMo integration)
│   │   ├── repository/             # Spring Data JPA Repositories
│   │   └── service/                # Lớp xử lý nghiệp vụ (Business Logic)
│   ├── Dockerfile                  # Hướng dẫn build container cho backend
│   └── pom.xml                     # Quản lý dependency của Maven
│
├── frontend/                       # Mã nguồn Frontend (React + Vite)
│   ├── src/
│   │   ├── api/                    # Quản lý các hàm gọi API (Axios instances)
│   │   ├── components/             # Các component dùng chung (Layout, Navbar, Sidebar)
│   │   ├── context/                # AuthContext lưu trữ trạng thái đăng nhập
│   │   ├── pages/                  # Các trang (Home, Course detail, Chat, Help Center)
│   │   └── i18n/                   # File dịch thuật đa ngôn ngữ (vi.json, en.json)
│   ├── Dockerfile                  # Build React app bằng Nginx trong môi trường Production
│   ├── nginx.conf                  # Cấu hình định tuyến và HTTPS reverse proxy
│   ├── tailwind.config.js          # Cấu hình Tailwind CSS
│   └── package.json                # Quản lý thư viện JavaScript/Node.js
│
├── ai-service/                     # Mã nguồn Dịch vụ AI (FastAPI Python)
│   ├── app/
│   │   ├── api/                    # Định nghĩa routes (/process-video, /generate-quiz, /ai/chat)
│   │   ├── core/                   # Cấu hình hệ thống và đọc biến môi trường
│   │   ├── schemas/                # Pydantic Schemas validate dữ liệu vào/ra
│   │   └── services/               # Logic RAG, tương tác Groq LLM, xử lý file âm thanh
│   ├── storage/                    # Thư mục chứa cơ sở dữ liệu Vector (FAISS) theo từng bài học
│   ├── Dockerfile                  # Build container Python tích hợp cài đặt FFmpeg
│   └── requirements.txt            # Danh sách thư viện Python cần thiết
│
├── prometheus/                     # Cấu hình hệ thống giám sát
│   └── prometheus.yml              # File cấu hình Prometheus kết nối tới backend metric endpoint
│
├── uploads/                        # Thư mục dùng chung chứa video, tài liệu bài học được upload
├── docker-compose.yaml             # File Docker Compose dùng cho môi trường DEVELOPMENT
├── docker-compose.prod.yml        # File Docker Compose dùng cho môi trường PRODUCTION
├── .env.example                    # File cấu hình biến môi trường mẫu
└── README.md                       # Tài liệu hướng dẫn (File này)
```

---

## ⚡ Các API đặc trưng (Characteristic APIs)

### 1. Dịch vụ AI (FastAPI - Port `8000`)
*   `POST /process-video`: Nhận đầu vào là đường dẫn video nội bộ hoặc đường dẫn YouTube. Tiến hành bóc băng (Speech-to-Text) bằng Groq Whisper, chuẩn hóa văn bản, và lưu trữ ngữ cảnh vào Vector Database (FAISS).
*   `POST /generate-quiz`: Tự động tạo ngân hàng câu hỏi trắc nghiệm dựa trên đoạn văn bản (transcript) được truyền lên. Trả về định dạng JSON chuẩn chứa câu hỏi, 4 phương án, đáp án đúng và lời giải chi tiết.
*   `POST /ai/chat`: Nhận câu hỏi học viên, tìm kiếm ngữ cảnh phù hợp trong Vector DB của bài học tương ứng (RAG) và gửi đến LLM để phản hồi chính xác câu hỏi dựa trên nội dung bài học.

### 2. Main Backend (Spring Boot - Port `8080`)
*   `POST /api/v1/auth/token`: Xác thực tài khoản bằng JWT (đăng nhập truyền thống).
*   `POST /api/v1/auth/outbound/authentication?code=...`: Đăng nhập thông qua tài khoản Google (OAuth2).
*   `GET /api/v1/courses`: Truy vấn danh sách khóa học (áp dụng phân trang, tìm kiếm và caching).
*   `POST /api/v1/payments/create-url`: Khởi tạo phiên thanh toán. Nhận thông tin khóa học/gói cước và cổng thanh toán (`VNPAY` hoặc `MOMO`), trả về link dẫn tới trang thanh toán của VNPay/MoMo.
*   `GET /api/v1/payments/vnpay-return` / `momo-ipn`: Nhận phản hồi thanh toán từ các cổng, cập nhật trạng thái hóa đơn, tự động mở khóa khóa học cho học viên và lưu lịch sử giao dịch.
*   `POST /api/v1/lessons/{id}/complete`: Ghi nhận tiến độ học tập của học viên.

### 3. Exam Service (Port `8081`)
*   `GET /api/exams`: Truy xuất danh sách đề thi trắc nghiệm.
*   `POST /api/exams/submit`: Nộp bài làm của học viên, tự động tính điểm và lưu trữ kết quả.

---

## 🔐 Hướng dẫn tạo File cấu hình môi trường (.env)

Để dự án hoạt động chính xác, bạn cần tạo các file `.env` chứa các khóa bí mật của bên thứ ba. Ở thư mục gốc của dự án, chúng tôi cung cấp file `.env.example`. Hãy sao chép và cấu hình lại:

1.  Tại thư mục gốc dự án, tạo file `.env`:
    ```bash
    cp .env.example .env
    ```
2.  Điền các thông tin môi trường của bạn:

```env
# =========================================================================
# DATABASE (PostgreSQL)
# =========================================================================
POSTGRES_USER=root
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=ai_learning_dashboard

# =========================================================================
# BACKEND (Spring Boot)
# =========================================================================
SPRING_PROFILES_ACTIVE=dev # Sử dụng 'prod' nếu chạy production
SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/ai_learning_dashboard
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=your_secure_password

JWT_SIGNER_KEY=viet_signer_key_an_toan_co_do_dai_toi_thieu_64_ky_tu_123456

# Google OAuth2 Credentials
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

# URL chuyển hướng sau khi đăng nhập thành công
OAUTH2_REDIRECT_URI=http://localhost:5173/oauth2/callback
FRONTEND_URL=http://localhost:5173

# VNPay Sandbox credentials
VNPAY_TMN_CODE=your_vnpay_tmn_code
VNPAY_SECRET_KEY=your_vnpay_hash_secret
VNPAY_PAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=http://localhost:8080/api/payment/vnpay-return

# MoMo Test credentials
MOMO_PARTNER_CODE=your_momo_partner_code
MOMO_ACCESS_KEY=your_momo_access_key
MOMO_SECRET_KEY=your_momo_secret_key
MOMO_ENDPOINT=https://test-payment.momo.vn/v2/gateway/api/create

# =========================================================================
# AI SERVICE (FastAPI - Python)
# =========================================================================
GROQ_API_KEY=gsk_your_groq_api_key_from_console_groq_com
GROQ_API_BASE=https://api.groq.com/openai/v1
```

---

## 🚀 Hướng dẫn cài đặt & Khởi chạy ứng dụng

### Yêu cầu hệ thống (Prerequisites)
*   **Docker & Docker Compose** (Khuyên dùng để triển khai nhanh nhất).
*   Nếu chạy local không qua Docker:
    *   Java 21 JDK.
    *   Node.js v18+.
    *   Python 3.10+ & FFmpeg (Cần được thêm vào biến môi trường PATH hệ thống).
    *   PostgreSQL 15 & Redis server đang chạy.

---

### Phương án 1: Sử dụng Docker Compose (Được khuyến nghị)

Docker Compose tự động thiết lập toàn bộ môi trường bao gồm: Database PostgreSQL, Cache Redis, Backend API, AI Service, Frontend (Nginx), Prometheus, Grafana và Exam Service.

#### Môi trường Phát triển (Development - Local)
Sử dụng file cấu hình phát triển mặc định. Trong chế độ này, frontend sẽ được host trực tiếp từ code và backend kết nối DB local cấu hình sẵn:
```bash
# Khởi chạy tất cả dịch vụ ở chế độ background
docker-compose up -d --build

# Kiểm tra trạng thái của các container đang chạy
docker-compose ps

# Xem log thời gian thực của backend hoặc ai-service
docker-compose logs -f backend
docker-compose logs -f ai-service
```
*   **Frontend**: Truy cập tại [http://localhost:5173](http://localhost:5173) (hoặc Port `80` tùy thuộc vào Dockerfile).
*   **Backend REST APIs**: Truy cập tại [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html) để xem tài liệu API.
*   **FastAPI Docs**: Truy cập tại [http://localhost:8000/docs](http://localhost:8000/docs).

#### Môi trường Production (Deploy lên Server)
Môi trường production sử dụng Nginx để cấu hình HTTPS, nén gzip và reverse proxy cho các service thông qua domain:
```bash
# Chạy dự án bằng cấu hình production
docker-compose -f docker-compose.prod.yml up -d --build

# Dừng hệ thống production
docker-compose -f docker-compose.prod.yml down
```
> [!IMPORTANT]
> Khi chạy môi trường Production, hãy chắc chắn bạn đã cấu hình SSL Let's Encrypt tại đường dẫn `/etc/letsencrypt` trên máy chủ và cập nhật đúng Domain Name trong file `frontend/nginx.conf`.

---

### Phương án 2: Chạy trực tiếp trên máy vật lý (Local Run)

Nếu bạn muốn chạy từng dịch vụ một cách thủ công để debug/phát triển:

#### 1. Khởi chạy Database & Cache (Dùng Docker cho nhanh)
```bash
docker run -d --name local-postgres -e POSTGRES_USER=root -e POSTGRES_PASSWORD=root -e POSTGRES_DB=ai_learning_dashboard -p 5432:5432 postgres:15-alpine
docker run -d --name local-redis -p 6379:6379 redis:7-alpine
```

#### 2. Khởi chạy AI Service (FastAPI)
```bash
cd ai-service
# Tạo môi trường ảo Python
python -m venv .venv
source .venv/bin/activate  # Trên Windows dùng: .venv\Scripts\activate

# Cài đặt các thư viện phụ thuộc
pip install -r requirements.txt

# Chạy FastAPI server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

#### 3. Khởi chạy Backend (Spring Boot)
Đảm bảo bạn đã điền các biến môi trường trong file cấu hình dev hoặc tạo biến hệ thống tương ứng:
```bash
cd backend
# Build và chạy ứng dụng Spring Boot
./mvnw spring-boot:run
```

#### 4. Khởi chạy Frontend (React + Vite)
```bash
cd frontend
# Cài đặt các package NodeJS
npm install

# Khởi chạy Web Server phát triển
npm run dev
```
Truy cập ứng dụng tại địa chỉ: [http://localhost:5173](http://localhost:5173).
