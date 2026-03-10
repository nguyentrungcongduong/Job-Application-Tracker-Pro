# Job Tracker - Authentication Testing Script
# Sử dụng: .\test-auth.ps1

$BaseURL = "http://localhost:8080/api/v1/auth"
$Headers = @{
    "Content-Type" = "application/json"
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  JOB TRACKER - AUTHENTICATION TEST SUITE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check Backend Status
Write-Host "[1/5] Checking Backend Status..." -ForegroundColor Yellow
try {
    $healthResponse = Invoke-WebRequest -Uri "http://localhost:8080/actuator/health" -Method GET -ErrorAction Stop
    Write-Host "✅ Backend is UP" -ForegroundColor Green
    Write-Host "   Response: $($healthResponse.Content)" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend is DOWN" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Solution: Make sure backend is running on port 8080" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Test 1: Login with Valid Credentials
Write-Host "[2/5] Testing Login - Valid Credentials..." -ForegroundColor Yellow
$loginBody = @{
    email = "verified@example.com"
    password = "Password@123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-WebRequest -Uri "$BaseURL/login" -Method POST -Headers $Headers -Body $loginBody -ErrorAction Stop
    $loginData = $loginResponse.Content | ConvertFrom-Json
    Write-Host "✅ Login Success" -ForegroundColor Green
    Write-Host "   Token: $($loginData.token.Substring(0, 30))..." -ForegroundColor Green
    Write-Host "   Email: $($loginData.email)" -ForegroundColor Green
    $ValidToken = $loginData.token
} catch {
    Write-Host "❌ Login Failed" -ForegroundColor Red
    Write-Host "   Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    Write-Host "   Message: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 2: Login with Wrong Password
Write-Host "[3/5] Testing Login - Wrong Password (Expected to Fail)..." -ForegroundColor Yellow
$wrongPassBody = @{
    email = "verified@example.com"
    password = "WrongPassword123"
} | ConvertTo-Json

try {
    $wrongPassResponse = Invoke-WebRequest -Uri "$BaseURL/login" -Method POST -Headers $Headers -Body $wrongPassBody -ErrorAction Stop
    Write-Host "❌ Should have failed but didn't!" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq "Unauthorized" -or $_.Exception.Response.StatusCode -eq 401) {
        Write-Host "✅ Correctly Rejected (401 Unauthorized)" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Unexpected Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Yellow
    }
}

Write-Host ""

# Test 3: Register New Account
Write-Host "[4/5] Testing Registration - New Account..." -ForegroundColor Yellow
$timestamp = Get-Date -Format "yyyyMMddHHmmss"
$registerBody = @{
    name = "Test User $timestamp"
    email = "testuser$timestamp@example.com"
    password = "TestPass@123"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-WebRequest -Uri "$BaseURL/register" -Method POST -Headers $Headers -Body $registerBody -ErrorAction Stop
    $registerData = $registerResponse.Content | ConvertFrom-Json
    Write-Host "✅ Registration Success" -ForegroundColor Green
    Write-Host "   Email: $($registerData.email)" -ForegroundColor Green
    Write-Host "   Message: $($registerData.message)" -ForegroundColor Green
} catch {
    Write-Host "❌ Registration Failed" -ForegroundColor Red
    Write-Host "   Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    Write-Host "   Message: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 4: Test with Admin Account
Write-Host "[5/5] Testing Login - Admin Account..." -ForegroundColor Yellow
$adminBody = @{
    email = "admin@jobtracker.com"
    password = "AdminPass@123"
} | ConvertTo-Json

try {
    $adminResponse = Invoke-WebRequest -Uri "$BaseURL/login" -Method POST -Headers $Headers -Body $adminBody -ErrorAction Stop
    $adminData = $adminResponse.Content | ConvertFrom-Json
    Write-Host "✅ Admin Login Success" -ForegroundColor Green
    Write-Host "   Email: $($adminData.email)" -ForegroundColor Green
    Write-Host "   Name: $($adminData.name)" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Admin Account Not Found (This is OK if not set up)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  TEST SUMMARY COMPLETE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Test Accounts Available:" -ForegroundColor Yellow
Write-Host "  • verified@example.com / Password@123 (✅ Ready)" -ForegroundColor Green
Write-Host "  • unverified@example.com / Test@12345 (⏳ Needs Email Verification)" -ForegroundColor Yellow
Write-Host "  • admin@jobtracker.com / AdminPass@123 (Admin)" -ForegroundColor Cyan
Write-Host ""
Write-Host "📌 For more details, see: AUTH_TEST_GUIDE.md" -ForegroundColor Cyan
Write-Host "📌 For Postman import: Postman_Auth_Tests.json" -ForegroundColor Cyan
