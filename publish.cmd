git add .
git commit -m "commit via publish.cmd - clean working dir"

call npm version patch -git-tag-version true
call npm run build

git push -u --all

cd dist
call npm publish
cd ..
