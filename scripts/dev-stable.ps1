param(
  [int]$Port = 5173,
  [switch]$NoRun
)

$ErrorActionPreference = "Stop"

function Get-ListeningPidsForPort {
  param([int]$TargetPort)

  $escapedPort = [regex]::Escape(":$TargetPort")
  $pattern = "$escapedPort\s+.*LISTENING"
  $matches = netstat -ano | Select-String -Pattern $pattern
  $pids = @()

  foreach ($line in $matches) {
    $parts = ($line.ToString() -split "\s+") | Where-Object { $_ -ne "" }
    if ($parts.Length -gt 0) {
      $pid = $parts[-1]
      if ($pid -match "^\d+$") {
        $pids += [int]$pid
      }
    }
  }

  return $pids | Sort-Object -Unique
}

function Stop-Pids {
  param([int[]]$Pids)

  foreach ($pid in $Pids) {
    try {
      Stop-Process -Id $pid -Force -ErrorAction Stop
      Write-Host "Stopped process $pid"
    } catch {
      Write-Host "Skip process $pid (already stopped or inaccessible)"
    }
  }
}

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptDir
Set-Location $projectRoot

$listeningPids = Get-ListeningPidsForPort -TargetPort $Port
if ($listeningPids.Count -gt 0) {
  Write-Host "Cleaning port $Port..."
  Stop-Pids -Pids $listeningPids
}

if ($NoRun) {
  Write-Host "NoRun set. Skip starting dev server."
  exit 0
}

Write-Host "Starting Vite dev server on port $Port..."
node .\node_modules\vite\bin\vite.js --host 0.0.0.0 --port $Port --strictPort --clearScreen false
