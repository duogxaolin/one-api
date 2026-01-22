# One API - Kiến trúc tổng quan

## 1. Tổng quan dự án

One API là một hệ thống quản lý và phân phối API cho các mô hình ngôn ngữ lớn (LLM). Nó hoạt động như một proxy/gateway thống nhất, cho phép truy cập nhiều nhà cung cấp AI khác nhau (OpenAI, Anthropic, Google, Baidu, v.v.) thông qua một API chuẩn OpenAI.

**Công nghệ chính:**
- **Backend**: Go (Gin framework)
- **Frontend**: React (3 themes: default, berry, air)
- **Database**: SQLite/MySQL/PostgreSQL (GORM)
- **Cache**: Redis (optional)
- **Deployment**: Docker, Docker Compose

## 2. Cấu trúc thư mục

```
one-api/
├── main.go                 # Entry point của ứng dụng
├── common/                 # Các tiện ích chung
│   ├── i18n/              # Internationalization (backend)
│   ├── config/            # Cấu hình hệ thống
│   ├── logger/            # Logging system
│   └── helper/            # Helper functions
├── controller/            # HTTP request handlers
│   ├── auth/             # Authentication (GitHub, WeChat, OIDC, Lark)
│   ├── channel.go        # Quản lý channels (AI providers)
│   ├── token.go          # Quản lý API tokens
│   ├── user.go           # Quản lý users
│   ├── relay.go          # Relay requests đến AI providers
│   └── ...
├── middleware/            # Gin middlewares
│   ├── auth.go           # Authentication middleware
│   ├── distributor.go    # Channel distribution logic
│   ├── rate-limit.go     # Rate limiting
│   ├── language.go       # i18n language detection
│   └── ...
├── model/                 # Database models (GORM)
│   ├── channel.go        # Channel model
│   ├── token.go          # Token model
│   ├── user.go           # User model
│   ├── log.go            # Request log model
│   └── ...
├── relay/                 # Core relay system
│   ├── adaptor/          # Adaptors cho từng AI provider
│   │   ├── openai/       # OpenAI adaptor
│   │   ├── anthropic/    # Anthropic adaptor
│   │   ├── gemini/       # Google Gemini adaptor
│   │   ├── aws/          # AWS Bedrock adaptor
│   │   └── ...           # 30+ providers
│   ├── controller/       # Relay controllers
│   ├── model/            # Request/response models
│   └── meta/             # Request metadata
├── router/                # Route definitions
│   ├── api.go            # API routes (/api/*)
│   ├── relay.go          # Relay routes (/v1/*)
│   ├── dashboard.go      # Dashboard routes
│   └── web.go            # Frontend routes
├── monitor/               # Monitoring & metrics
├── web/                   # Frontend applications
│   ├── default/          # Default theme (Semantic UI)
│   ├── berry/            # Berry theme (Material-UI)
│   └── air/              # Air theme (Semi Design)
└── Dockerfile            # Multi-stage Docker build
```

## 3. Luồng xử lý request

### 3.1. Request flow từ client đến AI provider

```
Client Request
    ↓
[Gin Router] (router/relay.go)
    ↓
[Middleware Chain]
    ├── CORS
    ├── GzipDecode
    ├── RequestId          # Tạo unique request ID
    ├── Language           # Detect ngôn ngữ từ Accept-Language header
    ├── RelayPanicRecover  # Error recovery
    ├── TokenAuth          # Xác thực API token
    └── Distribute         # Chọn channel phù hợp
    ↓
[Controller] (controller/relay.go)
    ↓
[Relay System] (relay/controller/proxy.go)
    ├── Get Adaptor by API Type
    ├── Init Adaptor with metadata
    ├── Convert Request format
    ├── Setup Request Headers
    └── Forward to AI Provider
    ↓
[AI Provider] (OpenAI, Anthropic, etc.)
    ↓
[Response Processing]
    ├── Stream/Non-stream handling
    ├── Usage tracking
    ├── Billing calculation
    └── Log recording
    ↓
Client Response
```

