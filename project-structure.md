# S-Steel Website Project Structure

## Overview
Dynamic steel construction company website with admin panel for project management.

## Architecture
- **Frontend**: React.js (Single Page Application)
- **Backend**: Python Flask API (lightweight for .NET hosting)
- **Database**: SQLite/JSON files (file-based for easy hosting)
- **Storage**: File system based (compatible with hosting storage)

## Features
- Responsive design matching PDF presentation
- Dynamic project showcase
- Admin panel with drag & drop project management
- Image gallery for each project
- Contact forms
- Services showcase
- Company information

## Folder Structure
```
/
├── frontend/                 # React application
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── admin/
│   │   ├── assets/
│   │   └── styles/
├── backend/                  # Python Flask API
│   ├── app.py
│   ├── routes/
│   ├── models/
│   └── data/
├── uploads/                  # Project images and files
├── database/                 # SQLite database files
└── deployment/               # Hosting configuration
```

## Hosting Requirements
- Compatible with .NET hosting
- File-based storage system
- Easy deployment process
- No complex database setup required
