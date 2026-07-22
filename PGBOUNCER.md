# PgBouncer — PostgreSQL Connection Pooler Guide

This document provides a complete guide to the **PgBouncer** connection pooler setup used in **NestGqlBoilerplate** (NestJS 11 + Prisma ORM + PostgreSQL).

---

## 📋 Table of Contents

1. [Overview & Why PgBouncer?](#1-overview--why-pgbouncer)
2. [High-Level Architecture](#2-high-level-architecture)
3. [PgBouncer Pool Modes Explained](#3-pgbouncer-pool-modes-explained)
4. [Prisma ORM Compatibility & Integration](#4-prisma-orm-compatibility--integration)
5. [Production Configuration Files](#5-production-configuration-files)
6. [VPS Service Management Commands](#6-vps-service-management-commands)
7. [PgBouncer Admin Console & Monitoring](#7-pgbouncer-admin-console--monitoring)
8. [Troubleshooting Common Issues](#8-troubleshooting-common-issues)

---

## 1. Overview & Why PgBouncer?

PostgreSQL creates a dedicated OS process for **every single client connection**. Each process consumes ~2 MB to 10 MB of RAM. 
When hundreds of concurrent GraphQL queries hit your NestJS API, spawning hundreds of raw PostgreSQL connections can quickly exhaust server memory (OOM crashes) or trigger `FATAL: sorry, too many clients already`.

### Benefits of PgBouncer:
* **Massive Concurrency Support**: Allows up to **1,000 concurrent client connections** from NestJS / serverless functions down to a small, optimized pool of **25 backend PostgreSQL connections**.
* **Ultra-Low Memory Footprint**: Written in C using `libevent`. PgBouncer consumes only ~2 KB to 3 KB per client connection.
* **Blazing Fast Response Times**: Eliminates the heavy TCP handshake overhead of creating new PostgreSQL connections for every GraphQL request.

---

## 2. High-Level Architecture

```
               ┌────────────────────────────────────────────────────────┐
               │              Incoming GraphQL Traffic                  │
               └──────────────────────────┬─────────────────────────────┘
                                          │
                                          ▼
                       ┌─────────────────────────────────────┐
                       │     NestJS API (Prisma Client)      │
                       └──────────────────┬──────────────────┘
                                          │  Port 6432 (PgBouncer)
                                          ▼
                       ┌─────────────────────────────────────┐
                       │        PgBouncer Connection         │
                       │     Pooler (1,000 Max Clients)      │
                       └──────────────────┬──────────────────┘
                                          │  Port 5432 (Internal PostgreSQL)
                                          ▼
                       ┌─────────────────────────────────────┐
                       │    PostgreSQL Database Engine       │
                       │     (25 Backend Server Conns)       │
                       └─────────────────────────────────────┘
```

---

## 3. PgBouncer Pool Modes Explained

PgBouncer supports three distinct pool modes:

| Pool Mode | Description | Prisma / Web API Suitability |
| :--- | :--- | :--- |
| **Transaction** (`pool_mode = transaction`) | Connection assigned to client for duration of a single transaction block (`BEGIN` ... `COMMIT`). Returned to pool immediately after. | ⭐ **RECOMMENDED for Prisma & NestJS** |
| **Session** (`pool_mode = session`) | Connection assigned when client logs in and kept until client disconnects. | ⚠️ High RAM usage under heavy load. |
| **Statement** (`pool_mode = statement`) | Connection returned after every single SQL query. | ❌ Breaks multi-statement transactions. |

---

## 4. Prisma ORM Compatibility & Integration

### A. Environment Connection URL (`.env`)
When connecting Prisma to PgBouncer in `transaction` mode, append `?pgbouncer=true` to the `DATABASE_URL`:

```env
# Connection via PgBouncer Pooler (Port 6432)
DATABASE_URL="postgresql://nestuser:YOUR_PASSWORD@127.0.0.1:6432/nestgql_db?schema=public&pgbouncer=true"

# Direct Connection to PostgreSQL (Port 5432) - Used for Prisma Schema Migrations
DIRECT_URL="postgresql://nestuser:YOUR_PASSWORD@127.0.0.1:5432/nestgql_db?schema=public"
```

### B. Startup Parameter Settings (`pgbouncer.ini`)
Prisma sends `extra_float_digits` and `search_path` startup parameters upon establishing a database connection. By default, PgBouncer in transaction mode rejects these parameters with `FATAL: unsupported startup parameter`.

**Fix**: Add `ignore_startup_parameters` to `/etc/pgbouncer/pgbouncer.ini`:
```ini
ignore_startup_parameters = extra_float_digits, search_path
```

---

## 5. Production Configuration Files

### File 1: `/etc/pgbouncer/pgbouncer.ini`
```ini
[databases]
nestgql_db = host=127.0.0.1 port=5432 dbname=nestgql_db

[pgbouncer]
logfile = /var/log/postgresql/pgbouncer.log
pidfile = /var/run/postgresql/pgbouncer.pid
listen_addr = *
listen_port = 6432
auth_type = plain
auth_file = /etc/pgbouncer/userlist.txt
admin_users = postgres
pool_mode = transaction
ignore_startup_parameters = extra_float_digits, search_path

; Connection Limits
max_client_conn = 1000
default_pool_size = 25
min_pool_size = 5
reserve_pool_size = 5
reserve_pool_timeout = 5
```

### File 2: `/etc/pgbouncer/userlist.txt`
Contains plain text or MD5 hashed credentials for database users allowed to connect:
```text
"nestuser" "YOUR_STRONG_PASSWORD"
"postgres" "YOUR_STRONG_PASSWORD"
```

* File Permissions:
  ```bash
  chown postgres:postgres /etc/pgbouncer/userlist.txt
  chmod 640 /etc/pgbouncer/userlist.txt
  ```

---

## 6. VPS Service Management Commands

* **Check Service Status**:
  ```bash
  systemctl status pgbouncer
  ```
* **Restart PgBouncer**:
  ```bash
  systemctl restart pgbouncer
  ```
* **Reload Configuration without dropping connections**:
  ```bash
  systemctl reload pgbouncer
  ```
* **View Live PgBouncer Logs**:
  ```bash
  tail -f /var/log/postgresql/pgbouncer.log
  ```

---

## 7. PgBouncer Admin Console & Monitoring

PgBouncer includes a built-in virtual administration database called `pgbouncer`.

### Connect to Admin Console:
```bash
psql -h 127.0.0.1 -p 6432 -U postgres pgbouncer
```

### Useful Inspection Commands:
```sql
-- Show active pools, client count, and server connection counts
SHOW POOLS;

-- Show total queries, transaction counts, and average response latency
SHOW STATS;

-- List connected NestJS client connections
SHOW CLIENTS;

-- List active backend PostgreSQL database server connections
SHOW SERVERS;

-- Reload configuration live
RELOAD;
```

---

## 8. Troubleshooting Common Issues

### Issue 1: `FATAL: unsupported startup parameter: search_path`
* **Cause**: Prisma sends `search_path` on connection start, which PgBouncer rejects in `transaction` mode.
* **Fix**: Ensure `/etc/pgbouncer/pgbouncer.ini` includes:
  ```ini
  ignore_startup_parameters = extra_float_digits, search_path
  ```
  Then run `systemctl restart pgbouncer`.

### Issue 2: `FATAL: password authentication failed`
* **Cause**: User credentials in `/etc/pgbouncer/userlist.txt` do not match PostgreSQL `pg_shadow`.
* **Fix**: Re-generate `userlist.txt` directly from PostgreSQL:
  ```bash
  sudo -u postgres psql -t -A -c "SELECT concat('\"', usename, '\" \"', passwd, '\"') FROM pg_shadow WHERE usename='nestuser';" > /etc/pgbouncer/userlist.txt
  systemctl restart pgbouncer
  ```

### Issue 3: `Prepared statements not supported`
* **Cause**: Prisma uses named prepared statements by default, which can conflict with `transaction` pool mode across different client connections.
* **Fix**: Append `?pgbouncer=true` to your `DATABASE_URL` in `.env`. Prisma will automatically disable named prepared statements and use binary parameter substitution.