### 3.2. Middleware chain chi tiết

1. **RequestId()**: Tạo unique ID cho mỗi request để tracking
2. **Language()**: Phát hiện ngôn ngữ từ `Accept-Language` header (zh-CN hoặc en)
3. **TokenAuth()**: 
   - Xác thực Bearer token
   - Kiểm tra user status
   - Lấy request model từ body
   - Set context variables (userId, tokenId, requestModel)
4. **Distribute()**:
   - Lấy user group
   - Chọn channel phù hợp dựa trên model và group
   - Load balancing giữa các channels
   - Set channel config vào context

## 4. Backend Architecture (Go)

### 4.1. Entry Point (main.go)

```go
func main() {
    // 1. Initialize common components
    common.Init()           // Parse flags, load env
    logger.SetupLogger()    // Setup logging
    
    // 2. Initialize Database
    model.InitDB()          // SQLite/MySQL/PostgreSQL
    model.InitLogDB()       // Separate log database
    model.CreateRootAccountIfNeed()  // Create default admin
    
    // 3. Initialize Redis (optional)
    common.InitRedisClient()
    
    // 4. Initialize Options & Cache
    model.InitOptionMap()   // Load system options
    model.InitChannelCache() // Cache channels in memory
    
    // 5. Initialize i18n
    i18n.Init()             // Load translation files
    
    // 6. Setup HTTP Server
    server := gin.New()
    server.Use(gin.Recovery())
    server.Use(middleware.RequestId())
    server.Use(middleware.Language())
    middleware.SetUpLogger(server)
    
    // 7. Setup Routes
    router.SetRouter(server, buildFS)
    
    // 8. Start Server
    server.Run(":" + port)
}
```

### 4.2. Router Setup

**4 nhóm routes chính:**

1. **API Routes** (`/api/*`): Management API
   - `/api/user/*` - User management
   - `/api/channel/*` - Channel management
   - `/api/token/*` - Token management
   - `/api/log/*` - Log viewing
   - `/api/option/*` - System settings

2. **Relay Routes** (`/v1/*`): OpenAI-compatible API
   - `/v1/chat/completions` - Chat completions
   - `/v1/completions` - Text completions
   - `/v1/embeddings` - Embeddings
   - `/v1/images/generations` - Image generation
   - `/v1/audio/*` - Audio transcription/translation

3. **Dashboard Routes**: Billing info
   - `/dashboard/billing/subscription`
   - `/dashboard/billing/usage`

4. **Web Routes** (`/*`): Frontend SPA
   - Serve static files từ embedded FS
   - Theme selection (default/berry/air)

### 4.3. Model/Database Layer

**Database Support:**
- SQLite (default, file-based)
- MySQL (production)
- PostgreSQL (production)

**Core Models:**

1. **Channel** (`model/channel.go`):
   ```go
   type Channel struct {
       Id          int
       Type        int      // Provider type (OpenAI, Anthropic, etc.)
       Key         string   // API key
       Status      int      // Enabled/Disabled
       Name        string
       Weight      *uint    // Load balancing weight
       BaseURL     *string  // Custom endpoint
       Balance     float64  // Account balance (USD)
       Models      string   // Supported models (JSON array)
       Group       string   // User group (default, vip, etc.)
       Priority    *int64   // Priority for selection
       Config      string   // Provider-specific config (JSON)
   }
   ```

2. **User** (`model/user.go`):
   ```go
   type User struct {
       Id          int
       Username    string
       Password    string   // Hashed
       Role        int      // 1=User, 10=Admin, 100=Root
       Status      int      // Enabled/Disabled
       Email       string
       Quota       int64    // Available quota
       UsedQuota   int64    // Used quota
       Group       string   // User group for channel access
       AccessToken string   // System management token
   }
   ```

