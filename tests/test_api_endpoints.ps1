$baseUrl = "http://localhost:8000"

# Test /api/react (POST)
$url = "$baseUrl/api/react"
$body = @{
    smarts = "[C:1](=[O:2])O.[N:3]>>[C:1](=[O:2])[N:3]"
    reactants = @("CC(=O)O", "N")
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri $url -Method Post -Body $body -ContentType "application/json" -ErrorAction Stop
    Write-Host "✅ /api/react (POST) : $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Gray
}
catch {
    Write-Host "❌ /api/react (POST) : $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test RDKit URL
$rdkitUrl = "https://unpkg.com/@rdkit/rdkit@2025.3.4-1.0.0/dist/RDKit_minimal.js"
try {
    $response = Invoke-WebRequest -Uri $rdkitUrl -Method Head -ErrorAction Stop
    Write-Host "✅ RDKit URL : $($response.StatusCode)" -ForegroundColor Green
}
catch {
    Write-Host "❌ RDKit URL : $($_.Exception.Response.StatusCode)" -ForegroundColor Red
}
