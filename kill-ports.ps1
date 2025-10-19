# PowerShell script to kill processes on development ports
# Usage: .\kill-ports.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Killing processes on development ports" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$ports = @(3000, 5173, 5174, 5175)

foreach ($port in $ports) {
    Write-Host "Checking port $port..." -ForegroundColor Yellow

    $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue

    if ($connections) {
        foreach ($conn in $connections) {
            $processId = $conn.OwningProcess
            $process = Get-Process -Id $processId -ErrorAction SilentlyContinue

            if ($process) {
                Write-Host "  Found process: $($process.Name) (PID: $processId)" -ForegroundColor Red
                Write-Host "  Killing process $processId..." -ForegroundColor Red
                Stop-Process -Id $processId -Force
                Write-Host "  ✓ Killed!" -ForegroundColor Green
            }
        }
    } else {
        Write-Host "  No process found on port $port" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Done! Ports should now be available." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "You can now run: npm run dev" -ForegroundColor Yellow
Write-Host ""
