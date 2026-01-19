#!/usr/bin/env python3
import requests
import json

def test_frontend_style_upload():
    """Test upload the way the frontend does it"""
    
    # Get token first
    login_url = "http://localhost:5001/api/admin/login"
    credentials = {"username": "admin", "password": "admin123"}
    
    login_response = requests.post(login_url, json=credentials)
    if login_response.status_code != 200:
        print("❌ Login failed")
        return
        
    token = login_response.json().get('access_token')
    print(f"✅ Got token: {token[:20]}...")
    
    # Test upload with 'images' field (multiple files like frontend)
    upload_url = "http://localhost:5001/api/admin/home-content/images"
    headers = {"Authorization": f"Bearer {token}"}
    
    # Simulate frontend FormData with 'images' field
    try:
        with open('/Users/ahmed_elmasry/SSteal-website/uploads/placeholder_800x600.jpg', 'rb') as f:
            files = {'images': ('test_image.jpg', f, 'image/jpeg')}
            
            print("🔧 Testing upload with 'images' field...")
            response = requests.post(upload_url, headers=headers, files=files)
            
            print(f"Status: {response.status_code}")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_frontend_style_upload()
