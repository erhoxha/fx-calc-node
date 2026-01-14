# Docker Deployment Guide

This guide explains how to build and deploy the Forex Risk Calculator using Docker.

## Prerequisites

- Docker installed on your system (Docker Desktop or Rancher Desktop)
- Docker Compose (optional, but recommended)
- **Note:** If using Rancher Desktop, ensure it's running before executing Docker commands

> 📋 **First time testing?** See [DOCKER_TEST.md](DOCKER_TEST.md) for a complete testing guide with step-by-step verification.

## Quick Start

### Option 1: Using Docker Compose (Recommended)

#### Production Mode
```bash
# Build and start the container
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the container
docker-compose down
```

#### Development Mode (with hot reload)
```bash
# Build and start in development mode
docker-compose -f docker-compose.dev.yml up

# Stop the container
docker-compose -f docker-compose.dev.yml down
```

### Option 2: Using Docker CLI

#### Build the image
```bash
docker build -t forex-risk-calculator:latest .
```

#### Run the container
```bash
docker run -d \
  --name forex-risk-calculator \
  -p 3000:3000 \
  -e NODE_ENV=production \
  forex-risk-calculator:latest
```

#### Stop and remove the container
```bash
docker stop forex-risk-calculator
docker rm forex-risk-calculator
```

## Configuration

### Environment Variables

Copy `.env.example` to `.env` and adjust as needed:
```bash
cp .env.example .env
```

Key variables:
- `PORT`: Application port (default: 3000)
- `NODE_ENV`: Environment mode (production/development)

### Port Configuration

The application runs on port 3000 by default. To change the port mapping:

```bash
# Map to different host port (e.g., 8080)
docker run -p 8080:3000 forex-risk-calculator:latest
```

## Docker Commands Reference

### View running containers
```bash
docker ps
```

### View logs
```bash
docker logs forex-risk-calculator

# Follow logs
docker logs -f forex-risk-calculator
```

### Execute commands in container
```bash
docker exec -it forex-risk-calculator sh
```

### Check container health
```bash
docker inspect --format='{{.State.Health.Status}}' forex-risk-calculator
```

### Remove image
```bash
docker rmi forex-risk-calculator:latest
```

### Clean up unused resources
```bash
docker system prune -a
```

## Deployment

### Cloud Platforms

#### AWS ECS/Fargate
1. Push image to ECR:
```bash
aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <account-id>.dkr.ecr.<region>.amazonaws.com
docker tag forex-risk-calculator:latest <account-id>.dkr.ecr.<region>.amazonaws.com/forex-risk-calculator:latest
docker push <account-id>.dkr.ecr.<region>.amazonaws.com/forex-risk-calculator:latest
```

#### Google Cloud Run
```bash
gcloud builds submit --tag gcr.io/<project-id>/forex-risk-calculator
gcloud run deploy forex-risk-calculator --image gcr.io/<project-id>/forex-risk-calculator --platform managed
```

#### Azure Container Instances
```bash
az acr build --registry <registry-name> --image forex-risk-calculator:latest .
az container create --resource-group <rg-name> --name forex-risk-calculator --image <registry-name>.azurecr.io/forex-risk-calculator:latest --dns-name-label forex-calc --ports 3000
```

#### DigitalOcean App Platform
1. Push to Docker Hub or DigitalOcean Container Registry
2. Create app via UI or doctl CLI

## Security Features

- **Non-root user**: Application runs as unprivileged user (nodejs)
- **Alpine Linux**: Minimal base image reduces attack surface
- **Production dependencies only**: Dev dependencies excluded from production image
- **Health checks**: Container monitoring for automatic restarts

## Troubleshooting

### Container won't start
```bash
# Check logs
docker logs forex-risk-calculator

# Verify port is not in use
netstat -ano | findstr :3000  # Windows
lsof -i :3000                 # Linux/Mac
```

### Application not accessible
```bash
# Verify container is running
docker ps

# Check health status
docker inspect forex-risk-calculator | grep -A 10 Health

# Test from inside container
docker exec forex-risk-calculator wget -O- http://localhost:3000
```

### Rebuild without cache
```bash
docker build --no-cache -t forex-risk-calculator:latest .
```

## Multi-Architecture Support

Build for multiple platforms (ARM64/AMD64):
```bash
docker buildx create --use
docker buildx build --platform linux/amd64,linux/arm64 -t forex-risk-calculator:latest .
```

## Access the Application

Once running, access the application at:
- Local: http://localhost:3000
- Container IP: http://<container-ip>:3000

The application will automatically redirect to `/calculateLotSize`.

