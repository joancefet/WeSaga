@echo off
REM Meteor to Node.JS Production Batch Tool

echo STARTING METEOR BUNDLE SERVICE

meteor build --architecture os.linux.x86_64 ../skyrooms.tar.gz 

echo METEOR BUNDLE COMPLETE, skyrooms.tar.gz

echo ----------------- SCRIPT COMPLETE - Press any key to close this window -----------------
pause >nul