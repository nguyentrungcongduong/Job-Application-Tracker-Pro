
bản phân tích nghiệp vụ chi tiết cho ý tưởng “Job Application Tracker Pro”

1. Phân Tích Người Dùng & Bài Toán

(User & Problem Analysis)

1.1. User Personas
Persona 1: Sinh viên mới ra trường / Junior (0–2 năm)

Động cơ

Tìm việc đầu tiên càng sớm càng tốt

Ứng tuyển số lượng lớn (20–50 đơn/tháng)

Nỗi đau

Gửi CV tràn lan → không nhớ đã gửi đâu, khi nào

Không biết vì sao bị từ chối

Bỏ lỡ email / phỏng vấn do thiếu hệ thống theo dõi

Mục tiêu

Quản lý tất cả đơn ứng tuyển trong 1 nơi

Biết đơn nào đang “có tín hiệu tốt”

Cải thiện CV & kỹ năng qua từng vòng

Persona 2: Người chuyển ngành (Career Switcher)

Động cơ

Chuyển sang ngành mới (VD: Non-IT → IT, Ops → Product)

Cần chiến lược ứng tuyển thông minh

Nỗi đau

JD yêu cầu nhiều skill chưa có

Không biết mình “fit” tới đâu

Dễ nản vì tỷ lệ bị loại cao

Mục tiêu

Đánh giá % phù hợp trước khi apply

Biết kỹ năng nào còn thiếu

Tối ưu chiến lược apply theo dữ liệu

Persona 3: Người đi làm có kinh nghiệm (Middle/Senior)

Động cơ

Tìm cơ hội tốt hơn (lương, vai trò, môi trường)

Ứng tuyển chọn lọc (5–10 công ty chất lượng)

Nỗi đau

Nhiều vòng phỏng vấn song song

Khó nhớ đã trao đổi gì với từng công ty

Quên follow-up, mất lợi thế

Mục tiêu

Theo dõi sâu từng công ty

Ghi chú chi tiết sau mỗi vòng

Ra quyết định offer dựa trên dữ liệu

1.2. Jobs-to-be-Done (JTBD)

“Tôi muốn quản lý toàn bộ quá trình tìm việc trong một hệ thống duy nhất.”

“Tôi muốn không bao giờ bỏ lỡ phỏng vấn, email hay follow-up quan trọng.”

“Tôi muốn biết đơn nào đang có khả năng thành công cao nhất.”

“Tôi muốn học từ dữ liệu để cải thiện kết quả ứng tuyển.”

“Tôi muốn ra quyết định nhận offer dựa trên so sánh logic, không cảm tính.”

1.3. Core Value Proposition
Giá trị cốt lõi khiến người dùng bỏ Excel/Notion:

1️⃣ Job Application = một “case study sống”
→ Không chỉ là record, mà là toàn bộ lịch sử, dữ liệu, nhận xét, cảm xúc, kết quả.

2️⃣ Tư duy phân tích + dự đoán (Insight-driven job search)
→ Tool phân tích khả năng phù hợp, chỉ ra điểm yếu, giúp ứng tuyển thông minh hơn – thứ Excel không làm được.

2. Phân Tích Nghiệp Vụ & Feature Breakdown
2.1. Application Pipeline – Vòng đời một đơn ứng tuyển

Các trạng thái đề xuất:

Wishlist / Dự định apply

CV in Progress

Đã nộp (Applied)

Được liên hệ (HR Screen)

Interview vòng 1

Interview vòng 2 / Technical

Final Interview

Offer Received

Offer Accepted

Rejected / Withdrawn

Mỗi trạng thái có: ngày bắt đầu, ngày kết thúc, ghi chú, outcome.

2.2. Module 1 – Quản lý Ứng tuyển
Trường dữ liệu BẮT BUỘC

Tên công ty

Vị trí ứng tuyển

Trạng thái hiện tại

Ngày nộp

Link JD

Trường TÙY CHỌN (nâng cao)

Mô tả JD (full text)

Nguồn apply (LinkedIn, Referral…)

CV / Cover Letter đã gửi (file)

Mức lương kỳ vọng

Recruiter contact

Priority (High / Medium / Low)

Tag (Remote, Startup, Product, etc.)

2.3. Module 2 – Phỏng vấn & Theo dõi
Ghi chú sau phỏng vấn – cần lưu:

