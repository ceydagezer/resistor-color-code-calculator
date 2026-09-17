Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot

function New-RoundedRectPath {
    param($x, $y, $w, $h, $r)
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $d = $r * 2
    $path.AddArc($x, $y, $d, $d, 180, 90)
    $path.AddArc($x + $w - $d, $y, $d, $d, 270, 90)
    $path.AddArc($x + $w - $d, $y + $h - $d, $d, $d, 0, 90)
    $path.AddArc($x, $y + $h - $d, $d, $d, 90, 90)
    $path.CloseFigure()
    return $path
}

# ---------- favicon / apple-touch-icon shared drawing ----------
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

# apple-touch-icon.png (180x180)
$sizeIcon = 180
$bmpIcon = New-Object System.Drawing.Bitmap($sizeIcon, $sizeIcon)
$gIcon = [System.Drawing.Graphics]::FromImage($bmpIcon)
$gIcon.Clear([System.Drawing.Color]::FromArgb(209, 39, 44))
Draw-OhmMark -g $gIcon -size $sizeIcon
$gIcon.Dispose()
$bmpIcon.Save("$root\apple-touch-icon.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmpIcon.Dispose()

# favicon.ico (32x32)
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

# ---------- og-image.png (1200x630) ----------
$w = 1200; $h = 630
$bmp = New-Object System.Drawing.Bitmap($w, $h)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

$bgColor = [System.Drawing.Color]::FromArgb(16, 18, 22)
$g.Clear($bgColor)

$red = [System.Drawing.Color]::FromArgb(209, 39, 44)
$white = [System.Drawing.Color]::FromArgb(238, 240, 243)
$muted = [System.Drawing.Color]::FromArgb(152, 160, 172)

$redBrush = New-Object System.Drawing.SolidBrush($red)
$whiteBrush = New-Object System.Drawing.SolidBrush($white)
$mutedBrush = New-Object System.Drawing.SolidBrush($muted)

# brand mark
$markPath = New-RoundedRectPath -x 64 -y 64 -w 56 -h 56 -r 10
$g.FillPath($redBrush, $markPath)
$markFont = New-Object System.Drawing.Font("Arial", 30, [System.Drawing.FontStyle]::Bold)
$sfCenter = New-Object System.Drawing.StringFormat
$sfCenter.Alignment = [System.Drawing.StringAlignment]::Center
$sfCenter.LineAlignment = [System.Drawing.StringAlignment]::Center
$g.DrawString([char]0x03A9, $markFont, $whiteBrush, (New-Object System.Drawing.RectangleF(64, 62, 56, 58)), $sfCenter)

$brandFont = New-Object System.Drawing.Font("Segoe UI", 24, [System.Drawing.FontStyle]::Bold)
$g.DrawString("ohmline", $brandFont, $whiteBrush, 134, 78)

# headline
$h1Font = New-Object System.Drawing.Font("Segoe UI", 52, [System.Drawing.FontStyle]::Bold)
$g.DrawString("Direncini", $h1Font, $whiteBrush, 62, 190)
$g.DrawString("oku.", $h1Font, $redBrush, 62, 260)

# subtitle
$subFont = New-Object System.Drawing.Font("Segoe UI", 17)
$sub1 = "Bant renklerini sec, degeri aninda gor."
$sub2 = "Reverse lookup: degerden bantlara."
$g.DrawString($sub1, $subFont, $mutedBrush, 64, 400)
$g.DrawString($sub2, $subFont, $mutedBrush, 64, 432)

$footFont = New-Object System.Drawing.Font("Segoe UI", 13, [System.Drawing.FontStyle]::Bold)
$g.DrawString("4 / 5 / 6 BANT DESTEGI", $footFont, $redBrush, 64, 500)

# ---- resistor illustration (right side) ----
$resCenterY = 330
$bodyX = 660; $bodyW = 440; $bodyH = 110
$leadColor = [System.Drawing.Color]::FromArgb(120, 126, 136)
$leadPen = New-Object System.Drawing.Pen($leadColor, 6)
$g.DrawLine($leadPen, 560, $resCenterY, $bodyX, $resCenterY)
$g.DrawLine($leadPen, ($bodyX + $bodyW), $resCenterY, 1140, $resCenterY)

$bodyGradBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    (New-Object System.Drawing.Point($bodyX, ($resCenterY - $bodyH/2))),
    (New-Object System.Drawing.Point($bodyX, ($resCenterY + $bodyH/2))),
    [System.Drawing.Color]::FromArgb(240, 240, 244),
    [System.Drawing.Color]::FromArgb(210, 208, 216)
)
$bodyPath = New-RoundedRectPath -x $bodyX -y ($resCenterY - $bodyH/2) -w $bodyW -h $bodyH -r 34
$g.FillPath($bodyGradBrush, $bodyPath)
$bodyPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(199, 196, 204), 2)
$g.DrawPath($bodyPen, $bodyPath)

# bands: brown, green, red, gold -> 15 x100 = 1.5k, 5%
$bandColors = @(
    [System.Drawing.Color]::FromArgb(110, 74, 48),
    [System.Drawing.Color]::FromArgb(63, 122, 76),
    [System.Drawing.Color]::FromArgb(162, 59, 48),
    [System.Drawing.Color]::FromArgb(179, 144, 63)
)
$bandXs = @(720, 800, 880, 990)
foreach ($i in 0..3) {
    $bx = $bandXs[$i]
    $bandBrush = New-Object System.Drawing.SolidBrush($bandColors[$i])
    $g.FillRectangle($bandBrush, $bx, ($resCenterY - $bodyH/2 + 4), 26, ($bodyH - 8))
}

$valueFont = New-Object System.Drawing.Font("Segoe UI", 22, [System.Drawing.FontStyle]::Bold)
$sfCenterTop = New-Object System.Drawing.StringFormat
$sfCenterTop.Alignment = [System.Drawing.StringAlignment]::Center
$g.DrawString("1.5k ohm  +/-5%", $valueFont, $whiteBrush, (New-Object System.Drawing.RectangleF($bodyX, ($resCenterY + $bodyH/2 + 30), $bodyW, 40)), $sfCenterTop)

$g.Dispose()
$bmp.Save("$root\og-image.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()

Write-Output "Generated: apple-touch-icon.png, favicon.ico, og-image.png"
