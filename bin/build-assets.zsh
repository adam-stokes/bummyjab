#!/usr/bin/zsh

lessItems=(src/styles/*.less)
cssItems=(bower_components/bootstrap/*/*/bootstrap.min.css bower_components/bootstrap/*/*/bootstrap-theme.min.css src/styles/main.css)
jsItems=(bower_components/jquery/*/jquery.min.js bower_components/bootstrap/*/*/bootstrap.min.js)

echo "Cleaning"
rm -rf build

echo "Creating build dirs"
mkdir -p build/{styles,js,fonts,images}

echo "Compiling css"
./node_modules/less/bin/lessc $lessItems --clean-css src/styles/main.css
cat $cssItems > build/styles/main.min.css

echo "Copying static"
rsync -az src/fonts/* build/fonts/. &
rsync -az src/images/* build/images/. &

echo "Writing javascript files..."
cat $jsItems > build/js/main.min.js

echo "compiling blog"
node index.js
