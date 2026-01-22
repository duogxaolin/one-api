# Docker Deployment Guide

This guide covers deploying One API using Docker and Docker Compose.

## Prerequisites

- Docker 20.10+
- Docker Compose 2.0+
- At least 2GB RAM available
- 10GB disk space recommended

## Quick Start (Development)

For local development and testing:

```bash
# Clone the repository
git clone https://github.com/songquanpeng/one-api.git
cd one-api

# Start with default configuration
docker-compose up -d

# View logs
docker-compose logs -f one-api
```

Access the application at `http://localhost:3000`

Default credentials: `root` / `123456`

## Production Deployment

### Step 1: Prepare Environment

```bash
# Copy environment template
cp .env.example .env

# Generate secure session secret
openssl rand -hex 32
```

### Step 2: Configure Environment Variables

Edit `.env` file with your production values:

```bash
# REQUIRED: Set secure passwords
SESSION_SECRET=<generated-secret>
MYSQL_ROOT_PASSWORD=<strong-password>
MYSQL_PASSWORD=<strong-password>

# Update SQL_DSN with your MySQL password
SQL_DSN=oneapi:<your-password>@tcp(db:3306)/one-api
```

### Step 3: Deploy

```bash
# Start production stack
docker-compose -f docker-compose.prod.yml up -d

# Verify all services are healthy
docker-compose -f docker-compose.prod.yml ps
```

### Step 4: Verify Deployment

```bash
# Check application health
curl http://localhost:3000/api/status

# View logs
docker-compose -f docker-compose.prod.yml logs -f one-api
```

## Environment Variables Reference

### Application

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Application port |
| `GIN_MODE` | `release` | Gin framework mode (`debug`/`release`) |
| `TZ` | `Asia/Ho_Chi_Minh` | Timezone |
| `SESSION_SECRET` | - | **Required**. Session encryption key |
| `THEME` | `default` | UI theme (`default`/`berry`/`air`) |

### Database

| Variable | Default | Description |
|----------|---------|-------------|
| `SQL_DSN` | - | MySQL/PostgreSQL connection string |
| `LOG_SQL_DSN` | - | Separate database for logs (optional) |
| `SQL_MAX_IDLE_CONNS` | `100` | Max idle connections |
| `SQL_MAX_OPEN_CONNS` | `1000` | Max open connections |
| `SQL_CONN_MAX_LIFETIME` | `60` | Connection lifetime (minutes) |

### Redis

| Variable | Default | Description |
|----------|---------|-------------|
| `REDIS_CONN_STRING` | - | Redis connection URL |
| `REDIS_PASSWORD` | - | Redis password (for cluster/sentinel) |
| `REDIS_MASTER_NAME` | - | Redis Sentinel master name |
| `SYNC_FREQUENCY` | `600` | Cache sync frequency (seconds) |

### Performance

| Variable | Default | Description |
|----------|---------|-------------|
| `MEMORY_CACHE_ENABLED` | `false` | Enable in-memory caching |
| `BATCH_UPDATE_ENABLED` | `false` | Enable batch database updates |
| `BATCH_UPDATE_INTERVAL` | `5` | Batch update interval (seconds) |

### Rate Limiting

| Variable | Default | Description |
|----------|---------|-------------|
| `GLOBAL_API_RATE_LIMIT` | `480` | API rate limit per 3 minutes |
| `GLOBAL_WEB_RATE_LIMIT` | `240` | Web rate limit per 3 minutes |

### Multi-Node

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_TYPE` | `master` | Node type (`master`/`slave`) |
| `FRONTEND_BASE_URL` | - | Frontend URL for slave nodes |

### Metrics

| Variable | Default | Description |
|----------|---------|-------------|
| `ENABLE_METRIC` | `false` | Enable channel metrics |
| `METRIC_QUEUE_SIZE` | `10` | Metrics queue size |
| `METRIC_SUCCESS_RATE_THRESHOLD` | `0.8` | Success rate threshold |

### External APIs

| Variable | Default | Description |
|----------|---------|-------------|
| `RELAY_TIMEOUT` | `0` | API relay timeout (seconds, 0=no timeout) |
| `RELAY_PROXY` | - | Proxy for API requests |
| `GEMINI_VERSION` | `v1` | Gemini API version |
| `GEMINI_SAFETY_SETTING` | `BLOCK_NONE` | Gemini safety setting |

### Initial Setup

| Variable | Default | Description |
|----------|---------|-------------|
| `INITIAL_ROOT_TOKEN` | - | Auto-create root token on first start |
| `INITIAL_ROOT_ACCESS_TOKEN` | - | Auto-create root access token |

## Volume Management

### Data Persistence

Production compose uses named volumes:

| Volume | Purpose |
|--------|---------|
| `one-api-data` | Application data (SQLite if used) |
| `one-api-logs` | Application logs |
| `redis-data` | Redis persistence |
| `mysql-data` | MySQL database files |

### Backup

```bash
# Backup MySQL
docker exec one-api-mysql mysqldump -u root -p one-api > backup.sql

# Backup volumes
docker run --rm -v one-api-data:/data -v $(pwd):/backup alpine \
  tar czf /backup/one-api-data.tar.gz /data
```

### Restore

```bash
# Restore MySQL
docker exec -i one-api-mysql mysql -u root -p one-api < backup.sql

# Restore volumes
docker run --rm -v one-api-data:/data -v $(pwd):/backup alpine \
  tar xzf /backup/one-api-data.tar.gz -C /
```

## Scaling & Multi-Node

### Master-Slave Setup

1. Deploy master node:
```bash
# .env on master
NODE_TYPE=master
```

2. Deploy slave nodes:
```bash
# .env on slave
NODE_TYPE=slave
SYNC_FREQUENCY=60
FRONTEND_BASE_URL=https://your-master-domain.com
SQL_DSN=<same-as-master>
REDIS_CONN_STRING=<same-as-master>
```

## Troubleshooting

### Container Won't Start

```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs one-api

# Common issues:
# - Missing SESSION_SECRET
# - Invalid SQL_DSN format
# - Database not ready (wait for healthcheck)
```

### Database Connection Failed

```bash
# Verify MySQL is healthy
docker-compose -f docker-compose.prod.yml ps db

# Test connection
docker exec -it one-api-mysql mysql -u oneapi -p
```

### Redis Connection Failed

```bash
# Verify Redis is healthy
docker-compose -f docker-compose.prod.yml ps redis

# Test connection
docker exec -it one-api-redis redis-cli ping
```

### High Memory Usage

- Reduce `SQL_MAX_OPEN_CONNS`
- Enable `BATCH_UPDATE_ENABLED`
- Adjust container resource limits in compose file

## Upgrade Procedures

### Standard Upgrade

```bash
# Pull latest images
docker-compose -f docker-compose.prod.yml pull

# Restart with new images
docker-compose -f docker-compose.prod.yml up -d

# Verify health
docker-compose -f docker-compose.prod.yml ps
```

### Upgrade with Backup

```bash
# 1. Backup database
docker exec one-api-mysql mysqldump -u root -p one-api > backup-$(date +%Y%m%d).sql

# 2. Stop services
docker-compose -f docker-compose.prod.yml down

# 3. Pull and restart
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
```

