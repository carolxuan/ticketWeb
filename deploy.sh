#!/usr/bin/env sh

set -e

npm run deploy

cd dist

git init
git add -A
git commit -m 'deploy'

git push -f https://github.com/carolxuan/ticketWeb.git master:gh-pages

cd -
