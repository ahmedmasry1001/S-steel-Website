@echo off
echo 🏗️  Building S-Steel Website...

:: Build Frontend
echo 📦 Building React frontend...
cd frontend
call npm install
call npm run build

if %errorlevel% neq 0 (
    echo ❌ Frontend build failed!
    exit /b 1
)

echo ✅ Frontend build successful!
cd ..

:: Setup Backend
echo 🐍 Setting up Python backend...
cd backend

:: Create virtual environment if it doesn't exist
if not exist "venv" (
    python -m venv venv
)

:: Activate virtual environment
call venv\Scripts\activate.bat

:: Install dependencies
pip install -r requirements.txt

if %errorlevel% neq 0 (
    echo ❌ Backend setup failed!
    exit /b 1
)

echo ✅ Backend setup successful!
cd ..

:: Create deployment structure
echo 📁 Creating deployment structure...

mkdir deployment\dist 2>nul
mkdir deployment\dist\static 2>nul
mkdir deployment\dist\api 2>nul
mkdir deployment\dist\uploads 2>nul
mkdir deployment\dist\database 2>nul

:: Copy frontend build
xcopy frontend\build\* deployment\dist\ /E /Y

:: Copy backend
xcopy backend\* deployment\dist\api\ /E /Y

:: Copy deployment files
copy deployment\web.config deployment\dist\
copy deployment\README.md deployment\dist\

echo 🎉 Build complete!
echo 📋 Deployment files are in: deployment\dist\
echo.
echo Next steps:
echo 1. Upload deployment\dist\* to your hosting server
echo 2. Configure Python environment on server
echo 3. Set proper file permissions for uploads and database directories
echo 4. Update admin credentials after first login
echo.
echo ✨ Your S-Steel website is ready for deployment!

pause
