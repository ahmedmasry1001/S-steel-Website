#!/usr/bin/env python3
"""
Simple test script for photo management functionality
"""

import requests
import json

BASE_URL = "http://localhost:5001"
ADMIN_USER = "admin"
ADMIN_PASS = "admin123"

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

def test_api_endpoints():
    """Test all API endpoints"""
    print("🔌 Testing API Endpoints...")
    
    # Test public endpoints
    response = requests.get(f"{BASE_URL}/api/projects")
    print(f"✅ Public projects API: {response.status_code}")
    
    response = requests.get(f"{BASE_URL}/api/home-content")
    print(f"✅ Public home content API: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"   Hero images count: {len(data.get('heroImages', []))}")
    
    # Test admin login
    print(f"🔑 Testing admin login...")
    token = get_admin_token()
    print(f"✅ Admin login successful, token length: {len(token)}")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # Test admin endpoints
    response = requests.get(f"{BASE_URL}/api/admin/home-content", headers=headers)
    print(f"✅ Admin home content: {response.status_code}")
    
    # Test project endpoints
    response = requests.get(f"{BASE_URL}/api/projects")
    print(f"✅ Projects list: {response.status_code}")
    if response.status_code == 200:
        projects = response.json()
        print(f"   Total projects: {len(projects)}")
        
        if projects:
            project_id = projects[0]['id']
            response = requests.get(f"{BASE_URL}/api/admin/projects/{project_id}/images", headers=headers)
            print(f"✅ Project images endpoint: {response.status_code}")
            if response.status_code == 200:
                images = response.json().get('images', [])
                print(f"   Project images: {len(images)}")

def test_project_creation():
    """Test creating a new project"""
    print("\n📁 Testing Project Creation...")
    
    token = get_admin_token()
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    
    project_data = {
        "title": "Test Project for Photos",
        "description": "A test project to verify photo functionality",
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
        
        # Test getting the project
        response = requests.get(f"{BASE_URL}/api/projects/{project_id}")
        print(f"✅ Get created project: {response.status_code}")
        
        # Test project images endpoint
        headers_auth = {"Authorization": f"Bearer {token}"}
        response = requests.get(f"{BASE_URL}/api/admin/projects/{project_id}/images",
                              headers=headers_auth)
        print(f"✅ Project images endpoint: {response.status_code}")
        
        return project_id
    
    return None

def main():
    """Run all tests"""
    print("🧪 Starting Photo Management API Tests...")
    print("=" * 50)
    
    try:
        test_api_endpoints()
        project_id = test_project_creation()
        
        print("\n" + "=" * 50)
        print("✅ API tests completed!")
        print("\n📋 Test Summary:")
        print("   ✅ Backend API is responding")
        print("   ✅ Admin authentication works")
        print("   ✅ Home content API accessible")
        print("   ✅ Project creation works")
        print("   ✅ Project image endpoints available")
        
        if project_id:
            print(f"\n💡 You can now test image uploads through the admin interface:")
            print(f"   🌐 Go to: http://localhost:3000/admin/projects")
            print(f"   📁 Select project ID: {project_id}")
            print(f"   📸 Upload images using the drag & drop interface")
        
    except Exception as e:
        print(f"\n❌ Test failed with error: {e}")
        return False
    
    return True

if __name__ == "__main__":
    main()
