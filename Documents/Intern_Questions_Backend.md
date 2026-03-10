# Câu hỏi Backend cho intern - Job Application Tracker Pro

Tài liệu tổng hợp các câu hỏi về Backend cho intern của dự án Job Application Tracker Pro.

---

## 1. Cấu trúc Dự án

### 1.1. Kiến trúc tổng thể

**Q1.1.1:** Dự án Backend sử dụng kiến trúc gì? Giải thích các layer chính.

**Q1.1.2:** Tại sao dự án lại chia thành các package `controller`, `service`, `repository`, `entity`, `dto`? Mỗi layer có vai trò gì?

**Q1.1.3:** Mối quan hệ giữa Controller, Service và Repository như thế nào? Data flow từ request đến database?

**Q1.1.4:** Giải thích DTO pattern. Tại sao không trả về Entity trực tiếp từ Controller?

### 1.2. Design Patterns

**Q1.2.1:** Dự án sử dụng design pattern nào? (Ví dụ: Repository pattern, DTO pattern, Dependency Injection)

**Q1.2.2:** `@RequiredArgsConstructor` trong Lombok làm gì? Tại sao nên dùng thay vì constructor thủ công?

**Q1.2.3:** MapStruct là gì? Tại sao dự án dùng MapStruct thay vì tự map DTO-Entity?

### 1.3. Package Structure

**Q1.3.1:** Giải thích cấu trúc package:
```
com.jobtracker.backend/
├── config/
├── controller/
├── service/
├── repository/
├── entity/
├── dto/
├── mapper/
├── security/
├── scheduler/
└── exception/
```

**Q1.3.2:** File nào là entry point của ứng dụng Spring Boot? (`JobTrackerApplication.java` làm gì?)

---

## 2. Đăng nhập/Đăng ký (Authentication & Authorization)

### 2.1. Flow đăng ký (Register)

**Q2.1.1:** Khi user đăng ký, flow xử lý như thế nào? (từ `AuthController.register()` đến lưu vào database)

**Q2.1.2:** Password được lưu như thế nào trong database? Tại sao không lưu plain text?

**Q2.1.3:** `PasswordEncoder` là gì? Dự án dùng thuật toán nào để encode password? (bcrypt)

**Q2.1.4:** Email verification flow hoạt động như thế nào? `VerificationToken` được tạo và sử dụng ra sao?

**Q2.1.5:** Sau khi đăng ký, user có được đăng nhập ngay không? Tại sao?

### 2.2. Flow đăng nhập (Login)

**Q2.2.1:** Khi user đăng nhập, `AuthService.authenticate()` làm những gì?

**Q2.2.2:** `AuthenticationManager` có vai trò gì trong quá trình đăng nhập?

**Q2.2.3:** Sau khi xác thực thành công, JWT token được tạo như thế nào? (`JwtService.generateToken()`)

**Q2.2.4:** JWT token chứa thông tin gì? Tại sao không lưu password trong token?

### 2.3. JWT Authentication

**Q2.3.1:** JWT là gì? Ưu và nhược điểm của JWT so với session-based authentication?

**Q2.3.2:** `JwtAuthenticationFilter` hoạt động như thế nào? Tại sao cần filter này?

**Q2.3.3:** Khi frontend gửi request với header `Authorization: Bearer <token>`, backend xử lý như thế nào?

**Q2.3.4:** JWT token có thời hạn bao lâu? (check `application.yml` - jwt.expiration)

**Q2.3.5:** Token bị expire thì phải làm gì? Có cơ chế refresh token không?

**Q2.3.6:** JWT secret key nằm ở đâu? Tại sao không hardcode trong code?

### 2.4. Spring Security

**Q2.4.1:** `SecurityConfig` cấu hình những gì? Giải thích `SecurityFilterChain`.

**Q2.4.2:** Tại sao cần `@EnableWebSecurity`? Security filter chain hoạt động như thế nào?

**Q2.4.3:** CORS là gì? Tại sao cần cấu hình CORS trong `SecurityConfig`?

**Q2.4.4:** `sessionCreationPolicy(SessionCreationPolicy.STATELESS)` nghĩa là gì? Tại sao dùng STATELESS?

**Q2.4.5:** Endpoint nào được `permitAll()`? Endpoint nào cần authentication?

**Q2.4.6:** `@PreAuthorize` và `@Secured` là gì? Dự án có dùng không?

**Q2.4.7:** Trong `SecurityConfig`, filter nào được thêm vào filter chain? Thứ tự có quan trọng không?

---

## 3. API xử lý Status Update (Kéo qua kéo lại Application)

### 3.1. REST Endpoint

**Q3.1.1:** API endpoint nào xử lý việc update status của JobApplication? (tìm trong `JobApplicationController`)

**Q3.1.2:** HTTP method nào được dùng? PUT hay PATCH? Tại sao?

**Q3.1.3:** Khi frontend drag & drop application sang column khác, request gửi lên backend có dạng gì?

