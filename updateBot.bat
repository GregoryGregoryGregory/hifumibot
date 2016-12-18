echo off
cls
pushd %~dp0
IF "%PROCESSOR_ARCHITECTURE%"=="x86" (GOTO 32bit) else (GOTO 64bit)
echo Sorry, something went wrong detecting your system bits.
echo.
echo Press any key to exit.
PAUSE>NUL
GOTO end

:32bit
echo %OS% with 32 bits detected (x86)
echo Unfortunately, you'll need to download the update manually.
echo Press ENTER and the download will start on your favorite browser.
echo Once done, follow the instructions.
PAUSE>NUL
start "" https://github.com/Underforest/hifumibot/archive/master.zip
echo --------------------------------------------------------
echo INSTRUCTIONS
echo Once the download is finished, do the following!
echo 1. Open master.zip
echo 2. Extract the "hifumibot-master" folder content (Replace all
echo files with new one, it shouldn't affect the bot)
echo 3. Start the bot and enjoy!
echo --------------------------------------------------------
echo.
echo Press any key to exit.
PAUSE>NUL
GOTO end

:64bit
echo %OS% with 64 bits detected (x64)
echo Download the update for you! :D
echo Please don't close this window or disconnect from the network.
echo Stay here to know when the download finishes and follow the instructions.
powershell -Command "(New-Object Net.WebClient).DownloadFile('https://github.com/Underforest/hifumibot/archive/master.zip', 'master.zip')"
echo Download finished!
echo --------------------------------------------------------
echo INSTRUCTIONS
echo Once the download is finished, do the following!
echo 1. Verify that there's a "master.zip" file on your
echo workplace. If so, open master.zip
echo 2. Extract the "hifumibot-master" folder content (Replace all
echo files with new one, it shouldn't affect the bot)
echo 3. Start the bot and enjoy!
echo --------------------------------------------------------
echo.
echo Press any key to exit.
PAUSE>NUL
GOTO end

:end
exit
