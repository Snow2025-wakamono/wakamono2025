@echo off
for %%i in (*.jpg) do (
  cwebp "%%i" -q 80 -o "%%~ni.webp"
)
pause
