# Simple Local Testing Setup
# 1. Start backend first
# 2. This script will register test users via API

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Job Tracker - Local Test User Setup" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

$BackendURL = "http://localhost:8080"

# Test 1: Health check
Write-Host "[1/4] Checking backend..." -ForegroundColor Yellow
try {
    $health = Invoke-WebRequest -Uri "$BackendURL/actuator/health" -TimeoutSec 5 -ErrorAction Stop
    Write-Host "✅ Backend is UP" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend is DOWN - Start backend first!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Run this in another terminal:" -ForegroundColor Yellow
    Write-Host 'java -jar "d:\project\Job-Application-Tracker-Pro\backend\target\backend-0.0.1-SNAPSHOT.jar"' -ForegroundColor Cyan
    exit 1
}

Write-Host ""

# Test user data
$testUsers = @(
    @{
        name = "Test User"
        email = "verified@example.com"
        password = "Password@123"
    },
    @{
        name = "Admin User"
        email = "admin@jobtracker.com"
        password = "AdminPass@123"
    },
    @{
        name = "Test User 2"
        email = "test@example.com"
        password = "Test@12345"
    }
)

# Test 2-4: Register each test user
$registeredCount = 0
foreach ($i in 0..($testUsers.Count - 1)) {
    $user = $testUsers[$i]
    $stepNum = $i + 2
    
    Write-Host "[$stepNum/4] Registering $($user.email)..." -ForegroundColor Yellow
    
    $body = $user | ConvertTo-Json
    
    try {
        $response = Invoke-WebRequest -Uri "$BackendURL/api/v1/auth/register" `
            -Method POST `
            -Headers @{"Content-Type"="application/json"} `
            -Body $body `
            -ErrorAction Stop
        
        $data = $response.Content | ConvertFrom-Json
        Write-Host "✅ Registered: $($user.email)" -ForegroundColor Green
        $registeredCount++
    } catch {
        $errorData = $_.Exception.Response.Content | ConvertFrom-Json -ErrorAction SilentlyContinue
        $errorMsg = if ($errorData.message) { $errorData.message } else { $_.Exception.Message }
        
        if ($errorMsg -match "Email already") {
            Write-Host "⚠️  Already exists: $($user.email)" -ForegroundColor Yellow
            $registeredCount++
        } else {
            Write-Host "❌ Failed: $errorMsg" -ForegroundColor Red
        }
    }
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📌 Test Credentials:" -ForegroundColor Cyan
Write-Host "   Email: verified@example.com" -ForegroundColor Green
Write-Host "   Password: Password@123" -ForegroundColor Green
Write-Host ""
Write-Host "   OR" -ForegroundColor Yellow
Write-Host ""
Write-Host "   Email: admin@jobtracker.com" -ForegroundColor Green
Write-Host "   Password: AdminPass@123" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "🔌 Backend: http://localhost:8080" -ForegroundColor Cyan
Write-Host ""
