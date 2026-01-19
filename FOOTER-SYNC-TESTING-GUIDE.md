# Testing Guide: Footer & Contact Information Sync

## 📋 Test Scenario Overview

This guide will help you verify that the footer and contact information synchronization system is working correctly.

---

## 🧪 Test 1: Verify Frontend Components Load Correctly

### Step 1.1: Check Navbar Contact Bar
**URL:** http://localhost:3000

**What to look for:**
- [ ] Blue contact bar at the TOP of the page (above main navigation)
- [ ] Shows phone number: `002‏0101 2654017‏` (or your company phone)
- [ ] Shows email: `sameh.hafez@s-steel.net` (or your company email)
- [ ] Shows tagline: "⚡ Get your steel construction quote today!"
- [ ] Links are clickable (tel: and mailto:)

**Expected Result:** ✅ Blue contact bar visible with dynamic data

---

## 🧪 Test 2: Verify Footer Contact Information

**URL:** http://localhost:3000 (scroll to bottom)

**What to look for in Footer:**
- [ ] **Address:** "123 Steel Industry Blvd, Industrial City" with 📍 icon
- [ ] **Phone:** "+1 (555) 123-4567" with 📞 icon (clickable tel link)
- [ ] **Fax:** "+1 (555) 123-4568" (if configured)
- [ ] **Email:** "info@s-steel.com" with 📧 icon (clickable mailto link)
- [ ] **Website:** "www.s-steel.com" with 🌐 icon (clickable link)
- [ ] **Certifications Section:**
  - ✅ ISO 9001:2015 Certified
  - ✅ OSHA Compliant
  - ✅ AWS Certified Welders

**Expected Result:** ✅ All contact information displayed correctly

---

## 🧪 Test 3: Verify API Endpoint

### Step 3.1: Test Public Endpoint
**Command:**
```bash
curl http://localhost:5001/api/company-info | jq '.'
```

**Expected Response:** Should return JSON with all footer fields:
- `footer_address`
- `footer_phone`
- `footer_fax`
- `footer_email`
- `footer_website`
- `footer_facebook` (empty string if not set)
- `footer_twitter` (empty string if not set)
- `footer_instagram` (empty string if not set)
- `footer_linkedin` (empty string if not set)
- `footer_certification_iso` (true/false)
- `footer_certification_osha` (true/false)
- `footer_certification_aws` (true/false)

**Expected Result:** ✅ All footer fields present in response

---

## 🧪 Test 4: Admin Panel - Edit Footer Information

### Step 4.1: Login to Admin Panel
**URL:** http://localhost:3000/admin

- Username: `admin`
- Password: `password123`

**Expected Result:** ✅ Redirected to dashboard

### Step 4.2: Navigate to Company Settings
- Click on "Settings" in the sidebar
- Select "Company Settings"

**Expected Result:** ✅ Company Settings page loads

### Step 4.3: Open Footer Information Tab
- Look for three tabs: "Company Info" | "Contact & Support" | "Footer Information"
- Click on "Footer Information" tab

**Expected Result:** ✅ Footer Information section appears with forms for:
1. **Footer Contact Information**
   - 📍 Address field
   - 📞 Phone field
   - 📠 Fax field
   - 📧 Email field
   - 🌐 Website field

2. **Social Media Links**
   - 📘 Facebook URL
   - 🐦 Twitter URL
   - 📷 Instagram URL
   - 💼 LinkedIn URL

3. **Certifications & Compliance**
   - ✅ ISO 9001:2015 Certified (checkbox)
   - ✅ OSHA Compliant (checkbox)
   - ✅ AWS Certified Welders (checkbox)

---

## 🧪 Test 5: Edit and Save Footer Information

### Step 5.1: Change Address
1. In the "📍 Address" field, change the value to: `999 Test Street, Test City`
2. Click "Save Changes" button
3. Wait for success toast notification

**Expected Result:** ✅ Green toast: "Footer information updated successfully!"

### Step 5.2: Change Phone Number
1. In the "📞 Phone" field, change to: `+1 (999) 999-9999`
2. Click "Save Changes"

**Expected Result:** ✅ Success notification

### Step 5.3: Add Social Media Links
1. In the "📘 Facebook URL" field, enter: `https://facebook.com/ssteel`
2. In the "💼 LinkedIn URL" field, enter: `https://linkedin.com/company/ssteel`
3. Click "Save Changes"

**Expected Result:** ✅ Success notification

### Step 5.4: Uncheck Certifications
1. Uncheck "✅ AWS Certified Welders"
2. Click "Save Changes"

