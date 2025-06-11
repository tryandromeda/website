export function handler(): Response {
  const installScript = `@echo off
setlocal enabledelayedexpansion

REM Andromeda Installation Script for Windows (Batch)
REM This script downloads and installs Andromeda on Windows systems

REM Configuration
set "REPO=tryandromeda/andromeda"
set "VERSION=0.1.0-draft1"
set "ASSET_NAME=andromeda-windows-amd64.exe"
set "INSTALL_DIR=%USERPROFILE%\\.local\\bin"

REM Colors (limited in batch)
set "INFO_PREFIX=[INFO]"
set "SUCCESS_PREFIX=[SUCCESS]"
set "ERROR_PREFIX=[ERROR]"
set "WARNING_PREFIX=[WARNING]"

REM Check for help
if "%1"=="--help" goto :show_help
if "%1"=="-h" goto :show_help
if "%1"=="/?" goto :show_help

echo %INFO_PREFIX% Installing Andromeda %VERSION% for Windows...

REM Construct download URL
set "DOWNLOAD_URL=https://github.com/%REPO%/releases/download/%VERSION%/%ASSET_NAME%"
echo %INFO_PREFIX% Download URL: !DOWNLOAD_URL!

REM Create install directory if it doesn't exist
if not exist "%INSTALL_DIR%" (
    echo %INFO_PREFIX% Creating install directory: %INSTALL_DIR%
    mkdir "%INSTALL_DIR%" 2>nul
    if errorlevel 1 (
        echo %ERROR_PREFIX% Failed to create install directory
        goto :error_exit
    )
)

REM Download the binary using PowerShell (available on Windows 7+)
set "BINARY_PATH=%INSTALL_DIR%\\andromeda.exe"
set "TEMP_FILE=%TEMP%\\andromeda_download.exe"

echo %INFO_PREFIX% Downloading Andromeda binary...

powershell -Command "& {[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; (New-Object Net.WebClient).DownloadFile('%DOWNLOAD_URL%', '%TEMP_FILE%')}" 2>nul

if not exist "%TEMP_FILE%" (
    echo %ERROR_PREFIX% Failed to download Andromeda binary
    echo %ERROR_PREFIX% Please check your internet connection and try again
    goto :error_exit
)

REM Move to install directory
move "%TEMP_FILE%" "%BINARY_PATH%" >nul 2>&1
if errorlevel 1 (
    echo %ERROR_PREFIX% Failed to move binary to install directory
    del "%TEMP_FILE%" 2>nul
    goto :error_exit
)

echo %SUCCESS_PREFIX% Andromeda installed to: %BINARY_PATH%

REM Check if install directory is in PATH
echo %PATH% | find /i "%INSTALL_DIR%" >nul
if errorlevel 1 (
    echo %WARNING_PREFIX% Install directory '%INSTALL_DIR%' is not in your PATH.
    echo %WARNING_PREFIX% Adding it to your user PATH environment variable...
    
    REM Add to user PATH
    for /f "tokens=2*" %%a in ('reg query "HKCU\\Environment" /v PATH 2^>nul') do set "USER_PATH=%%b"
    if "!USER_PATH!"=="" (
        set "NEW_PATH=%INSTALL_DIR%"
    ) else (
        set "NEW_PATH=!USER_PATH!;%INSTALL_DIR%"
    )
    
    reg add "HKCU\\Environment" /v PATH /t REG_EXPAND_SZ /d "!NEW_PATH!" /f >nul 2>&1
    if errorlevel 1 (
        echo %WARNING_PREFIX% Failed to update PATH automatically. 
        echo %WARNING_PREFIX% Please add '%INSTALL_DIR%' to your PATH manually:
        echo %WARNING_PREFIX% 1. Open System Properties ^> Environment Variables
        echo %WARNING_PREFIX% 2. Add '%INSTALL_DIR%' to your user PATH variable
    ) else (
        echo %SUCCESS_PREFIX% Added '%INSTALL_DIR%' to your PATH.
        echo %WARNING_PREFIX% Please restart your Command Prompt for PATH changes to take effect.
    )
)

REM Verify installation
echo %INFO_PREFIX% Verifying installation...
"%BINARY_PATH%" --version >nul 2>&1
if errorlevel 1 (
    echo %WARNING_PREFIX% Installation completed but verification failed.
    echo %WARNING_PREFIX% You may need to restart your terminal.
) else (
    echo %SUCCESS_PREFIX% Installation verified successfully!
)

echo.
echo %SUCCESS_PREFIX% Andromeda has been installed successfully!
echo %INFO_PREFIX% Try running: andromeda --help
echo %INFO_PREFIX% Note: You may need to restart your terminal for PATH changes to take effect.
goto :end

:show_help
echo Andromeda Installation Script for Windows
echo.
echo Usage: install.bat [OPTIONS]
echo.
echo Options:
echo   --help, -h, /?    Show this help message
echo.
echo This script will download the Andromeda binary from the GitHub release
echo and install it to %%USERPROFILE%%\\.local\\bin
echo.
echo The script will automatically add the install directory to your PATH.
goto :end

:error_exit
echo %ERROR_PREFIX% Installation failed!
exit /b 1

:end
pause
`;

  return new Response(installScript, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": "attachment; filename=install.bat",
      "Cache-Control": "public, max-age=3600", // Cache for 1 hour
    },
  });
}
