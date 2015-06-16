#!/usr/bin/zsh

./bin/build-assets.zsh

posts=($HOME/Dropbox/Articles/*.md)
echo "compiling blog"
node ./bin/build-posts $posts
node ./bin/build-index $posts
