#!/usr/bin/env python3
import requests
import json

def get_admin_token():
    """Get admin token for testing"""
    url = "http://localhost:5001/api/admin/login"
    credentials = {
        "username": "admin",
        "password": "admin123"
    }
    
    try:
        response = requests.post(url, json=credentials)
        if response.status_code == 200:
            return response.json().get('access_token')
    except Exception as e:
        print(f"❌ Login error: {e}")
    return None

def test_home_content_description_update(token):
    """Test updating company description"""
    url = "http://localhost:5001/api/admin/home-content/description"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    test_description = "Updated S-Steel Construction description for testing the admin interface functionality."
    
    try:
        response = requests.put(url, json={"description": test_description}, headers=headers)
        print(f"\n--- Update Description ---")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Description update error: {e}")
        return False

def test_home_content_stats_update(token):
    """Test updating company stats"""
    url = "http://localhost:5001/api/admin/home-content/stats"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    test_stats = {
        "yearsExperience": 20,
        "projectsCompleted": 750,
        "teamMembers": 65,
        "clientSatisfaction": 100
    }
    
    try:
        response = requests.put(url, json=test_stats, headers=headers)
        print(f"\n--- Update Stats ---")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Stats update error: {e}")
        return False

def test_projects_endpoint(token):
    """Test projects endpoint"""
    url = "http://localhost:5001/api/admin/projects"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.get(url, headers=headers)
        print(f"\n--- Admin Projects ---")
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            projects = response.json().get('projects', [])
            print(f"Number of projects: {len(projects)}")
        else:
            print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Projects endpoint error: {e}")
        return False

def test_contacts_endpoint(token):
    """Test contacts endpoint"""
    url = "http://localhost:5001/api/admin/contacts"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.get(url, headers=headers)
        print(f"\n--- Admin Contacts ---")
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            contacts = response.json().get('contacts', [])
            print(f"Number of contacts: {len(contacts)}")
        else:
            print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Contacts endpoint error: {e}")
        return False

if __name__ == "__main__":
    print("🔧 Testing S-Steel Admin Interface API Endpoints...")
    
    token = get_admin_token()
    if not token:
        print("❌ Cannot get admin token, stopping tests")
        exit(1)
    
    print("✅ Authentication successful")
    
    # Test all endpoints
    tests = [
        ("Home Content Description Update", lambda: test_home_content_description_update(token)),
        ("Home Content Stats Update", lambda: test_home_content_stats_update(token)),
        ("Projects Endpoint", lambda: test_projects_endpoint(token)),
        ("Contacts Endpoint", lambda: test_contacts_endpoint(token)),
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        try:
            if test_func():
                print(f"✅ {test_name}: PASSED")
                passed += 1
            else:
                print(f"❌ {test_name}: FAILED")
        except Exception as e:
            print(f"❌ {test_name}: ERROR - {e}")
    
    print(f"\n🎯 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All admin API endpoints are working correctly!")
    else:
        print("⚠️  Some tests failed, please check the implementation")
