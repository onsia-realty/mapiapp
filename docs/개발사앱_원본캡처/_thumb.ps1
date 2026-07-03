param([string]$name)
Add-Type -AssemblyName System.Drawing
$dir = "D:\claude\onsia-mapiapp\docs\개발사앱_원본캡처"
$src = "$dir\$name.png"
$img = [System.Drawing.Image]::FromFile($src)
$w = 760; $h = [int]($img.Height * $w / $img.Width)
$bmp = New-Object System.Drawing.Bitmap($w, $h)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.InterpolationMode = 'HighQualityBicubic'
$g.DrawImage($img, 0, 0, $w, $h)
$tdir = "$dir\_thumbs"
if(!(Test-Path $tdir)){ New-Item -ItemType Directory $tdir | Out-Null }
$bmp.Save("$tdir\$name.png", [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose(); $bmp.Dispose(); $img.Dispose()
Write-Output "$tdir\$name.png ($w x $h)"
