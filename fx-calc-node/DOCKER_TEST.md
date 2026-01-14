# Docker Testing Guide

## Current Status

✅ **Docker files created successfully:**
- `Dockerfile` - Multi-stage production-ready image
- `.dockerignore` - Optimized build context
- `docker-compose.yml` - Production deployment
- `docker-compose.dev.yml` - Development with hot reload
- `.env.example` - Environment configuration template

## Prerequisites to Test

You have **Rancher Desktop** installed. Before testing, you need to:

### Step 1: Start Rancher Desktop
1. Open Rancher Desktop application
2. Wait for it to fully start (check system tray icon)
3. Verify it's running by opening PowerShell and running:
   ```powershell
   docker ps
   ```
   You should see an empty list or running containers (not an error)

### Step 2: Test the Docker Setup

Once Rancher Desktop is running, execute these commands:

#### Test 1: Build the Image
```powershell
cd C:\Users\e.hoxha02\Downloads\forex-risk-calculator\fx-calc-node
docker build -t forex-risk-calculator:latest .
```

**Expected output:**
- Multiple build stages executing
- "Successfully built" message
- "Successfully tagged forex-risk-calculator:latest"

#### Test 2: Run the Container
```powershell
docker run -d -p 3000:3000 --name forex-risk-calculator forex-risk-calculator:latest
```

**Expected output:**
- Long container ID (e.g., `abc123def456...`)

#### Test 3: Verify Container is Running
```powershell
docker ps
```

**Expected output:**
- Table showing forex-risk-calculator container with status "Up X seconds"

#### Test 4: Check Application Logs
```powershell
docker logs forex-risk-calculator
```

**Expected output:**
- "Server is running on port 3000"

#### Test 5: Access the Application
Open your browser and navigate to:
```
http://localhost:3000
```

**Expected result:**
- Application loads and redirects to `/calculateLotSize`
- You should see the Lot Size Calculator form

#### Test 6: Test the Calculator
Fill in the form:
- Entry Price: 4444.44
- Stop Loss: 4444.43
- Account Balance: 10000
- Risk Percentage: 1
- Check "Gold/JPY pair"
- Click Calculate

**Expected result:**
- Shows recommended lot size
- Shows 1.00 pips at risk

#### Test 7: Check Health Status
```powershell
docker inspect --format='{{.State.Health.Status}}' forex-risk-calculator
```

**Expected output:**
- "healthy" (may take 10-30 seconds after startup)

#### Test 8: Clean Up
```powershell
# Stop and remove container
docker stop forex-risk-calculator
docker rm forex-risk-calculator

# Optionally remove image
docker rmi forex-risk-calculator:latest
```

### Alternative: Test with Docker Compose

#### Build and Start
```powershell
cd C:\Users\e.hoxha02\Downloads\forex-risk-calculator\fx-calc-node
docker-compose up -d
```

**Expected output:**
- "Creating network..."
- "Building app..."
- "Creating forex-risk-calculator..."
- "done"

#### View Logs
```powershell
docker-compose logs -f
```

**Expected output:**
- "Server is running on port 3000"
- Press Ctrl+C to exit logs

#### Stop
```powershell
docker-compose down
```

## Troubleshooting

### Error: "The system cannot find the file specified"
**Cause:** Rancher Desktop is not running  
**Solution:** Start Rancher Desktop application and wait for it to fully initialize

### Error: "port is already allocated"
**Cause:** Port 3000 is already in use  
**Solution:** 
```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (replace <PID> with actual process ID)
taskkill /PID <PID> /F

# Or use a different port
docker run -d -p 8080:3000 --name forex-risk-calculator forex-risk-calculator:latest
```

### Error: "Cannot connect to the Docker daemon"
**Cause:** Docker service is not running  
**Solution:** 
1. Open Rancher Desktop
2. Go to Settings → Kubernetes → Check "Enable Kubernetes" (optional)
3. Ensure "dockerd (moby)" is selected as container runtime
4. Click "Apply & Restart"

### Container starts but application not accessible
**Cause:** Application error or port mapping issue  
**Solution:**
```powershell
# Check logs for errors
docker logs forex-risk-calculator

# Test from inside container
docker exec forex-risk-calculator wget -O- http://localhost:3000
```

### Health check failing
**Cause:** Application taking too long to start  
**Solution:** Wait 30 seconds and check again. The health check has a 10-second start period.

## Test Results Checklist

Once you've completed testing, verify:

- [ ] Image builds successfully without errors
- [ ] Container starts and stays running (not restarting)
- [ ] Application accessible at http://localhost:3000
- [ ] Form submission works correctly
- [ ] Pip calculation is accurate (1 pip for 4444.44 - 4444.43)
- [ ] Health check shows "healthy" status
- [ ] Container stops cleanly without errors
- [ ] Docker Compose works (optional but recommended)

## Production Deployment Verification

Before deploying to production, ensure:

- [ ] `.env` file created with production values
- [ ] Port configuration matches your infrastructure
- [ ] Health checks configured in your orchestrator
- [ ] Logging configured for production monitoring
- [ ] Resource limits set (CPU/Memory)
- [ ] Security scanning completed on image
- [ ] Backup strategy for any persistent data

## Next Steps After Successful Testing

1. **Tag for version control:**
   ```powershell
   docker tag forex-risk-calculator:latest forex-risk-calculator:v1.0.0
   ```

2. **Push to container registry:**
   ```powershell
   # Docker Hub example
   docker tag forex-risk-calculator:latest yourusername/forex-risk-calculator:latest
   docker push yourusername/forex-risk-calculator:latest
   ```

3. **Deploy to cloud platform** (see DOCKER_README.md for specific instructions)

## Summary

Your Docker setup includes:
- ✅ Optimized multi-stage Dockerfile
- ✅ Security best practices (non-root user, Alpine base)
- ✅ Health checks for monitoring
- ✅ Development and production configurations
- ✅ Docker Compose for easy orchestration
- ✅ Comprehensive documentation

**Status:** Ready for testing once Rancher Desktop is started!

