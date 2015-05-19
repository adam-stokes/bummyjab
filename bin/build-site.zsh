#!/usr/bin/zsh

./bin/build-assets.zsh

echo "compiling blog"
node index.js src/posts/*.md
node ./bin/build-posts src/posts/*.md
