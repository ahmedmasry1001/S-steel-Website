# Image Upload Paths Guide - S-Steel Construction

## Available Image Paths

### **Option 1: Use the Uploads Folder (Recommended for Dynamic Images)**

#### Path Structure:
```
/Users/ahmed_elmasry/SSteal-website/uploads/
├── gallery/          ← For gallery images
├── projects/         ← For project images
└── [direct files]    ← For other images
```

#### How to Access via Frontend:
```javascript
// Gallery images
http://localhost:5001/uploads/gallery/your-image.jpg

// Project images
http://localhost:5001/uploads/projects/your-image.jpg

// Other images
http://localhost:5001/uploads/your-image.jpg
```

#### Image Format:
```javascript
<img src="http://localhost:5001/uploads/gallery/your-image.jpg" alt="Description" />

// Or with relative path:
<img src="/uploads/gallery/your-image.jpg" alt="Description" />
```

---

### **Option 2: Use Public Folder (For Static Assets)**

#### Path Structure:
```
/Users/ahmed_elmasry/SSteal-website/frontend/public/
├── index.html
├── s-steel-logo.svg          ← Current logo
└── [your files]              ← Add logos/static images here
```

#### How to Access via Frontend:
```javascript
// Static public files
http://localhost:3000/your-image.jpg

// Or direct path (React serves from public):
<img src="/your-image.jpg" alt="Description" />
```

---

## Recommended Setup for Company Logo

### **Option A: Replace/Update the Current Logo**
**File Path:** `/Users/ahmed_elmasry/SSteal-website/frontend/public/s-steel-logo.svg`

If you have an actual company logo image, replace the SVG with your image:

```bash
# Copy your logo to the public folder
cp /path/to/your/company-logo.png /Users/ahmed_elmasry/SSteal-website/frontend/public/s-steel-logo.png

# Then update the image reference in MainLayout.js from .svg to .png
```

### **Option B: Add New Logo File**
**File Path:** `/Users/ahmed_elmasry/SSteal-website/frontend/public/`

```bash
# Copy your logo to public
cp /path/to/your/logo.png /Users/ahmed_elmasry/SSteal-website/frontend/public/company-logo.png
```

Then update the image in MainLayout.js:
```javascript
<img 
  src="/company-logo.png"  // ← Change from s-steel-logo.svg
  alt="S-Steel Logo" 
  className="h-16 w-16 object-contain drop-shadow-md"
/>
```

---

## Current Logo Location

**Current File:** `/Users/ahmed_elmasry/SSteal-website/frontend/public/s-steel-logo.svg`
- This is an SVG (vector graphic)
- Currently used in:
  - Navbar.js (top bar)
  - MainLayout.js (header right side)

---

## Steps to Add Your Real Image

### **Step 1: Prepare Your Image**
- Format: PNG, JPG, JPEG, GIF, or WebP
- Size: Recommend 200x200px or larger for logo
- Ensure it's high quality

### **Step 2: Choose Storage Location**

**For Static Company Logo:**
```
/Users/ahmed_elmasry/SSteal-website/frontend/public/s-steel-logo.png
(Replace the current SVG)
```

**For Dynamic Images (Gallery/Projects):**
```
/Users/ahmed_elmasry/SSteal-website/uploads/gallery/image-name.jpg
/Users/ahmed_elmasry/SSteal-website/uploads/projects/image-name.jpg
```

### **Step 3: Add Image to System**

**Copy via Terminal:**
```bash
# For replacing logo
cp /path/to/your/company-logo.png /Users/ahmed_elmasry/SSteal-website/frontend/public/s-steel-logo.png

# For gallery
cp /path/to/your/image.jpg /Users/ahmed_elmasry/SSteal-website/uploads/gallery/image.jpg

# For projects
cp /path/to/your/image.jpg /Users/ahmed_elmasry/SSteal-website/uploads/projects/image.jpg
```

### **Step 4: Update Frontend Reference (if needed)**

In `/frontend/src/components/MainLayout.js`:
```javascript
<img 
  src="/s-steel-logo.png"  // Change .svg to .png if you're replacing it
  alt="S-Steel Logo" 
  className="h-16 w-16 object-contain drop-shadow-md"
/>
```

---

## File Size Limits

- **Max Upload Size:** 16 MB
- **Recommended:** Keep images under 2 MB for faster loading
- **Optimal Size for Logo:** 500-1000px width

---

## Supported Formats

✅ PNG  
✅ JPG / JPEG  
✅ GIF  
✅ WebP  
❌ SVG (already have one)

---

## Complete Path Examples

### **For Company Logo (Header):**
```
File Location: /Users/ahmed_elmasry/SSteal-website/frontend/public/s-steel-logo.png
Access URL:   http://localhost:3000/s-steel-logo.png
Backend URL:  (Not needed - served by React dev server)
```

### **For Gallery Images:**
```
File Location: /Users/ahmed_elmasry/SSteal-website/uploads/gallery/my-project-1.jpg
Access URL:   http://localhost:5001/uploads/gallery/my-project-1.jpg
React Path:   /uploads/gallery/my-project-1.jpg
```

### **For Project Images:**
```
File Location: /Users/ahmed_elmasry/SSteal-website/uploads/projects/steel-structure.jpg
Access URL:   http://localhost:5001/uploads/projects/steel-structure.jpg
React Path:   /uploads/projects/steel-structure.jpg
```

---

## Summary

| Purpose | File Path | React Path |
|---------|-----------|-----------|
| **Company Logo** | `/frontend/public/s-steel-logo.png` | `/s-steel-logo.png` |
| **Gallery Images** | `/uploads/gallery/image.jpg` | `/uploads/gallery/image.jpg` |
| **Project Images** | `/uploads/projects/image.jpg` | `/uploads/projects/image.jpg` |
| **Other Static Files** | `/frontend/public/file.jpg` | `/file.jpg` |

---

## Ready to Add Images?

1. **Replace the SVG logo:** Copy your image to `/frontend/public/s-steel-logo.png`
2. **Add gallery images:** Copy to `/uploads/gallery/`
3. **Add project images:** Copy to `/uploads/projects/`
4. **Update React components** if needed to reference new paths

Let me know which image you want to add and where! 📸

---

**Last Updated:** January 20, 2026
