#!/bin/bash

# Create directory for themes if it doesn't exist
mkdir -p public/themes

# Base URL for Monkeytype themes repository
BASE_URL="https://raw.githubusercontent.com/monkeytypegame/monkeytype/master/frontend/static/themes"

# List of theme files to download
THEMES=(
  "8008"
  "aurora"
  "ayu"
  "beach"
  "bingsu"
  "blueberry"
  "botanical"
  "carbon"
  "catppuccin"
  "cornfields"
  "darling"
  "dev"
  "dino"
  "dots"
  "dracula"
  "earthsong"
  "everforest"
  "fashion"
  "gruvbox"
  "hanok"
  "horizon"
  "iceberg"
  "levy"
  "lil_dragon"
  "lofi"
  "magic_girl"
  "mashu"
  "material"
  "matrix"
  "mizu"
  "moonlight"
  "mountain"
  "mr_sleeves"
  "nebula"
  "night_runner"
  "nord"
  "olive"
  "olivia"
  "onedark"
  "paper"
  "pink_lemonade"
  "pulse"
  "red_dragon"
  "red_samurai"
  "rose_pine"
  "rudy"
  "serika"
  "serika_dark"
  "shoko"
  "slow_dance"
  "stealth"
  "strawberry"
  "superuser"
  "swallowtail"
  "taro"
  "terminal"
  "terra"
  "tiffy"
  "tokyo_night"
  "vaporwave"
  "voc"
  "vscode"
)

echo "Downloading Monkeytype themes..."

for theme in "${THEMES[@]}"; do
  echo "Downloading $theme theme..."
  curl -L -o "public/themes/$theme.css" "$BASE_URL/$theme.css" || echo "Error downloading $theme.css"
done

# Create a theme manifest file
echo "Creating theme manifest file..."
cat > public/themes/theme-manifest.json << EOL
{
  "themes": [
EOL

# Add each theme to the manifest file
for i in "${!THEMES[@]}"; do
  theme="${THEMES[$i]}"
  name=$(echo "$theme" | sed 's/_/ /g' | sed 's/\b\(.\)/\u\1/g')
  
  comma=","
  if [ $i -eq $(( ${#THEMES[@]} - 1 )) ]; then
    comma=""
  fi
  
  # Add theme to manifest
  echo "    {\"id\": \"$theme\", \"name\": \"$name\", \"path\": \"/themes/$theme.css\"}$comma" >> public/themes/theme-manifest.json
done

# Close the JSON file
cat >> public/themes/theme-manifest.json << EOL
  ]
}
EOL

echo "Theme download complete! Downloaded ${#THEMES[@]} themes to public/themes/"
echo "Theme manifest created at public/themes/theme-manifest.json" 