# The Grand Azure – Hotel Management System (Backend API)

Domain-modular, production-ready backend API service for **The Grand Azure Hotel Management System**, engineered for high reliability, append-only ledger accounting, dual-slab Indian GST compliance, dynamic surge pricing, and seamless PostgreSQL / Supabase synchronization.

---

## 🛠️ Technology Stack

- **Runtime**: Node.js v20+ LTS
- **Language**: TypeScript 5.7+
- **HTTP Server**: Express.js
- **API Documentation**: OpenAPI 3.0 / Swagger UI (`/api/docs`)
- **Database System of Record**: PostgreSQL 16+ (with Supabase dual-mode adapter)
- **Asynchronous Architecture**: Transactional Outbox Pattern & Event Bus
- **Process Supervisor**: PM2 (Cluster Mode)

---

## 📡 REST API Module Overview

| Module Router | Endpoint Prefix | Operational Responsibilities |
| :--- | :--- | :--- |
| **Hotel Router** | `/api/rooms`, `/api/hotel` | Room matrix, state machine (`Available` → `Occupied` → `Dirty` → `Cleaning`), hotel property master, logo URL, and **dynamic field validation policies** (`/api/hotel/field-validations`). |
| **Reservation Router** | `/api/reservations` | Booking creation, check-in, guest folios, and daily room inventory allocation. |
| **Pricing Engine** | `/api/pricing` | Dynamic surge pricing calculation with weekend and occupancy multipliers. |
| **Billing Router** | `/api/billing` | Append-only folios, dual-slab GST calculation (`996311`/`996331`), invoice generation, payment settlement. |
| **POS & Kitchen** | `/api/pos` | Restaurant menu catalog CRUD, table and room-service ordering, live KDS ticket advancement. |
| **Inventory Router** | `/api/inventory` | Stock SKUs CRUD, low-stock threshold alerts, and stock adjustments. |
| **Workforce Router** | `/api/staff`, `/api/workforce` | Staff directory CRUD, biometric attendance punch-in/out, and shift schedules. |
| **Identity & Users** | `/api/users`, `/api/auth` | User account provisioning, authentication, and role assignments (`Admin`, `Reception`, `Housekeeping`, `Kitchen`). |
| **Housekeeping** | `/api/housekeeping` | Cleaning tasks, turnaround status, and technician maintenance work orders. |
| **Integration & Supabase** | `/api/integrations/supabase` | Supabase connection health check, runtime credential management, and 1-click master data cloud synchronization. |

---

## 🛡️ Dynamic Field Validation Policies

The backend exposes configuration endpoints allowing administrators to establish and enforce validation rules across the entire hotel management suite:

- **`GET /api/hotel/field-validations`**: Retrieves current field validation configuration map (required flags, min/max lengths, regex patterns, custom error messages).
- **`PUT /api/hotel/field-validations`**: Updates and persists field validation policies, logging an immutable audit record (`VALIDATION_RULES_UPDATED`) to the system ledger.

Supported field identifiers include:

- `guestPhone`: Indian 10-digit mobile number validation (`^[6-9]\d{9}$`).
- `guestEmail`: RFC 5322 compliant email regex.
- `guestGstin`: Indian 15-character Goods & Services Tax Identification Number (`^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$`).
- `guestAadhaar`: 12-digit Indian National Unique ID (`^\d{12}$`).
- `guestPan`: 10-character Permanent Account Number (`^[A-Z]{5}[0-9]{4}[A-Z]{1}$`).
- `roomTariff`: Positive numeric currency validation (`^\d+(\.\d{1,2})?$`).
- `inventoryThreshold`: Positive integer stock threshold validation (`^\d+$`).

---

## 🚀 Running & Building Backend

Run within the `backend/` directory:

### 1. Development Mode with Live Watch

```bash
npm run dev
```

Uses `tsx watch` for instantaneous TypeScript execution and hot-reloading on port `5000`.

### 2. Typecheck & Lint

```bash
npm run lint
```

Runs TypeScript compiler (`tsc --noEmit`) to verify 100% strict type adherence.

### 3. Production Build

```bash
npm run build
```

Compiles TypeScript into production JavaScript bundles in `dist/server.js`.

### 4. Start Production Server

```bash
npm start
```

Runs `node dist/server.js`.

---

## ⚙️ Environment Variables

Create `.env` inside `backend/`:

```env
NODE_ENV=production
PORT=5000
HOST=127.0.0.1

# PostgreSQL Database Connection
DATABASE_URL=postgresql://hms_user:YourSecureStrongPassword123!@127.0.0.1:5432/grand_azure_hms

# Allowed CORS Origins
CORS_ORIGIN=http://localhost:3000,https://hms.yourdomain.com

# Property Master
PROPERTY_CODE=GA-GOA
PROPERTY_NAME="The Grand Azure Hotel & Suites"
DEFAULT_CURRENCY=INR
DEFAULT_CURRENCY_SYMBOL=₹

# Optional: Supabase Credentials (leave blank to run in local/in-memory mode)
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```
