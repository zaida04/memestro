#!/bin/bash

# Check if the command argument is provided
if [ -z "$1" ]; then
    echo "Usage: $0 <command>"
    exit 1
fi

# Array of directories
dirs=("dir1" "dir2" "dir3")

# Loop through directories and run the specified command
for dir in "${dirs[@]}"; do
    cd "$dir" || exit 1    # Change to the directory
    eval "$1"              # Run the specified command
    cd -                   # Change back to the previous directory
done
