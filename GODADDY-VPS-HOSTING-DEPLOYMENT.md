# S-Steel Website Deployment Guide - GoDaddy VPS Hosting

## 📋 Table of Contents
1. [VPS vs Shared Hosting Comparison](#vps-vs-shared-hosting-comparison)
2. [Pre-Deployment Checklist](#pre-deployment-checklist)
3. [VPS Architecture & Setup](#vps-architecture--setup)
4. [Initial Server Configuration](#initial-server-configuration)
5. [Application Deployment](#application-deployment)
6. [Database Setup](#database-setup)
7. [SSL & Security](#ssl--security)
8. [Performance Optimization](#performance-optimization)
9. [Monitoring & Maintenance](#monitoring--maintenance)
10. [Troubleshooting](#troubleshooting)

---

## VPS vs Shared Hosting Comparison

### Shared Hosting
```
❌ Limited resources
❌ No Python support (usually)
❌ FTP only access
❌ Limited customization
❌ Slow for complex apps
✅ Cheap & easy setup
```

### VPS Hosting
```
✅ Dedicated resources (CPU, RAM, Disk)
✅ Full Python/Node.js support
✅ SSH access (full control)
✅ Install any software
✅ Better performance
✅ Better for scaling
❌ Requires more technical knowledge
❌ Higher cost ($20-100+/month)
```

### Why VPS for S-Steel?
- Running Python Flask backend
- Need file upload capability
- Admin panel with authentication
- Database management
- Future scaling potential

---

## Pre-Deployment Checklist

### Account & Access
- [ ] GoDaddy VPS account created
- [ ] SSH access credentials ready
- [ ] Root or sudo access confirmed
- [ ] IP address noted
- [ ] Domain s-steel.net pointing to VPS

### Local Environment
- [ ] Website built: `npm run build`
- [ ] Backend tested locally
- [ ] Database backed up
- [ ] Environment variables documented
- [ ] All code committed to repository

### Documentation Ready
- [ ] SSH login credentials (stored securely)
- [ ] Database credentials
- [ ] API keys (if any)
- [ ] Admin login credentials
- [ ] Backup schedule planned

---

## VPS Architecture & Setup

### System Overview
```
┌──────────────────────────────────────────────────┐
│         GoDaddy VPS (Ubuntu/CentOS)             │
├──────────────────────────────────────────────────┤
│                                                  │
│  Web Server (Nginx/Apache)                      │
│  ├── Listens on port 80 (HTTP)                  │
│  ├── Listens on port 443 (HTTPS/SSL)            │
│  └── Serves React frontend (static files)       │
│                                                  │
│  Python Application (Flask)                     │
│  ├── Runs on port 5001 (internal)               │
│  ├── Gunicorn WSGI server                       │
│  ├── Systemd service (auto-restart)             │
│  └── Handles /api/* routes                      │
│                                                  │
│  File System                                    │
│  ├── /home/steel/ (app directory)               │
│  ├── /var/www/html (web root)                   │
│  ├── /home/steel/data/ (database)               │
│  └── /home/steel/uploads/ (images)              │
│                                                  │
│  Database (SQLite or MySQL)                     │
│  └── /home/steel/data/steel.db                  │
│                                                  │
│  SSL Certificate                                │
│  └── Let's Encrypt (free)                       │
│                                                  │
│  Monitoring & Backups                           │
│  ├── Logrotate (manage logs)                    │
│  ├── Systemd (service management)               │
│  └── Cron (backup automation)                   │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

## Initial Server Configuration

### Step 1: Connect via SSH (5 minutes)

#### 1.1 Get SSH Credentials from GoDaddy
1. Go to GoDaddy.com → Hosting → Manage
2. Find your VPS
3. Click "Server Manager" or "SSH Access"
4. Note down:
   - IP Address: `xxx.xxx.xxx.xxx`
   - Username: `root` (or your user)
   - Password: (provided by GoDaddy)

#### 1.2 Connect via SSH
```bash
# From your Mac terminal
ssh root@xxx.xxx.xxx.xxx

# Or if username is different:
ssh username@xxx.xxx.xxx.xxx

# You'll be asked for password
# Enter the password from GoDaddy

# You should see terminal like:
# root@steel-server:~#
```

#### 1.3 Change Root Password (IMPORTANT)
```bash
passwd
# Enter new strong password
# Confirm password
```

### Step 2: Update System (10 minutes)

```bash
# Update package lists
apt update

# Upgrade all packages
apt upgrade -y

# Install essential tools
apt install -y curl wget git nano vim
```

### Step 3: Create Application User (5 minutes)

```bash
# Create a non-root user for the application
adduser steel

# Follow prompts to set password and info
# Press Enter to skip optional fields

# Add user to sudo group
usermod -aG sudo steel

# Switch to new user
su - steel
```

### Step 4: Install Required Software (15 minutes)

#### 4.1 Install Python & Dependencies
```bash
# Update package lists
sudo apt update

# Install Python 3
sudo apt install -y python3 python3-pip python3-venv

# Verify installation
python3 --version
pip3 --version
```

#### 4.2 Install Nginx (Web Server)
```bash
sudo apt install -y nginx

# Start Nginx
sudo systemctl start nginx

# Enable on boot
sudo systemctl enable nginx

# Check status
sudo systemctl status nginx
```

#### 4.3 Install Node.js (if needed for build tools)
```bash
curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify
node --version
npm --version
```

#### 4.4 Install Other Tools
```bash
# Git for version control
sudo apt install -y git

# SQLite (if using SQLite database)
sudo apt install -y sqlite3

# Or MySQL/MariaDB (if preferred)
# sudo apt install -y mysql-server mysql-client
```

### Step 5: Configure Firewall (5 minutes)

```bash
# Enable UFW firewall
sudo ufw enable

# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP
sudo ufw allow 80/tcp

# Allow HTTPS
sudo ufw allow 443/tcp

# Check status
sudo ufw status

# Should show:
# 22/tcp    ALLOW  (SSH)
# 80/tcp    ALLOW  (HTTP)
# 443/tcp   ALLOW  (HTTPS)
```

---

## Application Deployment

### Step 1: Setup Application Directory (5 minutes)

```bash
# Create directory for application
mkdir -p /home/steel/app
mkdir -p /home/steel/data
mkdir -p /home/steel/uploads

# Navigate to app directory
cd /home/steel/app

# Change ownership to steel user
sudo chown -R steel:steel /home/steel
```

### Step 2: Upload Application Files (20-30 minutes)

#### Option A: Via Git (Recommended)
```bash
# If you have a GitHub repository
git clone https://github.com/yourusername/ssteel-website.git .

# Or if already cloned, pull latest
git pull origin main
```

#### Option B: Via SCP/SFTP
```bash
# From your local machine, upload files
scp -r frontend/build/* steel@xxx.xxx.xxx.xxx:/home/steel/app/frontend/
scp -r backend/* steel@xxx.xxx.xxx.xxx:/home/steel/app/backend/
```

### Step 3: Setup Python Virtual Environment (5 minutes)

```bash
cd /home/steel/app/backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# You should see (venv) in terminal

# Upgrade pip
pip install --upgrade pip

# Install dependencies
pip install -r requirements.txt

# If requirements.txt doesn't exist, install manually:
pip install flask flask-cors flask-jwt-extended pillow

# Deactivate (for now)
deactivate
```

### Step 4: Create Application Configuration File (10 minutes)

Create: `/home/steel/app/backend/.env`
```
FLASK_ENV=production
DEBUG=False
SECRET_KEY=your-super-secret-key-here-change-this
JWT_SECRET_KEY=your-jwt-secret-key-change-this

# Database
DATABASE_PATH=/home/steel/data/steel.db

# File uploads
UPLOAD_FOLDER=/home/steel/uploads

# CORS settings
ALLOWED_ORIGINS=https://s-steel.net,https://www.s-steel.net

# Email settings (if needed)
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

**Security:** Change all SECRET_KEYs to strong random values!

### Step 5: Setup Gunicorn (Python WSGI Server) (10 minutes)

#### 5.1 Install Gunicorn
```bash
cd /home/steel/app/backend

# Activate virtual environment
source venv/bin/activate

# Install Gunicorn
pip install gunicorn

# Test if app runs
gunicorn --workers 4 --bind 127.0.0.1:5001 app:app

# Press Ctrl+C to stop
```

#### 5.2 Create Systemd Service
Create: `/etc/systemd/system/steel-app.service`

```bash
sudo nano /etc/systemd/system/steel-app.service
```

Add this content:
```ini
[Unit]
Description=S-Steel Application
After=network.target

[Service]
User=steel
WorkingDirectory=/home/steel/app/backend
Environment="PATH=/home/steel/app/backend/venv/bin"
ExecStart=/home/steel/app/backend/venv/bin/gunicorn --workers 4 --bind 127.0.0.1:5001 --access-logfile /var/log/steel-app/access.log --error-logfile /var/log/steel-app/error.log app:app
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Press: `Ctrl+X`, then `Y`, then `Enter` (to save)

#### 5.3 Create Log Directory
```bash
sudo mkdir -p /var/log/steel-app
sudo chown steel:steel /var/log/steel-app
```

#### 5.4 Enable and Start Service
```bash
# Reload systemd
sudo systemctl daemon-reload

# Enable service to start on boot
sudo systemctl enable steel-app.service

# Start the service
sudo systemctl start steel-app.service

# Check status
sudo systemctl status steel-app.service

# Should show "active (running)"

# View logs
sudo journalctl -u steel-app.service -f
```

### Step 6: Configure Nginx (Reverse Proxy) (10 minutes)

Create: `/etc/nginx/sites-available/s-steel.net`

```bash
sudo nano /etc/nginx/sites-available/s-steel.net
```

Add this content:
```nginx
server {
    listen 80;
    server_name s-steel.net www.s-steel.net;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name s-steel.net www.s-steel.net;

    # SSL certificates (will add with Certbot)
    ssl_certificate /etc/letsencrypt/live/s-steel.net/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/s-steel.net/privkey.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Root directory for static files
    root /home/steel/app/frontend/build;

    # Client upload size limit
    client_max_body_size 50M;

    # Static files
    location ~* ^/(static|uploads)/ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # API proxy to Python backend
    location /api/ {
        proxy_pass http://127.0.0.1:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # React Router - all non-static requests go to index.html
    location / {
        try_files $uri /index.html;
        add_header Cache-Control "public, max-age=3600";
    }

    # Deny access to sensitive files
    location ~ /\. {
        deny all;
    }

    location ~ ~$ {
        deny all;
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css text/javascript application/javascript application/json;
    gzip_min_length 1000;
}
```

#### Enable the site:
```bash
# Create symlink
sudo ln -s /etc/nginx/sites-available/s-steel.net /etc/nginx/sites-enabled/

# Disable default site
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx config
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

---

## Database Setup

### Option 1: SQLite (Simpler, Recommended for Start)

```bash
# Create database
touch /home/steel/data/steel.db

# Test database
sqlite3 /home/steel/data/steel.db

# In SQLite prompt:
# .tables
# .quit

# Change permissions
chmod 755 /home/steel/data/steel.db
```

### Option 2: MySQL (For scaling)

```bash
# Install MySQL
sudo apt install -y mysql-server

# Secure installation
sudo mysql_secure_installation

# Create database
mysql -u root -p
```

In MySQL prompt:
```sql
CREATE DATABASE s_steel_db;
CREATE USER 'steel_user'@'localhost' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON s_steel_db.* TO 'steel_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

Update `.env`:
```
DATABASE_URL=mysql+pymysql://steel_user:strong_password@localhost/s_steel_db
```

---

## SSL & Security

### Step 1: Install Certbot (Let's Encrypt)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot certonly --nginx -d s-steel.net -d www.s-steel.net

# Follow prompts to:
# 1. Enter email
# 2. Agree to terms
# 3. Accept marketing emails (optional)

# Certificate will be installed at:
# /etc/letsencrypt/live/s-steel.net/
```

### Step 2: Auto-Renewal

```bash
# Test renewal
sudo certbot renew --dry-run

# Enable auto-renewal (runs daily)
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# Check status
sudo systemctl status certbot.timer
```

### Step 3: Security Hardening

```bash
# Set secure file permissions
sudo chmod 644 /etc/nginx/sites-available/s-steel.net
sudo chmod 755 /home/steel/app
sudo chmod 755 /home/steel/data
chmod 700 /home/steel/app/backend/.env
```

---

## Performance Optimization

### Step 1: Enable Compression

Already in Nginx config (see above)

### Step 2: Setup Caching

Add to Nginx config:
```nginx
# Cache static assets
expires 30d;
add_header Cache-Control "public, immutable";
```

### Step 3: Optimize Python App

In `/home/steel/app/backend/app.py`:
```python
# Add caching headers
@app.after_request
def after_request(response):
    response.headers['Cache-Control'] = 'public, max-age=3600'
    return response
```

### Step 4: Monitor Performance

```bash
# Check server resources
top

# Check disk space
df -h

# Check memory
free -h

# Check network
ss -s
```

---

## Monitoring & Maintenance

### Step 1: Setup Log Rotation

```bash
sudo nano /etc/logrotate.d/steel-app
```

Add:
```
/var/log/steel-app/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 steel steel
    sharedscripts
}
```

### Step 2: Automated Backups

Create: `/home/steel/scripts/backup.sh`

```bash
#!/bin/bash

# Backup database
cp /home/steel/data/steel.db /home/steel/backups/steel-$(date +%Y%m%d).db.bak

# Keep only last 30 days
find /home/steel/backups -name "*.bak" -mtime +30 -delete

echo "Backup completed at $(date)"
```

Setup cron job:
```bash
# Edit crontab
crontab -e

# Add this line (daily backup at 2 AM):
0 2 * * * /home/steel/scripts/backup.sh
```

### Step 3: Monitoring Tools

#### Check Application Status
```bash
# Check if Flask is running
systemctl status steel-app

# Check Nginx
systemctl status nginx

# Check logs
tail -f /var/log/steel-app/error.log
tail -f /var/log/steel-app/access.log
```

#### Monitor Resources
```bash
# Install htop for better monitoring
sudo apt install -y htop

# Run htop
htop
```

---

## Troubleshooting

### Issue: Website shows "502 Bad Gateway"
**Cause:** Flask app not running or Nginx can't reach it

**Solution:**
```bash
# Check Flask service
sudo systemctl status steel-app

# If not running, start it
sudo systemctl start steel-app

# Check logs
sudo journalctl -u steel-app -n 50

# Verify Nginx config
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### Issue: "Connection refused" on /api calls
**Cause:** Backend not listening on port 5001

**Solution:**
```bash
# Check if Flask is listening
sudo netstat -tulpn | grep 5001

# If not shown, Flask isn't running
sudo systemctl restart steel-app

# Check Flask logs
sudo journalctl -u steel-app -f
```

### Issue: SSL certificate not working
**Cause:** Certificate not installed or expired

**Solution:**
```bash
# Check certificate
sudo certbot certificates

# If expired, renew
sudo certbot renew

# Check Nginx SSL config
sudo nginx -t

# Restart Nginx
sudo systemctl reload nginx
```

### Issue: Uploads not working
**Cause:** Permission issue on uploads folder

**Solution:**
```bash
# Fix permissions
sudo chmod 755 /home/steel/uploads
sudo chown steel:steel /home/steel/uploads

# Verify
ls -la /home/steel/ | grep uploads
```

### Issue: Database locked error
**Cause:** SQLite being accessed by multiple processes

**Solution:**
```bash
# Check who's using database
lsof | grep steel.db

# If Flask has lock, restart it
sudo systemctl restart steel-app

# If persistent, backup and reset
cp /home/steel/data/steel.db /home/steel/data/steel.db.bak
rm /home/steel/data/steel.db
# Reinitialize database in Python
```

### Issue: Site very slow
**Causes:** Server resources, unoptimized code, database queries

**Solutions:**
```bash
# Check resource usage
top
free -h
df -h

# Check Nginx performance
ab -n 100 https://s-steel.net

# Enable caching
# (already in Nginx config)

# Check database performance
# Review Flask code for N+1 queries
```

---

## Post-Deployment Checklist

- [ ] SSH access working
- [ ] Firewall configured
- [ ] Python environment setup
- [ ] Flask app running
- [ ] Nginx configured
- [ ] SSL certificate installed
- [ ] Domain pointing to VPS
- [ ] Website accessible via HTTPS
- [ ] API endpoints responding
- [ ] Contact form working
- [ ] Admin panel accessible
- [ ] Database working
- [ ] Backups scheduled
- [ ] Logs being monitored
- [ ] Performance acceptable

---

## Quick Reference

### Important Directories
```
App: /home/steel/app
Frontend: /home/steel/app/frontend/build
Backend: /home/steel/app/backend
Data: /home/steel/data
Uploads: /home/steel/uploads
Backups: /home/steel/backups
```

### Important Commands
```
# Service management
sudo systemctl status steel-app
sudo systemctl restart steel-app
sudo systemctl logs steel-app

# Nginx
sudo systemctl status nginx
sudo nginx -t
sudo systemctl reload nginx

# Monitoring
top
df -h
tail -f /var/log/steel-app/error.log
```

### Important Ports
```
HTTP: 80
HTTPS: 443
Flask Backend: 5001 (internal only)
SSH: 22
```

### Important Files
```
Nginx config: /etc/nginx/sites-available/s-steel.net
Flask service: /etc/systemd/system/steel-app.service
Environment: /home/steel/app/backend/.env
SSL certs: /etc/letsencrypt/live/s-steel.net/
```

---

## Summary

**Estimated Total Deployment Time:** 2-3 hours

1. **Server Setup** (30 min): SSH, updates, security
2. **Software Install** (20 min): Python, Nginx, Node.js
3. **App Upload** (20 min): Git clone or SCP
4. **Python Setup** (15 min): Virtual env, dependencies
5. **Gunicorn Setup** (15 min): WSGI server, systemd service
6. **Nginx Config** (15 min): Web server, proxy setup
7. **SSL Setup** (10 min): Let's Encrypt certificate
8. **Testing** (30 min): Verify everything works
9. **Optimization** (20 min): Performance tuning
10. **Monitoring** (15 min): Logs, backups, monitoring

**Monthly Cost:** $20-50 (depending on VPS specs)

**Maintenance:** 30 minutes per month

---

## Advanced Features (Optional)

### Add Redis Caching
```bash
sudo apt install -y redis-server
pip install redis flask-caching
```

### Setup Monitoring Dashboard
```bash
sudo apt install -y grafana-server
# Access at: https://your-ip:3000
```

### Setup Automated Deployments
```bash
# Using GitHub Actions
# Create .github/workflows/deploy.yml
```

---

**Document Version:** 1.0  
**Last Updated:** January 25, 2026  
**Status:** Ready for Deployment ✅

**VPS Deployment is More Flexible & Powerful!**
