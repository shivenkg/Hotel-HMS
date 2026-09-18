# The Grand Azure – Hotel Management System (HMS)

> A production-ready, domain-modular Hotel Management System (HMS) built around **PostgreSQL 16/17+ as the authoritative system of record**, event-driven asynchronous integration, and managed cloud deployments (Ubuntu Server, AWS, and GCP). Covers the complete hospitality lifecycle from omnichannel reservations to digital KYC, append-only folio billing with dual-slab GST, restaurant POS with Kitchen Display (KDS), stock ledgers, duty rosters, dynamic pricing, front desk month-view calendar with HTML5 drag-and-drop rescheduling, an Admin Field Validation Policy Engine, and a full Master Data & Admin Management Center with Supabase integration.

Built with design inspiration from the modern **Lodgify** hospitality interface, featuring clean aesthetics, pastel visual hierarchy, and signature electric-lime accents. Native currency support in Indian Rupee (**₹ / INR**) and persistent Dark Mode theming.

---

## 🏛️ Architecture & System Blueprint

```text
                                [ Client Applications ]
  ┌─────────────────────────┬─────────────────────────┬─────────────────────────┐
  │ Front Desk Web (React)  │ Housekeeping & Staff App│ Restaurant POS (PWA)    │
  └────────────┬────────────┴────────────┬────────────┴────────────┬────────────┘
               │                         │                         │
               ▼                         ▼                         ▼
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │         API Gateway / Domain-Modular Monolith (Express / Node.js API)       │
  │   [Identity] [Hotel] [Reservation] [Billing] [POS] [Inventory] [Workforce]  │
  │         [Master Data & Admin Center] [Supabase Dual-Mode Adapter]           │
  └──────────────────────────────────────┬──────────────────────────────────────┘
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 │                                               │
                 ▼ (ACID / RLS Transactions)                     ▼ (Async Events)
  ┌──────────────────────────────────────────────┐    ┌──────────────────────────┐
  │         PostgreSQL 16/17+ System of Record    │    │   Transactional Outbox   │
  │  13 Schemas: identity, hotel, guest, stay,   │───▶│   & Event Bus Engine     │
  │  reservation, billing, pos, inventory, hk,   │    └─────────────┬────────────┘
  │  workforce, audit, integration, reporting    │                  │
  │                                              │                  ▼
  │  - Append-Only Financial & Stock Ledgers     │       [ RabbitMQ / Redis PubSub ]
  │  - Multi-Tenant Row-Level Security (RLS)     │                  │
  │  - Daily Room Availability Matrix            │                  ▼
  │  - Supabase Database Link & Schema Sync      │    [ OTA Sync / KDS / Billing ]
  └──────────────────────────────────────────────┘
```

---

## 📦 Core Domain Modules & Technical Schemas

