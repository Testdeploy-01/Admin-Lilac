$targetDir = Join-Path $PSScriptRoot "..\src"
$files = Get-ChildItem -Path $targetDir -Recurse -Include "*.tsx","*.ts"
$count = 0
foreach ($file in $files) {
    $bytes = [System.IO.File]::ReadAllBytes($file.FullName)
    if ($bytes.Length -ge 3 -and $bytes[0] -eq 239 -and $bytes[1] -eq 187 -and $bytes[2] -eq 191) {
        $newBytes = $bytes[3..($bytes.Length - 1)]
        [System.IO.File]::WriteAllBytes($file.FullName, [byte[]]$newBytes)
        Write-Output "Fixed: $($file.FullName)"
        $count++
    }
}
Write-Output "Done. Fixed $count file(s)."
