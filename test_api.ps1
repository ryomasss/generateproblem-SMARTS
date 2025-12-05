$body = @{
    smarts = "[C:1][C:2](=O).[C:3][C:4](=O)>>[C:1][C:2](=O)[C:3][C:4](=O)"
    reactants = @("CC=O", "CC=O")
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8000/api/react" -Method POST -Body $body -ContentType "application/json" | Select-Object -ExpandProperty Content
