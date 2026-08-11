# ═══════════════════════════════════════════
# OPENCODE USAGE — update.ps1
# Regenerates data.json from opencode.log + db,
# then auto-commits & pushes if data changed.
# Run: powershell -ExecutionPolicy Bypass -File update.ps1
# ═══════════════════════════════════════════

$ErrorActionPreference = 'Stop'
$usageDir = $PSScriptRoot                     # .../demo/opencode-usage
$repoDir  = Split-Path $usageDir -Parent      # .../demo

# 1) Regenerate data.json
Write-Host ">> Regenerating data.json..."
node (Join-Path $usageDir 'parse-log.js')
if ($LASTEXITCODE -ne 0) { throw "parse-log.js gagal (exit $LASTEXITCODE)" }

# 2) Commit & push if changed (repo root is demo/)
Push-Location $repoDir
try {
    $status = git status --porcelain
    if ($status) {
        Write-Host ">> Perubahan dikesan, commit + push..."
        git add -A
        git commit -m "OpenCode Usage: auto-update data.json ($(Get-Date -Format 'yyyy-MM-dd HH:mm'))"
        git push origin main
        Write-Host ">> Selesai. Commit + push OK."
    } else {
        Write-Host ">> Tiada perubahan. Skip."
    }
} finally { Pop-Location }
