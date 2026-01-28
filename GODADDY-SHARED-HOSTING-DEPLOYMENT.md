# S-Steel Website Deployment Guide - GoDaddy Shared Hosting

## 📋 Table of Contents
1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Shared Hosting Architecture](#shared-hosting-architecture)
3. [Step-by-Step Deployment](#step-by-step-deployment)
4. [Configuration & Setup](#configuration--setup)
5. [Testing & Verification](#testing--verification)
6. [Troubleshooting](#troubleshooting)
7. [Maintenance](#maintenance)

---

## Pre-Deployment Checklist

### Items Required
- [ ] GoDaddy Shared Hosting account (cPanel access)
- [ ] Domain: `s-steel.net` (already registered)
- [ ] FTP/SFTP credentials
- [ ] Database credentials (if applicable)
- [ ] SSL certificate (usually included with GoDaddy)
- [ ] Website files ready for deployment

### System Requirements Check
- [ ] Node.js NOT required (React is pre-built)
- [ ] Python backend compiled/ready
- [ ] Database (SQLite or MySQL) prepared
- [ ] All environment variables documented
- [ ] Image assets optimized for web

### Pre-Deployment Tasks
- [ ] Build React frontend: `npm run build`
- [ ] Test all features locally
- [ ] Verify backend API endpoints
- [ ] Backup database
- [ ] Document all credentials securely

---

## Shared Hosting Architecture

### What is GoDaddy Shared Hosting?
- Multiple websites on one server
- Limited resources (CPU, RAM, bandwidth)
- No SSH access (FTP/SFTP only)
- cPanel management
- Pre-installed PHP, MySQL, Apache
- Automatic backups

### S-Steel on Shared Hosting
```
┌─────────────────────────────────────────┐
│       GoDaddy Shared Hosting Server      │
├─────────────────────────────────────────┤
│                                         │
│  Public HTML (/public_html)             │
│  ├── index.html (React App)             │
│  ├── /build (React compiled files)      │
│  ├── /uploads (Gallery images)          │
│  ├── /css                               │
│  ├── /js                                │
│  └── .htaccess (routing rules)          │
│                                         │
│  Backend (CGI-BIN or separate folder)   │
│  ├── Python app.py (via Python CGI)     │
│  ├── /data (SQLite database)            │
│  └── requirements.txt                   │
│                                         │
│  Database (if MySQL needed)             │
│  └── s_steel_db                         │
│                                         │
└─────────────────────────────────────────┘
```

---

## Step-by-Step Deployment

### Phase 1: GoDaddy Account Setup (5-10 minutes)

#### 1.1 Access cPanel
1. Go to GoDaddy.com → Hosting → Manage
2. Click "cPanel" for your hosting account
3. Login with your GoDaddy credentials
4. You'll see the cPanel dashboard

#### 1.2 Create FTP User
1. In cPanel, find "FTP Accounts"
2. Click "Add FTP Account"
3. Create account:
   - **Login:** `steelapp` (or similar)
   - **Password:** Strong password (save it!)
   - **Directory:** `public_html` (or create `/steel-backend`)
4. Click "Create FTP Account"

#### 1.3 Note Your FTP Credentials
```
FTP Host: ftp.s-steel.net (or your FTP address from cPanel)
Username: steelapp@s-steel.net
Password: [your password]
Port: 21
```

### Phase 2: File Preparation (10-15 minutes)

#### 2.1 Build React Frontend
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (if not done)
npm install

# Create optimized build
npm run build

# You'll have a "build" folder with all compiled files
# This is what uploads to the server
```

#### 2.2 Prepare Backend Files
```bash
# Backend files to upload
backend/
├── app.py (main application)
├── requirements.txt (Python dependencies)
└── data/ (database folder - create if needed)
```

#### 2.3 Create .htaccess for Routing
Create file: `frontend/build/.htaccess`
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # If the request is for a file or directory, let it go through
  RewriteCond %{REQUEST_FILENAME} -f
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  
  # Otherwise, route everything to index.html (React Router)
  RewriteRule ^ index.html [QSA,L]
</IfModule>
```

### Phase 3: Upload Files via FTP (20-30 minutes)

#### 3.1 Connect via FTP Client
**Recommended FTP Clients:**
- FileZilla (Windows/Mac/Linux) - Free
- Transmit (Mac) - Paid
- WinSCP (Windows)
- Cyberduck (Mac/Windows)

**Steps:**
1. Open FTP client
2. Enter credentials:
   - Host: `ftp.s-steel.net`
   - Username: `steelapp@s-steel.net`
   - Password: [your password]
   - Port: 21
3. Click "Connect"

#### 3.2 Upload Frontend Files
```
Local: frontend/build/*
Upload to: public_html/

Structure on server:
/public_html/
├── index.html
├── static/
│   ├── js/
│   ├── css/
│   └── media/
├── uploads/ (for gallery images)
└── .htaccess
```

#### 3.3 Upload Backend Files (if needed)
```
Option A: Via CGI-BIN (Shared Hosting compatible)
/cgi-bin/
├── app.py
├── requirements.txt
└── data/

Option B: Separate folder
/backend/
├── app.py
├── requirements.txt
└── data/
```

**Note:** Shared hosting may have limitations. Confirm with GoDaddy if Python apps are supported.

#### 3.4 Upload Database (if MySQL)
Use cPanel's phpMyAdmin to import database:
1. Go to cPanel → phpMyAdmin
2. Create new database: `s_steel_db`
3. Import your database backup
4. Note credentials for later

### Phase 4: Server Configuration (10-15 minutes)

#### 4.1 Configure Environment Variables
In GoDaddy cPanel, you may need to create a `.env` file:

**File location:** `public_html/.env` (or backend folder)
```
REACT_APP_API_URL=https://s-steel.net/api
REACT_APP_ENV=production

DATABASE_URL=sqlite:///data/steel.db
# OR for MySQL:
# DATABASE_URL=mysql://user:pass@localhost/s_steel_db

DEBUG=False
FLASK_ENV=production
```

#### 4.2 Set File Permissions
Via cPanel File Manager:
1. Right-click folders → Change Permissions
2. Set permissions:
   - Public HTML: `755`
   - Uploads folder: `777` (for write access)
   - Database folder: `755`

#### 4.3 Configure Python (if applicable)
**Important:** GoDaddy Shared Hosting may NOT support Python Flask directly.

**Alternatives:**
1. **Use Node.js instead** (if available)
2. **Use PHP wrapper** to call backend
3. **Use serverless functions** (limited support)
4. **Contact GoDaddy** to enable Python support

Check with GoDaddy support: Can Python Flask apps run on this shared host?

### Phase 5: SSL Configuration (5 minutes)

#### 5.1 Enable HTTPS
1. GoDaddy usually includes free SSL
2. Go to cPanel → SSL/TLS Status
3. Check if certificate is installed
4. If not, click "Manage" and install certificate

#### 5.2 Force HTTPS
Add to `.htaccess`:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</IfModule>
```

### Phase 6: DNS Configuration (5-10 minutes)

#### 6.1 Verify Domain Pointing
1. Go to GoDaddy Domain Manager
2. Check DNS records pointing to hosting
3. Should show GoDaddy nameservers
4. May take 24-48 hours to fully propagate

#### 6.2 Update API Endpoints
In React code, update API calls:
```javascript
// Before (local):
const API_URL = 'http://localhost:5001';

// After (production):
const API_URL = 'https://s-steel.net/api';
```

---

## Configuration & Setup

### Database Setup (if using MySQL)

#### Via cPanel phpMyAdmin:
```sql
CREATE DATABASE s_steel_db;
CREATE USER 'steel_user'@'localhost' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON s_steel_db.* TO 'steel_user'@'localhost';
FLUSH PRIVILEGES;
```

### Email Configuration
Add contact form emails:
```
From: noreply@s-steel.net
SMTP Server: (check GoDaddy documentation)
```

### Automated Backups
1. In cPanel → Backups
2. Enable automatic backups
3. Schedule: Daily or Weekly (recommended)

---

## Testing & Verification

### Phase 1: Website Access (5 minutes)
- [ ] Visit `https://s-steel.net`
- [ ] Page loads without errors
- [ ] Logo appears correctly
- [ ] Navigation works
- [ ] Check browser console for errors

### Phase 2: Feature Testing (15 minutes)
- [ ] Home page loads fully
- [ ] All navigation links work
- [ ] Services page displays correctly
- [ ] Projects/Gallery loads images
- [ ] About page renders
- [ ] Contact form appears

### Phase 3: API Testing (10 minutes)
- [ ] Contact form submission works
- [ ] Admin panel accessible
- [ ] Status changes save properly
- [ ] Email replies work
- [ ] Contact deletion works

### Phase 4: Performance Check (5 minutes)
```
Use tools:
- Google PageSpeed Insights
- GTmetrix
- Pingdom

Look for:
- Page load time < 3 seconds
- Mobile responsive
- Images optimized
```

### Phase 5: Security Check (5 minutes)
- [ ] HTTPS/SSL working
- [ ] No mixed content warnings
- [ ] Forms validate inputs
- [ ] Admin login secure
- [ ] Database credentials not exposed

---

## Troubleshooting

### Issue: 404 Error on Page Refresh
**Cause:** React Router needs .htaccess rules

**Solution:**
1. Create `.htaccess` in public_html
2. Add routing rules (see Phase 2.3)
3. Enable mod_rewrite in Apache

**Test:**
```bash
# Via browser developer console:
curl -I https://s-steel.net/services
# Should return 200, not 404
```

### Issue: API Calls Failing (CORS Error)
**Cause:** Backend not allowing cross-origin requests

**Solution:**
In backend `app.py`, add:
```python
from flask_cors import CORS
cors = CORS(app)
```

Or update API endpoint in React:
```javascript
fetch('https://s-steel.net/api/admin/contacts', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```

### Issue: Uploads Not Working
**Cause:** Permission issue on uploads folder

**Solution:**
1. In cPanel File Manager, right-click `/uploads`
2. Change permissions to `777`
3. Test upload again

### Issue: Database Connection Error
**Cause:** Wrong credentials or database not created

**Solution:**
1. Check `.env` file for correct DATABASE_URL
2. Verify database exists in cPanel
3. Test connection:
```python
import sqlite3
conn = sqlite3.connect('data/steel.db')
print("Connected!")
```

### Issue: Images Not Loading
**Cause:** Wrong path to images

**Solution:**
In React, update image paths:
```javascript
// Before:
src="/uploads/gallery/image.jpg"

// After:
src="/uploads/gallery/image.jpg"
// or use environment variable:
src={`${process.env.REACT_APP_API_URL}/uploads/gallery/image.jpg`}
```

### Issue: Site Very Slow
**Causes:** 
- Shared hosting limitations
- Unoptimized images
- Too many database queries

**Solutions:**
1. Optimize images (use WebP format)
2. Enable caching in `.htaccess`
3. Upgrade to VPS if traffic increases
4. Use CDN for static assets

---

## Maintenance

### Regular Tasks

#### Daily
- Monitor error logs
- Check contact form submissions
- Review admin dashboard

#### Weekly
- Backup database
- Check SSL certificate validity
- Review performance metrics

#### Monthly
- Update content as needed
- Check for security updates
- Review analytics

### Monitoring & Logs

#### Access Error Logs
1. cPanel → Error Log Viewer
2. Check for recurring issues
3. Fix any application errors

#### Monitor Performance
```
cPanel → Raw Access Logs
```

### Updates & Patches

#### When to Update
- Security patches: Immediately
- New features: Monthly
- Bug fixes: As needed

#### Update Process
1. Test changes locally
2. Build React: `npm run build`
3. Upload via FTP
4. Verify on production
5. Keep backups of old version

---

## Post-Deployment Checklist

- [ ] Website accessible at s-steel.net
- [ ] HTTPS/SSL working
- [ ] All pages load without 404 errors
- [ ] Images display correctly
- [ ] Navigation functional
- [ ] Contact form works
- [ ] Admin panel accessible
- [ ] Email notifications working
- [ ] Database backing up automatically
- [ ] Error logs monitored
- [ ] Performance acceptable
- [ ] Mobile responsive
- [ ] Security verified

---

## Quick Reference

### Important Paths
```
Frontend: /public_html/
Backend: /backend/ or /cgi-bin/
Database: /data/steel.db (SQLite)
Uploads: /public_html/uploads/
Logs: cPanel → Error Log Viewer
```

### Important Credentials
```
FTP: steelapp@s-steel.net
Database: steel_user
Domain: s-steel.net
```

### Important URLs
```
Website: https://s-steel.net
Admin: https://s-steel.net/admin
cPanel: https://godaddy.com/hosting/manage
```

---

## Support Contacts

- **GoDaddy Support:** 1-480-505-8877
- **Domain:** s-steel.net
- **Hosting Type:** Shared Hosting
- **Issue Priority:** Contact GoDaddy within 24 hours for critical issues

---

## Summary

**Estimated Total Deployment Time:** 1-2 hours

1. **Setup** (10 min): FTP access
2. **Preparation** (15 min): Build & prepare files
3. **Upload** (30 min): FTP upload
4. **Configuration** (15 min): Server setup
5. **Testing** (30 min): Verify everything
6. **Troubleshooting** (varies): Fix any issues

**Cost:** Usually included in GoDaddy Shared Hosting plan

**Maintenance:** 10-15 minutes per month

---

**Document Version:** 1.0  
**Last Updated:** January 25, 2026  
**Status:** Ready for Deployment ✅
