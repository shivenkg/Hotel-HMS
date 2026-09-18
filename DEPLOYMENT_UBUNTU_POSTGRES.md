# Production Deployment Guide: Ubuntu Server with PostgreSQL

> **The Grand Azure – Hotel Management System (HMS)**  
> Complete step-by-step production deployment guide for **Ubuntu 22.04 / 24.04 LTS**, **PostgreSQL 16+**, **Node.js LTS**, **PM2 process supervisor**, and **Nginx reverse proxy with Let's Encrypt SSL/TLS**.

---

## 📋 Architectural Overview

In this deployment topology:

- **Nginx** listens on ports `80` (HTTP) and `443` (HTTPS with TLS encryption).
- **Frontend SPA** (Vite + React 19 bundle) is statically served by Nginx with client-side route fallback.
- **Backend API** runs as a persistent Node.js daemon managed by **PM2** on `127.0.0.1:5000`.
- **PostgreSQL 16+** runs as a secured local system daemon listening strictly on `127.0.0.1:5432`.
- **UFW Firewall** restricts external traffic to ports `22` (SSH), `80` (HTTP), and `443` (HTTPS). Internal ports `5000` and `5432` are isolated.

```text
[ Internet Users ]
       │ (HTTPS :443)
       ▼
 ┌─────────────── Ubuntu Server Host ──────────────────────┐
 │                                                         │
 │  ┌──────────────── Nginx Reverse Proxy ──────────────┐  │
 │  │                                                   │  │
 │  │  • "/" ──────────▶ Statically Serves Frontend SPA │  │
 │  │                    (/var/www/grand-azure-hms/     │  │
 │  │                     frontend/dist)                │  │
 │  │                                                   │  │
 │  │  • "/api/" ──────▶ Reverse Proxies to Backend     │  │
 │  │                    (http://127.0.0.1:5000)        │  │
 │  └────────────────────────┬──────────────────────────┘  │
 │                           │                             │
 │                           ▼                             │
 │  ┌──────────────── Backend Service ──────────────────┐  │
 │  │  • Node.js API Monolith (PM2 Daemon)              │  │
 │  │  • Port: 127.0.0.1:5000                           │  │
 │  └────────────────────────┬──────────────────────────┘  │
 │                           │ (PostgreSQL Protocol)       │
 │                           ▼                             │
 │  ┌──────────────── Database Engine ──────────────────┐  │
 │  │  • PostgreSQL 16+ System of Record                │  │
 │  │  • Port: 127.0.0.1:5432                           │  │
 │  │  • Database: grand_azure_hms                      │  │
 │  └───────────────────────────────────────────────────┘  │
 └─────────────────────────────────────────────────────────┘
```

---

## 🖥️ Server Prerequisites

| Component | Minimum Recommended | Production Recommended |
| :--- | :--- | :--- |
| **OS** | Ubuntu 22.04 LTS or 24.04 LTS | Ubuntu 24.04 LTS (x86_64) |
| **CPU** | 2 vCPUs | 4 vCPUs |
| **RAM** | 4 GB | 8 GB+ |
| **Disk** | 40 GB NVMe / SSD | 100 GB NVMe SSD |
| **Domain** | Public DNS A/AAAA record pointed to server IP | e.g. `hms.yourdomain.com` |

---

## Step 1: System Update & Security Hardening

Connect to your Ubuntu server via SSH:

```bash
ssh root@your_server_ip
```

### 1.1 Update Apt Packages

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget git build-essential ufw fail2ban certbot python3-certbot-nginx
```

### 1.2 Configure UFW Firewall

Permit OpenSSH, HTTP, and HTTPS, then enable the firewall:

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable
sudo ufw status verbose
```

### 1.3 Create a Dedicated System User

Avoid running Node.js services as `root`:

```bash
sudo adduser --gecos "" hmsadmin
sudo usermod -aG sudo hmsadmin

# Switch to the new administrative user
su - hmsadmin
```

---

## Step 2: Install and Configure PostgreSQL 16+

### 2.1 Add Official PostgreSQL APT Repository

```bash
sudo install -d /etc/apt/keyrings
curl -fsSL https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo gpg --dearmor -o /etc/apt/keyrings/postgresql.gpg

echo "deb [signed-by=/etc/apt/keyrings/postgresql.gpg] http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" | sudo tee /etc/apt/sources.list.d/pgdg.list

sudo apt update
sudo apt install -y postgresql-16 postgresql-contrib-16
```

### 2.2 Verify PostgreSQL Service Status

```bash
sudo systemctl enable postgresql
sudo systemctl status postgresql --no-pager
```

### 2.3 Create Database, User, and Set Permissions

Replace `YourSecureStrongPassword123!` with a strong generated password:

