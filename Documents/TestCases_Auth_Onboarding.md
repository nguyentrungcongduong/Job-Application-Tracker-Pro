# Test Cases: User Authentication & Onboarding

Project: **Job Application Tracker Pro**  
Process: **User Authentication & Onboarding**  
Version: 1.0

---

## 1. Sign Up (Đăng ký)

| ID | Description | Pre-conditions | Steps | Expected Result | Priority |
|:---|:---|:---|:---|:---|:---|
| **TC-SU-01** | Sign up success with valid Email/Password | User not registered | 1. Navigate to Sign Up page.<br>2. Enter valid Email and strong Password.<br>3. Click "Sign Up". | 1. User record created in DB (enabled=false).<br>2. Verification email sent to User.<br>3. UI shows success message to check email. | High |
| **TC-SU-05** | Email Verification success | User signed up but not verified | 1. Click "Verify Account" link in email. | 1. Redirect to /verify-email.<br>2. User status updated to enabled=true in DB.<br>3. UI shows "Verified" success state and "Sign In" button. | High |
| **TC-LG-04** | Login blocked if unverified | User signed up but not verified | 1. Attempt to login with valid credentials. | 1. Error message: "Email not verified. Please check your inbox." | High |
| **TC-SU-02** | Sign up failure with existing Email | Email already exists in system | 1. Navigate to Sign Up.<br>2. Enter existing Email.<br>3. Click "Sign Up". | 1. Show error: "Email already in use".<br>2. No duplicate record created. | High |
| **TC-SU-03** | Password validation | - | 1. Enter weak password (e.g., "123").<br>2. Click "Sign Up". | 1. Show validation error: "Password must be at least 8 characters...". | Medium |
| **TC-SU-04** | Initial Data Creation | User signs up successfully | 1. Complete TC-SU-01. | 1. Empty application pipeline initialized.<br>2. Default dashboard config created.<br>3. Default CV profile placeholder created. | High |

---

## 2. Login (Đăng nhập)

| ID | Description | Pre-conditions | Steps | Expected Result | Priority |
|:---|:---|:---|:---|:---|:---|
| **TC-LG-01** | Login success with valid credentials | User exists and verified | 1. Navigate to Login page.<br>2. Enter correct Email and Password.<br>3. Click "Login". | 1. JWT/Session generated.<br>2. Redirect to Dashboard (returning user) or Onboarding (first time).<br>3. User data loaded (Applications, Profile). | High |
| **TC-LG-02** | Login failure - Wrong password | User exists | 1. Enter correct Email but wrong Password.<br>2. Click "Login". | 1. Show error: "Invalid credentials".<br>2. Access denied. | High |
| **TC-LG-03** | Session Persistence | User is logged in | 1. Log in successfully.<br>2. Close browser.<br>3. Re-open website. | 1. User remains authenticated (session remembered).<br>2. Directly enters Dashboard. | Medium |

---

## 3. First-time Onboarding (CỰC KỲ QUAN TRỌNG)

| ID | Description | Pre-conditions | Steps | Expected Result | Priority |
|:---|:---|:---|:---|:---|:---|
| **TC-ON-01** | Mandatory Onboarding for new users | Authenticated - New | 1. User logs in for the first time. | 1. System forces redirect to Welcome screen.<br>2. Cannot jump directly to Dashboard via URL. | High |
| **TC-ON-02** | Onboarding Flow - Step 1: Role/Industry | Welcome screen | 1. Select "Software Engineering" / "Tech".<br>2. Click "Next". | 1. Selection saved to profile.<br>2. Progress bar updates (1/3). | High |
| **TC-ON-03** | Onboarding Flow - Step 3: Add First App | On step 3 | 1. Enter Company, Position, Status.<br>2. Click "Finish". | 1. First application record created.<br>2. "Aha moment": Dashboard shows data immediately. | High |
| **TC-ON-04** | Skip Onboarding - Sample Data | Welcome screen | 1. Click "Skip for now" or "Explore with sample data". | 1. System populates 3-5 sample applications.<br>2. User sees a "pre-filled" Dashboard layout. | Medium |

---

## 4. Access Control & Business Rules

| ID | Description | Pre-conditions | Steps | Expected Result | Priority |
|:---|:---|:---|:---|:---|:---|
| **TC-AC-01** | Unauthorized Access (BR-AUTH-01) | Non-authenticated | 1. Attempt to access `/dashboard` or `/applications` via URL. | 1. Redirect to Login page. | High |
| **TC-AC-02** | Data Isolation (BR-AUTH-02) | Two users (A and B) exist | 1. Login as User A.<br>2. Attempt to view application belonging to User B (via ID). | 1. Access Denied / 403 Forbidden.<br>2. User A only sees User A's data. | High |
| **TC-BR-01** | Free User Limits (BR-AUTH-03) | User is "Free" tier | 1. Login as Free User.<br>2. Reach max applications (e.g., 20).<br>3. Attempt to add one more. | 1. Show upgrade prompt.<br>2. Block "Add" action until upgrade or deletion. | Medium |

---

## 5. Performance & KPI Verification (Chi tiết chỉ số đo lường)

Để đảm bảo quy trình Auth & Onboarding đạt hiệu quả cao nhất (chuẩn Product Management), các chỉ số sau cần được theo dõi sát sao:

| KPI ID | Chỉ số (Metric) | Định nghĩa / Cách tính | Mục tiêu (Target) |
|:---|:---|:---|:---|
| **KPI-AUTH-01** | **Signup completion rate** | Tỷ lệ user tạo tài khoản thành công / Tổng số user truy cập trang Signup. | > 60% |
| **KPI-AUTH-02** | **Drop-off tại signup screen** | Tỷ lệ user rời đi ngay tại màn hình đăng ký mà không thực hiện hành động. | < 20% |
| **KPI-AUTH-03** | **% user hoàn thành onboarding** | Tỷ lệ user đi hết 3 bước onboarding / Tổng số user đã signup thành công. | > 85% |
| **KPI-AUTH-04** | **Time to first application** | Thời gian trung bình từ lúc Signup đến lúc tạo Application đầu tiên (Aha moment). | < 3 phút |
| **KPI-AUTH-05** | **DAU / WAU** | Tỷ lệ User hoạt động hàng ngày trên hàng tuần (Độ "dính" của app). | > 30% |
| **KPI-PERF-01** | **Signup/Login Speed** | Thời gian phản hồi của hệ thống khi thực hiện Auth. | < 3s |

---
**Note:** These test cases are based on the PRD for the "User Authentication & Onboarding" process.