| Domain Module | Schema | Purpose & Key Tables | Concurrency & Ledger Controls |
| :--- | :--- | :--- | :--- |
| **Master Data & Admin** | `hotel` / `pos` / `inventory` | `rooms`, `pricing_configs`, `menu_items`, `items`, `staff` | Full CRUD for rooms, tariffs, F&B menu catalog, inventory SKUs, workforce, property profile with logo upload, and **Dynamic Field Validation Policies**. |
| **Identity & RBAC** | `identity` | `tenants`, `users` | Multi-tenant isolation with scoped roles (`Admin`, `Reception`, `Housekeeping`, `Kitchen`). |
| **Hotel Catalog** | `hotel` | `properties`, `room_types`, `rooms`, `outlets` | Room operational state machine (`Available` → `Occupied` → `Dirty` → `Cleaning` → `Inspected`). |
| **Guest CRM & KYC** | `guest` | `guests`, `feedback`, `loyalty_members` | Encrypted KYC document verification (`Passport`, `National ID`, `Aadhaar`), NPS sentiment scoring. |
| **Reservation Engine** | `reservation` | `reservations`, `room_inventory_daily`, `pricing_configs` | Daily matrix inventory allocation; dynamic surge pricing engine; **interactive month calendar with HTML5 drag-and-drop rescheduling**. |
| **Stay & Front Desk** | `stay` | `checkin_records`, `checkout_records` | Check-in KYC sync; **Today's Arrivals widget** with 1-click check-in; automated turnover dispatch to Housekeeping on checkout. |
| **Folio & Billing** | `billing` | `folios`, `folio_entries`, `journal_entries`, `journal_lines` | **Append-only ledger** with reversals; dual-slab GST (`996311`/`996331`); payment settlement in ₹; **daily summary PDF export**. |
| **POS & Kitchen** | `pos` | `pos_orders`, `pos_order_items`, `menu_items` | Touch ordering; live KDS ticket progression; automatic charge-to-room folio routing. |
| **Inventory Ledger** | `inventory` | `items`, `stock_ledger`, `stock_balances` | **Append-only stock movements** (`PURCHASE`, `KITCHEN_ISSUE`, `WASTAGE`); **low-stock visual alert badges & threshold filters**. |
| **Housekeeping** | `housekeeping` | `tasks`, `maintenance_work_orders` | Turnover tasks, inspection checklists, technician work order resolution workflows. |
| **Workforce & HR** | `workforce` | `staff`, `attendance_records`, `leave_requests` | Shift rosters, biometric punch-in/out attendance simulator, supervisor leave approvals. |
| **Audit & Security** | `audit` | `audit_log` | Immutable append-only audit trail logging actors, roles, actions, timestamps, and IPs. |
| **Integration & OTAs** | `integration` | `outbox_events`, `ota_channel_sync_logs` | **Transactional Outbox pattern**; 2-way rate parity broadcast (Booking.com, Expedia, Airbnb). |
| **Database Cloud Hub** | `integration` | Supabase Cloud Connector | Live connection health probe, schema migration generator, and 1-click cloud synchronization. |

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Web** | React 19, TypeScript, Vite 8, Lucide React, Recharts, jsPDF, Modern Lodgify Design System |
| **Backend API** | Node.js v20+, TypeScript, Express Modular Architecture with REST Endpoints |
| **System of Record** | PostgreSQL 16/17+ (Schemas, Append-Only Ledgers, RLS, Supabase Integration) |
| **Currency** | Native Indian Rupee (**₹ / INR**) with formatted pricing across all folios and catalogs |
| **Event Engine** | Transactional Outbox Pattern, Asynchronous Event Bus, RabbitMQ / Redis |
| **API Contracts** | OpenAPI 3.0 / Swagger Interactive UI (`/api/docs`) |
| **Tax & Pricing** | Dual-Slab GST Engine (12% vs 18% accommodation, 5% F&B), Dynamic Surge Multiplier |
| **Process Manager** | PM2 Cluster Mode with Zero-Downtime Reloads |
| **Reverse Proxy** | Nginx with Gzip Compression, Security Headers, and Let's Encrypt TLS |
| **Containers** | Docker Compose with PostgreSQL 16, Redis 7, RabbitMQ 3 Management |
| **Cloud Deployments** | **Ubuntu Server 22.04/24.04**, **AWS** (ECS + RDS + S3), and **GCP** (Cloud Run + Cloud SQL) |
| **CI/CD & Tests** | GitHub Actions pipeline, Oxlint static linting, 19 End-to-End Enterprise UAT Hospitality Use Cases (`npm test`) |

---

## 👑 Master Data & Admin Management Center

Accessible to users with the `Admin` role via the **Master Data & Admin** sidebar tab or settings gear:

1. **🏨 Rooms Matrix**: Create, update, filter, and delete rooms with floor, category, tariff in ₹, and amenities.
2. **📈 Rates & Dynamic Surge**: Base tariffs by category, occupancy trigger thresholds, surge/weekend multipliers, and live rate simulator.
3. **🍽️ F&B Menu Catalog**: Dish creation, pricing in ₹, category filtering, preparation times, and real-time synchronization with POS ordering.
4. **📦 Inventory Catalog**: Stock tracking, minimum threshold alerts, unit costs in ₹, supplier assignments, and low-stock visual alert badges.
5. **👥 Staff & Workforce**: Employee directory, shifts, departments, contact information, and duty status management.
6. **🏢 Hotel Master Profile & Logo Upload**: Entity name, GSTIN, HSN/SAC codes, address, contact details, and **official brand logo upload** with instant live sidebar preview and persistent synchronization.
7. **🛡️ Field Validation Policy Engine**: Dynamic validation configuration interface allowing administrators to enforce required fields, min/max lengths, custom regex patterns, and tailored error messages, paired with a **live interactive regex sandbox / test simulator**.
8. **📋 Standardized Master Dropdown Datasets**: 36 Indian States & Union Territories with official GST state codes, standard inventory UOM units (`KGS`, `LTRS`, `PCS`, etc.), and staff department/role hierarchies.
9. **⚡ Supabase Database Link Hub**: Live database connection testing, credential management, 1-click cloud sync, and instant PostgreSQL schema migration scripts.

