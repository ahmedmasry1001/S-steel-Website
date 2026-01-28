#!/usr/bin/env python3
"""
Test script for contact management functionality
Tests the new PATCH and DELETE endpoints
"""

import requests
import json
from datetime import datetime

# Configuration
BASE_URL = "http://localhost:5001"
ADMIN_TOKEN = "YOUR_ADMIN_TOKEN_HERE"  # Replace with actual token

HEADERS = {
    "Authorization": f"Bearer {ADMIN_TOKEN}",
    "Content-Type": "application/json"
}

def test_get_contacts():
    """Test getting all contacts"""
    print("\n" + "="*60)
    print("TEST 1: Get All Contacts")
    print("="*60)
    
    try:
        response = requests.get(
            f"{BASE_URL}/api/admin/contacts",
            headers=HEADERS
        )
        print(f"Status: {response.status_code}")
        if response.ok:
            contacts = response.json()
            print(f"✓ Retrieved {len(contacts)} contact(s)")
            if contacts:
                first = contacts[0]
                print(f"\nFirst contact:")
                print(f"  ID: {first.get('id')}")
                print(f"  Name: {first.get('name')}")
                print(f"  Email: {first.get('email')}")
                print(f"  Status: {first.get('status')}")
                return first.get('id')
        else:
            print(f"✗ Error: {response.text}")
        return None
    except Exception as e:
        print(f"✗ Exception: {e}")
        return None

def test_update_status(contact_id, new_status):
    """Test updating contact status"""
    print("\n" + "="*60)
    print(f"TEST 2: Update Contact Status (ID: {contact_id})")
    print("="*60)
    
    try:
        payload = {"status": new_status}
        response = requests.patch(
            f"{BASE_URL}/api/admin/contacts/{contact_id}/status",
            headers=HEADERS,
            json=payload
        )
        print(f"Status: {response.status_code}")
        if response.ok:
            contact = response.json()
            print(f"✓ Status updated to '{contact.get('status')}'")
            print(f"  Updated contact:")
            print(f"    ID: {contact.get('id')}")
            print(f"    Name: {contact.get('name')}")
            print(f"    Status: {contact.get('status')}")
            return True
        else:
            print(f"✗ Error: {response.text}")
            return False
    except Exception as e:
        print(f"✗ Exception: {e}")
        return False

def test_delete_contact(contact_id):
    """Test deleting a contact"""
    print("\n" + "="*60)
    print(f"TEST 3: Delete Contact (ID: {contact_id})")
    print("="*60)
    
    try:
        response = requests.delete(
            f"{BASE_URL}/api/admin/contacts/{contact_id}",
            headers=HEADERS
        )
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"✓ {result.get('message')}")
            return True
        elif response.status_code == 404:
            print(f"✗ Contact not found")
            return False
        else:
            print(f"✗ Error: {response.text}")
            return False
    except Exception as e:
        print(f"✗ Exception: {e}")
        return False

def test_invalid_status(contact_id):
    """Test updating with invalid status"""
    print("\n" + "="*60)
    print(f"TEST 4: Invalid Status Update (ID: {contact_id})")
    print("="*60)
    
    try:
        payload = {"status": "invalid_status"}
        response = requests.patch(
            f"{BASE_URL}/api/admin/contacts/{contact_id}/status",
            headers=HEADERS,
            json=payload
        )
        print(f"Status: {response.status_code}")
        if response.status_code == 400:
            print(f"✓ Invalid status properly rejected")
            print(f"  Error: {response.json().get('error')}")
            return True
        else:
            print(f"✗ Expected 400, got {response.status_code}")
            return False
    except Exception as e:
        print(f"✗ Exception: {e}")
        return False

def test_nonexistent_contact():
    """Test accessing non-existent contact"""
    print("\n" + "="*60)
    print("TEST 5: Non-existent Contact")
    print("="*60)
    
    try:
        response = requests.patch(
            f"{BASE_URL}/api/admin/contacts/99999/status",
            headers=HEADERS,
            json={"status": "replied"}
        )
        print(f"Status: {response.status_code}")
        if response.status_code == 404:
            print(f"✓ Non-existent contact properly rejected")
            print(f"  Error: {response.json().get('error')}")
            return True
        else:
            print(f"✗ Expected 404, got {response.status_code}")
            return False
    except Exception as e:
        print(f"✗ Exception: {e}")
        return False

def run_all_tests():
    """Run all tests"""
    print("\n" + "="*60)
    print("CONTACT MANAGEMENT API TEST SUITE")
    print(f"Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("="*60)
    
    # Get a contact to test with
    contact_id = test_get_contacts()
    
    if contact_id:
        # Test valid status update
        test_update_status(contact_id, "replied")
        
        # Test another status update
        test_update_status(contact_id, "archived")
        
        # Test invalid status
        test_invalid_status(contact_id)
    
    # Test non-existent contact
    test_nonexistent_contact()
    
    # Uncomment below to test deletion
    # if contact_id:
    #     test_delete_contact(contact_id)
    
    print("\n" + "="*60)
    print(f"Tests completed: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("="*60)

if __name__ == "__main__":
    print("\nIMPORTANT: Set ADMIN_TOKEN before running tests!")
    print("Update the ADMIN_TOKEN variable with a valid JWT token.")
    print("\nTo get a token, login to the admin panel and check localStorage['admin_token']")
    
    # Uncomment to run tests
    # run_all_tests()
