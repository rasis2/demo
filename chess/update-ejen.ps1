# ============================================================
# update-ejen.ps1 - Silent regenerator untuk Ejen Directory
#   - Scan .opencode\memory\*.md
#   - Kira SHA256 content; skip jika sama (silent dedup)
#   - Generate data.json HANYA jika berubah
#   - Git commit/push hanya jika berubah
# Cron: setiap 15 minit (lihat Arahan Cron di bawah)
# ============================================================

$ErrorActionPreference = 'SilentlyContinue'
$ProgressPreference    = 'SilentlyContinue'

$memoryDir = 'C:\Users\Rasis\Documents\GitHub\.opencode\memory'
$chessDir  = 'C:\Users\Rasis\Documents\GitHub\demo\chess'
$dataFile  = Join-Path $chessDir 'data.json'
$hashFile  = Join-Path $chessDir '.last-hash'
$logFile   = Join-Path $chessDir '.update.log'

function Write-Log {
    param([string]$msg)
    $line = "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')  $msg"
    Add-Content -LiteralPath $logFile -Value $line -Encoding utf8
}

# 1. Kira SHA256 gabungan semua .md dalam memory (TIDAK termasuk archive)
if (-not (Test-Path -LiteralPath $memoryDir)) {
    Write-Log "ABORT: $memoryDir tidak wujud"
    exit 1
}

$mdFiles = Get-ChildItem -LiteralPath $memoryDir -Filter '*.md' -File | Sort-Object Name
if (-not $mdFiles -or $mdFiles.Count -eq 0) {
    Write-Log "ABORT: tiada .md dalam $memoryDir"
    exit 1
}

$sha = [System.Security.Cryptography.SHA256]::Create()
try {
    $combined = New-Object System.Text.StringBuilder
    foreach ($f in $mdFiles) {
        $content = [System.IO.File]::ReadAllText($f.FullName, [System.Text.Encoding]::UTF8)
        [void]$combined.AppendLine("=== $($f.Name) ===")
        [void]$combined.AppendLine($content)
    }
    $bytes  = [System.Text.Encoding]::UTF8.GetBytes($combined.ToString())
    $hashSb = $sha.ComputeHash($bytes)
    $newHash = -join ($hashSb | ForEach-Object { $_.ToString('x2') })
} finally {
    $sha.Dispose()
}

# 2. Bandingkan dengan hash lama
$oldHash = $null
if (Test-Path -LiteralPath $hashFile) {
    $oldHash = (Get-Content -LiteralPath $hashFile -Raw -ErrorAction SilentlyContinue).Trim()
}

if ($newHash -eq $oldHash) {
    # Silent dedup
    exit 0
}

Write-Log "PERUBAHAN: $oldHash -> $newHash"

# 3. Generate data.json
#    Timestamp format DATE sahaja (supaya git diff minimal)
$today  = [DateTime]::UtcNow.ToString('yyyy-MM-dd')

$ejenList = @()
foreach ($f in $mdFiles) {
    $id = $f.BaseName  # nama fail tanpa .md
    if ($id -eq 'ejen-directory') { continue }  # sumber rujukan, bukan ejen

    $content = [System.IO.File]::ReadAllText($f.FullName, [System.Text.Encoding]::UTF8)

    # Status heuristik (positif dulu, negatif kemudian)
    $status = 'ringan'  # default
    # NEGATIF kuat: SEKAT / TIDAK berfungsi
    if ($content -match '(?i)\bSEKAT\b') {
        $status = 'tak_aktif'
    }
    # NEGATIF sederhana: belum aktif / diarhhk
    elseif ($content -match '(?i)\b(TIDAK\s+pernah\s+dijalankan|TIDAK\s+disentuh|belum\s+ujian|ujian\s+ditunda)') {
        $status = 'tak_aktif'
    }
    # POSITIF BERAT: terbeban (audit/penuh)
    elseif ($content -match '(?i)\b(semakan\s+penuh|audit\s+penuh|pemakan\s+token\s*#\s*\d)') {
        $status = 'terbeban'
    }
    # POSITIF sederhana: aktif
    elseif ($content -match '(?i)\b(LULUS|BERJAYA|SELESAI|siap|terkini|connected)') {
        $status = 'aktif'
    }
    elseif ($content -match '(?i)\bstatus\s+semasa|status\s+penuh|RUN\s+OK|up\s+since') {
        $status = 'aktif'
    }

    # Workload heuristik (kira mention kata kunci aktif)
    $wlMatches = ([regex]::Matches($content, '\b(2026-08-(0[1-9]|[12][0-9]|3[01]))\b', 'IgnoreCase')).Count
    $wlMatches += ([regex]::Matches($content, '(?i)\b(tugasan|tugas|projek|audit|rawatan|semakan|build|compile|ujian|run)\b')).Count
    $workload = [Math]::Min(8, [int][Math]::Floor($wlMatches / 3))
    if ($status -eq 'tak_aktif') { $workload = 0 }

    # Meta: model frontmatter jika disebut
    $model = 'default'
    $m = [regex]::Match($content, 'model:\s*([\w\-/\.]+)')
    if ($m.Success) { $model = $m.Groups[1].Value }

    # Kategori (dari nama fail)
    $kategori = 'Ejen Teknikal'
    if ($id -match 'reporter') {
        $kategori = 'Ejen Komunikasi'
    } elseif ($id -match 'admin|operator|monitor|doktor|memori') {
        $kategori = 'Ejen Operasional'
    } elseif ($id -match 'gremlin|compiler|maestro') {
        $kategori = 'Ejen Projek Gremlin'
    }

    # Tugasan ringkas
    $tugas = ''
    $firstSection = [regex]::Match($content, '(?ms)^##\s*(?:Tujuan|Identiti)[^\n]*\n+(.+?)(?=\n##|\z)')
    if ($firstSection.Success) {
        $tugas = ($firstSection.Groups[1].Value -split "`n")[0].Trim()
    }
    if (-not $tugas) {
        $tugas = ($content -split "`n" | Where-Object { $_ -match '\S' } | Select-Object -First 1).Trim()
    }
    if ($tugas.Length -gt 240) { $tugas = $tugas.Substring(0, 237) + '...' }

    # Indikator warna/badge
    $colorMap = @{ 'aktif'='#10b981'; 'ringan'='#eab308'; 'terbeban'='#f97316'; 'tak_aktif'='#ef4444' }
    $color = '#94a3b8'
    if ($colorMap.ContainsKey($status)) { $color = $colorMap[$status] }

    $namaRaw = ($id -replace '^ejen-', 'Ejen ')
    $nama = $namaRaw.Substring(0,1).ToUpper() + $namaRaw.Substring(1)

    $ejenList += [PSCustomObject]@{
        id        = $id
        nama      = $nama
        tugas     = $tugas
        kategori  = $kategori
        status    = $status
        workload  = $workload
        meta      = @{ model = $model; kaedah = ($id -replace '^ejen-',''); khas = '' }
        indikator = @{ warna_status = $color; badge = $status.ToUpper(); ikon = '' }
    }
}

