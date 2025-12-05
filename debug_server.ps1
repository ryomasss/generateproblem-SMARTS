$files = @(
    "/",
    "/random.html",
    "/style.css",
    "/reactions.js",
    "/main.js",
    "/modules/state.js",
    "/modules/utils.js",
    "/modules/ui-controller.js",
    "/modules/renderer.js",
    "/modules/reaction-engine.js",
    "/modules/pubchem-api.js"
)

$baseUrl = "http://localhost:8000"

foreach ($file in $files) {
    $url = "$baseUrl$file"
    try {
        $response = Invoke-WebRequest -Uri $url -Method Head -ErrorAction Stop
        Write-Host "✅ $file : $($response.StatusCode)" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ $file : $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    }
}
