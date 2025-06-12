# API Test Script
Write-Host "🧪 Testing Smart Triathlete APIs..." -ForegroundColor Cyan

# Test 1: Database Connection
Write-Host "`n1. Testing Database Connection..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5180/api/test/database" -Method GET -UseBasicParsing
    Write-Host "✅ Database API: Status $($response.StatusCode)" -ForegroundColor Green
    $dbData = $response.Content | ConvertFrom-Json
    Write-Host "   Tables found: $($dbData.database.tables.Count)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Database API failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Profile API
Write-Host "`n2. Testing Profile API..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5180/api/profile" -Method GET -UseBasicParsing
    Write-Host "✅ Profile API: Status $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ Profile API failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: AI Training Plan Generation
Write-Host "`n3. Testing AI Training Plan Generation..." -ForegroundColor Yellow
$aiBody = @{
    athleteData = @{
        age = 30
        gender = "male"
        experienceLevel = "intermediate"
        weeklyTrainingHours = 10
        currentFTP = 250
        swimTime100m = 90
        runTime5k = 1200
    }
    goal = @{
        type = "triathlon"
        event = "olympic"
        targetDate = "2025-08-15"
        priority = "finish"
    }
    options = @{
        duration = 12
        trainingDays = 5
        includeRecovery = $true
    }
} | ConvertTo-Json -Depth 3

try {
    $response = Invoke-WebRequest -Uri "http://localhost:5180/api/ai/generate-plan" -Method POST -Body $aiBody -ContentType "application/json" -UseBasicParsing
    Write-Host "✅ AI Training Plan API: Status $($response.StatusCode)" -ForegroundColor Green
    $planData = $response.Content | ConvertFrom-Json
    Write-Host "   Plan duration: $($planData.plan.totalWeeks) weeks" -ForegroundColor Gray
    Write-Host "   Sessions per week: $($planData.plan.sessionsPerWeek)" -ForegroundColor Gray
} catch {
    Write-Host "❌ AI Training Plan API failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Strava Integration Endpoint
Write-Host "`n4. Testing Strava Integration..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5180/api/integrations/strava" -Method GET -UseBasicParsing
    Write-Host "✅ Strava Integration API: Status $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ Strava Integration API failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: Garmin Integration Endpoint
Write-Host "`n5. Testing Garmin Integration..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5180/api/integrations/garmin" -Method GET -UseBasicParsing
    Write-Host "✅ Garmin Integration API: Status $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ Garmin Integration API failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎉 API Testing Complete!" -ForegroundColor Cyan
Write-Host "📊 Check results above for any issues" -ForegroundColor Gray
