Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot

function Draw-OhmMark {
    param($g, $size)
    $red = [System.Drawing.Color]::FromArgb(209, 39, 44)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
    $brush = New-Object System.Drawing.SolidBrush($red)
    $g.FillEllipse($brush, 0, 0, $size, $size)
    $fontSize = [float]($size * 0.56)
    $font = New-Object System.Drawing.Font("Arial", $fontSize, [System.Drawing.FontStyle]::Bold)
    $white = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $sf = New-Object System.Drawing.StringFormat
    $sf.Alignment = [System.Drawing.StringAlignment]::Center
    $sf.LineAlignment = [System.Drawing.StringAlignment]::Center
    $g.DrawString([char]0x03A9, $font, $white, (New-Object System.Drawing.RectangleF(0, 0, $size, $size * 1.02)), $sf)
}

# favicon.ico (32x32) - fallback for browsers that don't support favicon.svg
$sizeFav = 32
$bmpFav = New-Object System.Drawing.Bitmap($sizeFav, $sizeFav)
$gFav = [System.Drawing.Graphics]::FromImage($bmpFav)
$gFav.Clear([System.Drawing.Color]::Transparent)
Draw-OhmMark -g $gFav -size $sizeFav
$gFav.Dispose()
$iconHandle = $bmpFav.GetHicon()
$icon = [System.Drawing.Icon]::FromHandle($iconHandle)
$fs = New-Object System.IO.FileStream("$root\favicon.ico", [System.IO.FileMode]::Create)
$icon.Save($fs)
$fs.Close()
$icon.Dispose()
$bmpFav.Dispose()

Write-Output "Generated: favicon.ico"
