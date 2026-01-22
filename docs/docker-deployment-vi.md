# 🐳 Hướng Dẫn Triển Khai Docker cho One API

Tài liệu này hướng dẫn chi tiết cách triển khai One API sử dụng Docker và Docker Compose.

---

## 📋 Mục Lục

1. [Yêu Cầu Hệ Thống](#-yêu-cầu-hệ-thống)
2. [Hướng Dẫn Nhanh](#-hướng-dẫn-nhanh-development)
3. [Triển Khai Production](#-triển-khai-production)
4. [Bảng Tham Chiếu Biến Môi Trường](#-bảng-tham-chiếu-biến-môi-trường)
5. [Quản Lý Dữ Liệu](#-quản-lý-dữ-liệu)
6. [Mở Rộng Hệ Thống](#-mở-rộng-hệ-thống)
7. [Xử Lý Sự Cố](#-xử-lý-sự-cố)
8. [Nâng Cấp Hệ Thống](#-nâng-cấp-hệ-thống)

---

## 💻 Yêu Cầu Hệ Thống

### Phần Mềm Bắt Buộc

| Thành phần | Phiên bản tối thiểu | Ghi chú |
|------------|---------------------|---------|
| Docker | 20.10+ | Kiểm tra: `docker --version` |
| Docker Compose | 2.0+ | Kiểm tra: `docker-compose --version` |

### Tài Nguyên Phần Cứng

| Môi trường | RAM | Disk | CPU |
|------------|-----|------|-----|
| 🧪 Development | 2GB | 5GB | 1 core |
| 🏭 Production (nhỏ) | 4GB | 20GB | 2 cores |
| 🏢 Production (lớn) | 8GB+ | 50GB+ | 4+ cores |

### Cổng Mạng

| Cổng | Dịch vụ | Mô tả |
|------|---------|-------|
| 3000 | One API | Giao diện web và API |
| 3306 | MySQL | Cơ sở dữ liệu (nội bộ) |
| 6379 | Redis | Cache (nội bộ) |

---

## 🚀 Hướng Dẫn Nhanh (Development)

Dành cho môi trường phát triển và thử nghiệm nhanh:

```bash
# 1️⃣ Clone repository
git clone https://github.com/songquanpeng/one-api.git
cd one-api

# 2️⃣ Khởi chạy với cấu hình mặc định
docker-compose up -d

# 3️⃣ Xem logs
docker-compose logs -f one-api

# 4️⃣ Dừng dịch vụ
docker-compose down
```

### 🔐 Thông Tin Đăng Nhập Mặc Định

- **URL**: http://localhost:3000
- **Tài khoản**: `root`
- **Mật khẩu**: `123456`

> ⚠️ **Cảnh báo**: Đổi mật khẩu ngay sau khi đăng nhập lần đầu!

---

## 🏭 Triển Khai Production

### Bước 1: Chuẩn Bị Môi Trường 📁

```bash
# Tạo thư mục làm việc
mkdir -p /opt/one-api
cd /opt/one-api

# Clone repository
git clone https://github.com/songquanpeng/one-api.git .

# Sao chép file cấu hình mẫu
cp .env.example .env

# Tạo khóa bảo mật ngẫu nhiên
openssl rand -hex 32
# Kết quả ví dụ: a1b2c3d4e5f6...
```

### Bước 2: Cấu Hình Biến Môi Trường 🔧

Chỉnh sửa file `.env` với các giá trị production:

```bash
# Mở file cấu hình
nano .env
```

**Các biến BẮT BUỘC phải thay đổi:**

```bash
# ===== BẢO MẬT (BẮT BUỘC) =====
# Thay bằng chuỗi ngẫu nhiên đã tạo ở bước trên
SESSION_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6

# ===== CƠ SỞ DỮ LIỆU =====
MYSQL_ROOT_PASSWORD=MatKhauRoot_ManhMe_123!
MYSQL_PASSWORD=MatKhauOneAPI_AnToan_456!
SQL_DSN=oneapi:MatKhauOneAPI_AnToan_456!@tcp(db:3306)/one-api

# ===== MÚI GIỜ =====
TZ=Asia/Ho_Chi_Minh
```

### Bước 3: Khởi Chạy 🚀

```bash
# Khởi chạy với cấu hình production
docker-compose -f docker-compose.prod.yml up -d

# Kiểm tra trạng thái các container
docker-compose -f docker-compose.prod.yml ps
```

**Kết quả mong đợi:**
```
NAME              STATUS                   PORTS
one-api           Up (healthy)             0.0.0.0:3000->3000/tcp
one-api-mysql     Up (healthy)             3306/tcp
one-api-redis     Up (healthy)             6379/tcp
```

### Bước 4: Kiểm Tra ✅

```bash
# Kiểm tra health endpoint
curl http://localhost:3000/api/status

# Kết quả mong đợi:
# {"success":true,"message":"","data":{"version":"..."}}

# Xem logs ứng dụng
docker-compose -f docker-compose.prod.yml logs -f one-api

# Kiểm tra kết nối database
docker exec -it one-api-mysql mysql -u oneapi -p -e "SELECT 1"
```

---

## 📊 Bảng Tham Chiếu Biến Môi Trường

### 🔧 Ứng Dụng Chính

| Biến | Mặc định | Mô tả |
|------|----------|-------|
| `PORT` | `3000` | Cổng chạy ứng dụng |
| `GIN_MODE` | `release` | Chế độ Gin (`debug`/`release`) |
| `TZ` | `Asia/Ho_Chi_Minh` | Múi giờ hệ thống |
| `SESSION_SECRET` | - | **Bắt buộc**. Khóa mã hóa phiên đăng nhập |
| `THEME` | `default` | Giao diện (`default`/`berry`/`air`) |

### 🗄️ Cơ Sở Dữ Liệu

| Biến | Mặc định | Mô tả |
|------|----------|-------|
| `SQL_DSN` | - | Chuỗi kết nối MySQL/PostgreSQL |
| `LOG_SQL_DSN` | - | Database riêng cho logs (tùy chọn) |
| `SQL_MAX_IDLE_CONNS` | `100` | Số kết nối nhàn rỗi tối đa |
| `SQL_MAX_OPEN_CONNS` | `1000` | Số kết nối mở tối đa |
| `SQL_CONN_MAX_LIFETIME` | `60` | Thời gian sống kết nối (giây) |

**Định dạng SQL_DSN:**
```bash
# MySQL
SQL_DSN=user:password@tcp(host:3306)/database

# PostgreSQL
SQL_DSN=postgres://user:password@host:5432/database
```

### 🔴 Redis

| Biến | Mặc định | Mô tả |
|------|----------|-------|
| `REDIS_CONN_STRING` | - | URL kết nối Redis |
| `REDIS_PASSWORD` | - | Mật khẩu Redis (cho cluster/sentinel) |
| `REDIS_MASTER_NAME` | - | Tên master node (chế độ Sentinel) |
| `SYNC_FREQUENCY` | `600` | Tần suất đồng bộ cache (giây) |

### ⚡ Hiệu Năng

| Biến | Mặc định | Mô tả |
|------|----------|-------|
| `MEMORY_CACHE_ENABLED` | `false` | Bật cache trong bộ nhớ |
| `BATCH_UPDATE_ENABLED` | `false` | Bật cập nhật database theo lô |
| `BATCH_UPDATE_INTERVAL` | `5` | Khoảng cách cập nhật lô (giây) |

### 🚦 Giới Hạn Tốc Độ

| Biến | Mặc định | Mô tả |
|------|----------|-------|
| `GLOBAL_API_RATE_LIMIT` | `480` | Giới hạn API mỗi 3 phút |
| `GLOBAL_WEB_RATE_LIMIT` | `240` | Giới hạn Web mỗi 3 phút |

### 🌐 Đa Node (Multi-Node)

| Biến | Mặc định | Mô tả |
|------|----------|-------|
| `NODE_TYPE` | `master` | Loại node (`master`/`slave`) |
| `FRONTEND_BASE_URL` | - | URL frontend cho slave nodes |

### 📈 Metrics & Giám Sát

| Biến | Mặc định | Mô tả |
|------|----------|-------|
| `ENABLE_METRIC` | `false` | Bật thu thập metrics |
| `METRIC_QUEUE_SIZE` | `10` | Kích thước hàng đợi metrics |
| `METRIC_SUCCESS_RATE_THRESHOLD` | `0.8` | Ngưỡng tỷ lệ thành công |

### 🔌 API Bên Ngoài

| Biến | Mặc định | Mô tả |
|------|----------|-------|
| `RELAY_TIMEOUT` | `0` | Timeout relay API (giây, 0=không giới hạn) |
| `RELAY_PROXY` | - | Proxy cho các request API |
| `GEMINI_VERSION` | `v1` | Phiên bản Gemini API |
| `GEMINI_SAFETY_SETTING` | `BLOCK_NONE` | Cài đặt an toàn Gemini |

### 🔑 Khởi Tạo Ban Đầu

| Biến | Mặc định | Mô tả |
|------|----------|-------|
| `INITIAL_ROOT_TOKEN` | - | Tự động tạo root token khi khởi động lần đầu |
| `INITIAL_ROOT_ACCESS_TOKEN` | - | Tự động tạo root access token |

---

## 💾 Quản Lý Dữ Liệu

### 📦 Volumes Lưu Trữ

Production compose sử dụng named volumes:

| Volume | Mục đích | Vị trí trong container |
|--------|----------|------------------------|
| `one-api-data` | Dữ liệu ứng dụng | `/data` |
| `one-api-logs` | Logs ứng dụng | `/app/logs` |
| `redis-data` | Dữ liệu Redis | `/data` |
| `mysql-data` | Database MySQL | `/var/lib/mysql` |

### 📤 Sao Lưu (Backup)

#### Sao lưu MySQL

```bash
# Sao lưu toàn bộ database
docker exec one-api-mysql mysqldump \
  -u root -p'MatKhauRoot' \
  --single-transaction \
  --routines \
  --triggers \
  one-api > backup_$(date +%Y%m%d_%H%M%S).sql

# Nén file backup
gzip backup_*.sql
```

#### Sao lưu Volumes

```bash
# Sao lưu volume one-api-data
docker run --rm \
  -v one-api-data:/data \
  -v $(pwd)/backups:/backup \
  alpine tar czf /backup/one-api-data_$(date +%Y%m%d).tar.gz /data

# Sao lưu volume redis-data
docker run --rm \
  -v redis-data:/data \
  -v $(pwd)/backups:/backup \
  alpine tar czf /backup/redis-data_$(date +%Y%m%d).tar.gz /data
```

#### Script Sao Lưu Tự Động

```bash
#!/bin/bash
# backup.sh - Chạy hàng ngày với cron

BACKUP_DIR="/opt/backups/one-api"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup MySQL
docker exec one-api-mysql mysqldump \
  -u root -p'MatKhauRoot' \
  one-api | gzip > $BACKUP_DIR/mysql_$DATE.sql.gz

# Xóa backup cũ hơn 7 ngày
find $BACKUP_DIR -name "*.gz" -mtime +7 -delete

echo "✅ Backup hoàn tất: $DATE"
```

### 📥 Khôi Phục (Restore)

#### Khôi phục MySQL

```bash
# Dừng ứng dụng trước khi khôi phục
docker-compose -f docker-compose.prod.yml stop one-api

# Giải nén (nếu cần)
gunzip backup_20240101.sql.gz

# Khôi phục database
docker exec -i one-api-mysql mysql \
  -u root -p'MatKhauRoot' \
  one-api < backup_20240101.sql

# Khởi động lại ứng dụng
docker-compose -f docker-compose.prod.yml start one-api
```

#### Khôi phục Volumes

```bash
# Dừng tất cả services
docker-compose -f docker-compose.prod.yml down

# Khôi phục volume
docker run --rm \
  -v one-api-data:/data \
  -v $(pwd)/backups:/backup \
  alpine sh -c "rm -rf /data/* && tar xzf /backup/one-api-data_20240101.tar.gz -C /"

# Khởi động lại
docker-compose -f docker-compose.prod.yml up -d
```

---

## 🔄 Mở Rộng Hệ Thống

### Kiến Trúc Multi-Node

```
                    ┌─────────────────┐
                    │   Load Balancer │
                    │  (Nginx/HAProxy)│
                    └────────┬────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
         ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│   Master Node   │ │   Slave Node 1  │ │   Slave Node 2  │
│  (Đọc + Ghi)    │ │   (Chỉ đọc)     │ │   (Chỉ đọc)     │
└────────┬────────┘ └────────┬────────┘ └────────┬────────┘
         │                   │                   │
         └───────────────────┼───────────────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
              ▼                             ▼
     ┌─────────────────┐           ┌─────────────────┐
     │     MySQL       │           │     Redis       │
     │   (Shared DB)   │           │  (Shared Cache) │
     └─────────────────┘           └─────────────────┘
```

### Cấu Hình Master Node

```bash
# .env trên Master
NODE_TYPE=master
SESSION_SECRET=khoa-bi-mat-chung
SQL_DSN=oneapi:password@tcp(mysql-server:3306)/one-api
REDIS_CONN_STRING=redis://redis-server:6379
```

### Cấu Hình Slave Node

```bash
# .env trên Slave
NODE_TYPE=slave
SYNC_FREQUENCY=60
FRONTEND_BASE_URL=https://api.example.com
SESSION_SECRET=khoa-bi-mat-chung  # Phải giống Master!
SQL_DSN=oneapi:password@tcp(mysql-server:3306)/one-api
REDIS_CONN_STRING=redis://redis-server:6379
```

### Docker Compose cho Slave

```yaml
# docker-compose.slave.yml
version: '3.8'

services:
  one-api-slave:
    image: justsong/one-api:latest
    container_name: one-api-slave
    restart: always
    ports:
      - "3000:3000"
    environment:
      - NODE_TYPE=slave
      - SYNC_FREQUENCY=60
      - FRONTEND_BASE_URL=https://api.example.com
      - SESSION_SECRET=${SESSION_SECRET}
      - SQL_DSN=${SQL_DSN}
      - REDIS_CONN_STRING=${REDIS_CONN_STRING}
      - TZ=Asia/Ho_Chi_Minh
    healthcheck:
      test: ["CMD", "wget", "-q", "-O", "-", "http://localhost:3000/api/status"]
      interval: 30s
      timeout: 10s
      retries: 3
```

### Cấu Hình Nginx Load Balancer

```nginx
# /etc/nginx/conf.d/one-api.conf
upstream one_api_backend {
    least_conn;  # Thuật toán cân bằng tải

    server master.internal:3000 weight=3;
    server slave1.internal:3000 weight=2;
    server slave2.internal:3000 weight=2;

    keepalive 32;
}

server {
    listen 80;
    server_name api.example.com;

    location / {
        proxy_pass http://one_api_backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Connection "";

        # Timeout cho streaming
        proxy_read_timeout 300s;
        proxy_buffering off;
    }
}
```

---

## 🔧 Xử Lý Sự Cố

### ❌ Container Không Khởi Động

```bash
# Xem logs chi tiết
docker-compose -f docker-compose.prod.yml logs one-api

# Kiểm tra cấu hình
docker-compose -f docker-compose.prod.yml config
```

**Nguyên nhân phổ biến:**

| Lỗi | Nguyên nhân | Giải pháp |
|-----|-------------|-----------|
| `SESSION_SECRET is set to an example value` | Chưa đổi SESSION_SECRET | Tạo khóa mới với `openssl rand -hex 32` |
| `failed to connect database` | Sai SQL_DSN | Kiểm tra định dạng và mật khẩu |
| `connection refused` | Database chưa sẵn sàng | Đợi healthcheck hoàn tất |

### ❌ Lỗi Kết Nối Database

```bash
# Kiểm tra MySQL đang chạy
docker-compose -f docker-compose.prod.yml ps db

# Kiểm tra logs MySQL
docker-compose -f docker-compose.prod.yml logs db

# Test kết nối thủ công
docker exec -it one-api-mysql mysql -u oneapi -p -e "SELECT 1"

# Kiểm tra quyền user
docker exec -it one-api-mysql mysql -u root -p -e \
  "SELECT user, host FROM mysql.user WHERE user='oneapi';"
```

### ❌ Lỗi Kết Nối Redis

```bash
# Kiểm tra Redis đang chạy
docker-compose -f docker-compose.prod.yml ps redis

# Test kết nối
docker exec -it one-api-redis redis-cli ping
# Kết quả mong đợi: PONG

# Kiểm tra memory
docker exec -it one-api-redis redis-cli info memory
```

### ❌ Sử Dụng RAM Cao

```bash
# Kiểm tra memory usage
docker stats --no-stream

# Giải pháp:
# 1. Giảm số kết nối database
SQL_MAX_OPEN_CONNS=500
SQL_MAX_IDLE_CONNS=50

# 2. Bật batch update
BATCH_UPDATE_ENABLED=true

# 3. Giới hạn resource trong docker-compose
deploy:
  resources:
    limits:
      memory: 1G
```

### ❌ API Chậm / Timeout

```bash
# Kiểm tra latency database
docker exec -it one-api-mysql mysql -u oneapi -p -e \
  "SELECT * FROM channels LIMIT 1;"

# Bật Redis cache nếu chưa có
REDIS_CONN_STRING=redis://redis:6379
MEMORY_CACHE_ENABLED=true

# Tăng timeout nếu cần
RELAY_TIMEOUT=120
```

### 📋 Lệnh Debug Hữu Ích

```bash
# Xem tất cả logs
docker-compose -f docker-compose.prod.yml logs -f

# Vào shell container
docker exec -it one-api sh

# Kiểm tra network
docker network inspect one-api-network

# Restart một service
docker-compose -f docker-compose.prod.yml restart one-api

# Xem resource usage
docker stats
```

---

## ⬆️ Nâng Cấp Hệ Thống

### 🔄 Nâng Cấp Tiêu Chuẩn

```bash
# 1️⃣ Pull image mới nhất
docker-compose -f docker-compose.prod.yml pull

# 2️⃣ Khởi động lại với image mới
docker-compose -f docker-compose.prod.yml up -d

# 3️⃣ Kiểm tra phiên bản mới
curl http://localhost:3000/api/status | jq '.data.version'

# 4️⃣ Xem logs để đảm bảo không có lỗi
docker-compose -f docker-compose.prod.yml logs -f one-api
```

### 🛡️ Nâng Cấp An Toàn (Có Backup)

```bash
# 1️⃣ Tạo backup trước khi nâng cấp
BACKUP_DATE=$(date +%Y%m%d_%H%M%S)

docker exec one-api-mysql mysqldump \
  -u root -p'MatKhauRoot' \
  --single-transaction \
  one-api > backup_before_upgrade_$BACKUP_DATE.sql

echo "✅ Backup tạo xong: backup_before_upgrade_$BACKUP_DATE.sql"

# 2️⃣ Dừng services
docker-compose -f docker-compose.prod.yml down

# 3️⃣ Pull image mới
docker-compose -f docker-compose.prod.yml pull

# 4️⃣ Khởi động lại
docker-compose -f docker-compose.prod.yml up -d

# 5️⃣ Kiểm tra health
sleep 30
docker-compose -f docker-compose.prod.yml ps
curl http://localhost:3000/api/status
```

### 🔙 Rollback Nếu Có Lỗi

```bash
# 1️⃣ Dừng services
docker-compose -f docker-compose.prod.yml down

# 2️⃣ Chỉ định phiên bản cũ trong .env
# VERSION=v0.5.0

# 3️⃣ Khôi phục database (nếu cần)
docker-compose -f docker-compose.prod.yml up -d db
sleep 30

docker exec -i one-api-mysql mysql \
  -u root -p'MatKhauRoot' \
  one-api < backup_before_upgrade_*.sql

# 4️⃣ Khởi động lại với phiên bản cũ
docker-compose -f docker-compose.prod.yml up -d
```

### 📅 Lịch Nâng Cấp Khuyến Nghị

| Loại | Tần suất | Ghi chú |
|------|----------|---------|
| Patch (x.x.X) | Hàng tuần | Sửa lỗi, bảo mật |
| Minor (x.X.0) | Hàng tháng | Tính năng mới |
| Major (X.0.0) | Theo nhu cầu | Đọc changelog kỹ |

---

## 📚 Tài Liệu Tham Khảo

- 📖 [README chính](../README.md)
- 🏗️ [Kiến trúc hệ thống](./architecture.md)
- 🔧 [API Documentation](./API.md)
- 🐙 [GitHub Repository](https://github.com/songquanpeng/one-api)

---

## 💡 Mẹo & Thủ Thuật

### Alias Hữu Ích

Thêm vào `~/.bashrc` hoặc `~/.zshrc`:

```bash
# One API shortcuts
alias oa-up='docker-compose -f docker-compose.prod.yml up -d'
alias oa-down='docker-compose -f docker-compose.prod.yml down'
alias oa-logs='docker-compose -f docker-compose.prod.yml logs -f one-api'
alias oa-ps='docker-compose -f docker-compose.prod.yml ps'
alias oa-restart='docker-compose -f docker-compose.prod.yml restart one-api'
```

### Health Check Script

```bash
#!/bin/bash
# health-check.sh

ENDPOINT="http://localhost:3000/api/status"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $ENDPOINT)

if [ "$RESPONSE" = "200" ]; then
    echo "✅ One API đang hoạt động bình thường"
    exit 0
else
    echo "❌ One API không phản hồi (HTTP $RESPONSE)"
    # Gửi thông báo (tùy chọn)
    # curl -X POST "https://your-webhook-url" -d "One API down!"
    exit 1
fi
```

---

> 📝 **Cập nhật lần cuối**: Tháng 1, 2026
>
> 🤝 **Đóng góp**: Nếu bạn phát hiện lỗi hoặc muốn cải thiện tài liệu này, vui lòng tạo Pull Request!

