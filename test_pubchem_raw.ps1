Add-Type -AssemblyName System.Web

$smarts = "C=C"
$encodedSmarts = [System.Web.HttpUtility]::UrlEncode($smarts)
$cids = "980,4173,5143" # Use some CIDs from previous run
$propsUrl = "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/$cids/property/IsomericSMILES/JSON"

try {
    $propsResponse = Invoke-WebRequest -Uri $propsUrl -Method Get -ErrorAction Stop
    Write-Host "Raw Response:" -ForegroundColor Gray
    Write-Host $propsResponse.Content
}
catch {
    Write-Host "❌ PubChem API failed: $($_.Exception.Message)" -ForegroundColor Red
}
