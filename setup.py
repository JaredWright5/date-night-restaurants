#!/usr/bin/env python3
"""
Setup script for LA Date Night Restaurant Scraper
"""

import subprocess
import sys
import os

def install_requirements():
    """Install required packages"""
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ All packages installed successfully!")
    except subprocess.CalledProcessError as e:
        print(f"❌ Error installing packages: {e}")
        return False
    return True

def setup_env_file():
    """Create .env file from example"""
    if not os.path.exists('.env'):
        if os.path.exists('env_example.txt'):
            with open('env_example.txt', 'r') as f:
                content = f.read()
            with open('.env', 'w') as f:
                f.write(content)
            print("✅ Created .env file from example")
            print("⚠️  Please edit .env file and add your Google Places API key")
        else:
            print("❌ env_example.txt not found")
            return False
    else:
        print("✅ .env file already exists")
    return True

def main():
    """Main setup function"""
    print("🚀 Setting up LA Date Night Restaurant Scraper...")
    
    # Install requirements
    if not install_requirements():
        return
    
    # Setup environment file
    if not setup_env_file():
        return
    
    print("\n🎉 Setup complete!")
    print("\nNext steps:")
    print("1. Get a Google Places API key from: https://console.cloud.google.com/")
    print("2. Edit the .env file and add your API key")
    print("3. Run: python la_date_night_scraper.py")

if __name__ == "__main__":
    main()