**Expected Result:** ✅ Success notification

---

## 🧪 Test 6: Verify Changes on Website (Real-time Sync)

### Step 6.1: Check Navbar
**URL:** http://localhost:3000

- [ ] Phone number updated to: `+1 (999) 999-9999`
- [ ] Email still shows company email

**Expected Result:** ✅ Phone updated immediately without page reload

### Step 6.2: Check Footer
**Scroll to bottom of page**

- [ ] Address shows: "999 Test Street, Test City"
- [ ] Phone shows: "+1 (999) 999-9999"
- [ ] New social links appear:
  - 📘 Facebook link is clickable
  - 💼 LinkedIn link is clickable
- [ ] AWS Certified Welders is NO LONGER visible in certifications
- [ ] ISO and OSHA certifications still visible

**Expected Result:** ✅ All changes reflected in real-time

---

## 🧪 Test 7: Verify Link Functionality

### Step 7.1: Test Phone Link
- Click on phone number in navbar or footer
- Expected: Should open phone dialer (or show tel: protocol handler)

### Step 7.2: Test Email Link
- Click on email in navbar or footer
- Expected: Should open email client

### Step 7.3: Test Social Links
- Click on Facebook link in footer
- Expected: Should open Facebook page in new tab

### Step 7.4: Test Website Link
- Click on website URL in footer
- Expected: Should open website in new tab

**Expected Result:** ✅ All links functional

---

## 🧪 Test 8: Verify API Reflects Changes

After making changes in admin:

**Command:**
```bash
curl http://localhost:5001/api/company-info | jq '.footer_phone'
```

**Expected Result:** Should show: `"+1 (999) 999-9999"`

---

## 🧪 Test 9: Revert Changes

### Step 9.1: Reset to Original Values
1. Go back to Admin → Company Settings → Footer Information
2. Change values back to:
   - Address: "123 Steel Industry Blvd, Industrial City"
   - Phone: "+1 (555) 123-4567"
   - Remove social links (clear the fields)
   - Check "AWS Certified Welders" again
3. Click "Save Changes"

**Expected Result:** ✅ Website updates to show original values

---

## ✅ FINAL VERIFICATION CHECKLIST

### Frontend Components
- [ ] Navbar contact bar displays correctly
- [ ] Footer contact information displays correctly
- [ ] Social links only show when configured
- [ ] Certifications only show when enabled
- [ ] All links are functional (tel, mailto, http)
- [ ] Responsive design maintained (test on mobile)

### Admin Panel
- [ ] Can access Company Settings
- [ ] Footer Information tab is visible
- [ ] Can edit all footer fields
- [ ] Save button works with success notification
- [ ] Can add/remove social media links
- [ ] Can toggle certifications

### Data Synchronization
- [ ] Changes saved to database
- [ ] API endpoint returns updated data
- [ ] Website reflects changes immediately
- [ ] No page reload needed
- [ ] Changes persistent after refresh

### API Endpoints
- [ ] GET /api/company-info returns all fields
- [ ] GET /api/admin/company-settings returns all fields (requires auth)
- [ ] PUT /api/admin/company-settings saves all fields (requires auth)

---

## 📊 Test Summary

**Total Tests:** 9
**Expected Pass Rate:** 100%

If all tests pass with ✅, the footer and contact information synchronization system is fully functional!

---

## 🐛 Troubleshooting

### Issue: Changes not appearing on website
- [ ] Check browser cache (Ctrl+Shift+Delete)
- [ ] Verify backend is running (port 5001)
- [ ] Check browser console for errors (F12)
- [ ] Verify API endpoint: `curl http://localhost:5001/api/company-info`

### Issue: Admin save button not working
- [ ] Check network tab (F12) for failed requests
- [ ] Verify auth token is valid (login again)
- [ ] Check backend logs for errors

### Issue: Links not clickable
- [ ] Verify data is being returned from API
- [ ] Check that URLs are properly formatted
- [ ] Open browser console (F12) for errors

### Issue: Social media or certifications not showing
- [ ] Make sure checkbox is actually checked
- [ ] Verify the boolean value is `true` in API response
- [ ] Clear browser cache and refresh

---

## 📞 Support

For issues or questions about this implementation, refer to:
- `FOOTER-SYNC-IMPLEMENTATION.md` - Implementation details
- `DATA-SYNC-COMPLETE.md` - General synchronization overview
- Backend logs: `/tmp/backend.log`
- Frontend console: Open DevTools (F12)

---

**Testing Status: Ready to Begin ✅**
