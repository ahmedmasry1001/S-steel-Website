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
    
    # Hero images table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS hero_images (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            filename TEXT NOT NULL,
            original_name TEXT,
            alt_text TEXT,
            display_order INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Employees table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS employees (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            role TEXT,
            experience_years INTEGER,
            specialty TEXT,
            bio TEXT,
            email TEXT,
            phone TEXT,
            avatar_url TEXT,
            display_order INTEGER DEFAULT 0,
            is_active BOOLEAN DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Contact cards table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS contact_cards (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            details TEXT,
            sub_details TEXT,
            contact_type TEXT,
            icon_emoji TEXT,
            display_order INTEGER DEFAULT 0,
            is_active BOOLEAN DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
            # Convert relative path to full URL
            if project_dict['main_image']:
                project_dict['image'] = f"http://localhost:5001/uploads/{project_dict['main_image']}"
                project_dict['main_image'] = f"http://localhost:5001/uploads/{project_dict['main_image']}"
            else:
                project_dict['image'] = None
                project_dict['main_image'] = None
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
        
        # Convert image paths to full URLs and add main image URL
        images_with_urls = []
        main_image_url = None
        
        for img in images:
            img_dict = dict(img)
            img_dict['url'] = f"http://localhost:5001/uploads/{img_dict['image_path']}"
            images_with_urls.append(img_dict)
            
            # Set main image URL
            if img_dict['is_main']:
                main_image_url = img_dict['url']
        
        project_dict['images'] = images_with_urls
        project_dict['main_image'] = main_image_url
        
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

@app.route('/api/admin/projects/<int:project_id>', methods=['PUT'])
@jwt_required()
def update_project(project_id):
    """Update an existing project"""
    try:
        data = request.get_json()
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            UPDATE projects 
            SET title = ?, description = ?, category = ?, location = ?, size = ?, year = ?, featured = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        ''', (
            data.get('title'),
            data.get('description'),
            data.get('category'),
            data.get('location'),
            data.get('size'),
            data.get('year'),
            data.get('featured', False),
            project_id
        ))
        
        if cursor.rowcount == 0:
            conn.close()
            return jsonify({'error': 'Project not found'}), 404
        
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Project updated successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/projects/<int:project_id>', methods=['DELETE'])
@jwt_required()
def delete_project(project_id):
    """Delete a project and all its associated images"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get all images for this project
        cursor.execute('SELECT image_path FROM project_images WHERE project_id = ?', (project_id,))
        images = cursor.fetchall()
        
        # Delete all project images from filesystem
        for image in images:
            try:
                file_path = os.path.join(app.config['UPLOAD_FOLDER'], image[0])
                if os.path.exists(file_path):
                    os.remove(file_path)
            except Exception as e:
                print(f"Warning: Could not delete file {image[0]}: {e}")
        
        # Delete project images from database
        cursor.execute('DELETE FROM project_images WHERE project_id = ?', (project_id,))
        
        # Delete project
        cursor.execute('DELETE FROM projects WHERE id = ?', (project_id,))
        
        if cursor.rowcount == 0:
            conn.rollback()
            conn.close()
            return jsonify({'error': 'Project not found'}), 404
        
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Project deleted successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/projects/<int:project_id>/upload', methods=['POST'])
@jwt_required()
def upload_project_images(project_id):
    try:
        
        if 'files' not in request.files:
            return jsonify({'error': 'No files uploaded'}), 400
        
        files = request.files.getlist('files')
        is_main = request.form.get('is_main', 'false').lower() == 'true'
        
        uploaded_files = []
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Check if project has any existing main image
        existing_main = cursor.execute(
            'SELECT COUNT(*) FROM project_images WHERE project_id = ? AND is_main = 1',
            (project_id,)
        ).fetchone()[0]
        
        has_main_image = existing_main > 0
        first_upload = True  # Track if this is the first file being uploaded
        
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
                
                # Determine if this should be the main image
                should_be_main = is_main or (not has_main_image and first_upload)
                
                # Save to database
                cursor.execute('''
                    INSERT INTO project_images (project_id, image_path, image_name, is_main)
                    VALUES (?, ?, ?, ?)
                ''', (project_id, f"projects/{filename}", file.filename, should_be_main))
                
                uploaded_files.append({
                    'filename': filename,
                    'original_name': file.filename,
                    'path': f"projects/{filename}",
                    'is_main': should_be_main
                })
                
                # After setting the first image as main, don't set subsequent ones as main
                if should_be_main:
                    has_main_image = True
                first_upload = False
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'message': f'{len(uploaded_files)} files uploaded successfully',
            'files': uploaded_files
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/projects/<int:project_id>/images', methods=['GET'])
@jwt_required()
def get_project_images(project_id):
    """Get all images for a specific project"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT id, image_path, image_name, is_main, created_at
            FROM project_images 
            WHERE project_id = ? 
            ORDER BY is_main DESC, created_at
        ''', (project_id,))
        
        images = cursor.fetchall()
        conn.close()
        
        image_list = []
        for img in images:
            image_list.append({
                'id': img[0],
                'url': f"http://localhost:5001/uploads/{img[1]}",
                'path': img[1],
                'name': img[2],
                'is_main': bool(img[3]),
                'created_at': img[4]
            })
        
        return jsonify({'images': image_list})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/projects/<int:project_id>/images/<int:image_id>', methods=['DELETE'])
@jwt_required()
def delete_project_image(project_id, image_id):
    """Delete a specific project image"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get image path before deleting
        cursor.execute('SELECT image_path FROM project_images WHERE id = ? AND project_id = ?', 
                      (image_id, project_id))
        image = cursor.fetchone()
        
        if not image:
            return jsonify({'error': 'Image not found'}), 404
        
        # Delete from database
        cursor.execute('DELETE FROM project_images WHERE id = ? AND project_id = ?', 
                      (image_id, project_id))
        conn.commit()
        conn.close()
        
        # Delete file from filesystem
        try:
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], image[0])
            if os.path.exists(file_path):
                os.remove(file_path)
        except Exception as e:
            print(f"Warning: Could not delete file {image[0]}: {e}")
        
        return jsonify({'message': 'Image deleted successfully'})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/projects/<int:project_id>/images/<int:image_id>/main', methods=['PUT'])
@jwt_required()
def set_main_project_image(project_id, image_id):
    """Set an image as the main image for a project"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # First, unset all main images for this project
        cursor.execute('UPDATE project_images SET is_main = 0 WHERE project_id = ?', (project_id,))
        
        # Set the specified image as main
        cursor.execute('UPDATE project_images SET is_main = 1 WHERE id = ? AND project_id = ?', 
                      (image_id, project_id))
        
        if cursor.rowcount == 0:
            conn.rollback()
            conn.close()
            return jsonify({'error': 'Image not found'}), 404
        
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Main image updated successfully'})
        
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

# Public Home Content Route (no authentication required)
@app.route('/api/home-content', methods=['GET'])
def get_public_home_content():
    """Get home content for public website"""
    try:
        conn = get_db_connection()
        
        # Get all home content from database
        content = {}
        rows = conn.execute('SELECT content_key, content_value FROM home_content').fetchall()
        for row in rows:
            content[row['content_key']] = row['content_value']
        
        # Get hero images from database
        hero_images = []
        image_rows = conn.execute(
            'SELECT id, filename, alt_text FROM hero_images ORDER BY display_order, created_at'
        ).fetchall()
        
        for row in image_rows:
            hero_images.append({
                'id': row['id'],
                'url': f'http://localhost:5001/uploads/gallery/{row["filename"]}',
                'alt': row['alt_text'] or f'Hero Image {row["id"]}'
            })
        
        # If no uploaded images, show placeholders
        if not hero_images:
            hero_images = [
                {'id': 1, 'url': '/api/placeholder/800/600', 'alt': 'Steel Construction Project 1'},
                {'id': 2, 'url': '/api/placeholder/800/600', 'alt': 'Steel Construction Project 2'},
                {'id': 3, 'url': '/api/placeholder/800/600', 'alt': 'Steel Construction Project 3'}
            ]
        
        conn.close()
        
        # Format data for frontend
        home_data = {
            'heroImages': hero_images,
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

# Company Info Endpoint (Public)
@app.route('/api/company-info', methods=['GET'])
def get_public_company_info():
    """Get company information for public website (footer, contact info)"""
    try:
        conn = get_db_connection()
        
        # Get all company settings from database
        company_data = {}
        rows = conn.execute(
            'SELECT content_key, content_value FROM home_content WHERE content_key LIKE ?', 
            ('company_%',)
        ).fetchall()
        
        for row in rows:
            key = row['content_key'].replace('company_', '')
            try:
                # Try to parse as JSON for complex data
                company_data[key] = json.loads(row['content_value'])
            except:
                # Keep as string for simple values
                company_data[key] = row['content_value']
        
        # Also get footer-specific settings
        footer_rows = conn.execute(
            'SELECT content_key, content_value FROM home_content WHERE content_key LIKE ?', 
            ('footer_%',)
        ).fetchall()
        
        for row in footer_rows:
            key = row['content_key']  # Keep the full key with footer_ prefix
            value = row['content_value']
            
            # Special handling for boolean values
            if 'certification' in key:
                # Convert "true"/"false" strings to actual booleans
                company_data[key] = value.lower() == 'true'
            else:
                try:
                    # Try to parse as JSON for complex data
                    company_data[key] = json.loads(value)
                except:
                    # Keep as string for simple values
                    company_data[key] = value
        
        # Set default values if not found
        defaults = {
            'address': '123 Steel Avenue, Industrial District, City, State 12345',
            'phone': '+1 (555) 123-4567',
            'email': 'info@s-steel.com',
            'website': 'www.s-steel.com',
            'footer_address': '123 Steel Industry Blvd, Industrial City',
            'footer_phone': '+1 (555) 123-4567',
            'footer_fax': '+1 (555) 123-4568',
            'footer_email': 'info@s-steel.com',
            'footer_website': 'www.s-steel.com',
            'footer_facebook': '',
            'footer_twitter': '',
            'footer_instagram': '',
            'footer_linkedin': '',
            'footer_certification_iso': True,
            'footer_certification_osha': True,
            'footer_certification_aws': True
        }
        
        # Merge defaults with saved settings
        for key, default_value in defaults.items():
            if key not in company_data:
                company_data[key] = default_value
        
        conn.close()
        return jsonify(company_data)
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
        
        # Get hero images from database
        hero_images = []
        image_rows = conn.execute(
            'SELECT id, filename, alt_text FROM hero_images ORDER BY display_order, created_at'
        ).fetchall()
        
        for row in image_rows:
            hero_images.append({
                'id': row['id'],
                'url': f'http://localhost:5001/uploads/gallery/{row["filename"]}',
                'alt': row['alt_text'] or f'Hero Image {row["id"]}'
            })
        
        # If no uploaded images, show placeholders
        if not hero_images:
            hero_images = [
                {'id': 1, 'url': '/api/placeholder/800/600', 'alt': 'Steel Construction Project 1'},
                {'id': 2, 'url': '/api/placeholder/800/600', 'alt': 'Steel Construction Project 2'},
                {'id': 3, 'url': '/api/placeholder/800/600', 'alt': 'Steel Construction Project 3'}
            ]
        
        conn.close()
        
        # Format data for frontend
        home_data = {
            'heroImages': hero_images,
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
def upload_hero_images():
    try:
        uploaded_images = []
        
        # Check for both 'image' (single) and 'images' (multiple) fields
        files = []
        if 'images' in request.files:
            files = request.files.getlist('images')
        elif 'image' in request.files:
            files = [request.files['image']]
        
        if not files:
            return jsonify({'error': 'No image files provided'}), 400
        
        for file in files:
            if file and file.filename != '' and allowed_file(file.filename):
                # Generate unique filename
                filename = secure_filename(file.filename)
                unique_filename = f"{uuid.uuid4().hex}_{filename}"
                
                # Ensure gallery directory exists
                gallery_path = os.path.join(UPLOAD_FOLDER, 'gallery')
                os.makedirs(gallery_path, exist_ok=True)
                
                # Save file
                file_path = os.path.join(gallery_path, unique_filename)
                file.save(file_path)
                
                # Save to database
                conn = get_db_connection()
                cursor = conn.cursor()
                cursor.execute(
                    "INSERT INTO hero_images (filename, original_name, alt_text, display_order) VALUES (?, ?, ?, ?)",
                    (unique_filename, file.filename, f'Hero Image {len(uploaded_images) + 1}', len(uploaded_images))
                )
                image_id = cursor.lastrowid
                conn.commit()
                conn.close()
                
                # Add to uploaded images list
                image_data = {
                    'id': image_id,
                    'url': f'http://localhost:5001/uploads/gallery/{unique_filename}',
                    'alt': f'Hero Image {len(uploaded_images) + 1}',
                    'filename': unique_filename
                }
                uploaded_images.append(image_data)
        
        if not uploaded_images:
            return jsonify({'error': 'No valid image files were uploaded'}), 400
        
        return jsonify({
            'message': f'{len(uploaded_images)} image(s) uploaded successfully',
            'images': uploaded_images
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Delete hero image endpoint
@app.route('/api/admin/home-content/images/<int:image_id>', methods=['DELETE'])
@jwt_required()
def delete_hero_image(image_id):
    try:
        conn = get_db_connection()
        
        # Get the filename before deleting
        image = conn.execute(
            'SELECT filename FROM hero_images WHERE id = ?', (image_id,)
        ).fetchone()
        
        if not image:
            conn.close()
            return jsonify({'error': 'Image not found'}), 404
        
        # Delete from database
        conn.execute('DELETE FROM hero_images WHERE id = ?', (image_id,))
        conn.commit()
        conn.close()
        
        # Delete physical file
        try:
            file_path = os.path.join(UPLOAD_FOLDER, 'gallery', image['filename'])
            if os.path.exists(file_path):
                os.remove(file_path)
        except Exception as e:
            print(f"Warning: Could not delete file {image['filename']}: {e}")
        
        return jsonify({'message': 'Image deleted successfully'})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Employee Management APIs
@app.route('/api/employees', methods=['GET'])
def get_employees():
    """Get all active employees for public website"""
    try:
        conn = get_db_connection()
        employees = []
        rows = conn.execute('''
            SELECT id, name, role, experience_years, specialty, avatar_url 
            FROM employees 
            WHERE is_active = 1 
            ORDER BY display_order, name
        ''').fetchall()
        
        for row in rows:
            employees.append({
                'id': row['id'],
                'name': row['name'],
                'role': row['role'],
                'experience': f"{row['experience_years']} years" if row['experience_years'] else 'N/A',
                'specialty': row['specialty'],
                'avatar': row['avatar_url'] or '👨‍💼',
                'verified': True
            })
        
        conn.close()
        return jsonify(employees)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/employees', methods=['GET'])
@jwt_required()
def get_admin_employees():
    """Get all employees for admin management"""
    try:
        conn = get_db_connection()
        employees = []
        rows = conn.execute('''
            SELECT * FROM employees ORDER BY display_order, name
        ''').fetchall()
        
        for row in rows:
            employees.append({
                'id': row['id'],
                'name': row['name'],
                'role': row['role'],
                'experience_years': row['experience_years'],
                'specialty': row['specialty'],
                'bio': row['bio'],
                'email': row['email'],
                'phone': row['phone'],
                'avatar_url': row['avatar_url'],
                'display_order': row['display_order'],
                'is_active': bool(row['is_active']),
                'created_at': row['created_at']
            })
        
        conn.close()
        return jsonify(employees)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/employees', methods=['POST'])
@jwt_required()
def create_employee():
    """Create new employee"""
    try:
        data = request.get_json()
        
        conn = get_db_connection()
        conn.execute('''
            INSERT INTO employees (name, role, experience_years, specialty, bio, email, phone, avatar_url, display_order, is_active)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            data.get('name'),
            data.get('role'),
            data.get('experience_years'),
            data.get('specialty'),
            data.get('bio'),
            data.get('email'),
            data.get('phone'),
            data.get('avatar_url'),
            data.get('display_order', 0),
            data.get('is_active', True)
        ))
        conn.commit()
        
        employee_id = conn.lastrowid
        conn.close()
        
        return jsonify({'message': 'Employee created successfully', 'id': employee_id}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/employees/<int:employee_id>', methods=['PUT'])
@jwt_required()
def update_employee(employee_id):
    """Update employee"""
    try:
        data = request.get_json()
        
        conn = get_db_connection()
        conn.execute('''
            UPDATE employees 
            SET name=?, role=?, experience_years=?, specialty=?, bio=?, email=?, phone=?, avatar_url=?, display_order=?, is_active=?
            WHERE id=?
        ''', (
            data.get('name'),
            data.get('role'),
            data.get('experience_years'),
            data.get('specialty'),
            data.get('bio'),
            data.get('email'),
            data.get('phone'),
            data.get('avatar_url'),
            data.get('display_order', 0),
            data.get('is_active', True),
            employee_id
        ))
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Employee updated successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/employees/<int:employee_id>', methods=['DELETE'])
@jwt_required()
def delete_employee(employee_id):
    """Delete employee"""
    try:
        conn = get_db_connection()
        conn.execute('DELETE FROM employees WHERE id=?', (employee_id,))
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Employee deleted successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Contact Cards Management APIs
@app.route('/api/contact-cards', methods=['GET'])
def get_contact_cards():
    """Get all active contact cards for public website"""
    try:
        conn = get_db_connection()
        cards = []
        rows = conn.execute('''
            SELECT id, title, details, sub_details, contact_type, icon_emoji 
            FROM contact_cards 
            WHERE is_active = 1 
            ORDER BY display_order, title
        ''').fetchall()
        
        for row in rows:
            cards.append({
                'id': row['id'],
                'title': row['title'],
                'details': row['details'],
                'subDetails': row['sub_details'],
                'emoji': row['icon_emoji'] or '📞',
                'gradient': 'from-blue-500 to-purple-600',  # Default gradient
                'verified': True
            })
        
        conn.close()
        return jsonify(cards)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/contact-cards', methods=['GET'])
@jwt_required()
def get_admin_contact_cards():
    """Get all contact cards for admin management"""
    try:
        conn = get_db_connection()
        cards = []
        rows = conn.execute('''
            SELECT * FROM contact_cards ORDER BY display_order, title
        ''').fetchall()
        
        for row in rows:
            cards.append({
                'id': row['id'],
                'title': row['title'],
                'details': row['details'],
                'sub_details': row['sub_details'],
                'contact_type': row['contact_type'],
                'icon_emoji': row['icon_emoji'],
                'display_order': row['display_order'],
                'is_active': bool(row['is_active']),
                'created_at': row['created_at']
            })
        
        conn.close()
        return jsonify(cards)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/contact-cards', methods=['POST'])
@jwt_required()
def create_contact_card():
    """Create new contact card"""
    try:
        data = request.get_json()
        
        conn = get_db_connection()
        conn.execute('''
            INSERT INTO contact_cards (title, details, sub_details, contact_type, icon_emoji, display_order, is_active)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (
            data.get('title'),
            data.get('details'),
            data.get('sub_details'),
            data.get('contact_type'),
            data.get('icon_emoji'),
            data.get('display_order', 0),
            data.get('is_active', True)
        ))
        conn.commit()
        
        card_id = conn.lastrowid
        conn.close()
        
        return jsonify({'message': 'Contact card created successfully', 'id': card_id}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/contact-cards/<int:card_id>', methods=['PUT'])
@jwt_required()
def update_contact_card(card_id):
    """Update contact card"""
    try:
        data = request.get_json()
        
        conn = get_db_connection()
        conn.execute('''
            UPDATE contact_cards 
            SET title=?, details=?, sub_details=?, contact_type=?, icon_emoji=?, display_order=?, is_active=?
            WHERE id=?
        ''', (
            data.get('title'),
            data.get('details'),
            data.get('sub_details'),
            data.get('contact_type'),
            data.get('icon_emoji'),
            data.get('display_order', 0),
            data.get('is_active', True),
            card_id
        ))
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Contact card updated successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/contact-cards/<int:card_id>', methods=['DELETE'])
@jwt_required()
def delete_contact_card(card_id):
    """Delete contact card"""
    try:
        conn = get_db_connection()
        conn.execute('DELETE FROM contact_cards WHERE id=?', (card_id,))
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Contact card deleted successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Route to serve uploaded files
# Company Settings Endpoints
@app.route('/api/admin/company-settings', methods=['GET'])
@jwt_required()
def get_company_settings():
    """Get all company settings"""
    try:
        conn = sqlite3.connect(DATABASE)
        conn.row_factory = sqlite3.Row
        
        settings = {}
        
        # Get all settings from home_content table with 'company_' prefix
        rows = conn.execute(
            'SELECT content_key, content_value FROM home_content WHERE content_key LIKE ?', 
            ('company_%',)
        ).fetchall()
        
        for row in rows:
            # Remove 'company_' prefix from key
            key = row['content_key'].replace('company_', '')
            try:
                # Try to parse as JSON for complex data
                settings[key] = json.loads(row['content_value'])
            except:
                # Keep as string for simple values
                settings[key] = row['content_value']
        
        # Also get footer settings with 'footer_' prefix
        footer_rows = conn.execute(
            'SELECT content_key, content_value FROM home_content WHERE content_key LIKE ?', 
            ('footer_%',)
        ).fetchall()
        
        for row in footer_rows:
            key = row['content_key']  # Keep the full key with footer_ prefix
            value = row['content_value']
            
            # Special handling for boolean values
            if 'certification' in key:
                # Convert "true"/"false" strings to actual booleans
                settings[key] = value.lower() == 'true'
            else:
                try:
                    # Try to parse as JSON for complex data
                    settings[key] = json.loads(value)
                except:
                    # Keep as string for simple values
                    settings[key] = value
        
        # Set default values if not found
        defaults = {
            'name': 'S-Steel Construction',
            'description': 'Leading steel construction and engineering company specializing in industrial, commercial, and infrastructure projects.',
            'address': '123 Industrial Ave, Steel City, SC 12345',
            'phone': '+1 (555) 123-4567',
            'email': 'info@s-steel.com',
            'website': 'www.s-steel.com',
            'founded': '1995',
            'employees': '250+',
            'projects_completed': '500+',
            'support_email': 'support@s-steel.com',
            'support_phone': '+1 (555) 123-4568',
            'sales_email': 'sales@s-steel.com',
            'sales_phone': '+1 (555) 123-4569',
            'emergency_contact': '+1 (555) 911-STEEL',
            'business_hours': 'Mon-Fri: 8:00 AM - 6:00 PM',
            'office_locations': [
                {
                    'id': 1,
                    'name': 'Main Office',
                    'address': '123 Industrial Ave, Steel City, SC 12345',
                    'phone': '+1 (555) 123-4567'
                },
                {
                    'id': 2,
                    'name': 'Regional Office',
                    'address': '456 Construction Blvd, Metro City, MC 67890',
                    'phone': '+1 (555) 987-6543'
                }
            ],
            # Footer defaults
            'footer_address': '123 Steel Industry Blvd, Industrial City',
            'footer_phone': '+1 (555) 123-4567',
            'footer_fax': '+1 (555) 123-4568',
            'footer_email': 'info@s-steel.com',
            'footer_website': 'www.s-steel.com',
            'footer_facebook': '',
            'footer_twitter': '',
            'footer_instagram': '',
            'footer_linkedin': '',
            'footer_certification_iso': True,
            'footer_certification_osha': True,
            'footer_certification_aws': True
        }
        
        # Merge defaults with saved settings
        for key, default_value in defaults.items():
            if key not in settings:
                settings[key] = default_value
        
        conn.close()
        return jsonify(settings)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/company-settings', methods=['PUT'])
@jwt_required()
def update_company_settings():
    """Update company settings"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        
        # Update each setting
        for key, value in data.items():
            # Only add 'company_' prefix if key doesn't already have a prefix
            if key.startswith('footer_') or key.startswith('dashboard_'):
                content_key = key  # Keep footer_* and dashboard_* keys as-is
            else:
                content_key = f'company_{key}'  # Add prefix for other keys
            
            # Convert complex data to JSON string
            if isinstance(value, (dict, list)):
                content_value = json.dumps(value)
            elif isinstance(value, bool):
                # Convert boolean to "true"/"false" string for consistency
                content_value = "true" if value else "false"
            else:
                content_value = str(value)
            
            # Try to update existing record
            cursor.execute(
                "UPDATE home_content SET content_value = ?, updated_at = CURRENT_TIMESTAMP WHERE content_key = ?",
                (content_value, content_key)
            )
            
            # If no rows were affected, insert new record
            if cursor.rowcount == 0:
                cursor.execute(
                    "INSERT INTO home_content (content_key, content_value) VALUES (?, ?)",
                    (content_key, content_value)
                )
        
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Company settings updated successfully'})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Dashboard Settings Endpoints
@app.route('/api/admin/dashboard-settings', methods=['GET'])
@jwt_required()
def get_dashboard_settings():
    """Get dashboard settings"""
    try:
        conn = sqlite3.connect(DATABASE)
        conn.row_factory = sqlite3.Row
        
        # Get dashboard settings from home_content table with 'dashboard_' prefix
        rows = conn.execute(
            'SELECT content_key, content_value FROM home_content WHERE content_key LIKE ?', 
            ('dashboard_%',)
        ).fetchall()
        
        settings = {}
        for row in rows:
            key = row['content_key'].replace('dashboard_', '')
            try:
                settings[key] = json.loads(row['content_value'])
            except:
                settings[key] = row['content_value']
        
        # Set defaults if not found
        if 'stats_cards' not in settings:
            settings['stats_cards'] = [
                {
                    'id': 1,
                    'title': 'Total Projects',
                    'value': '12',
                    'change': '+12% this month',
                    'icon': 'BuildingOfficeIcon',
                    'visible': True,
                    'order': 1
                },
                {
                    'id': 2,
                    'title': 'New Contacts',
                    'value': '5',
                    'change': '+8% this week',
                    'icon': 'ChatBubbleLeftRightIcon',
                    'visible': True,
                    'order': 2
                },
                {
                    'id': 3,
                    'title': 'Active Projects',
                    'value': '8',
                    'change': '+2 from last month',
                    'icon': 'ChartBarIcon',
                    'visible': True,
                    'order': 3
                },
                {
                    'id': 4,
                    'title': 'Revenue',
                    'value': '$2.5M',
                    'change': '+15% this quarter',
                    'icon': 'BanknotesIcon',
                    'visible': True,
                    'order': 4
                }
            ]
        
        if 'quick_actions' not in settings:
            settings['quick_actions'] = [
                {
                    'id': 1,
                    'title': 'Add New Project',
                    'description': 'Create a new construction project',
                    'link': '/admin/projects/new',
                    'icon': 'PlusIcon',
                    'visible': True
                },
                {
                    'id': 2,
                    'title': 'View Contacts',
                    'description': 'Manage customer inquiries',
                    'link': '/admin/contacts',
                    'icon': 'ChatBubbleLeftRightIcon',
                    'visible': True
                }
            ]
        
        conn.close()
        return jsonify(settings)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/dashboard-settings', methods=['PUT'])
@jwt_required()
def update_dashboard_settings():
    """Update dashboard settings"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        
        # Update each setting with 'dashboard_' prefix
        for key, value in data.items():
            content_key = f'dashboard_{key}'
            content_value = json.dumps(value)
            
            cursor.execute(
                "UPDATE home_content SET content_value = ?, updated_at = CURRENT_TIMESTAMP WHERE content_key = ?",
                (content_value, content_key)
            )
            
            if cursor.rowcount == 0:
                cursor.execute(
                    "INSERT INTO home_content (content_key, content_value) VALUES (?, ?)",
                    (content_key, content_value)
                )
        
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Dashboard settings updated successfully'})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/uploads/<path:filename>')
def serve_upload(filename):
    """Serve uploaded files"""
    return send_from_directory(UPLOAD_FOLDER, filename)

# Initialize database on startup
if __name__ == '__main__':
    init_db()
    port = int(os.environ.get('PORT', 5001))
    app.run(debug=True, host='0.0.0.0', port=port)