3. **Token** (`model/token.go`):
   ```go
   type Token struct {
       Id             int
       UserId         int
       Key            string   // API key (48 chars)
       Status         int
       Name           string
       ExpiredTime    int64    // -1 = never expires
       RemainQuota    int64
       UnlimitedQuota bool
       Models         *string  // Allowed models (JSON)
   }
   ```

4. **Log** (`model/log.go`): Request logging cho billing và monitoring

**Caching Strategy:**
- Memory cache cho channels (optional)
- Redis cache cho user groups, tokens
- Sync frequency configurable (default: 60s)

### 4.4. Relay System - Core của One API

**Adaptor Pattern:**

Mỗi AI provider có một adaptor implement interface:

```go
type Adaptor interface {
    Init(meta *meta.Meta)
    GetRequestURL(meta *meta.Meta) (string, error)
    SetupRequestHeader(c *gin.Context, req *http.Request, meta *meta.Meta) error
    ConvertRequest(c *gin.Context, relayMode int, request *model.GeneralOpenAIRequest) (any, error)
    DoRequest(c *gin.Context, meta *meta.Meta, requestBody io.Reader) (*http.Response, error)
    DoResponse(c *gin.Context, resp *http.Response, meta *meta.Meta) (usage *model.Usage, err *model.ErrorWithStatusCode)
    GetModelList() []string
    GetChannelName() string
}
```

**Supported Providers (30+):**
- OpenAI, Azure OpenAI
- Anthropic (Claude), AWS Bedrock
- Google (Gemini, PaLM)
- Chinese providers: Baidu, Alibaba, Tencent, Zhipu, Moonshot, DeepSeek, etc.
- Others: Mistral, Cohere, Groq, Ollama, Cloudflare Workers AI

**Request Flow trong Relay:**

1. **RelayProxyHelper** nhận request
2. **GetAdaptor** chọn adaptor dựa trên APIType
3. **Init** adaptor với metadata (channel config, user info)
4. **ConvertRequest** chuyển đổi OpenAI format sang provider format
5. **DoRequest** gửi request đến provider
6. **DoResponse** xử lý response:
   - Stream/non-stream handling
   - Usage tracking (tokens, cost)
   - Error handling
7. **Billing** tính toán và trừ quota

## 5. Frontend Architecture (React)

### 5.1. Three Themes

**1. Default Theme** (`web/default/`):
- **UI Framework**: Semantic UI React
- **Structure**: Functional components với hooks
- **State**: Context API (UserContext, StatusContext)
- **i18n**: ✅ **Đã có** - react-i18next
  - Languages: Chinese (zh), English (en)
  - Files: `src/locales/zh/translation.json`, `src/locales/en/translation.json`
  - Setup: `src/i18n.js`
- **Features**:
  - Language switcher trong Header
  - Browser language detection
  - Comprehensive translations (800+ keys)

**2. Berry Theme** (`web/berry/`):
- **UI Framework**: Material-UI (MUI)
- **Structure**: Modern React với hooks
- **State**: Redux (store/reducer pattern)
- **i18n**: ❌ **Chưa có** - hardcoded Chinese text
- **Features**:
  - Dark/Light theme toggle
  - Professional admin dashboard
  - Redux state management

**3. Air Theme** (`web/air/`):
- **UI Framework**: Semi Design (ByteDance)
- **Structure**: Functional components
- **State**: Context API
- **i18n**: ❌ **Chưa có** - hardcoded Chinese text
- **Features**:
  - Modern design
  - VChart integration for analytics
  - Sidebar navigation

### 5.2. Component Structure (Default Theme)

