# 3D Reconstruction

A Python-based 3D reconstruction project with a modern React interface for creating three-dimensional models from 2D images and point cloud data.

## Overview

This project combines powerful Python computer vision algorithms with a sleek React frontend to provide an intuitive interface for 3D reconstruction tasks. The core reconstruction engine is built in Python, leveraging libraries like OpenCV, NumPy, and other computer vision tools, while the user interface is crafted with React for a responsive web experience.

## Architecture

- **Backend**: Python-based reconstruction algorithms and processing
- **Frontend**: React interface for user interaction and visualization
- **Communication**: RESTful API or WebSocket connection between frontend and backend

## Features

- **Image-based 3D Reconstruction**: Convert multiple 2D images into 3D models
- **Point Cloud Processing**: Advanced point cloud manipulation and visualization
- **Interactive React Interface**: Modern, responsive web UI
- **Real-time Processing**: Live feedback during reconstruction
- **Multiple Input Formats**: Support for various image and data formats
- **Export Options**: Save results in popular 3D formats

## Tech Stack

### Backend (Python)
- **OpenCV**: Computer vision and image processing
- **NumPy**: Numerical computations
- **SciPy**: Scientific computing
- **Matplotlib**: Visualization and plotting
- **Flask/FastAPI**: Web API framework
- **PIL/Pillow**: Image manipulation

### Frontend (React)
- **React**: User interface framework
- **Three.js**: 3D rendering and visualization
- **WebGL**: Hardware-accelerated graphics
- **Axios**: HTTP client for API communication
- **Material-UI/Chakra UI**: Component library

## Installation

### Prerequisites
- Python 3.8+
- Node.js 16+
- pip (Python package manager)
- npm or yarn

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/lewisMVP/3d-reconstruction.git
cd 3d-reconstruction

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt
```

### Frontend Setup

```bash
# Navigate to frontend directory (assuming it exists)
cd frontend  # or wherever your React app is located

# Install dependencies
npm install
```

## Usage

### Starting the Backend

```bash
# Activate virtual environment
source venv/bin/activate

# Start the Python server
python app.py
# or
python -m flask run
```

### Starting the Frontend

```bash
# In a new terminal, navigate to frontend directory
cd frontend

# Start React development server
npm start
```

The application will be available at `http://localhost:3000` (React) with the Python backend running on `http://localhost:5000`.

## API Endpoints

### Core Reconstruction
- `POST /api/reconstruct` - Start 3D reconstruction from images
- `GET /api/status/{job_id}` - Check reconstruction status
- `GET /api/result/{job_id}` - Download reconstruction results

### File Management
- `POST /api/upload` - Upload images for processing
- `GET /api/files` - List uploaded files
- `DELETE /api/files/{file_id}` - Remove files

## Algorithms Implemented

- **Structure from Motion (SfM)**: Extract 3D structure from image sequences
- **Multi-View Stereo (MVS)**: Dense reconstruction from calibrated images
- **SLAM**: Simultaneous Localization and Mapping
- **Point Cloud Registration**: Align multiple point clouds
- **Mesh Generation**: Create triangulated meshes from point clouds
- **Texture Mapping**: Apply textures to 3D models

## Development

### Python Development

```bash
# Install development dependencies
pip install -r requirements-dev.txt

# Run tests
python -m pytest tests/

# Code formatting
black src/
flake8 src/
```

### React Development

```bash
# Run frontend tests
npm test

# Build for production
npm run build

# Lint code
npm run lint
```

## Configuration

Create a `.env` file in the root directory:

```env
# Backend configuration
FLASK_ENV=development
FLASK_APP=app.py
DATABASE_URL=sqlite:///app.db

# Frontend configuration (in frontend/.env)
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ENV=development
```

## Docker Support

```bash
# Build and run with Docker Compose
docker-compose up --build

# Or build individual containers
docker build -t 3d-reconstruction-backend .
docker build -t 3d-reconstruction-frontend ./frontend
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## Performance Optimization

- **GPU Acceleration**: Utilize CUDA for intensive computations
- **Parallel Processing**: Multi-threading for image processing
- **Memory Management**: Efficient handling of large datasets
- **Caching**: Cache intermediate results for faster processing

## Troubleshooting

### Common Issues

1. **OpenCV Installation**: Install system dependencies for OpenCV
2. **Memory Errors**: Reduce image resolution or batch size
3. **CORS Issues**: Configure proper CORS settings in Flask
4. **Port Conflicts**: Change default ports in configuration

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Lewis - [@lewisMVP](https://github.com/lewisMVP)

Project Link: [https://github.com/lewisMVP/3d-reconstruction](https://github.com/lewisMVP/3d-reconstruction)

## Acknowledgments

- OpenCV community for computer vision tools
- React community for frontend framework
- Research papers and academic contributions to 3D reconstruction
- Open source contributors

## Roadmap

- [ ] Add real-time reconstruction capabilities
- [ ] Implement advanced SLAM algorithms
- [ ] Mobile app support
- [ ] Cloud processing integration
- [ ] AR/VR visualization features
- [ ] Machine learning-based improvements

---

*Last updated: August 2025*
