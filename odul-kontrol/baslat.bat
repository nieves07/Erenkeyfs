@echo off
chcp 65001 >nul
cd /d "%~dp0"
title Kick Odul Tus
python -m pip install -q -r requirements.txt
python kick_odul_tus.py %*
pause
