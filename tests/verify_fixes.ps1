# Check if files contain expected strings
$files = @{
    "modules/pubchem-api.js" = "IsomericSMILES,CanonicalSMILES"
    "modules/reaction-engine.js" = "return data.products;"
    "modules/ui-controller.js" = "productSmilesArray.forEach"
    "random.html" = "link rel=`"icon`""
}

foreach ($file in $files.Keys) {
    $content = Get-Content -Path $file -Raw
    if ($content -match $files[$file]) {
        Write-Host "✅ $file : Verified" -ForegroundColor Green
    } else {
        Write-Host "❌ $file : Verification Failed (Expected '$($files[$file])')" -ForegroundColor Red
    }
}