**Q3.1.4:** Request body chứa gì? Có cần gửi toàn bộ JobApplicationDTO hay chỉ status?

### 3.2. Service Layer

**Q3.2.1:** `JobApplicationService.updateApplication()` làm những gì?

**Q3.2.2:** MapStruct mapper (`JobApplicationMapper.updateEntityFromDto()`) hoạt động như thế nào?

**Q3.2.3:** Tại sao cần `@Transactional` ở method `updateApplication()`?

**Q3.2.4:** `getCurrentUser()` lấy user hiện tại như thế nào? Từ đâu?

**Q3.2.5:** Khi update status, có validate gì không? (ví dụ: không cho phép chuyển từ REJECTED sang OFFER)

### 3.3. Entity Management

**Q3.3.1:** Khi update status, JPA/Hibernate làm gì? Save() vs Update()?

**Q3.3.2:** `@EntityListeners(AuditingEntityListener.class)` làm gì? `@CreatedDate` và `@LastModifiedDate` tự động set như thế nào?

**Q3.3.3:** Enum `ApplicationStatus` có những giá trị nào? Có thể tự thêm status mới không?

---

## 4. Scheduler/Thông báo (10h/9h)

### 4.1. @Scheduled và Cron

**Q4.1.1:** `@Scheduled` annotation là gì? Tại sao cần `@EnableScheduling`?

**Q4.1.2:** Cron expression `"0 0 9 * * ?"` nghĩa là gì? Chạy khi nào?

**Q4.1.3:** Cron expression `"0 */15 * * * ?"` nghĩa là gì? Chạy mỗi bao lâu?

**Q4.1.4:** Muốn chạy vào 10h sáng thay vì 9h, cron expression là gì?

**Q4.1.5:** Timezone của cron job là gì? Có thể set timezone không?

### 4.2. NotificationScheduler

**Q4.2.1:** `NotificationScheduler` có mấy method được schedule? Mỗi method làm gì?

**Q4.2.2:** `checkFollowUpSuggestions()` chạy khi nào? Logic xử lý như thế nào?

**Q4.2.3:** Làm sao biết application nào cần follow-up? Điều kiện là gì?

**Q4.2.4:** `checkUpcomingInterviews()` check mỗi 15 phút, tại sao không check mỗi phút?

**Q4.2.5:** Khi nào thì gửi interview reminder? (45-75 phút trước interview)

**Q4.2.6:** Tại sao cần `@Transactional` ở các scheduled method?

**Q4.2.7:** Nếu scheduled job bị crash/exception, có cơ chế retry không?

**Q4.2.8:** Trong production, có nên chạy nhiều instance của app không? Scheduler có bị chạy trùng không?

### 4.3. Email Service

**Q4.3.1:** `EmailService` gửi email như thế nào? SMTP hay API?

**Q4.3.2:** Cấu hình email trong `application.yml` gồm những gì?

**Q4.3.3:** Gmail App Password là gì? Tại sao không dùng password thường?

**Q4.3.4:** `NotificationService.notify()` làm gì? Có gửi email và in-app notification không?

---

## 5. Giải quyết Bài toán

### 5.1. Cách tiếp cận

**Q5.1.1:** Khi nhận một feature mới, bạn sẽ bắt đầu từ đâu? (Design → Entity → Repository → Service → Controller)

**Q5.1.2:** Làm sao để đảm bảo code dễ maintain? (Naming convention, code structure, comments)

**Q5.1.3:** Khi gặp bug, process debug như thế nào? (Logs, breakpoints, database check)

### 5.2. Design Decisions

**Q5.2.1:** Tại sao dùng UUID thay vì auto-increment ID cho primary key?

**Q5.2.2:** Tại sao dùng JPA/Hibernate thay vì JDBC thuần?

**Q5.2.3:** Tại sao dùng PostgreSQL thay vì MySQL?

**Q5.2.4:** Tại sao dùng Spring Boot thay vì Spring Framework thuần?

**Q5.2.5:** DTO pattern vs trả Entity trực tiếp - trade-off là gì?

### 5.3. Error Handling

**Q5.3.1:** `GlobalExceptionHandler` làm gì? Tại sao cần global exception handler?

**Q5.3.2:** Các exception nào được handle? Response format như thế nào?

**Q5.3.3:** Khi nào dùng `RuntimeException`? Khi nào tạo custom Exception?

**Q5.3.4:** HTTP status code nào cho lỗi validation? 400 hay 422?

**Q5.3.5:** Làm sao để log lỗi mà không expose thông tin nhạy cảm cho user?

---

## 6. Khó khăn khi Code

### 6.1. Common Issues

**Q6.1.1:** Lỗi "LazyInitializationException" xảy ra khi nào? Cách fix?

**Q6.1.2:** Circular dependency trong Spring Boot xảy ra khi nào? Cách fix?

**Q6.1.3:** Transaction không rollback khi có exception - tại sao? (check exception type)

**Q6.1.4:** JWT token không được validate - check những gì? (secret key, expiration, format)

