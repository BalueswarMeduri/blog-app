**Blogify – MERN Blog Application**
Blogify is a full-stack MERN Blog Application built with modern tools and fully Dockerized for production.

**Key Features:**
Blog creation & editing
Categories management
Comments & likes system
AI-powered content features
Production-ready Docker setup

**Tech Stack**
**Frontend**
React + Vite
Tailwind CSS
Served via Nginx

**Backend**
Node.js
Express.js
MongoDB
JWT Authentication
ImageKit (for image uploads)

**DevOps**
Docker & Docker Compose
CI/CD with GitHub Actions

Multi-stage builds
Docker Hub public images
Production-ready configuration

🐳 **Docker Images (Public)**
🔹 Backend API
balumeduri/my-blog-api:v1.0

🔹 Frontend Client
balumeduri/my-blog-client:v1.0

Note: These images are publicly available on Docker Hub.

✅ **Method 1: Run using Docker Compose (Recommended)**
This is the easiest and cleanest way to run the full application.

📁 Step 1: Create a project folder
bash
mkdir blog-app
cd blog-app
📄 Step 2: Create docker-compose.yml
yaml
services:
  api:
    image: balumeduri/my-blog-api:v1.0
    ports:
      - "3000:3000"
    environment:
      PORT: 3000
      FRONTEND_URL: http://localhost
      MONGO: <your-mongodb-url>
      JWT_SECRET: <your-jwt-secret>
      NODE_ENV: production
      IMAGEKIT_PUBLIC_KEY: <your-imagekit-public-key>
      IMAGEKIT_URL_ENDPOINT: <your-imagekit-url-endpoint>
      IMAGEKIT_PRIVATE_KEY: <your-imagekit-private-key>

  client:
    image: balumeduri/my-blog-client:v1.0
    ports:
      - "80:80"
    depends_on:
      - api
⚠️ Important: Replace all <...> values with your actual credentials.

▶️ Step 3: Pull & Run containers
bash
docker compose pull
docker compose up -d
🌐 Access the Application
Service	URL
Website	http://localhost
Backend API	http://localhost:3000
🎉 That's it! Blogify is live.



**Future Enhancements**
Kubernetes 
Auto scaling
Monitoring (Prometheus + Grafana)
HTTPS with Nginx & SSL

📦 Docker Hub:
https://hub.docker.com/u/balumeduri