---

## 🚀 Running Locally

### 1. Prerequisites

- Node.js v20+ and npm installed
- Optional: Docker & Docker Compose (for local PostgreSQL, Redis, and RabbitMQ)

### 2. Full-Stack Dev Environment

Start backend and frontend in a single unified command:

```bash
npm run dev
```

- 🌐 **Frontend Web App**: `http://localhost:3000/`
- 🏨 **Backend REST API**: `http://localhost:5000/api`
- 📖 **Interactive OpenAPI Docs**: `http://localhost:5000/api/docs`
- ❤️ **Health Check**: `http://localhost:5000/api/health`

### 3. Enterprise UAT Test Suite

Run the industry-standard 19 use-case acceptance suite:

```bash
npm test
```

*The UAT runner automatically verifies backend readiness, auto-starts it if needed, seeds baseline data, and validates all 19 hospitality scenarios with 100% pass verification.*

---

## 🐧 Production Ubuntu Server & PostgreSQL Deployment

For a detailed step-by-step production deployment on **Ubuntu Server (22.04 or 24.04 LTS)** with native **PostgreSQL 16+**, **PM2**, **Nginx**, and **Let's Encrypt SSL/TLS**, see the dedicated guide:

👉 **[Production Deployment Guide: Ubuntu Server with PostgreSQL](file:///d:/Projects/Gautam_Github/HMS%20-%20Small%20&%20Mid/DEPLOYMENT_UBUNTU_POSTGRES.md)**

The guide covers:

- System update, security hardening, and UFW firewall configuration.
- PostgreSQL 16 installation, database user creation, and running schema migrations (`init.sql` and `01_master_data.sql`).
- Node.js 20 LTS installation and environment variable configuration (`.env`).
- Backend compilation and PM2 daemon setup with systemd autostart.
- Frontend production bundle build and Nginx reverse proxy routing.
- Free SSL/TLS certificate setup with Let's Encrypt Certbot.
- Automated daily PostgreSQL backup script with cron scheduling.
- Day-2 maintenance, zero-downtime updates, and diagnostic commands.

---

## 🐳 Docker Compose Deployment

Launch the complete stack (PostgreSQL 16, Redis, RabbitMQ, Backend API, Frontend Nginx):

```bash
cd deploy/docker
docker compose up --build -d
```

- Frontend Application: `http://localhost`
- Backend API: `http://localhost:5000`
- RabbitMQ Management Console: `http://localhost:15672` (User: `hms_guest` / Pass: `hms_guest_pass`)
- PostgreSQL: `localhost:5432` (`grand_azure_hms`)

---

## ☁️ Cloud Deployments (Infrastructure as Code)

### AWS Deployment (ECS Fargate + RDS Multi-AZ + S3)

Located in [`deploy/terraform/aws/`](file:///d:/Projects/Gautam_Github/HMS%20-%20Small%20&%20Mid/deploy/terraform/aws/):

```bash
cd deploy/terraform/aws
terraform init
terraform plan
terraform apply
```

### GCP Deployment (Cloud Run + Cloud SQL HA + GCS)

Located in [`deploy/terraform/gcp/`](file:///d:/Projects/Gautam_Github/HMS%20-%20Small%20&%20Mid/deploy/terraform/gcp/):

```bash
cd deploy/terraform/gcp
terraform init
terraform plan
terraform apply
```

---

## 📄 License

MIT License. Built for hospitality excellence.