```bash
sudo -u postgres psql <<EOF
CREATE DATABASE grand_azure_hms;
CREATE USER hms_user WITH ENCRYPTED PASSWORD 'YourSecureStrongPassword123!';
GRANT ALL PRIVILEGES ON DATABASE grand_azure_hms TO hms_user;
ALTER DATABASE grand_azure_hms OWNER TO hms_user;
\q
EOF
```

Grant schema-level permissions for PostgreSQL 16+:

```bash
sudo -u postgres psql -d grand_azure_hms <<EOF
GRANT ALL ON SCHEMA public TO hms_user;
ALTER SCHEMA public OWNER TO hms_user;
\q
EOF
```

---

## Step 3: Install Node.js LTS (v20+) & PM2

### 3.1 Install Node.js 20 LTS via NodeSource

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify Node.js and npm versions
node -v # Should display v20.x.x
npm -v  # Should display v10.x.x
```

### 3.2 Install PM2 Process Manager Globally

```bash
sudo npm install -g pm2
pm2 --version
```

---

## Step 4: Clone Codebase & Run Database Migrations

### 4.1 Create Application Directory

```bash
sudo mkdir -p /var/www/grand-azure-hms
sudo chown -R hmsadmin:hmsadmin /var/www/grand-azure-hms

# Clone your repository
git clone https://github.com/gautam303in/HMS---Small---Mid.git /var/www/grand-azure-hms
cd /var/www/grand-azure-hms
```

### 4.2 Initialize PostgreSQL Schemas and Seeds

Execute the comprehensive 13-schema initialization script and baseline seed data:

```bash
# Execute Schema Initialization
PGPASSWORD='YourSecureStrongPassword123!' psql -h 127.0.0.1 -U hms_user -d grand_azure_hms -f /var/www/grand-azure-hms/database/init.sql

# Execute Baseline Master Data Seeds
PGPASSWORD='YourSecureStrongPassword123!' psql -h 127.0.0.1 -U hms_user -d grand_azure_hms -f /var/www/grand-azure-hms/database/seeds/01_master_data.sql
```

Verify tables in the database:

```bash
PGPASSWORD='YourSecureStrongPassword123!' psql -h 127.0.0.1 -U hms_user -d grand_azure_hms -c "\dt hotel.*"
```

---

## Step 5: Configure Environment Variables

### 5.1 Backend Environment Configuration

Create `/var/www/grand-azure-hms/backend/.env`:

```bash
cat << 'EOF' > /var/www/grand-azure-hms/backend/.env
NODE_ENV=production
PORT=5000
HOST=127.0.0.1

# PostgreSQL Database Connection URL
DATABASE_URL=postgresql://hms_user:YourSecureStrongPassword123!@127.0.0.1:5432/grand_azure_hms

# CORS Origins (Allow your domain)
CORS_ORIGIN=https://hms.yourdomain.com,http://localhost:3000

# Dual-Slab GST & Hotel Master
PROPERTY_CODE=GA-GOA
PROPERTY_NAME="The Grand Azure Hotel & Suites"
DEFAULT_CURRENCY=INR
DEFAULT_CURRENCY_SYMBOL=₹