Thông tin cứng

Ngày phỏng vấn

Vòng phỏng vấn

Người phỏng vấn (tên, chức danh)

Hình thức (Online / Onsite)

Nội dung

Câu hỏi chính & câu hỏi khó

Câu trả lời của mình (self-reflection)

Feedback nhận được

Mức lương / scope công việc đã trao đổi

Đánh giá chủ quan

Mức độ tự tin (1–5)

Mức độ phù hợp cảm nhận (1–5)

Mong muốn tiếp tục (Yes/No)

Nhắc lịch Follow-up

Logic đề xuất:

Sau phỏng vấn X ngày chưa có phản hồi → gợi ý follow-up

User chọn:

Email reminder

In-app notification

Template email follow-up gợi ý sẵn

2.4. Module 3 – Phân tích & Dự đoán % Phù Hợp (CORE)
Mục tiêu

→ Không phải AI phức tạp, mà là logic minh bạch – giải thích được.

Các yếu tố đầu vào:

CV vs JD Matching (40%)

So khớp keyword kỹ năng

Số năm kinh nghiệm

User Self-Assessment (30%)

Đánh giá sau phỏng vấn

Mức độ tự tin

Process Signal (30%)

Được gọi nhanh hay chậm

Số vòng đã qua

Feedback tích cực/tiêu cực

Công thức đơn giản (ví dụ):
Fit Score (%) =
0.4 × CV_JD_Match
+ 0.3 × Self_Rating
+ 0.3 × Process_Signal


→ Hiển thị % + giải thích bằng text:

“Bạn mạnh về kỹ năng A, B nhưng thiếu C. Feedback vòng 1 tích cực → khả năng cao.”

2.5. Module 4 – Dashboard & Báo cáo
Dashboard chính nên có:

Tổng số đơn ứng tuyển

Funnel chuyển đổi (Applied → Interview → Offer)

Tỷ lệ thành công theo:

CV version

Nguồn apply

Top công ty có phản hồi nhanh nhất

Kỹ năng bị reject nhiều nhất

Fit Score trung bình theo tháng

3. Non-Functional Requirements (NFRs)
3.1. Bảo mật

HTTPS

Hash password (bcrypt)

JWT / OAuth

2FA (tùy chọn cho bản Pro)

Phân quyền dữ liệu theo user

3.2. Usability

Thêm đơn mới < 30 giây

Giao diện clean, giống CRM cá nhân

Responsive mobile

Search & filter cực nhanh

3.3. Integrations (nâng cao)

Import JD từ LinkedIn / ITviec

Google Calendar (phỏng vấn)

Gmail (follow-up email)

Export CSV/PDF

4. Chiến Lược Phát Triển & Kinh Doanh
4.1. MVP – Tối thiểu để launch

5 tính năng CỐT LÕI:

Application pipeline + status

Ghi chú phỏng vấn

Follow-up reminder

Dashboard cơ bản

Fit Score (logic đơn giản)

4.2. Monetization

Freemium

Free: ≤ 20 đơn

Pro: unlimited + analytics

Subscription

Monthly / Yearly

Target: job seeker active

One-time Pro

Dùng cho 1 đợt tìm việc (3–6 tháng)

4.3. Success Metrics (KPIs)

Activation rate (tạo ≥ 3 đơn trong 7 ngày)

Avg. applications/user/week

Conversion Free → Paid

Retention 30/60/90 ngày

NPS (Job search stress giảm?)

Kết luận

Job Application Tracker Pro không phải là “to-do list xin việc”, mà là CRM + Analytics cho cá nhân tìm việc.
Nếu làm đúng, sản phẩm này giải quyết stress, tăng tỷ lệ thành công và tạo insight thực sự – điều mà Excel, Notion hay Google Sheet không thể làm.


PHƯƠNG ÁN TRIỂN KHAI 

1. Kiến trúc tổng thể (High-level Architecture)
[ React Web App ]
        |
        | REST / JWT
        v
[ Spring Boot API ]
        |
        | JPA / Hibernate
        v
[ PostgreSQL ]


Optional (giai đoạn sau)

Spring Boot
 ├─ Redis (cache, reminder)
 ├─ Scheduler (follow-up)
 ├─ Email Service (SMTP / Gmail API)
 └─ Analytics Module

