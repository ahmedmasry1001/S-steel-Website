# Contact Management - Manual Testing Guide

## Prerequisites
- Admin panel is running (localhost:3000 or similar)
- Backend API is running (localhost:5001)
- You are logged in as an admin
- There are contact messages in the database

## Test Scenarios

### 1. Status Change Functionality

**Objective:** Verify that contact status can be changed and persists

**Steps:**
1. Navigate to Admin → Contact Messages
2. Locate a contact with status "New"
3. Click the status dropdown for that contact
4. Change status from "New" to "Replied"
5. **Expected Result:** 
   - Toast notification: "Contact status updated"
   - Status badge changes to "Replied"
   - Status persists after page refresh
   - Dropdown shows correct current status

**Variations:**
- Test all status transitions:
  - New → Replied → Archived
  - Replied → New
  - Archived → New
  - etc.

---

### 2. Email Reply Functionality

**Objective:** Verify that email reply link works with special characters

**Steps:**
1. Navigate to Admin → Contact Messages
2. Click the eye icon on any contact to open details modal
3. Click "Reply via Email" button
4. **Expected Result:**
   - Default email client opens
   - Email address is pre-filled in "To:" field
   - Subject line shows: "Re: [Original Subject]"
   - Subject line is properly formatted (no broken characters)

**Test Cases with Special Characters:**
Create test contacts with these subjects:
- "Warehouse (10,000 sq ft) - Quote Request"
- "Steel Frame: Load-bearing Analysis"
- "Building Code Questions & Compliance"
- "Project #2024-001: Steel Fabrication"

Each should open email with properly formatted subject.

---

### 3. Contact Deletion

**Objective:** Verify that contacts can be deleted with confirmation

**Steps:**
1. Navigate to Admin → Contact Messages
2. Click the trash icon on a contact
3. **Expected Result:**
   - Confirmation dialog appears: "Are you sure you want to delete this contact?"
4. Click "OK" in confirmation
5. **Expected Result:**
   - Toast notification: "Contact deleted successfully"
   - Contact is removed from the list
   - List is updated immediately

**Edge Case:**
- Click trash icon, then click "Cancel" in confirmation
- **Expected Result:** Contact remains in list, no changes

---

### 4. Error Handling - Session Expired

**Objective:** Verify proper error messages when session is invalid

**Steps:**
1. Open browser DevTools Console
2. Run: `localStorage.removeItem('admin_token')`
3. Try to change a contact status or delete a contact
4. **Expected Result:**
   - Toast error: "Session expired. Please login again."
   - Contact is not modified

---

### 5. Error Handling - Invalid Data

**Objective:** Verify backend validates status values

**Steps:**
1. Open browser DevTools (F12)
2. Go to Network tab
3. Change a contact status
4. Find the PATCH request to `/api/admin/contacts/{id}/status`
5. **Expected Result:**
   - Status code: 200
   - Response includes updated contact with new status
   - Response headers include appropriate CORS headers

**Manual Test (Advanced):**
Using curl or Postman:
```bash
curl -X PATCH http://localhost:5001/api/admin/contacts/1/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"status": "invalid"}'
```
**Expected Result:**
- Status code: 400
- Response: `{"error": "Invalid status"}`

---

### 6. Search and Filter After Status Change

**Objective:** Verify filters work correctly with updated statuses

**Steps:**
1. Change a contact's status from "New" to "Replied"
2. Use Status Filter dropdown to show "New" only
3. **Expected Result:**
   - Previously changed contact is no longer visible
4. Change filter to "Replied"
5. **Expected Result:**
   - Previously changed contact is now visible

---

### 7. Bulk Status Management

**Objective:** Verify multiple status changes work correctly

**Steps:**
1. Open Contact Messages page
2. Change status of Contact A from "New" to "Replied"
3. Change status of Contact B from "New" to "Archived"
4. Change status of Contact C from "Replied" to "New"
5. **Expected Result:**
   - All changes persist independently
   - Each shows appropriate toast notification
   - Filter shows correct contacts for each status

---

## API Testing (Advanced)

### Using Curl

**Get all contacts:**
```bash
curl http://localhost:5001/api/admin/contacts \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Update status:**
```bash
curl -X PATCH http://localhost:5001/api/admin/contacts/1/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"status": "replied"}'
```

**Delete contact:**
```bash
curl -X DELETE http://localhost:5001/api/admin/contacts/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Expected Responses

**Status update - Success:**
```json
{
  "id": 1,
  "name": "John Smith",
  "email": "john@example.com",
  "phone": "+1 (555) 123-4567",
  "company": "Acme Corp",
  "message": "I need a quote...",
  "status": "replied",
  "created_at": "2024-01-15T10:30:00"
}
```

**Status update - Invalid:**
```json
{
  "error": "Invalid status"
}
```

**Delete - Success:**
```json
{
  "message": "Contact deleted successfully"
}
```

**Delete - Not found:**
```json
{
  "error": "Contact not found"
}
```

---

## Browser Console Checks

Open DevTools Console (F12) while testing:

**Check for errors:**
- Should see no JavaScript errors
- Check Network tab for failed requests (red)
- All API calls should return 200 or 404 (not 500)

**Monitor requests:**
```javascript
// In Console, you can monitor fetch calls:
// Look for successful PATCH and DELETE requests
```

---

## Checklist for Testing

- [ ] Status changes update UI immediately
- [ ] Status changes persist after page refresh
- [ ] Status filter works after changes
- [ ] Email reply opens with correct subject
- [ ] Special characters in subject are encoded properly
- [ ] Delete confirmation dialog appears
- [ ] Contacts are removed after deletion
- [ ] Toast notifications appear for all actions
- [ ] Error messages are user-friendly
- [ ] No JavaScript errors in console
- [ ] All API requests complete successfully
- [ ] Session expiration is handled gracefully

---

## Common Issues and Solutions

### Issue: "Status didn't change"
**Solution:** 
- Check Network tab for failed PATCH request
- Verify admin_token is valid
- Check backend logs for errors
- Ensure contact ID is correct

### Issue: "Email client doesn't open"
**Solution:**
- Verify email client is set as default
- Check mailto: link in browser address bar
- Try different email subject with/without special chars

### Issue: "Deleted contact still appears"
**Solution:**
- Force page refresh (Ctrl+F5)
- Check if DELETE request succeeded (Status 200)
- Check browser console for errors

### Issue: "Toast notifications not showing"
**Solution:**
- Verify react-toastify is properly installed
- Check if toast container is mounted in app
- Open browser console for any error messages

---

## Performance Notes

- Status changes should complete in <500ms
- Deletion should complete in <1s
- UI should remain responsive during operations
- No noticeable lag when filtering after changes
