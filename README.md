# S-Steel Construction Website

A modern, dynamic website for steel construction company featuring project management, admin panel, and responsive design.

## 🏗️ Features

### Frontend (React)
- **Responsive Design**: Mobile-first approach with modern UI
- **Dynamic Project Showcase**: Interactive project gallery with filtering
- **Service Pages**: Comprehensive service and company information
- **Contact Forms**: Professional contact and quote request forms
- **SEO Optimized**: Clean URLs and meta tags

### Admin Panel
- **Easy Project Management**: Add, edit, and delete projects
- **Drag & Drop Image Upload**: Simple image management system
- **Contact Management**: View and manage contact submissions
- **User-Friendly Interface**: Intuitive admin dashboard

### Backend (Python Flask)
- **RESTful API**: Clean API design for all functionality
- **File-Based Database**: SQLite for easy hosting
- **Image Processing**: Automatic image optimization
- **Authentication**: JWT-based admin authentication
- **File Upload**: Secure image upload system

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- Python 3.8+

### Development Setup

1. **Clone and setup:**
   ```bash
   git clone https://github.com/ahmedmasry1001/S-steel-Website.git
   cd S-steel-Website
   ```

2. **Start Frontend:**
   ```bash
   cd frontend
   npm install
   npm start
   ```

3. **Start Backend:**
   ```bash
   cd backend
   pip install -r requirements.txt
   python app.py
   ```

4. **Access the application:**
   - Website: http://localhost:3000
   - Admin Panel: http://localhost:3000/admin
   - API: http://localhost:5000/api

### Default Admin Credentials
- Username: `admin`
- Password: `admin123`

**⚠️ Important**: Change these credentials immediately after deployment!

## 📦 Deployment

### Quick Deploy
```bash
./build.sh  # Linux/Mac
# or
build.bat   # Windows
```

### Manual Deployment

1. **Build Frontend:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to .NET Hosting:**
   - Upload `frontend/build/*` to your web root
   - Copy `backend/` to your server
   - Configure Python environment
   - Set file permissions for uploads and database

See [Deployment Guide](deployment/README.md) for detailed instructions.

## 🛠️ Tech Stack

### Frontend
- React 18
- React Router
- Framer Motion (animations)
- Heroicons
- React Hook Form
- React Dropzone
- React Toastify

### Backend
- Python Flask
- SQLite Database
- JWT Authentication
- PIL (Image Processing)
- Flask-CORS

### Hosting
- .NET Compatible
- File-based storage
- No complex database setup required

## 📁 Project Structure

```
S-steel-Website/
├── frontend/           # React application
│   ├── src/
│   │   ├── components/ # Reusable components
│   │   ├── pages/      # Page components
│   │   ├── admin/      # Admin panel
│   │   └── styles/     # CSS styles
├── backend/            # Flask API
│   ├── app.py         # Main application
│   └── requirements.txt
├── uploads/            # Project images
├── database/           # SQLite databases
├── deployment/         # Deployment configurations
└── build scripts
```

## 🎨 Customization

### Colors & Branding
Update the CSS variables in `frontend/src/styles/index.css`:

```css
:root {
  --primary-blue: #1e3a8a;
  --secondary-blue: #3b82f6;
  --steel-gray: #64748b;
  /* ... */
}
```

### Content
- Update company information in components
- Replace placeholder content with actual data
- Add your own project images

## 📝 Usage

### Adding Projects
1. Login to admin panel (`/admin`)
2. Navigate to Project Manager
3. Click "Add New Project"
4. Fill in project details
5. Upload images using drag & drop

### Managing Content
- **Projects**: Add, edit, delete, and feature projects
- **Images**: Drag & drop multiple images per project
- **Contacts**: View and manage contact form submissions

## 🔧 Configuration

### Environment Variables
Create `.env` file in backend directory:

```env
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret
FLASK_ENV=production
```

### API Endpoints
- `GET /api/projects` - Get all projects
- `POST /api/admin/projects` - Create project (auth required)
- `POST /api/contact` - Submit contact form
- `POST /api/admin/login` - Admin authentication

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 💡 Support

For support and questions:
- Create an issue on GitHub
- Contact: info@s-steel.com

---

Built with ❤️ for steel construction professionals