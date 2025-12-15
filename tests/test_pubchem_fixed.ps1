Add-Type -AssemblyName System.Web

$smarts = "C=C" # Simple alkene
$encodedSmarts = [System.Web.HttpUtility]::UrlEncode($smarts)
$url = "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/fastsubstructure/smarts/$encodedSmarts/cids/JSON?MaxRecords=20"

try {
    $response = Invoke-WebRequest -Uri $url -Method Get -ErrorAction Stop
    $data = $response.Content | ConvertFrom-Json
    $cids = $data.IdentifierList.CID
    Write-Host "✅ PubChem returned $($cids.Count) CIDs for SMARTS '$smarts'" -ForegroundColor Green
    
    if ($cids.Count -gt 0) {
        $cidsStr = $cids -join ","
        $propsUrl = "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/$cidsStr/property/IsomericSMILES/JSON"
        $propsResponse = Invoke-WebRequest -Uri $propsUrl -Method Get -ErrorAction Stop
        $propsData = $propsResponse.Content | ConvertFrom-Json
        $smiles = $propsData.PropertyTable.Properties | ForEach-Object { $_.IsomericSMILES }
        Write-Host "SMILES List:" -ForegroundColor Gray
        $smiles | ForEach-Object { Write-Host "  - $_" }
    }
}
catch {
    Write-Host "❌ PubChem API failed: $($_.Exception.Message)" -ForegroundColor Red
}
