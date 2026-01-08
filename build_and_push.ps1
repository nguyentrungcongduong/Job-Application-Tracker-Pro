$DOCKER_USERNAME = Read-Host -Prompt "Enter your Docker Hub Username"
$VERSION = "0.9.0"

# 1. Backend
Write-Host "Building Backend..." -ForegroundColor Green
cd backend
docker build -t "$DOCKER_USERNAME/job-tracker-backend:$VERSION" -t "$DOCKER_USERNAME/job-tracker-backend:latest" .
if ($LASTEXITCODE -ne 0) { Write-Error "Backend build failed"; exit }
cd ..

# 2. Frontend
Write-Host "Building Frontend..." -ForegroundColor Green
# Ask for API URL or use default
$API_URL = Read-Host -Prompt "Enter Backend API URL (Public IP/Domain) [e.g., http://54.x.x.x:8080/api/v1]"
if ([string]::IsNullOrWhiteSpace($API_URL)) {
    Write-Error "API URL is required for Frontend build!"
    exit
}

cd frontend
docker build --build-arg VITE_API_URL=$API_URL -t "$DOCKER_USERNAME/job-tracker-frontend:$VERSION" -t "$DOCKER_USERNAME/job-tracker-frontend:latest" .
if ($LASTEXITCODE -ne 0) { Write-Error "Frontend build failed"; exit }
cd ..

# 3. Push
Write-Host "Pushing images to Docker Hub..." -ForegroundColor Cyan
docker push "$DOCKER_USERNAME/job-tracker-backend:$VERSION"
docker push "$DOCKER_USERNAME/job-tracker-backend:latest"
docker push "$DOCKER_USERNAME/job-tracker-frontend:$VERSION"
docker push "$DOCKER_USERNAME/job-tracker-frontend:latest"

Write-Host "Done! Images are live on Docker Hub." -ForegroundColor Green
Write-Host "Now copy 'docker-compose.prod.yml' to your server and run: DOCKER_USERNAME=$DOCKER_USERNAME docker-compose -f docker-compose.prod.yml up -d"
