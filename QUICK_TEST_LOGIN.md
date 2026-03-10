# 🚀 Hướng Dẫn Test Đăng nhập - Bản Nhanh

## ⚡ Startup Nhanh

### 1️⃣ Start Backend (Terminal 1)

```powershell
cd d:\project\Job-Application-Tracker-Pro\backend

# Option A: Dùng Maven (chậm hơn, lần đầu tải dependencies)
mvn spring-boot:run -DskipTests=true

# Option B: Chạy JAR (nhanh hơn, nếu đã build)
java -jar target/job-tracker-0.0.1-SNAPSHOT.jar
```

### 2️⃣ Start Frontend (Terminal 2)

```powershell
cd d:\project\Job-Application-Tracker-Pro\frontend
npm run dev
```

---

## 🔐 Test Đăng Nhập

### 👤 **Tài Khoản Test Sẵn**

| Email                  | Mật khẩu        | Trạng thái            |
| ---------------------- | --------------- | --------------------- |
| `verified@example.com` | `Password@123`  | ✅ Sẵn sàng dùng      |
| `admin@jobtracker.com` | `AdminPass@123` | ✅ Admin              |
| `test@example.com`     | `Test@12345`    | ⏳ Cần xác thực email |

### 🌐 **Cách Test**

**Option 1: Browser**

```
Frontend: http://localhost:5173
Nhập tài khoản above → Đăng nhập
```

**Option 2: Postman**

- Import file: `Postman_Auth_Tests.json`
- Chạy request: `1. Login - Valid Credentials`

**Option 3: PowerShell**

```powershell
cd d:\project\Job-Application-Tracker-Pro
.\test-auth.ps1
```

**Option 4: curl**

```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"verified@example.com","password":"Password@123"}'
```

---

## ❌ Troubleshooting

| Vấn đề                     | Giải pháp                                            |
| -------------------------- | ---------------------------------------------------- |
| **Connection refused**     | Kiểm tra backend đang chạy port 8080                 |
| **Invalid credentials**    | Kiểm tra email/password chính xác                    |
| **Email not verified**     | Dùng `verified@example.com` hoặc xác thực email      |
| **500 Internal Error**     | Check database connection (PostgreSQL)               |
| **Maven plugin not found** | Dùng Java JAR directly thay vì `mvn spring-boot:run` |

---

## 📁 Files Tham Khảo

- 📖 Chi tiết: [AUTH_TEST_GUIDE.md](./AUTH_TEST_GUIDE.md)
- 📮 Postman: [Postman_Auth_Tests.json](./Postman_Auth_Tests.json)
- 🔧 Script test: [test-auth.ps1](./test-auth.ps1)

---

## 🎯 Nếu Quên Tài Khoản

1. **Cách 1:** Dùng tài khoản test có sẵn ở trên ↑
2. **Cách 2:** Đăng ký tài khoản mới
   ```
   POST /api/v1/auth/register
   {
     "name": "Your Name",
     "email": "youremail@example.com",
     "password": "StrongPass@123"
   }
   ```
3. **Cách 3:** Liên hệ admin để reset

---

**✨ Thêm tài khoản test?** Chỉnh sửa file này hoặc tạo API request để đăng ký mới.
