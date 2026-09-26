$ErrorActionPreference = "Stop"
$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
$dataPath = Join-Path $projectRoot "data"
$bundlePath = Join-Path $PSScriptRoot "data-bundle.js"
$payload = [ordered]@{}

Get-ChildItem -LiteralPath $dataPath -Filter "*.json" -File | Sort-Object Name | ForEach-Object {
    $key = [System.IO.Path]::GetFileNameWithoutExtension($_.Name)
    $payload[$key] = Get-Content -LiteralPath $_.FullName -Raw | ConvertFrom-Json
}

$json = ConvertTo-Json -InputObject $payload -Depth 100 -Compress
$contents = "window.budgetBasicsJSON = $json;`r`n"
[System.IO.File]::WriteAllText($bundlePath, $contents, [System.Text.UTF8Encoding]::new($false))
