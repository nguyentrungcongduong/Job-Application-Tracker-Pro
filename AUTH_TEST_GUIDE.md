# Hướng dẫn Test Đăng ký & Đăng nhập

## 1. Tài khoản Test Có sẵn

Nếu bạn quên tài khoản, hãy dùng các tài khoản test này:

| Email                  | Mật khẩu        | Trạng thái         | Ghi chú          |
| ---------------------- | --------------- | ------------------ | ---------------- |
| `test@example.com`     | `Test@12345`    | Cần xác thực email | -                |
| `verified@example.com` | `Password@123`  | Đã xác thực        | Đã sẵn sàng dùng |
| `admin@jobtracker.com` | `AdminPass@123` | Đã xác thực        | Admin account    |

---

## 2. Các Endpoint Test

### A. Đăng ký tài khoản (Sign Up)

**Endpoint:** `POST /api/v1/auth/register`

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "newemail@example.com",
  "password": "SecurePass@123"
}
```

**Response (Success):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "email": "newemail@example.com",
  "message": "Registration successful. Please verify your email."
}
```

---

### B. Đăng nhập (Login)

**Endpoint:** `POST /api/v1/auth/login`

**Request Body:**

```json
{
  "email": "verified@example.com",
  "password": "Password@123"
}
```

**Response (Success):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "email": "verified@example.com",
  "name": "Test User",
  "message": "Login successful"
}
```

**Response (Failure - Wrong Password):**

```json
{
  "error": "Invalid credentials",
  "status": 401
}
```

---

### C. Xác thực Email (Email Verification)

**Endpoint:** `GET /api/v1/auth/verify-email?token={verification_token}`

- Bạn sẽ nhận được email có link xác thực
- Click vào link để xác thực email
- Response: `"Email verified successfully. You can now login."`

---

## 3. Cách Test bằng Postman / curl

### Sử dụng Postman:

1. **Import** collection từ: `/Documents/postman-collection.json` (nếu có)
2. Hoặc tạo request mới:
   - **Endpoint:** `http://localhost:8080/api/v1/auth/login`
   - **Method:** POST
   - **Body (JSON):**
     ```json
     {
       "email": "verified@example.com",
       "password": "Password@123"
     }
     ```

### Sử dụng curl:

```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "verified@example.com",
    "password": "Password@123"
  }'
```

### Sử dụng PowerShell:

```powershell
$body = @{
    email = "verified@example.com"
    password = "Password@123"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8080/api/v1/auth/login" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body
```

---

## 4. Kiểm tra Trạng thái Backend

Chạy command này để kiểm tra backend đang chạy:

```powershell
# Windows PowerShell
curl http://localhost:8080/actuator/health

# Hoặc
Invoke-WebRequest -Uri "http://localhost:8080/actuator/health"
```

Nếu nhận được response `{"status":"UP"}` = Backend đang chạy ✅

---

## 5. Đặt lại Mật khẩu

Hiện tại chưa có tính năng "Forgot Password", bạn có thể:

1. **Cách 1:** Xoá account cũ và đăng ký lại
2. **Cách 2:** Liên hệ Admin để reset
3. **Cách 3:** Dùng tài khoản test có sẵn ở mục 1

---

## 6. Ghi Chú Quan Trọng ⚠️

- **JWT Token** hết hạn sau 24 giờ
- **Email Verification** bắt buộc trước khi login
- **Password** phải >= 8 ký tự (recommend có chữ hoa, chữ thường, số, ký tự đặc biệt)
- Database: PostgreSQL tại `localhost:5432/job_tracker`

---

## 7. Troubleshooting

| Vấn đề                 | Giải pháp                               |
| ---------------------- | --------------------------------------- |
| "Email not verified"   | Kiểm tra email và click xác thực link   |
| "Invalid credentials"  | Kiểm tra email/password có đúng không   |
| "Connection refused"   | Chắc chắn backend đang chạy (port 8080) |
| "Email already in use" | Dùng email khác hoặc reset account      |

---

**Cần thêm tài khoản test?** Liên hệ hoặc dùng endpoint `/api/v1/auth/register` để tạo mới.
