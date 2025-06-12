// deno-lint-ignore require-await
export async function handler(): Promise<Response> {
  const latestVersionScript = `# Andromeda Installation Script for Windows
# This script downloads and installs Andromeda on Windows systems

param(
    [string]$InstallDir = "$env:USERPROFILE\\.local\\bin",
    [switch]$Help
)

# Configuration
$Repo = "tryandromeda/andromeda"
$AssetName = "andromeda-windows-amd64.exe"

# Colors for output
$Colors = @{
    Red = [System.ConsoleColor]::Red
    Green = [System.ConsoleColor]::Green
    Yellow = [System.ConsoleColor]::Yellow
    Blue = [System.ConsoleColor]::Blue
    White = [System.ConsoleColor]::White
}

function Write-ColoredOutput {
    param(
        [string]$Message,
        [System.ConsoleColor]$Color = $Colors.White,
        [string]$Prefix = ""
    )
    
    if ($Prefix) {
        Write-Host "[$Prefix] " -ForegroundColor $Color -NoNewline
    }
    Write-Host $Message -ForegroundColor $Color
}

function Write-Status {
    param([string]$Message)
    Write-ColoredOutput -Message $Message -Color $Colors.Blue -Prefix "INFO"
}

function Write-Success {
    param([string]$Message)
    Write-ColoredOutput -Message $Message -Color $Colors.Green -Prefix "SUCCESS"
}

function Write-Error {
    param([string]$Message)
    Write-ColoredOutput -Message $Message -Color $Colors.Red -Prefix "ERROR"
}

function Write-Warning {
    param([string]$Message)
    Write-ColoredOutput -Message $Message -Color $Colors.Yellow -Prefix "WARNING"
}

function Show-Help {
    Write-Host "Andromeda Installation Script for Windows" -ForegroundColor $Colors.Blue
    Write-Host ""
    Write-Host "Usage: .\\install.ps1 [OPTIONS]" -ForegroundColor $Colors.White
    Write-Host ""
    Write-Host "Options:" -ForegroundColor $Colors.White
    Write-Host "  -InstallDir <path>    Installation directory (default: %USERPROFILE%\\.local\\bin)" -ForegroundColor $Colors.White
    Write-Host "  -Help                 Show this help message" -ForegroundColor $Colors.White
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor $Colors.White
    Write-Host "  .\\install.ps1                           # Install to default location" -ForegroundColor $Colors.White
    Write-Host "  .\\install.ps1 -InstallDir 'C:\\tools'    # Install to custom location" -ForegroundColor $Colors.White
    Write-Host ""
    Write-Host "This script will download the latest Andromeda binary from GitHub" -ForegroundColor $Colors.White
    Write-Host "and install it to the specified directory." -ForegroundColor $Colors.White
}

function Test-Administrator {
    $currentPrincipal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
    return $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

function Get-LatestRelease {
    Write-Status "Getting latest release information..."
    
    $ReleaseApiUrl = "https://api.github.com/repos/$Repo/releases/latest"
    $Headers = @{
        "Accept" = "application/vnd.github.v3+json"
        "User-Agent" = "Andromeda-Installer/1.0"
    }
    
    try {
        $Response = Invoke-RestMethod -Uri $ReleaseApiUrl -Headers $Headers -ErrorAction Stop
        $Version = $Response.tag_name
        
        # Find the correct asset
        $Asset = $Response.assets | Where-Object { $_.name -eq $AssetName }
        if (-not $Asset) {
            Write-Error "Could not find asset '$AssetName' in the latest release."
            exit 1
        }
        
        return @{
            Version = $Version
            DownloadUrl = $Asset.browser_download_url
        }
    }
    catch {
        Write-Error "Failed to get latest release: $($_.Exception.Message)"
        Write-Warning "Falling back to direct download URL pattern..."
        
        # Fallback to direct URL with latest
        return @{
            Version = "latest"
            DownloadUrl = "https://github.com/$Repo/releases/latest/download/$AssetName"
        }
    }
}

function Install-Andromeda {
    Write-Status "Preparing to install Andromeda for Windows..."
    
    # Get latest release info
    $ReleaseInfo = Get-LatestRelease
    $Version = $ReleaseInfo.Version
    $DownloadUrl = $ReleaseInfo.DownloadUrl
    
    Write-Status "Installing Andromeda $Version for Windows..."
    Write-Status "Download URL: $DownloadUrl"
    
    try {
        # Create install directory if it doesn't exist
        if (-not (Test-Path $InstallDir)) {
            Write-Status "Creating install directory: $InstallDir"
            New-Item -ItemType Directory -Path $InstallDir -Force | Out-Null
        }
        
        # Download the binary
        $TempFile = [System.IO.Path]::GetTempFileName()
        $BinaryPath = Join-Path $InstallDir "andromeda.exe"
        
        Write-Status "Downloading Andromeda binary..."
        
        # Use Invoke-WebRequest for better compatibility and progress
        try {
            Invoke-WebRequest -Uri $DownloadUrl -OutFile $TempFile -ErrorAction Stop
        }
        catch {
            Write-Error "Failed to download Andromeda binary: $($_.Exception.Message)"
            throw
        }
        
        # Move to install directory
        Move-Item -Path $TempFile -Destination $BinaryPath -Force
        
        Write-Success "Andromeda installed to: $BinaryPath"
        
        # Check if install directory is in PATH
        $CurrentPath = [Environment]::GetEnvironmentVariable("PATH", "User")
        if ($CurrentPath -notlike "*$InstallDir*") {
            Write-Warning "Install directory '$InstallDir' is not in your PATH."
            Write-Warning "Adding it to your user PATH environment variable..."
            
            try {
                $NewPath = if ($CurrentPath) { "$CurrentPath;$InstallDir" } else { $InstallDir }
                [Environment]::SetEnvironmentVariable("PATH", $NewPath, "User")
                Write-Success "Added '$InstallDir' to your PATH."
                Write-Warning "Please restart your PowerShell/Command Prompt for PATH changes to take effect."
            }
            catch {
                Write-Warning "Failed to update PATH automatically. Please add '$InstallDir' to your PATH manually:"
                Write-Host "1. Open System Properties > Environment Variables" -ForegroundColor $Colors.Yellow
                Write-Host "2. Add '$InstallDir' to your user PATH variable" -ForegroundColor $Colors.Yellow
            }
        }
        
        # Verify installation
        Write-Status "Verifying installation..."
        try {
            $VersionOutput = & $BinaryPath --version 2>$null
            if ($LASTEXITCODE -eq 0) {
                Write-Success "Installation verified successfully!"
                Write-Status "Version: $VersionOutput"
            } else {
                Write-Warning "Installation completed but version check failed."
            }
        }
        catch {
            Write-Warning "Installation completed but verification failed."
        }
        
        Write-Host ""
        Write-Success "Andromeda has been installed successfully!"
        Write-Status "Try running: andromeda --help"
        Write-Status "Note: You may need to restart your terminal for PATH changes to take effect."
        
    }
    catch {
        Write-Error "Installation failed: $($_.Exception.Message)"
        
        # Clean up temporary file if it exists
        if (Test-Path $TempFile) {
            Remove-Item $TempFile -Force -ErrorAction SilentlyContinue
        }
        
        exit 1
    }
}

# Show help if requested
if ($Help) {
    Show-Help
    exit 0
}

# Check PowerShell execution policy
$ExecutionPolicy = Get-ExecutionPolicy
if ($ExecutionPolicy -eq "Restricted") {
    Write-Warning "PowerShell execution policy is set to 'Restricted'."
    Write-Warning "You may need to run: Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser"
    Write-Warning "Or run this script with: powershell -ExecutionPolicy Bypass -File install.ps1"
}

# Run installation
Install-Andromeda
`;

  return new Response(latestVersionScript, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": "attachment; filename=install.ps1",
      "Cache-Control": "public, max-age=3600", // Cache for 1 hour
    },
  });
}
