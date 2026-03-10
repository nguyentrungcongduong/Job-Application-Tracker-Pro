# Script to find EC2 instances across all AWS regions
# Run: .\find-ec2-instances.ps1

Write-Host "🔍 Searching for EC2 instances in all regions..." -ForegroundColor Cyan

$regions = @(
    "us-east-1", "us-east-2", "us-west-1", "us-west-2",
    "ap-south-1", "ap-northeast-1", "ap-northeast-2", "ap-northeast-3",
    "ap-southeast-1", "ap-southeast-2",
    "ca-central-1",
    "eu-central-1", "eu-west-1", "eu-west-2", "eu-west-3",
    "sa-east-1"
)

$found = $false

foreach ($region in $regions) {
    Write-Host "`nChecking region: $region" -ForegroundColor Yellow
    
    try {
        $instances = aws ec2 describe-instances `
            --region $region `
            --query 'Reservations[*].Instances[*].[InstanceId,State.Name,Tags[?Key==`Name`].Value|[0],PublicIpAddress]' `
            --output json | ConvertFrom-Json
        
        if ($instances.Count -gt 0) {
            $found = $true
            Write-Host "✅ Found instances in $region!" -ForegroundColor Green
            
            foreach ($reservation in $instances) {
                foreach ($instance in $reservation) {
                    $instanceId = $instance[0]
                    $state = $instance[1]
                    $name = $instance[2]
                    $ip = $instance[3]
                    
                    Write-Host "  Instance ID: $instanceId" -ForegroundColor White
                    Write-Host "  Name: $name" -ForegroundColor White
                    Write-Host "  State: $state" -ForegroundColor $(if ($state -eq "running") { "Green" } elseif ($state -eq "stopped") { "Red" } else { "Gray" })
                    Write-Host "  Public IP: $ip" -ForegroundColor White
                    Write-Host "  ---"
                }
            }
        }
    }
    catch {
        Write-Host "  ⚠️  Error checking region $region" -ForegroundColor Red
    }
}

if (-not $found) {
    Write-Host "`n❌ No instances found in any region!" -ForegroundColor Red
    Write-Host "Possible reasons:" -ForegroundColor Yellow
    Write-Host "  1. Instance was terminated (deleted)" -ForegroundColor Yellow
    Write-Host "  2. Wrong AWS account" -ForegroundColor Yellow
    Write-Host "  3. AWS CLI not configured correctly" -ForegroundColor Yellow
}
else {
    Write-Host "`n✅ Search complete!" -ForegroundColor Green
}
