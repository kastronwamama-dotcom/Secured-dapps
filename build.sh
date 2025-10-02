#!/usr/bin/env bash
set -o errexit

# Install dependencies
pip install --upgrade pip
pip install -e .

# Run any other build commands if needed
echo "Build completed successfully"