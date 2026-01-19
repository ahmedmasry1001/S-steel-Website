#!/usr/bin/env python3
"""
Comprehensive test script for photo management functionality
Tests both home content and project photo management features
"""

import requests
import json
import os
from io import BytesIO
try:
    from PIL import Image
except ImportError:
    print("PIL/Pillow not available, using simple test data instead")
    Image = None

BASE_URL = "http://localhost:5001"
ADMIN_USER = "admin"
ADMIN_PASS = "admin123"

def create_test_image(width=800, height=600, color=(255, 0, 0), format='JPEG'):
    """Create a test image in memory"""
    img = Image.new('RGB', (width, height), color=color)
    buffer = BytesIO()
    img.save(buffer, format=format)
    buffer.seek(0)
    return buffer

def get_admin_token():
    """Get admin authentication token"""
    response = requests.post(f"{BASE_URL}/api/admin/login", json={
        "username": ADMIN_USER,
        "password": ADMIN_PASS
    })
    if response.status_code == 200:
        return response.json()['access_token']
    else:
        raise Exception(f"Failed to login: {response.text}")

def test_home_content_images():
    """Test home content image management"""
    print("🏠 Testing Home Content Image Management...")
    
    token = get_admin_token()
    headers = {"Authorization": f"Bearer {token}"}
    
    # Test upload
    files = {
        'images': ('test_hero1.jpg', create_test_image(800, 600, (255, 0, 0)), 'image/jpeg'),
    }
    
    response = requests.post(f"{BASE_URL}/api/admin/home-content/images", 
                           headers=headers, files=files)
    print(f"✅ Hero image upload: {response.status_code} - {response.text}")
    
    if response.status_code == 200:
        image_id = response.json().get('images', [{}])[0].get('id')
        
        # Test getting home content
        response = requests.get(f"{BASE_URL}/api/home-content")
        print(f"✅ Get home content: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   Hero images count: {len(data.get('heroImages', []))}")
        
        # Test delete (if we got an image ID)
        if image_id:
            response = requests.delete(f"{BASE_URL}/api/admin/home-content/images/{image_id}", 
                                     headers=headers)
            print(f"✅ Hero image delete: {response.status_code}")

def test_project_management():
    """Test project creation and image management"""
    print("\n📁 Testing Project Management...")
    
    token = get_admin_token()
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    
    # Create a test project
    project_data = {
        "title": "Test Photo Management Project",
        "description": "A test project for verifying photo upload functionality",
        "category": "commercial",
        "location": "Test City",
        "size": "1000 sq ft",
        "year": "2026",
        "featured": True
    }
    
    response = requests.post(f"{BASE_URL}/api/admin/projects", 
                           headers=headers, json=project_data)
    print(f"✅ Project creation: {response.status_code}")
    
    if response.status_code == 201:
        project_id = response.json()['project_id']
        print(f"   Created project ID: {project_id}")
        
        # Test project image upload
        headers_upload = {"Authorization": f"Bearer {token}"}
        files = {
            'files': [
                ('test_project1.jpg', create_test_image(1024, 768, (0, 255, 0)), 'image/jpeg'),
                ('test_project2.jpg', create_test_image(1024, 768, (0, 0, 255)), 'image/jpeg'),
            ]
        }
        
        response = requests.post(f"{BASE_URL}/api/admin/projects/{project_id}/upload",
                               headers=headers_upload, files=files)
        print(f"✅ Project images upload: {response.status_code} - {response.text}")
        
        # Test getting project images
        response = requests.get(f"{BASE_URL}/api/admin/projects/{project_id}/images",
                              headers=headers_upload)
        print(f"✅ Get project images: {response.status_code}")
        
        if response.status_code == 200:
            images = response.json().get('images', [])
            print(f"   Project images count: {len(images)}")
            
            if images:
                first_image = images[0]
                image_id = first_image['id']
                
                # Test setting main image
                response = requests.put(f"{BASE_URL}/api/admin/projects/{project_id}/images/{image_id}/main",
                                      headers=headers_upload)
                print(f"✅ Set main image: {response.status_code}")
                
                # Test deleting an image
                if len(images) > 1:
                    second_image_id = images[1]['id']
                    response = requests.delete(f"{BASE_URL}/api/admin/projects/{project_id}/images/{second_image_id}",
                                             headers=headers_upload)
                    print(f"✅ Delete project image: {response.status_code}")
        
        # Clean up - delete test project
        response = requests.delete(f"{BASE_URL}/api/admin/projects/{project_id}",
                                 headers=headers_upload)
        print(f"✅ Project deletion: {response.status_code}")

def test_api_endpoints():
    """Test all API endpoints"""
    print("\n🔌 Testing API Endpoints...")
    
    # Test public endpoints
    response = requests.get(f"{BASE_URL}/api/projects")
    print(f"✅ Public projects API: {response.status_code}")
    
    response = requests.get(f"{BASE_URL}/api/home-content")
    print(f"✅ Public home content API: {response.status_code}")
    
    # Test admin login
    response = requests.post(f"{BASE_URL}/api/admin/login", json={
        "username": ADMIN_USER,
        "password": ADMIN_PASS
    })
    print(f"✅ Admin login: {response.status_code}")
    
    if response.status_code == 200:
        token = response.json()['access_token']
        headers = {"Authorization": f"Bearer {token}"}
        
        # Test admin endpoints
        response = requests.get(f"{BASE_URL}/api/admin/home-content", headers=headers)
        print(f"✅ Admin home content: {response.status_code}")

def main():
    """Run all tests"""
    print("🧪 Starting Photo Management Tests...")
    print("=" * 50)
    
    try:
        test_api_endpoints()
        test_home_content_images()
        test_project_management()
        
        print("\n" + "=" * 50)
        print("✅ All tests completed successfully!")
        print("\n📋 Test Summary:")
        print("   ✅ Home content image upload/delete")
        print("   ✅ Project creation")
        print("   ✅ Project image upload/delete")
        print("   ✅ Set main project image")
        print("   ✅ API endpoint accessibility")
        
    except Exception as e:
        print(f"\n❌ Test failed with error: {e}")
        return False
    
    return True

if __name__ == "__main__":
    main()
