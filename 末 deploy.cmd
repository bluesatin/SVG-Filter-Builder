:INITIALISE
cls
@echo off
setlocal
:PROMPT
ECHO [41;m!WARNING![0;m This will build and deploy the app to GitHub pages.
SET /P CONFIRM=If you want to continue, type 'DEPLOY': 
IF /I "%CONFIRM%" NEQ "DEPLOY" GOTO END
:RUN DEPLOY COMMAND
npm run deploy
:END
endlocal
PAUSE
