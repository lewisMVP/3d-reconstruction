# 3D Reconstruction Studio

A modern 3D reconstruction application implementing **Neural Radiance Fields (NeRF)** and **Gaussian Splatting** techniques. Built with a Python Flask backend for AI processing and a React frontend for interactive visualization.

<img width="1918" height="949" alt="image" src="https://github.com/user-attachments/assets/f8d37ffa-5d95-49e8-9bda-2b1679fa1d3f" />

## 🚀 Overview

This project combines cutting-edge computer vision algorithms with a sleek web interface to reconstruct 3D scenes from 2D images. The system uses MiDaS for depth estimation and implements both NeRF and Gaussian Splatting methodologies for high-quality 3D reconstruction.

## ✨ Features

- **Neural Radiance Fields (NeRF)**: Volumetric scene reconstruction from multiple viewpoints
- **Gaussian Splatting**: Advanced point cloud generation with realistic rendering
- **Real-time Processing**: Live feedback during reconstruction with performance metrics
- **Interactive 3D Viewer**: Web-based visualization powered by Three.js
- **Multiple Input Support**: Drag-and-drop image upload with HEIC conversion
- **Modern UI**: Clean React interface with Tailwind CSS styling
- **Server Monitoring**: Real-time backend status and performance tracking

## 🏗️ Architecture

```
Frontend (React + Vite)  ←→  Backend (Flask + PyTorch)
     ↓                              ↓
Three.js Viewer          ←→  MiDaS + CLIP Models
     ↓                              ↓
Point Cloud Display      ←→  NeRF/GS Processing
```

## 🛠️ Tech Stack

### Backend
- **Flask**: Web API framework with CORS support
- **PyTorch**: Deep learning framework for model inference
- **MiDaS**: Depth estimation from monocular images
- **CLIP**: Vision-language understanding
- **OpenCV**: Computer vision and image processing
- **NumPy**: Numerical computations for point cloud generation

### Frontend
- **React 18**: Modern UI framework with hooks
- **Vite**: Fast build tool and development server
- **Three.js**: 3D graphics and WebGL rendering
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client for API communication


## 🚀 Installation

### Prerequisites
- Python 3.8+
- Node.js 16+
- PyTorch with CUDA support (recommended)

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/lewisMVP/3d-reconstruction.git
cd 3d-reconstruction

# Set up Python environment
cd server
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install flask flask-cors torch torchvision opencv-python numpy pillow-heif
```

### Frontend Setup

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Install additional packages
npm install axios three @vitejs/plugin-react
```

### Model Setup

Place your pre-trained models in the `server/models/` directory:
- `midas.pt` - MiDaS depth estimation model
- `clip.pt` - CLIP vision-language model

## 🏃‍♂️ Usage

### Start the Backend

```bash
cd server
source venv/bin/activate
python app.py
```
Backend runs on `http://localhost:5000`

### Start the Frontend

```bash
cd client
npm run dev
```
Frontend runs on `http://localhost:5173`

### Using the Application

1. **Upload Images**: Drag and drop images or use the file picker
2. **Select Model**: Choose between NeRF, Gaussian Splatting, or both
3. **Reconstruct**: Click the reconstruct button to process images
4. **Visualize**: View the generated 3D point cloud in the interactive viewer
5. **Monitor**: Track processing performance and server status

## 🎯 API Endpoints

### Reconstruction
```http
POST /reconstruct
Content-Type: multipart/form-data

Form Data:
- images: Multiple image files
- model_type: "nerf", "gaussian_splatting", or "both"

Response:
{
  "success": true,
  "data": {
    "points": [[x, y, z], ...],
    "colors": [[r, g, b], ...]
  }
}
```

## 🔬 Algorithms

### NeRF Implementation
- Uses MiDaS for monocular depth estimation
- Converts depth maps to 3D point clouds
- Samples points at 4-pixel intervals for performance
- Applies camera intrinsics for world coordinate transformation

### Gaussian Splatting
- Generates high-quality point clouds with 15,000+ points
- Creates realistic 3D scenes with proper color distribution
- Optimized for real-time rendering and interaction

## 🎨 Features in Detail

### Image Processing
- **HEIC Support**: Automatic conversion from HEIC to JPG format
- **Multiple Formats**: Support for common image formats
- **Batch Processing**: Handle multiple images simultaneously

### 3D Visualization
- **Interactive Viewer**: Rotate, zoom, and pan through 3D scenes
- **Real-time Rendering**: Smooth 60fps visualization
- **Point Cloud Display**: Colored point clouds with depth information

### Performance Monitoring
- **Live Metrics**: Real-time processing statistics
- **Server Status**: Backend health and model loading status
- **Progress Tracking**: Visual feedback during reconstruction

## 🛠️ Development

### Running in Development Mode

```bash
# Backend with auto-reload
cd server
export FLASK_ENV=development
python app.py

# Frontend with hot reload
cd client
npm run dev
```

### Building for Production

```bash
# Build frontend
cd client
npm run build

# Serve with production Flask server
cd server
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

## 🐛 Troubleshooting

### Common Issues

1. **Model Loading Errors**: Ensure `midas.pt` and `clip.pt` are in `server/models/`
2. **CORS Issues**: Flask-CORS is configured for all origins in development
3. **Memory Issues**: Reduce image resolution or enable GPU acceleration
4. **Port Conflicts**: Backend uses 5000, frontend uses 5173

### HEIC Conversion

If you have HEIC images from iPhone/macOS:

```bash
cd server
python utils/convert_heic.py
```

## 🚀 Future Enhancements

- [ ] Real-time NeRF training
- [ ] Advanced Gaussian Splatting with neural networks
- [ ] Mobile device support
- [ ] Cloud processing integration
- [ ] Export to standard 3D formats (PLY, OBJ)
- [ ] Multi-user collaboration features


## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 👤 Author

**Lewis** - [@lewisMVP](https://github.com/lewisMVP)

Project Link: [https://github.com/lewisMVP/3d-reconstruction](https://github.com/lewisMVP/3d-reconstruction)

## 🙏 Acknowledgments

- MiDaS team for depth estimation models
- CLIP researchers for vision-language models
- NeRF and Gaussian Splatting research communities
- Three.js and React development teams

---

*Built with ❤️ using modern web technologies and cutting-edge AI*
