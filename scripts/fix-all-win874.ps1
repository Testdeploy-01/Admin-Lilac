$files = Get-ChildItem -Path "src" -Recurse -Include "*.tsx","*.ts"
foreach ($f in $files) {
    node scripts/fix-win874.mjs $f.FullName
}
