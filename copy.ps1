Get-ChildItem -Path .\dist\atow-chargen\* | Copy-Item -Destination .\docs -Recurse -Container
Get-ChildItem -Path .\docs\index.html | Copy-Item -Destination .\docs\404.html