2. Backend – Spring Boot (Core Logic)
2.1. Domain-Driven Design (DDD nhẹ)

Chia theo Business Module, không theo technical layer thuần.

com.jobtracker
├── auth
├── user
├── application
├── interview
├── analytics
├── reminder
└── common

2.2. Database Design (PostgreSQL)
2.2.1. User
users
- id (UUID)
- email
- password_hash
- role (FREE, PRO)
- created_at

2.2.2. Job Application (CORE ENTITY)
job_applications
- id (UUID)
- user_id (FK)
- company_name
- position
- status
- applied_date
- jd_link
- jd_text
- source
- salary_expectation
- priority
- created_at


👉 status = ENUM
(WISHLIST, APPLIED, HR_SCREEN, INTERVIEW_1, OFFER, REJECTED…)

2.2.3. Interview Notes
interviews
- id
- application_id (FK)
- interview_round
- interview_date
- interviewer_name
- interview_type (ONLINE, ONSITE)
- questions
- self_answer
- feedback
- confidence_score (1–5)
- fit_score (1–5)
- want_continue (boolean)

2.2.4. Follow-up Reminder
follow_ups
- id
- application_id
- remind_at
- sent (boolean)
- channel (EMAIL, IN_APP)

2.3. Business Logic – Fit Score Engine
2.3.1. Service Layer
@Service
public class FitScoreService {

    public double calculateFitScore(
        double cvJdMatch,
        double selfRating,
        double processSignal
    ) {
        return 0.4 * cvJdMatch
             + 0.3 * selfRating
             + 0.3 * processSignal;
    }
}

2.3.2. Explainable Output
{
  "fitScore": 72,
  "explanation": [
    "CV match tốt với Java, Spring",
    "Thiếu Docker và System Design",
    "Feedback vòng HR tích cực"
  ]
}


👉 Rất quan trọng:

Không dùng AI mù – logic minh bạch + giải thích được → đúng tinh thần BA.

2.4. API Design (REST)
Job Application
POST   /api/applications
GET    /api/applications
GET    /api/applications/{id}
PUT    /api/applications/{id}
DELETE /api/applications/{id}

Interview
POST /api/applications/{id}/interviews
GET  /api/applications/{id}/interviews

Analytics
GET /api/analytics/dashboard
GET /api/analytics/funnel
GET /api/analytics/fit-score

3. Frontend – React (User-Centric)
3.1. Tech Stack

React + TypeScript

React Query (data fetching)

Zustand / Redux Toolkit (state)

Ant Design / MUI (CRM-style UI)

Recharts (dashboard)

React Hook Form (fast input)

3.2. Page Structure
/login
/dashboard
/applications
  ├─ list (kanban / table)
  └─ detail
       ├─ overview
       ├─ interviews
       ├─ fit-score
/analytics
/settings

3.3. Application Pipeline UI (CRM-style)

👉 Kanban Board

Wishlist | Applied | HR Screen | Interview | Offer | Rejected


Drag & drop = đổi status

Click card = mở Application Detail

3.4. Application Detail = “Case Study Sống”

Tabs:

1️⃣ Overview
2️⃣ Interview Notes
3️⃣ Follow-up
4️⃣ Fit Score & Insight

3.5. Dashboard (Decision-Oriented)

Hiển thị:

Funnel chart

Fit Score trung bình

CV version hiệu quả nhất

Nguồn apply tốt nhất

👉 Không phải dashboard cho đẹp – mà để quyết định chiến lược apply.

4. Non-Functional Implementation
4.1. Security

Spring Security + JWT

Password: bcrypt

Role-based access (FREE / PRO)

Row-level security (user_id)

4.2. Performance

Index:

user_id

status

applied_date

Pagination everywhere

Redis cache (analytics)

5. MVP → Scale Roadmap
Phase 1 – MVP (1–2 dev, 2–3 tháng)

✅ Application pipeline
✅ Interview notes
✅ Fit score (basic)
✅ Dashboard basic
✅ Reminder (in-app)

Phase 2 – Pro Features

Gmail integration

Calendar sync

CV/JD parsing

Advanced analytics

AI suggestion (sau khi có data)

6. Vì sao kiến trúc này đúng cho Startup?

✔ Không over-engineer
✔ Logic minh bạch (BA-friendly)
✔ Dễ iterate theo feedback
✔ Scale từ solo job seeker → power user









