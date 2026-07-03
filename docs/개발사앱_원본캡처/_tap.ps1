param([int]$x, [int]$y)
$adb = "C:\Users\Dae\AppData\Local\Android\Sdk\platform-tools\adb.exe"
& $adb shell input tap $x $y
Start-Sleep -Milliseconds 1500
