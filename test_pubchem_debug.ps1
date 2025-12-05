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
        
        Write-Host "SMILES List:" -ForegroundColor Gray
        foreach ($prop in $propsData.PropertyTable.Properties) {
            if ($prop.IsomericSMILES) {
                Write-Host "  - CID $($prop.CID): $($prop.IsomericSMILES)"
            } else {
                Write-Host "  - CID $($prop.CID): [No SMILES]" -ForegroundColor Yellow
            }
        }
    }
}
catch {
    Write-Host "❌ PubChem API failed: $($_.Exception.Message)" -ForegroundColor Red
}
