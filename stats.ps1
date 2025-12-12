$exclude = @("node_modules", ".git", "dist", "build", "coverage", ".gemini", "package-lock.json")
$extensions = @(".ts", ".tsx", ".css", ".html", ".js", ".json")

$files = Get-ChildItem -Recurse -File | Where-Object { 
    $path = $_.FullName
    $ext = $_.Extension
    
    # Check exclusion
    foreach ($exc in $exclude) {
        if ($path -like "*$exc*") { return $false }
    }
    
    # Check extension
    if ($extensions -notcontains $ext) { return $false }
    
    return $true
}

Write-Output "Total Files: $($files.Count)"
$lines = 0
foreach ($f in $files) {
    $lines += (Get-Content $f.FullName | Measure-Object -Line).Lines
}
Write-Output "Total Lines: $lines"
