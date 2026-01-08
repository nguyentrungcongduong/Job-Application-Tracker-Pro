# Hướng dẫn Deploy lên AWS EC2 (Sử dụng Docker)

Đây là hướng dẫn chi tiết để deploy dự án Job Application Tracker Pro lên một máy chủ AWS EC2 sử dụng Docker và Docker Compose. Cách này đơn giản, dễ quản lý và chi phí thấp.

## Bước 1: Chuẩn bị AWS EC2 Instance

1.  Đăng nhập vào **AWS Console**.
2.  Đi tới **EC2 Dashboard** và chọn **Launch Instance**.
3.  **Name**: Đặt tên (ví dụ: `JobTrackerServer`).
4.  **OS Image**: Chọn **Ubuntu Server 22.04 LTS** (Khuyên dùng vì dễ sử dụng).
5.  **Instance Type**:
    *   `t2.small` hoặc `t3.small` (Khuyên dùng: cần ít nhất 2GB RAM để chạy Java + Postgres + Node build ổn định).
    *   *Lưu ý: `t2.micro` (Free Tier) có thể bị thiếu RAM dẫn đến crash.*
6.  **Key Pair**: Tạo mới hoặc chọn key có sẵn để SSH vào server.
7.  **Network Settings**: Chọn "Create security group" và cho phép:
    *   SSH (Port 22)
    *   HTTP (Port 80)
    *   Custom TCP (Port 8080) - Cho Backend API
8.  Nhấn **Launch Instance**.

## Bước 2: Cài đặt Docker trên EC2

SSH vào server của bạn (Sử dụng Terminal hoặc PuTTY):
```bash
ssh -i "keycuaban.pem" ubuntu@<PUBLIC-IP-CUA-EC2>
```

Chạy các lệnh sau để cài Docker:
```bash
# Cập nhật hệ thống
sudo apt update

# Cài đặt Docker
sudo apt install -y docker.io

# Cài đặt Java (nếu cần debug, không bắt buộc vì Docker đã bao gồm)
# sudo apt install openjdk-17-jdk

# Cài đặt Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Cho phép user 'ubuntu' chạy docker không cần sudo (Logout rồi login lại để áp dụng)
sudo usermod -aG docker ubuntu
exit
```
*Đăng nhập lại SSH để lệnh docker hoạt động.*

## Bước 3: Đưa code lên Server

Bạn có 2 cách chính:
1.  **Git (Khuyên dùng)**: Push code của bạn lên GitHub/GitLab rồi clone về server.
2.  **SCP**: Copy file từ máy tính lên server.

Ví dụ dùng Git:
```bash
git clone <LINK_GITHUB_REPO_CUA_BAN>
cd Job-Application-Tracker-Pro
```

## Bước 4: Cấu hình và Chạy

1.  **Chỉnh sửa `docker-compose.yml`**:
    Bạn cần thay đổi địa chỉ API để Frontend gọi đúng Backend trên server (thay vì localhost).

    ```bash
    nano docker-compose.yml
    ```
    
    Tìm dòng:
    ```yaml
        args:
          - VITE_API_URL=http://localhost:8080/api/v1
    ```
    Đổi `localhost` thành **Public IP** của EC2 hoặc Domain của bạn:
    ```yaml
        args:
          - VITE_API_URL=http://<PUBLIC-IP-CUA-BAN>:8080/api/v1
    ```
    
    Lưu file (`Ctrl+O`, `Enter`, `Ctrl+X`).

2.  **Build và Chạy**:
    ```bash
    # Lệnh này sẽ build image và chạy các container
    # Lần đầu build sẽ mất vài phút
    docker-compose up -d --build
    ```

3.  **Kiểm tra**:
    *   Gõ lệnh `docker-compose ps` để xem các service `frontend`, `backend`, `db` có trạng thái `Up` không.
    *   Nếu cần xem log: `docker-compose logs -f`.

## Bước 5: Truy cập ứng dụng

*   Mở trình duyệt và vào: `http://<PUBLIC-IP-CUA-BAN>`
*   Frontend sẽ hiện ra và kết nối tới Backend tại port 8080.

## Lưu ý quan trọng

*   **Database**: Dữ liệu Postgres được lưu trong volume docker `postgres_data`, nên restart container không bị mất dữ liệu.
*   **Production**:
    *   Nên đổi password DB và JWT Secret trong `docker-compose.yml`.
    *   Nên chặn port 8080 từ bên ngoài (chỉ cho phép nội bộ Docker hoặc Frontend gọi), nhưng với setup đơn giản này Frontend chạy trên trình duyệt người dùng nên **BẮT BUỘC** phải mở port 8080 (hoặc cấu hình Nginx làm Reverse Proxy cho cả /api).