```
src/
├── components/
│   ├── Header.js           # Navigation + Language switcher
│   ├── Footer.js
│   ├── LoginForm.js
│   ├── RegisterForm.js
│   ├── ChannelsTable.js    # Channel management
│   ├── TokensTable.js      # Token management
│   └── UsersTable.js       # User management
├── pages/
│   ├── Home/               # Dashboard
│   ├── Channel/            # Channel CRUD
│   ├── Token/              # Token CRUD
│   ├── User/               # User management
│   ├── Log/                # Request logs
│   └── Setting/            # System settings
├── context/
│   ├── User/               # User context & auth
│   └── Status/             # System status
├── helpers/
│   ├── api.js              # Axios instance
│   └── utils.js            # Utility functions
├── locales/
│   ├── zh/translation.json # Chinese translations
│   └── en/translation.json # English translations
└── i18n.js                 # i18next configuration
```

### 5.3. State Management

**Default & Air Themes**: Context API
```javascript
// UserContext provides:
- userState (logged in user info)
- userDispatch (login, logout actions)

// StatusContext provides:
- statusState (system config, options)
- statusDispatch (update system status)
```

**Berry Theme**: Redux
```javascript
// Store structure:
- customization (theme, layout)
- account (user info)
- siteInfo (system config)
```

### 5.4. API Communication

All themes use Axios với interceptors:

```javascript
export const API = axios.create({
  baseURL: process.env.REACT_APP_SERVER || '/'
});

API.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Redirect to login
    }
    showError(error);
  }
);
```

**Common API endpoints:**
- `/api/user/login` - Authentication
- `/api/channel` - Channel CRUD
- `/api/token` - Token CRUD
- `/api/log` - Request logs
- `/api/status` - System status

## 6. Internationalization (i18n)

### 6.1. Backend i18n

**Location**: `common/i18n/`

**Implementation**:
```go
// Embedded translation files
//go:embed locales/*.json
var localesFS embed.FS

// Middleware detects language
func Language() gin.HandlerFunc {
    return func(c *gin.Context) {
        lang := c.GetHeader("Accept-Language")
        if strings.HasPrefix(strings.ToLower(lang), "zh") {
            lang = "zh-CN"
        } else {
            lang = "en"
        }
        c.Set(i18n.ContextKey, lang)
        c.Next()
    }
}

// Usage in controllers
message := i18n.Translate(c, "invalid_input")
```

**Translation Files**:
- `locales/en.json` - English
- `locales/zh-CN.json` - Chinese

**Coverage**: Limited (only error messages, ~4 keys)

### 6.2. Frontend i18n

**Default Theme** - ✅ **Fully Implemented**:
```javascript
// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'zh',
    resources: {
      zh: { translation: zhTranslation },
      en: { translation: enTranslation }
    }
  });
```

**Usage in components**:
```javascript
import { useTranslation } from 'react-i18next';

function Header() {
  const { t, i18n } = useTranslation();

  return (
    <Menu.Item>{t('header.home')}</Menu.Item>
  );
}
```

**Translation Coverage**:
- 800+ translation keys
- All UI text translated
- Language switcher in header
- Persistent language preference

**Berry & Air Themes** - ❌ **Not Implemented**:
- All text hardcoded in Chinese
- No i18n library integrated
- Need to add react-i18next

## 7. Docker Deployment

### 7.1. Dockerfile (Multi-stage Build)

**Stage 1: Frontend Build** (Node.js)
```dockerfile
FROM node:16 AS builder
WORKDIR /web
COPY ./web .

# Install dependencies for all 3 themes in parallel
RUN npm install --prefix /web/default & \
    npm install --prefix /web/berry & \
    npm install --prefix /web/air & \
    wait

# Build all 3 themes in parallel
RUN DISABLE_ESLINT_PLUGIN='true' npm run build --prefix /web/default & \
    DISABLE_ESLINT_PLUGIN='true' npm run build --prefix /web/berry & \
    DISABLE_ESLINT_PLUGIN='true' npm run build --prefix /web/air & \
    wait
```

**Stage 2: Backend Build** (Go)
```dockerfile
FROM golang:alpine AS builder2
RUN apk add gcc musl-dev sqlite-dev build-base

ENV GO111MODULE=on CGO_ENABLED=1 GOOS=linux
WORKDIR /build

COPY go.mod go.sum ./
RUN go mod download

COPY . .
COPY --from=builder /web/build ./web/build

RUN go build -trimpath -ldflags "-s -w" -o one-api
```

