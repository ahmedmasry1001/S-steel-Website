#!/usr/bin/env python3
"""
Remove black background from PNG logo and make it more visible
"""
from PIL import Image
import os

input_path = '/Users/ahmed_elmasry/SSteal-website/frontend/public/s-steel-logo.png'
output_path = '/Users/ahmed_elmasry/SSteal-website/frontend/public/s-steel-logo.png'

# Open the image
img = Image.open(input_path)

# Convert to RGBA if not already
if img.mode != 'RGBA':
    img = img.convert('RGBA')

# Get image data
data = img.getdata()

# Create new image data
new_data = []
for item in data:
    # If pixel is black or very dark (R, G, B all < 30), make it transparent
    if item[0] < 30 and item[1] < 30 and item[2] < 30:
        # Make transparent
        new_data.append((255, 255, 255, 0))
    else:
        # Keep original pixel
        new_data.append(item)

# Update image with new data
img.putdata(new_data)

# Save the processed image
img.save(output_path, 'PNG')
print(f"✅ Successfully processed logo!")
print(f"✅ Black background removed")
print(f"✅ Image saved to: {output_path}")
print(f"✅ Image size: {img.size}")
