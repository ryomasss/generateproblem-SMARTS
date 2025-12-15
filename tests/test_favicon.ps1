$url = "http://localhost:8000/favicon.ico"
try {
    $response = Invoke-WebRequest -Uri $url -Method Head -ErrorAction Stop
    Write-Host "✅ Favicon : $($response.StatusCode)" -ForegroundColor Green
}
catch {
    Write-Host "❌ Favicon : $($_.Exception.Response.StatusCode)" -ForegroundColor Red
}
