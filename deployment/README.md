# S-Steel Website Deployment Guide

## Prerequisites
- Python 3.8+
- Node.js 16+
- .NET hosting environment

## Quick Deploy Steps

### 1. Build Frontend
```bash
cd frontend
npm install
npm run build
```

### 2. Setup Backend
```bash
cd backend
pip install -r requirements.txt
python app.py
```

### 3. Configure for Hosting

#### For .NET Hosting with IIS:

1. **Frontend (React)**:
   - Copy `frontend/build/*` to your web hosting directory
   - Configure IIS to serve static files and handle SPA routing

2. **Backend (Python Flask)**:
   - Use Python CGI or WSGI hosting
   - Ensure Python and pip are available on hosting server
   - Copy `backend/` folder to hosting environment
   - Install dependencies: `pip install -r requirements.txt`

#### File Structure on Host:
```
/wwwroot/
├── index.html                 # React app entry
├── static/                    # React build assets
├── api/                       # Python Flask backend
│   ├── app.py
│   ├── requirements.txt
│   └── ...
├── uploads/                   # Project images
└── database/                  # SQLite databases
```

### 4. Environment Configuration

Create `.env` file in backend directory:
```
SECRET_KEY=your-production-secret-key
JWT_SECRET_KEY=your-jwt-secret-key
FLASK_ENV=production
DATABASE_PATH=../database/steel_website.db
UPLOAD_PATH=../uploads
```

### 5. Database Initialization

The database will be automatically created on first run. Default admin credentials:
- Username: `admin`
- Password: `admin123`

**IMPORTANT**: Change these credentials immediately after deployment!

### 6. File Permissions

Ensure write permissions for:
- `database/` directory
- `uploads/` directory

### 7. URL Configuration

Update API URLs in React app if needed:
- Development: `http://localhost:5000/api`
- Production: `https://yoursite.com/api`

## Hosting Options

### Option 1: Traditional .NET Hosting
- Upload built React files to web root
- Configure Python/Flask as CGI or subdirectory
- Use file-based SQLite database

### Option 2: Separate API Hosting
- Host React app on .NET server
- Host Flask API on Python-compatible server
- Update CORS settings accordingly

### Option 3: Single Server with Reverse Proxy
- Use IIS URL Rewrite to proxy API requests to Flask
- Host everything on single .NET server

## Production Checklist

- [ ] Change default admin credentials
- [ ] Update secret keys
- [ ] Configure SSL/HTTPS
- [ ] Set up database backups
- [ ] Configure file upload limits
- [ ] Test contact form delivery
- [ ] Verify image upload functionality
- [ ] Check responsive design on all devices

## Troubleshooting

### Common Issues:
1. **CORS errors**: Update Flask CORS settings
2. **File upload fails**: Check directory permissions
3. **Database errors**: Verify SQLite file permissions
4. **Admin login fails**: Check JWT configuration

### Support:
For deployment assistance, contact technical support with your hosting environment details.
