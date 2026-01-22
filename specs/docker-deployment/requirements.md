# Docker Deployment Enhancement

## Overview

Improve Docker deployment experience by adding missing configuration files for production readiness, security, and documentation.

## User Stories

### Story 1: Optimized Docker Build
As a DevOps engineer, I want a `.dockerignore` file so that Docker build context is smaller and builds are faster.

**Acceptance Criteria**:
- [x] WHEN building Docker image, THE SYSTEM SHALL exclude unnecessary files (node_modules, .git, logs, IDE configs, test files)
- [x] WHEN `.dockerignore` is applied, THE SYSTEM SHALL reduce build context size by at least 50%

### Story 2: Production-Ready Docker Compose
As a system administrator, I want a production Docker Compose configuration so that I can deploy One API securely with proper resource management.

**Acceptance Criteria**:
- [x] THE SYSTEM SHALL provide `docker-compose.prod.yml` with resource limits for all services
- [x] THE SYSTEM SHALL configure logging with json-file driver and size rotation (max 10MB, 3 files)
- [x] THE SYSTEM SHALL enable Redis persistence (AOF or RDB)
- [x] THE SYSTEM SHALL isolate services using custom Docker network
- [x] THE SYSTEM SHALL NOT expose MySQL port (3306) to host in production config
- [x] THE SYSTEM SHALL use environment variable references instead of hardcoded credentials
- [x] WHEN deploying with production config, THE SYSTEM SHALL require `.env` file for all secrets

### Story 3: Complete Environment Configuration
As a developer, I want a comprehensive `.env.example` file so that I know all available configuration options.

**Acceptance Criteria**:
- [x] THE SYSTEM SHALL document all environment variables with descriptive comments
- [x] THE SYSTEM SHALL include variables for: Database (SQL_DSN, LOG_SQL_DSN, SQL_MAX_IDLE_CONNS, SQL_MAX_OPEN_CONNS, SQL_CONN_MAX_LIFETIME)
- [x] THE SYSTEM SHALL include variables for: Redis (REDIS_CONN_STRING, REDIS_PASSWORD, REDIS_MASTER_NAME, SYNC_FREQUENCY)
- [x] THE SYSTEM SHALL include variables for: Application (PORT, SESSION_SECRET, GIN_MODE, TZ, THEME)
- [x] THE SYSTEM SHALL include variables for: Features (MEMORY_CACHE_ENABLED, BATCH_UPDATE_ENABLED, BATCH_UPDATE_INTERVAL)
- [x] THE SYSTEM SHALL include variables for: Rate Limiting (GLOBAL_API_RATE_LIMIT, GLOBAL_WEB_RATE_LIMIT)
- [x] THE SYSTEM SHALL include variables for: Metrics (ENABLE_METRIC, METRIC_QUEUE_SIZE, METRIC_SUCCESS_RATE_THRESHOLD)
- [x] THE SYSTEM SHALL include variables for: Multi-node (NODE_TYPE, FRONTEND_BASE_URL)
- [x] THE SYSTEM SHALL include variables for: Debug (DEBUG, DEBUG_SQL)
- [x] THE SYSTEM SHALL include variables for: Initial Setup (INITIAL_ROOT_TOKEN, INITIAL_ROOT_ACCESS_TOKEN)
- [x] THE SYSTEM SHALL include variables for: External APIs (RELAY_TIMEOUT, GEMINI_VERSION, GEMINI_SAFETY_SETTING)
- [x] THE SYSTEM SHALL include variables for: MySQL container (MYSQL_ROOT_PASSWORD, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE)

### Story 4: Deployment Documentation
As a new user, I want clear deployment documentation so that I can deploy One API using Docker without issues.

**Acceptance Criteria**:
- [x] THE SYSTEM SHALL provide `docs/docker-deployment.md` with step-by-step instructions
- [x] THE SYSTEM SHALL document prerequisites (Docker, Docker Compose versions)
- [x] THE SYSTEM SHALL document quick start for development environment
- [x] THE SYSTEM SHALL document production deployment steps
- [x] THE SYSTEM SHALL document environment variable configuration
- [x] THE SYSTEM SHALL document volume management and data persistence
- [x] THE SYSTEM SHALL document common troubleshooting scenarios
- [x] THE SYSTEM SHALL document upgrade procedures

## Out of Scope

- Kubernetes/Helm charts
- Monitoring stack (Prometheus/Grafana)
- Nginx/reverse proxy configuration
- Deployment automation scripts (deploy.sh, backup.sh)
- SSL/TLS certificate management

## Context

### Current State
- `Dockerfile`: Multi-stage build (Node.js + Go) - complete
- `docker-compose.yml`: Basic setup with one-api + MySQL + Redis
- `.env.example`: Only 3 variables (PORT, DEBUG, HTTPS_PROXY)
- No `.dockerignore` file exists
- Hardcoded credentials in `docker-compose.yml` (lines 15, 46-48)

### Related Files
- `Dockerfile`: lines 1-47
- `docker-compose.yml`: lines 1-49
- `.env.example`: lines 1-3
- `common/config/config.go`: lines 56-159 (environment variable definitions)
- `common/redis.go`: lines 17-53 (Redis configuration)
- `README.md`: lines 352-382 (environment variable documentation in Chinese)