**Q6.1.5:** CORS error khi frontend call API - fix như thế nào?

**Q6.1.6:** Password không match dù đã encode đúng - check gì? (salt, algorithm)

**Q6.1.7:** Query không trả về data mới insert - tại sao? (Transaction, flush, refresh)

### 6.2. Debugging Tips

**Q6.2.1:** Cách xem SQL query mà Hibernate generate? (check `application.yml` - show-sql)

**Q6.2.2:** Cách debug Spring Security filter chain?

**Q6.2.3:** Cách test scheduled job không cần chờ đến 9h?

**Q6.2.4:** Cách xem logs của Spring Boot? (application logs, error logs)

**Q6.2.5:** Cách test API không cần frontend? (Postman, curl, Swagger UI)

### 6.3. Performance Issues

**Q6.3.1:** N+1 query problem là gì? Cách fix trong JPA? (`@EntityGraph`, `JOIN FETCH`)

**Q6.3.2:** Khi query nhiều records, cần làm gì? (Pagination - `Pageable`)

**Q6.3.3:** Lazy loading vs Eager loading - khi nào dùng cái nào?

**Q6.3.4:** Index trong database - khi nào cần tạo index? (Foreign key, frequently queried columns)

---

## 7. Deploy AWS

### 7.1. EC2 Setup

**Q7.1.1:** AWS EC2 là gì? Instance type nào phù hợp cho dự án này? (t2.small, t3.small)

**Q7.1.2:** Security Group cần mở port nào? (22 - SSH, 80 - HTTP, 8080 - Backend API)

**Q7.1.3:** Tại sao t2.micro (Free Tier) có thể bị thiếu RAM?

**Q7.1.4:** Key Pair dùng để làm gì? Làm sao SSH vào EC2?

### 7.2. Docker Deployment

**Q7.2.1:** Docker là gì? Tại sao dùng Docker thay vì cài trực tiếp trên server?

**Q7.2.2:** Dockerfile trong backend làm gì? Multi-stage build là gì?

**Q7.2.3:** Docker Compose là gì? `docker-compose.yml` định nghĩa những services nào?

**Q7.2.4:** Các services trong docker-compose (frontend, backend, db) giao tiếp như thế nào?

**Q7.2.5:** Volume trong Docker là gì? Tại sao cần volume cho database?

**Q7.2.6:** Build command: `docker-compose up -d --build` - các flag nghĩa là gì?

**Q7.2.7:** Làm sao xem logs của containers? (`docker-compose logs -f`)

### 7.3. Configuration

**Q7.3.1:** Environment variables trong Docker - làm sao pass từ host vào container?

**Q7.3.2:** Database connection string trên production khác local như thế nào?

**Q7.3.3:** JWT secret key trên production - nên lưu ở đâu? (Environment variable, không hardcode)

**Q7.3.4:** Frontend cần biết Backend URL - cách cấu hình? (`VITE_API_URL`)

**Q7.3.5:** `docker-compose.yml` cần thay đổi gì khi deploy? (API URL, database credentials)

### 7.4. Production Best Practices

**Q7.4.1:** Security: Password database và JWT secret trên production - có nên hardcode không?

**Q7.4.2:** Database backup - làm sao backup PostgreSQL trong Docker?

**Q7.4.3:** Monitoring - làm sao biết app có chạy ổn không? (Health check, logs)

**Q7.4.4:** Restart container - làm sao restart mà không mất data? (Volume persistence)

**Q7.4.5:** Domain name - làm sao trỏ domain về EC2 IP?

**Q7.4.6:** HTTPS - làm sao enable HTTPS? (SSL certificate, Nginx reverse proxy)

---

## 8. Câu hỏi Thực hành

### 8.1. Code Review

**Q8.1.1:** Đọc code `JobApplicationService.updateApplication()` - có vấn đề gì không?

**Q8.1.2:** `NotificationScheduler` có thể cải thiện gì? (Error handling, performance)

**Q8.1.3:** So sánh cách xử lý exception trong `AuthService` và `GlobalExceptionHandler`.

### 8.2. Implement Feature

**Q8.2.1:** Muốn thêm feature "Đếm số application theo status" - implement như thế nào?

**Q8.2.2:** Muốn thêm endpoint "Get applications by date range" - cần thay đổi gì?

**Q8.2.3:** Muốn thêm email reminder cho interview 2 ngày trước - implement như thế nào?

### 8.3. Testing

**Q8.3.1:** Làm sao test API endpoint? (Postman, unit test, integration test)

**Q8.3.2:** Test authentication flow - cần test những case nào?

**Q8.3.3:** Test scheduled job - có cách nào test không cần chờ cron?

---

## Ghi chú

- Câu hỏi được sắp xếp theo độ khó tăng dần
- Một số câu hỏi cần đọc code để trả lời chính xác
- Khuyến khích intern tìm hiểu codebase và thử nghiệm

---

*Last Updated: 2026-01-06*

