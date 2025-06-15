import os
import cv2
import numpy as np

def resize_images(input_dir, output_dir, size=(256, 256)):
    """
    Resize images from input directory to specified size and save to output directory.
    
    Args:
        input_dir (str): Directory containing input JPG images.
        output_dir (str): Directory to save resized images.
        size (tuple): Target size (width, height) in pixels, default (256, 256).
    """
    os.makedirs(output_dir, exist_ok=True)
    for img_name in os.listdir(input_dir):
        if img_name.lower().endswith('.jpg'):
            input_path = os.path.join(input_dir, img_name)
            img = cv2.imread(input_path)
            if img is not None:
                img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
                img_resized = cv2.resize(img, size, interpolation=cv2.INTER_AREA)
                output_path = os.path.join(output_dir, img_name)
                cv2.imwrite(output_path, img_resized)
                print(f"Resized and saved: {img_name}")
            else:
                print(f"Failed to load: {img_name}")

# Sử dụng hàm
if __name__ == "__main__":
    input_dir = "../dataset/train/"  # Thư mục chứa ảnh JPG sau khi chuyển đổi
    output_dir = "../dataset/train_processed/"  # Thư mục lưu ảnh đã resize
    resize_images(input_dir, output_dir)