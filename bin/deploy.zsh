#!/usr/bin/zsh

NODE_ENV=production ./bin/build-site.zsh

rsync -avz --delete -e ssh build/* root@ssh.astokes.org:/srv/blog/.
