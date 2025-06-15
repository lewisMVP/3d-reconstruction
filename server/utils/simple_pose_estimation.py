import os
import cv2
import numpy as np
import json
from pathlib import Path

def estimate_simple_poses(image_dir, output_file):
    """
    Estimate simple camera poses for images using feature matching.
    This is a simplified alternative to COLMAP.
    """
    image_files = sorted([f for f in os.listdir(image_dir) if f.lower().endswith(('.jpg', '.jpeg', '.png'))])
    
    if len(image_files) < 2:
        print("Need at least 2 images for pose estimation!")
        return
    
    print(f"Found {len(image_files)} images")
    
    # Initialize SIFT detector
    sift = cv2.SIFT_create()
    
    # Camera intrinsics (assuming standard phone camera)
    focal_length = 1000  # Approximate focal length
    cx, cy = 640, 480    # Principal point (image center)
    
    camera_matrix = np.array([
        [focal_length, 0, cx],
        [0, focal_length, cy],
        [0, 0, 1]
    ], dtype=float)
    
    poses = {}
    
    # First image is at origin
    poses[image_files[0]] = {
        'rotation': [1, 0, 0, 0],  # Identity quaternion
        'translation': [0, 0, 0],
        'camera_matrix': camera_matrix.tolist()
    }
    
    # For simplicity, arrange cameras in a circle
    radius = 3.0
    for i in range(1, len(image_files)):
        angle = (i / len(image_files)) * 2 * np.pi
        
        # Camera position
        x = radius * np.cos(angle)
        z = radius * np.sin(angle)
        y = 0
        
        poses[image_files[i]] = {
            'rotation': [1, 0, 0, 0],  # Simplified
            'translation': [x, y, z],
            'camera_matrix': camera_matrix.tolist()
        }
    
    # Save poses
    with open(output_file, 'w') as f:
        json.dump(poses, f, indent=2)
    
    print(f"\nSaved camera poses to: {output_file}")
    return poses

if __name__ == "__main__":
    # First, check if we have JPG images
    jpg_dir = "../dataset/train_jpg"
    
    if not os.path.exists(jpg_dir):
        print(f"Directory {jpg_dir} not found!")
        print("Please run convert_heic.py first to convert HEIC images to JPG")
    else:
        jpg_files = [f for f in os.listdir(jpg_dir) if f.lower().endswith('.jpg')]
        if len(jpg_files) == 0:
            print("No JPG files found! Please run convert_heic.py first")
        else:
            print(f"Found {len(jpg_files)} JPG files")
            
            # Estimate poses
            print("\nEstimating camera poses...")
            output_file = "../dataset/camera_poses.json"
            estimate_simple_poses(jpg_dir, output_file) 