**Stage 3: Runtime** (Alpine)
```dockerfile
FROM alpine:latest
RUN apk add ca-certificates tzdata

COPY --from=builder2 /build/one-api /
EXPOSE 3000
ENTRYPOINT ["/one-api"]
```

**Build Features:**
- Multi-stage để giảm image size
- Parallel builds cho frontend
- Static binary với CGO enabled (SQLite support)
- Embedded frontend files trong binary

### 7.2. Docker Compose Configuration

```yaml
services:
  one-api:
    image: justsong/one-api:latest
    ports:
      - "3000:3000"
    volumes:
      - ./data/oneapi:/data      # SQLite database
      - ./logs:/app/logs         # Application logs
    environment:
      - SQL_DSN=oneapi:123456@tcp(db:3306)/one-api  # MySQL
      - REDIS_CONN_STRING=redis://redis              # Redis cache
      - SESSION_SECRET=random_string                 # Session encryption
      - TZ=Asia/Shanghai                             # Timezone
      # - NODE_TYPE=slave        # For multi-node deployment
      # - SYNC_FREQUENCY=60      # Cache sync interval
      # - FRONTEND_BASE_URL=...  # External frontend URL
    depends_on:
      - redis
      - db

  redis:
    image: redis:latest
    restart: always

  db:
    image: mysql:8.2.0
    volumes:
      - ./data/mysql:/var/lib/mysql
    environment:
      MYSQL_ROOT_PASSWORD: 'OneAPI@justsong'
      MYSQL_USER: oneapi
      MYSQL_PASSWORD: '123456'
      MYSQL_DATABASE: one-api
```

**Deployment Options:**
1. **Standalone**: SQLite + no Redis (simplest)
2. **Production**: MySQL + Redis (recommended)
3. **Multi-node**: Master node + slave nodes (scalable)

### 7.3. Environment Variables

**Database:**
- `SQL_DSN` - Database connection string
  - MySQL: `user:pass@tcp(host:3306)/dbname`
  - PostgreSQL: `postgres://user:pass@host:5432/dbname`
  - Empty = SQLite (default)
- `SQLITE_PATH` - SQLite file path (default: `./one-api.db`)

**Redis:**
- `REDIS_CONN_STRING` - Redis connection (e.g., `redis://localhost:6379`)

**Server:**
- `PORT` - HTTP port (default: 3000)
- `SESSION_SECRET` - Session encryption key (required)
- `GIN_MODE` - `release` or `debug`

**Features:**
- `THEME` - Frontend theme: `default`, `berry`, or `air`
- `CHANNEL_TEST_FREQUENCY` - Auto-test channels (seconds)
- `BATCH_UPDATE_ENABLED` - Batch database updates
- `SYNC_FREQUENCY` - Cache sync interval (seconds)

**Multi-node:**
- `NODE_TYPE` - `master` or `slave`
- `FRONTEND_BASE_URL` - External frontend URL for slaves

## 8. Key Features & Patterns

### 8.1. Load Balancing

**Channel Selection Algorithm:**
1. Filter channels by user group and model
2. Filter by status (enabled only)
3. Sort by priority (higher first)
4. Within same priority, random selection with weight
5. Retry with lower priority if failed

**Weight-based Distribution:**
```go
// Channels with higher weight get more requests
channel.Weight = 10  // Gets 10x more requests than weight=1
```

### 8.2. Billing & Quota Management

**Quota System:**
- User quota (total available)
- Token quota (per API key)
- Pre-consumed quota (reserved before request)
- Usage tracking per request

**Billing Calculation:**
```
Cost = (PromptTokens * PromptRatio + CompletionTokens * CompletionRatio)
       * ModelRatio * GroupRatio * QuotaPerUnit
```