# Optional: Supabase External Link (Leave empty if using native Postgres)
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
EOF
```

### 5.2 Frontend Production Environment Configuration

Create `/var/www/grand-azure-hms/frontend/.env.production`:

```bash
cat << 'EOF' > /var/www/grand-azure-hms/frontend/.env.production
VITE_API_BASE_URL=/api
EOF
```

---

## Step 6: Install Dependencies & Build Stack

Install root and workspace dependencies:

```bash
cd /var/www/grand-azure-hms
npm install
```

### 6.1 Build the Backend

```bash
cd /var/www/grand-azure-hms/backend
npm run build
```

Verify that `dist/server.js` was created:

```bash
ls -lh dist/server.js
```

### 6.2 Build the Frontend Static Assets

```bash
cd /var/www/grand-azure-hms/frontend
npm run build
```

Verify that the production bundle is ready:

```bash
ls -la dist/index.html
```

---

## Step 7: Configure PM2 for Backend Autostart

Create PM2 ecosystem configuration at `/var/www/grand-azure-hms/ecosystem.config.cjs`:

```bash
cat << 'EOF' > /var/www/grand-azure-hms/ecosystem.config.cjs
module.exports = {
  apps: [
    {
      name: 'hms-backend',
      cwd: '/var/www/grand-azure-hms/backend',
      script: 'dist/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 5000,
        HOST: '127.0.0.1'
      }
    }
  ]
};
EOF
```

### 7.1 Start Backend via PM2

```bash
cd /var/www/grand-azure-hms
pm2 start ecosystem.config.cjs
pm2 save
```

### 7.2 Configure Systemd Autostart on Server Reboot

Generate and run the systemd startup command:

```bash
pm2 startup systemd
```

*(Copy and execute the exact `sudo env PATH=...` command printed by PM2)*.

Check backend status and health check:

```bash
pm2 status
curl http://127.0.0.1:5000/api/health
```

---

## Step 8: Configure Nginx Web Server & Reverse Proxy

Install Nginx:

```bash
sudo apt install -y nginx
sudo systemctl enable nginx
```

### 8.1 Create Virtual Host Configuration

Create `/etc/nginx/sites-available/grand-azure-hms`:

Replace `hms.yourdomain.com` with your actual domain or server public IP:

```bash
sudo tee /etc/nginx/sites-available/grand-azure-hms << 'EOF'
server {
    listen 80;
    server_name hms.yourdomain.com;

    # Client body upload size (supports hotel logo & KYC doc uploads up to 10MB)
    client_max_body_size 10M;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_types text/plain text/css text/xml application/json application/javascript application/xml+rss application/atom+xml image/svg+xml;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # 1. Frontend SPA Static Files
    root /var/www/grand-azure-hms/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Static Assets Caching
    location ~* \.(?:ico|css|js|gif|jpe?g|png|webp|svg|woff2?|eot|ttf|otf)$ {
        expires 6M;
        access_log off;
        add_header Cache-Control "public, max-age=15552000, immutable";
    }

    # 2. Backend REST API Reverse Proxy
    location /api/ {
        proxy_pass http://127.0.0.1:5000/api/;
        proxy_http_version 1.1;

        # WebSocket & Long-Polling Connection Upgrade Headers
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';

        # Standard Proxy Headers
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
EOF
```

### 8.2 Enable Site & Verify Syntax

```bash
sudo ln -sf /etc/nginx/sites-available/grand-azure-hms /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

---

## Step 9: Install SSL/TLS Certificate (Let's Encrypt)

Obtain a free automated SSL/TLS certificate using Certbot:

```bash
sudo certbot --nginx -d hms.yourdomain.com
```

Select the option to automatically redirect all HTTP traffic to HTTPS.

Verify automated renewal:

```bash
sudo systemctl status certbot.timer
sudo certbot renew --dry-run
```

---

## Step 10: Automated Daily PostgreSQL Backups

Set up automated daily database dumps to protect operational hospitality data:

### 10.1 Create Backup Script

Create `/usr/local/bin/hms-postgres-backup.sh`:

```bash
sudo tee /usr/local/bin/hms-postgres-backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/var/backups/postgres/grand_azure_hms"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
RETENTION_DAYS=14

mkdir -p "$BACKUP_DIR"

# Perform compressed SQL dump
sudo -u postgres pg_dump -Fc grand_azure_hms > "$BACKUP_DIR/grand_azure_hms_$TIMESTAMP.dump"

# Remove backups older than 14 days
find "$BACKUP_DIR" -type f -name "*.dump" -mtime +$RETENTION_DAYS -delete
EOF

sudo chmod +x /usr/local/bin/hms-postgres-backup.sh
```

### 10.2 Add Cron Schedule

```bash
sudo crontab -e
```

Add the following entry to trigger daily backups at 03:00 AM:

```cron
0 3 * * * /usr/local/bin/hms-postgres-backup.sh >/dev/null 2>&1
```

---

## Step 11: Day-2 Maintenance & Updates

### 11.1 Deploying Code Updates

When releasing a new version:

```bash
cd /var/www/grand-azure-hms
git pull origin main

# Install any new dependencies
npm install

# Build backend and frontend
npm run build --workspace=backend
npm run build --workspace=frontend

# Zero-downtime reload of PM2 worker processes
pm2 reload hms-backend

# Reload Nginx static cache
sudo systemctl reload nginx
```

### 11.2 Useful Diagnostic Commands

```bash
# Check PM2 backend status and memory
pm2 status
pm2 monit

# Inspect live backend logs
pm2 logs hms-backend --lines 50

# Inspect Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Inspect PostgreSQL service status
sudo systemctl status postgresql

# Run Enterprise UAT Test Suite in Production
cd /var/www/grand-azure-hms
npm test
```

---

## 🎯 Verification Checklist

- [ ] UFW firewall is active with ports 22, 80, 443 open.
- [ ] PostgreSQL 16+ is running and restricted to `127.0.0.1:5432`.
- [ ] `grand_azure_hms` database contains tables from `init.sql` and `01_master_data.sql`.
- [ ] Backend API daemon is supervised by PM2 in cluster mode.
- [ ] Frontend static bundle is served by Nginx with `try_files` SPA fallback.
- [ ] SSL/TLS certificate is active and auto-renewing via Certbot.
- [ ] Automated daily backup cron job is scheduled at 03:00 AM.
- [ ] Health check `https://hms.yourdomain.com/api/health` returns `200 OK`.
- [ ] Hotel Master Profile and Logo Upload functions smoothly in Admin view.
- [ ] Field Validation Policies can be configured and live tested via the Admin Console.
- [ ] Front Desk Month Calendar supports drag-and-drop booking rescheduling.
- [ ] Persistent Dark Mode toggle correctly maintains theme state across browser sessions.
