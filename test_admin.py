#!/usr/bin/env python3
import requests
import json

# Test admin login
def test_admin_login():
    url = "http://localhost:5001/api/admin/login"
    credentials = {
        "username": "admin",
        "password": "admin123"
    }
    
    try:
        response = requests.post(url, json=credentials)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200:
            token = response.json().get('access_token')
            print(f"✅ Login successful! Token: {token[:20]}...")
            return token
        else:
            print("❌ Login failed!")
            return None
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def test_home_content_endpoint(token):
    """Test the home content management endpoint"""
    url = "http://localhost:5001/api/admin/home-content"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    try:
        # Test GET request
        response = requests.get(url, headers=headers)
        print(f"\n--- Home Content GET ---")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
    except Exception as e:
        print(f"❌ Home Content Test Error: {e}")

if __name__ == "__main__":
    print("Testing S-Steel Admin API...")
    token = test_admin_login()
    
    if token:
        test_home_content_endpoint(token)
    else:
        print("Cannot proceed with other tests without valid token")
