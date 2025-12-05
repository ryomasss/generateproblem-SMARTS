$wasmUrl = "https://unpkg.com/@rdkit/rdkit@2025.3.4-1.0.0/dist/RDKit_minimal.wasm"
try {
    $response = Invoke-WebRequest -Uri $wasmUrl -Method Head -ErrorAction Stop
    Write-Host "✅ WASM URL : $($response.StatusCode)" -ForegroundColor Green
}
catch {
    Write-Host "❌ WASM URL : $($_.Exception.Response.StatusCode)" -ForegroundColor Red
}
