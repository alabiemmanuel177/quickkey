#!/bin/bash

# Create directories for sounds if they don't exist
mkdir -p public/sounds/keypress
mkdir -p public/sounds/error

# Base URL for MonkeyType sound repository
BASE_URL="https://raw.githubusercontent.com/monkeytypegame/monkeytype/master/frontend/static/sound"

echo "Downloading keypress sounds..."

# Click sound
echo "Downloading click.mp3..."
curl -L -o "public/sounds/keypress/click.mp3" "$BASE_URL/click1/click1_1.wav" || 
echo "Error downloading click.mp3 - please manually download this file"

# Beep sound
echo "Downloading beep.mp3..."
curl -L -o "public/sounds/keypress/beep.mp3" "$BASE_URL/click2/click2_1.wav" || 
echo "Error downloading beep.mp3 - please manually download this file"

# Pop sound
echo "Downloading pop.mp3..."
curl -L -o "public/sounds/keypress/pop.mp3" "$BASE_URL/click3/click3_1.wav" || 
echo "Error downloading pop.mp3 - please manually download this file"

# NK Creams sound
echo "Downloading nk-creams.mp3..."
curl -L -o "public/sounds/keypress/nk-creams.mp3" "$BASE_URL/click4/click4_1.wav" || 
echo "Error downloading nk-creams.mp3 - please manually download this file"

# Typewriter sound
echo "Downloading typewriter.mp3..."
curl -L -o "public/sounds/keypress/typewriter.mp3" "$BASE_URL/click5/click5_1.wav" || 
echo "Error downloading typewriter.mp3 - please manually download this file"

# Osu sound
echo "Downloading osu.mp3..."
curl -L -o "public/sounds/keypress/osu.mp3" "$BASE_URL/click6/click6_1.wav" || 
echo "Error downloading osu.mp3 - please manually download this file"

# Hitmaker sound
echo "Downloading hitmaker.mp3..."
curl -L -o "public/sounds/keypress/hitmaker.mp3" "$BASE_URL/click7/click7_1.wav" || 
echo "Error downloading hitmaker.mp3 - please manually download this file"

# Pentatonic sound
echo "Downloading pentatonic.mp3..."
curl -L -o "public/sounds/keypress/pentatonic.mp3" "$BASE_URL/click15/click15_1.wav" || 
echo "Error downloading pentatonic.mp3 - please manually download this file"

echo "Downloading error sounds..."

# Damage sound
echo "Downloading damage.mp3..."
curl -L -o "public/sounds/error/damage.mp3" "$BASE_URL/error1/error1_1.wav" || 
echo "Error downloading damage.mp3 - please manually download this file"

# Triangle sound
echo "Downloading triangle.mp3..."
curl -L -o "public/sounds/error/triangle.mp3" "$BASE_URL/error2/error2_1.wav" || 
echo "Error downloading triangle.mp3 - please manually download this file"

# Square sound
echo "Downloading square.mp3..."
curl -L -o "public/sounds/error/square.mp3" "$BASE_URL/error3/error3_1.wav" || 
echo "Error downloading square.mp3 - please manually download this file"

# Missed punch sound
echo "Downloading missed-punch.mp3..."
curl -L -o "public/sounds/error/missed-punch.mp3" "$BASE_URL/error4/error4_1.wav" || 
echo "Error downloading missed-punch.mp3 - please manually download this file"

# Convert WAV files to MP3 (optional, requires ffmpeg)
if command -v ffmpeg &> /dev/null; then
  echo "Converting WAV files to MP3 for better compatibility..."
  
  for file in public/sounds/keypress/*.mp3 public/sounds/error/*.mp3; do
    # Only convert if the file exists and is a WAV file saved as MP3
    if [ -f "$file" ]; then
      temp_file="${file%.mp3}.temp.mp3"
      ffmpeg -i "$file" -codec:a libmp3lame -qscale:a 2 "$temp_file" -y &>/dev/null
      mv "$temp_file" "$file"
    fi
  done
else
  echo "Note: ffmpeg not found. WAV files will be used as is."
fi

echo "Sound download complete!"
echo "Note: These sounds are sourced from the monkeytype GitHub repository."
echo "You can find the original files at: https://github.com/monkeytypegame/monkeytype/tree/master/frontend/static/sound" 