# 4. Susun ikut kategori + bina kategori dict
$katOrder = @('Ejen Komunikasi','Ejen Operasional','Ejen Teknikal','Ejen Projek Gremlin')
$kategoriDict = [ordered]@{}
foreach ($k in $katOrder) { $kategoriDict[$k] = @() }
foreach ($e in $ejenList) {
    if (-not $kategoriDict.Contains($e.kategori)) { $kategoriDict[$e.kategori] = @() }
    $kategoriDict[$e.kategori] += $e.id
}

$rng = [ordered]@{
    aktif     = [int]($ejenList | Where-Object { $_.status -eq 'aktif' }).Count
    ringan    = [int]($ejenList | Where-Object { $_.status -eq 'ringan' }).Count
    terbeban  = [int]($ejenList | Where-Object { $_.status -eq 'terbeban' }).Count
    tak_aktif = [int]($ejenList | Where-Object { $_.status -eq 'tak_aktif' }).Count
}

# 5. Convert ke JSON
$perKat = [ordered]@{
    'Ejen Komunikasi'      = [int]($kategoriDict['Ejen Komunikasi']      | Measure-Object).Count
    'Ejen Operasional'     = [int]($kategoriDict['Ejen Operasional']     | Measure-Object).Count
    'Ejen Teknikal'        = [int]($kategoriDict['Ejen Teknikal']        | Measure-Object).Count
    'Ejen Projek Gremlin'  = [int]($kategoriDict['Ejen Projek Gremlin']  | Measure-Object).Count
}

$metaObj = [ordered]@{
    title          = 'Ejen Directory'
    subtitle       = 'OpenCode Memory Snapshot'
    generated_at   = $today
    total_ejen     = $ejenList.Count
    kategori_count = $katOrder.Count
    source         = '.opencode/memory/'
    note           = 'Snapshot dijana dari .opencode/memory/*.md'
}

$ringkasanObj = [ordered]@{
    aktif        = $rng.aktif
    ringan       = $rng.ringan
    terbeban     = $rng.terbeban
    tak_aktif    = $rng.tak_aktif
    per_kategori = $perKat
}

$ejenObj = @($ejenList | ForEach-Object {
    [ordered]@{
        id        = $_.id
        nama      = $_.nama
        tugas     = $_.tugas
        kategori  = $_.kategori
        status    = $_.status
        workload  = $_.workload
        meta      = $_.meta
        indikator = $_.indikator
    }
})

$json = [ordered]@{
    meta     = $metaObj
    ringkasan= $ringkasanObj
    kategori = $kategoriDict
    ejen     = $ejenObj
}

$jsonText = $json | ConvertTo-Json -Depth 8
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($dataFile, $jsonText, $utf8NoBom)

Set-Content -LiteralPath $hashFile -Value $newHash -Encoding utf8 -NoNewline
Write-Log "TULIS: data.json ($($ejenList.Count) ejen, hash $newHash)"

# 6. Git commit + push (jika berubah & repo wujud)
$gitDir = Join-Path $chessDir '.git'
if (Test-Path -LiteralPath $gitDir) {
    Push-Location -LiteralPath $chessDir
    try {
        $gitStatus = & git status --porcelain -- data.json 2>&1
        if ($gitStatus) {
            & git add -- data.json 2>&1 | Out-Null
            & git commit --no-verify -q -m "chore: update ejen directory snapshot ($today)" 2>&1 | Out-Null
            $pushOut = & git push --no-verify -q origin main 2>&1
            if ($LASTEXITCODE -eq 0) {
                Write-Log 'GIT: push origin/main BERJAYA'
            } else {
                $pushOutStr = ($pushOut | Out-String).Trim()
                Write-Log "GIT: push GAGAL - $pushOutStr"
            }
        } else {
            Write-Log 'GIT: data.json tiada perubahan (race condition)'
        }
    } finally {
        Pop-Location
    }
}

exit 0
