# PowerShell Script to register the Shopee Ranking Auto-Update Task
# Run this script as Administrator to register the task in Windows Task Scheduler.

$TaskName = "ShopeeRankingAutoUpdate"
$ScriptPath = "D:\Projects\shopee-ranking\auto_update_all.py"
$WorkDir = "D:\Projects\shopee-ranking"

# 1. Define the action to execute
$Action = New-ScheduledTaskAction -Execute "python.exe" -Argument "`"$ScriptPath`"" -WorkingDirectory $WorkDir

# 2. Define the trigger (Daily at 3:00 AM)
$Trigger = New-ScheduledTaskTrigger -Daily -At 3:00AM

# 3. Define settings (allow starting on batteries, restart if failed, etc.)
$Settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable

# 4. Register the scheduled task under the current user context (runs in background)
try {
    Register-ScheduledTask -TaskName $TaskName -Action $Action -Trigger $Trigger -Settings $Settings -Description "Automatically updates Shopee product rankings daily, compiles to JSON, and pushes to GitHub for Vercel deployment." -Force
    Write-Host "==================================================================" -ForegroundColor Green
    Write-Host "SUCCESS: Scheduled task '$TaskName' registered successfully!" -ForegroundColor Green
    Write-Host "It will run daily at 3:00 AM in the background." -ForegroundColor Green
    Write-Host "You can inspect it in Windows Task Scheduler under Action -> 'Task Scheduler Library'." -ForegroundColor Green
    Write-Host "==================================================================" -ForegroundColor Green
} catch {
    Write-Error "Failed to register scheduled task: $_"
}
