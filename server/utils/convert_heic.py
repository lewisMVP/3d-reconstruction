import os
from PIL import Image
from pillow_heif import register_heif_opener

# Register HEIF opener with Pillow
register_heif_opener()

def convert_heic_to_jpg(input_dir, output_dir):
    """
    Convert all HEIC images in input directory to JPG format.
    
    Args:
        input_dir (str): Directory containing HEIC images
        output_dir (str): Directory to save converted JPG images
    """
    os.makedirs(output_dir, exist_ok=True)
    
    heic_files = [f for f in os.listdir(input_dir) if f.lower().endswith('.heic')]
    print(f"Found {len(heic_files)} HEIC files to convert")
    
    for i, filename in enumerate(heic_files):
        try:
            # Open HEIC image
            heic_path = os.path.join(input_dir, filename)
            image = Image.open(heic_path)
            
            # Convert to RGB (HEIC might have alpha channel)
            rgb_image = image.convert('RGB')
            
            # Save as JPG
            jpg_filename = os.path.splitext(filename)[0] + '.jpg'
            jpg_path = os.path.join(output_dir, jpg_filename)
            rgb_image.save(jpg_path, 'JPEG', quality=95)
            
            print(f"[{i+1}/{len(heic_files)}] Converted: {filename} → {jpg_filename}")
            
        except Exception as e:
            print(f"Error converting {filename}: {str(e)}")

if __name__ == "__main__":
    # Convert HEIC images to JPG
    input_dir = "../dataset/train"
    output_dir = "../dataset/train_jpg"
    
    convert_heic_to_jpg(input_dir, output_dir)
    print("\nConversion complete! JPG images saved to:", output_dir) 