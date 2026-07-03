param([string]$name)
$adb = "C:\Users\Dae\AppData\Local\Android\Sdk\platform-tools\adb.exe"
$disp = "4630947194243491972"
$dir = "D:\claude\onsia-mapiapp\docs\개발사앱_원본캡처"
$out = "$dir\$name.png"
& $adb shell screencap -p -d $disp /sdcard/cap.png
& $adb pull /sdcard/cap.png $out | Out-Null
Write-Output "$name.png ($((Get-Item $out).Length) bytes)"