**Ratios:**
- `ModelRatio` - Per model pricing (e.g., GPT-4 = 30x GPT-3.5)
- `GroupRatio` - Per user group multiplier
- `CompletionRatio` - Completion vs prompt token ratio
- `QuotaPerUnit` - USD to quota conversion

### 8.3. Monitoring & Metrics

**Request Logging:**
- All requests logged to database
- Includes: model, tokens, cost, latency, status
- Searchable by user, channel, model, date range

**Channel Health:**
- Auto-disable on repeated failures
- Response time tracking
- Balance monitoring
- Periodic testing

**Rate Limiting:**
- Global API rate limit
- Global web rate limit
- Critical endpoints (login, register)
- Per-IP tracking (Redis or in-memory)

### 8.4. Security Features

**Authentication:**
- Session-based (cookie) for web UI
- Token-based (Bearer) for API
- Multiple OAuth providers (GitHub, WeChat, OIDC, Lark)

**Authorization:**
- Role-based: User (1), Admin (10), Root (100)
- Token-level model restrictions
- User group-based channel access

**API Key Management:**
- 48-character random keys
- Expiration dates
- Quota limits per key
- Model restrictions per key

## 9. Cấu trúc Database Schema

**Main Tables:**
1. `users` - User accounts
2. `tokens` - API keys
3. `channels` - AI provider configurations
4. `abilities` - Channel-model mappings
5. `logs` - Request logs
6. `redemptions` - Redemption codes
7. `options` - System settings

**Relationships:**
- User 1:N Token
- Channel 1:N Ability
- User 1:N Log
- Token 1:N Log

## 10. Workflow Examples

### 10.1. User Makes API Request

```
1. Client sends: POST /v1/chat/completions
   Headers: Authorization: Bearer sk-xxx
   Body: { model: "gpt-4", messages: [...] }

2. TokenAuth middleware:
   - Validates token sk-xxx
   - Checks user status
   - Extracts model from body
   - Sets context: userId, tokenId, requestModel

3. Distribute middleware:
   - Gets user group (e.g., "vip")
   - Finds channels: group="vip" AND model="gpt-4" AND status=enabled
   - Selects channel by priority/weight
   - Sets context: channelId, channelConfig

4. Relay controller:
   - Gets adaptor for channel type (e.g., OpenAI)
   - Converts request to provider format
   - Forwards to provider API
   - Streams response back to client

5. Post-processing:
   - Calculates usage (tokens, cost)
   - Deducts quota from user & token
   - Records log entry
   - Updates channel stats
```

### 10.2. Admin Adds New Channel

```
1. Admin logs in to web UI
2. Navigates to Channel page
3. Clicks "Add Channel"
4. Fills form:
   - Type: OpenAI
   - Name: "My OpenAI Channel"
   - Key: sk-...
   - Models: ["gpt-4", "gpt-3.5-turbo"]
   - Group: "default"
   - Priority: 0
5. Submits form
6. Backend:
   - Creates channel record
   - Creates ability records (channel-model mappings)
   - Tests channel (optional)
   - Updates cache
7. Channel is now available for requests
```

## 11. Tổng kết

### Điểm mạnh:
- ✅ Kiến trúc modular, dễ mở rộng
- ✅ Hỗ trợ 30+ AI providers
- ✅ Load balancing & failover
- ✅ Comprehensive billing system
- ✅ Multi-theme frontend
- ✅ Docker deployment ready
- ✅ i18n support (backend + default theme)

### Điểm cần cải thiện:
- ⚠️ Berry & Air themes chưa có i18n
- ⚠️ Backend i18n coverage còn hạn chế
- ⚠️ Documentation có thể chi tiết hơn
- ⚠️ Test coverage chưa đầy đủ

### Khuyến nghị:
1. Thêm i18n cho Berry và Air themes
2. Mở rộng backend i18n coverage
3. Thêm unit tests và integration tests
4. Cải thiện monitoring và alerting
5. Thêm API documentation (Swagger/OpenAPI)


