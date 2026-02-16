
@echo off
git init
git add .
git commit -m "Initial commit of Foxit Sentinel Pro (Sanitized)"
git branch -M main
git remote add origin https://github.com/QuisTech/Foxit-Sentinel-Pro.git
git push -u origin main --force
exit
