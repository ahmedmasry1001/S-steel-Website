from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
import sqlite3
import os
import json
import uuid
from datetime import datetime, timedelta
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash
from PIL import Image
import shutil

# Initialize Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-change-this-in-production'
app.config['JWT_SECRET_KEY'] = 'jwt-secret-string-change-this-in-production'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)

# Configure file uploads
UPLOAD_FOLDER = '../uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Initialize extensions
CORS(app, origins=["*"])  # Configure for production
jwt = JWTManager(app)

# Database setup
DATABASE = '../database/steel_website.db'

def init_db():
    """Initialize the database with required tables"""
    os.makedirs(os.path.dirname(DATABASE), exist_ok=True)
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    os.makedirs(f"{UPLOAD_FOLDER}/projects", exist_ok=True)
    os.makedirs(f"{UPLOAD_FOLDER}/gallery", exist_ok=True)
    
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    
    # Admin users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS admins (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Projects table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS projects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            category TEXT,
            location TEXT,
            size TEXT,
            year TEXT,
            featured BOOLEAN DEFAULT 0,
            status TEXT DEFAULT 'active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Project images table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS project_images (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            project_id INTEGER,
            image_path TEXT,
            image_name TEXT,
            is_main BOOLEAN DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (project_id) REFERENCES projects (id)
        )
    ''')
    
    # Contact submissions table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT,
            company TEXT,
            message TEXT,
            status TEXT DEFAULT 'new',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Home content table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS home_content (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            content_key TEXT UNIQUE NOT NULL,
            content_value TEXT,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Initialize default home content
    default_content = {
        'company_description': 'S-Steel Construction is a leading provider of steel construction services with over 15 years of experience in delivering high-quality projects.',
        'years_experience': '15',
        'projects_completed': '500',
        'team_members': '50',
        'client_satisfaction': '99'
    }
    
    for key, value in default_content.items():
        cursor.execute("SELECT * FROM home_content WHERE content_key = ?", (key,))
        if not cursor.fetchone():
            cursor.execute(
                "INSERT INTO home_content (content_key, content_value) VALUES (?, ?)",
                (key, value)
            )
    
    # Create default admin user if not exists
    cursor.execute("SELECT * FROM admins WHERE username = ?", ('admin',))
    if not cursor.fetchone():
        default_password = generate_password_hash('admin123')  # Change in production
        cursor.execute(
            "INSERT INTO admins (username, password_hash) VALUES (?, ?)",
            ('admin', default_password)
        )
    
    conn.commit()
    conn.close()

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

# Admin Authentication Routes
@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        conn = get_db_connection()
        admin = conn.execute(
            'SELECT * FROM admins WHERE username = ?', (username,)
        ).fetchone()
        conn.close()
        
        if admin and check_password_hash(admin['password_hash'], password):
            access_token = create_access_token(identity=username)
            return jsonify({
                'access_token': access_token,
                'username': username
            })
        else:
            return jsonify({'message': 'Invalid credentials'}), 401
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Projects Routes
@app.route('/api/projects', methods=['GET'])
def get_projects():
    try:
        featured = request.args.get('featured')
        limit = request.args.get('limit')
        category = request.args.get('category')
        
        conn = get_db_connection()
        query = '''
            SELECT p.*, 
                   pi.image_path as main_image
            FROM projects p
            LEFT JOIN project_images pi ON p.id = pi.project_id AND pi.is_main = 1
            WHERE p.status = 'active'
        '''
        params = []
        
        if featured:
            query += ' AND p.featured = 1'
        if category and category != 'all':
            query += ' AND p.category = ?'
            params.append(category)
            
        query += ' ORDER BY p.created_at DESC'
        
        if limit:
            query += ' LIMIT ?'
            params.append(int(limit))
        
        projects = conn.execute(query, params).fetchall()
        conn.close()
        
        projects_list = []
        for project in projects:
            project_dict = dict(project)
            project_dict['image'] = project_dict['main_image']
            projects_list.append(project_dict)
        
        return jsonify(projects_list)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/projects/<int:project_id>', methods=['GET'])
def get_project(project_id):
    try:
        conn = get_db_connection()
        
        # Get project details
        project = conn.execute(
            'SELECT * FROM projects WHERE id = ? AND status = "active"',
            (project_id,)
        ).fetchone()
        
        if not project:
            conn.close()
            return jsonify({'message': 'Project not found'}), 404
        
        # Get project images
        images = conn.execute(
            'SELECT * FROM project_images WHERE project_id = ? ORDER BY is_main DESC, created_at',
            (project_id,)
        ).fetchall()
        
        conn.close()
        
        project_dict = dict(project)
        project_dict['images'] = [dict(img) for img in images]
        
        return jsonify(project_dict)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/projects', methods=['POST'])
@jwt_required()
def create_project():
    try:
        data = request.get_json()
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO projects (title, description, category, location, size, year, featured)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (
            data.get('title'),
            data.get('description'),
            data.get('category'),
            data.get('location'),
            data.get('size'),
            data.get('year'),
            data.get('featured', False)
        ))
        
        project_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return jsonify({
            'message': 'Project created successfully',
            'project_id': project_id
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/projects/<int:project_id>/upload', methods=['POST'])
@jwt_required()
def upload_project_images():
    try:
        project_id = request.view_args['project_id']
        
        if 'files' not in request.files:
            return jsonify({'error': 'No files uploaded'}), 400
        
        files = request.files.getlist('files')
        is_main = request.form.get('is_main', 'false').lower() == 'true'
        
        uploaded_files = []
        conn = get_db_connection()
        cursor = conn.cursor()
        
        for file in files:
            if file and file.filename and allowed_file(file.filename):
                # Generate unique filename
                filename = f"{uuid.uuid4()}_{secure_filename(file.filename)}"
                file_path = os.path.join(app.config['UPLOAD_FOLDER'], 'projects', filename)
                
                # Save file
                file.save(file_path)
                
                # Optimize image
                try:
                    with Image.open(file_path) as img:
                        # Resize if too large
                        if img.width > 1920 or img.height > 1080:
                            img.thumbnail((1920, 1080), Image.Resampling.LANCZOS)
                            img.save(file_path, optimize=True, quality=85)
                except Exception as e:
                    print(f"Image optimization failed: {e}")
                
                # Save to database
                cursor.execute('''
                    INSERT INTO project_images (project_id, image_path, image_name, is_main)
                    VALUES (?, ?, ?, ?)
                ''', (project_id, f"projects/{filename}", file.filename, is_main))
                
                uploaded_files.append({
                    'filename': filename,
                    'original_name': file.filename,
                    'path': f"projects/{filename}"
                })
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'message': f'{len(uploaded_files)} files uploaded successfully',
            'files': uploaded_files
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Contact Routes
@app.route('/api/contact', methods=['POST'])
def submit_contact():
    try:
        data = request.get_json()
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO contacts (name, email, phone, company, message)
            VALUES (?, ?, ?, ?, ?)
        ''', (
            data.get('name'),
            data.get('email'),
            data.get('phone'),
            data.get('company'),
            data.get('message')
        ))
        
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Contact form submitted successfully'}), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/contacts', methods=['GET'])
@jwt_required()
def get_contacts():
    try:
        conn = get_db_connection()
        contacts = conn.execute(
            'SELECT * FROM contacts ORDER BY created_at DESC'
        ).fetchall()
        conn.close()
        
        return jsonify([dict(contact) for contact in contacts])
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# File serving
@app.route('/uploads/<path:filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/api/placeholder/<int:width>/<int:height>')
def placeholder_image(width, height):
    """Generate placeholder images for demo purposes"""
    try:
        # Create a simple placeholder image
        from PIL import Image, ImageDraw, ImageFont
        
        img = Image.new('RGB', (width, height), color='#64748b')
        draw = ImageDraw.Draw(img)
        
        text = f"Steel Project\n{width}x{height}"
        text_bbox = draw.textbbox((0, 0), text)
        text_width = text_bbox[2] - text_bbox[0]
        text_height = text_bbox[3] - text_bbox[1]
        
        position = ((width - text_width) // 2, (height - text_height) // 2)
        draw.text(position, text, fill='white')
        
        # Save to a temporary location
        placeholder_path = f"{UPLOAD_FOLDER}/placeholder_{width}x{height}.jpg"
        img.save(placeholder_path, 'JPEG')
        
        return send_from_directory(os.path.dirname(placeholder_path), 
                                 os.path.basename(placeholder_path))
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Home Content Management Routes
@app.route('/api/admin/home-content', methods=['GET'])
@jwt_required()
def get_home_content():
    try:
        conn = get_db_connection()
        
        # Get all home content from database
        content = {}
        rows = conn.execute('SELECT content_key, content_value FROM home_content').fetchall()
        for row in rows:
            content[row['content_key']] = row['content_value']
        
        conn.close()
        
        # Format data for frontend
        home_data = {
            'heroImages': [
                {'id': 1, 'url': '/api/placeholder/800/600', 'alt': 'Steel Construction Project 1'},
                {'id': 2, 'url': '/api/placeholder/800/600', 'alt': 'Steel Construction Project 2'},
                {'id': 3, 'url': '/api/placeholder/800/600', 'alt': 'Steel Construction Project 3'}
            ],
            'companyDescription': content.get('company_description', 'S-Steel Construction is a leading provider of steel construction services.'),
            'stats': {
                'yearsExperience': int(content.get('years_experience', 15)),
                'projectsCompleted': int(content.get('projects_completed', 500)),
                'teamMembers': int(content.get('team_members', 50)),
                'clientSatisfaction': int(content.get('client_satisfaction', 99))
            }
        }
        return jsonify(home_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/home-content/description', methods=['PUT'])
@jwt_required()
def update_company_description():
    try:
        data = request.get_json()
        description = data.get('description', '')
        
        conn = get_db_connection()
        conn.execute(
            "UPDATE home_content SET content_value = ?, updated_at = CURRENT_TIMESTAMP WHERE content_key = ?",
            (description, 'company_description')
        )
        # If no row was updated, insert it
        if conn.total_changes == 0:
            conn.execute(
                "INSERT INTO home_content (content_key, content_value) VALUES (?, ?)",
                ('company_description', description)
            )
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Company description updated successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/home-content/stats', methods=['PUT'])
@jwt_required()
def update_stats():
    try:
        data = request.get_json()
        
        # Extract individual stats
        years_exp = data.get('yearsExperience', '')
        projects = data.get('projectsCompleted', '')
        team = data.get('teamMembers', '')
        satisfaction = data.get('clientSatisfaction', '')
        
        conn = get_db_connection()
        
        # Update each stat
        stats_mapping = {
            'years_experience': str(years_exp),
            'projects_completed': str(projects), 
            'team_members': str(team),
            'client_satisfaction': str(satisfaction)
        }
        
        for key, value in stats_mapping.items():
            if value:  # Only update if value provided
                conn.execute(
                    "UPDATE home_content SET content_value = ?, updated_at = CURRENT_TIMESTAMP WHERE content_key = ?",
                    (value, key)
                )
                # If no row was updated, insert it
                if conn.total_changes == 0:
                    conn.execute(
                        "INSERT INTO home_content (content_key, content_value) VALUES (?, ?)",
                        (key, value)
                    )
        
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Statistics updated successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/home-content/images', methods=['POST'])
@jwt_required()
def upload_hero_image():
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400
            
        file = request.files['image']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # In a real app, handle file upload and save to database
        # For now, just return success
        return jsonify({
            'message': 'Image uploaded successfully',
            'image': {
                'id': 4,
                'url': '/api/placeholder/800/600',
                'alt': 'New Hero Image'
            }
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Initialize database on startup
if __name__ == '__main__':
    init_db()
    port = int(os.environ.get('PORT', 5001))
    app.run(debug=True, host='0.0.0.0', port=port)
