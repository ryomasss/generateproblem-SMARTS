$content = Get-Content -Path "modules/ui-controller.js" -Raw
if ($content -match "answerContainer.appendChild\(structDiv\)") {
    Write-Host "✅ UI Controller Refactored Correctly" -ForegroundColor Green
} else {
    Write-Host "❌ UI Controller Refactor Failed" -ForegroundColor Red
}

$css = Get-Content -Path "style.css" -Raw
if ($css -match "align-items: center; /\* 垂直居中对齐") {
    Write-Host "✅ CSS Updated Correctly" -ForegroundColor Green
} else {
    Write-Host "❌ CSS Update Failed" -ForegroundColor Red
}
