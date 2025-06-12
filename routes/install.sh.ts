export function handler(): Response {
  const installScript = `#!/bin/bash

# Andromeda Installation Script
# This script downloads and installs the appropriate Andromeda binary for your system

set -e

# Colors for output
RED='\\033[0;31m'
GREEN='\\033[0;32m'
YELLOW='\\033[1;33m'
BLUE='\\033[0;34m'
NC='\\033[0m' # No Color

# Configuration
REPO="tryandromeda/andromeda"
INSTALL_DIR="$HOME/.local/bin"

# Function to get latest release version from GitHub API
get_latest_version() {
    local api_url="https://api.github.com/repos/$REPO/releases/latest"
    local version
    
    print_status "Fetching latest release information..."
    
    if command_exists curl; then
        version=$(curl -s "$api_url" | grep '"tag_name":' | sed -E 's/.*"([^"]+)".*/\\1/')
    elif command_exists wget; then
        version=$(wget -qO- "$api_url" | grep '"tag_name":' | sed -E 's/.*"([^"]+)".*/\\1/')
    else
        print_error "Neither curl nor wget is available. Cannot fetch latest version."
        exit 1
    fi
    
    if [ -z "$version" ]; then
        print_error "Failed to fetch latest version from GitHub API"
        exit 1
    fi
    
    echo "$version"
}

# Function to print colored output
print_status() {
    echo -e "\${BLUE}[INFO]\${NC} $1"
}

print_success() {
    echo -e "\${GREEN}[SUCCESS]\${NC} $1"
}

print_error() {
    echo -e "\${RED}[ERROR]\${NC} $1"
}

print_warning() {
    echo -e "\${YELLOW}[WARNING]\${NC} $1"
}

# Function to detect OS and architecture
detect_platform() {
    local os
    local arch
    local asset_name

    # Detect OS
    case "$(uname -s)" in
        Linux*)     os="linux" ;;
        Darwin*)    os="macos" ;;
        CYGWIN*|MINGW*|MSYS*) os="windows" ;;
        *)          print_error "Unsupported operating system: $(uname -s)"; exit 1 ;;
    esac

    # Detect architecture
    case "$(uname -m)" in
        x86_64|amd64)   arch="amd64" ;;
        arm64|aarch64)  
            if [ "$os" = "macos" ]; then
                arch="arm64"
            else
                print_error "ARM64 is only supported on macOS"
                exit 1
            fi
            ;;
        *)              print_error "Unsupported architecture: $(uname -m)"; exit 1 ;;
    esac

    # Construct asset name
    if [ "$os" = "windows" ]; then
        asset_name="andromeda-\${os}-\${arch}.exe"
    else
        asset_name="andromeda-\${os}-\${arch}"
    fi

    echo "$asset_name"
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to download file
download_file() {
    local url="$1"
    local output="$2"
    
    if command_exists curl; then
        curl -fSL "$url" -o "$output"
    elif command_exists wget; then
        wget -q "$url" -O "$output"
    else
        print_error "Neither curl nor wget is available. Please install one of them."
        exit 1
    fi
}

# Main installation function
install_andromeda() {
    # Get the latest version
    local VERSION
    VERSION=$(get_latest_version)
    
    print_status "Installing Andromeda $VERSION..."
    
    # Detect platform
    local asset_name
    asset_name=$(detect_platform)
    print_status "Detected platform: $asset_name"
    
    # Construct download URL
    local download_url="https://github.com/\${REPO}/releases/download/\${VERSION}/\${asset_name}"
    print_status "Download URL: $download_url"
    
    # Create install directory if it doesn't exist
    mkdir -p "$INSTALL_DIR"
    
    # Download the binary
    local temp_file
    temp_file=$(mktemp)
    print_status "Downloading Andromeda binary..."
    
    if ! download_file "$download_url" "$temp_file"; then
        print_error "Failed to download Andromeda binary"
        rm -f "$temp_file"
        exit 1
    fi
    
    # Move to install directory and make executable
    local binary_name="andromeda"
    if [[ "$asset_name" == *.exe ]]; then
        binary_name="andromeda.exe"
    fi
    
    local install_path="$INSTALL_DIR/$binary_name"
    mv "$temp_file" "$install_path"
    chmod +x "$install_path"
    
    print_success "Andromeda installed to: $install_path"
    
    # Check if install directory is in PATH
    if [[ ":$PATH:" != *":$INSTALL_DIR:"* ]]; then
        print_warning "Install directory '$INSTALL_DIR' is not in your PATH."
        print_warning "Add the following line to your shell profile (.bashrc, .zshrc, etc.):"
        echo -e "\${YELLOW}export PATH=\\"\\$PATH:$INSTALL_DIR\\"\${NC}"
        echo ""
        print_warning "Or run: echo 'export PATH=\\"\\$PATH:$INSTALL_DIR\\"' >> ~/.bashrc"
        print_warning "Then restart your terminal or run: source ~/.bashrc"
    fi
    
    # Verify installation
    print_status "Verifying installation..."
    if "$install_path" --version >/dev/null 2>&1; then
        print_success "Installation verified successfully!"
    else
        print_warning "Installation completed but verification failed. You may need to adjust your PATH."
    fi
    
    echo ""
    print_success "Andromeda has been installed successfully!"
    print_status "Try running: andromeda --help"
}

# Check for help flag
if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    echo "Andromeda Installation Script"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -h, --help     Show this help message"
    echo ""
    echo "Environment Variables:"
    echo "  INSTALL_DIR    Installation directory (default: \\$HOME/.local/bin)"
    echo ""
    echo "This script will automatically fetch the latest Andromeda release"
    echo "from GitHub and download the appropriate binary for your platform."
    exit 0
fi

# Run installation
install_andromeda
`;

  return new Response(installScript, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": "attachment; filename=install.sh",
      "Cache-Control": "public, max-age=3600", // Cache for 1 hour
    },
  });
}
