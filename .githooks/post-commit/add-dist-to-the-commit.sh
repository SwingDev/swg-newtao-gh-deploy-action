#!/bin/sh

echo
if [ -e .commit ]
    then
    rm .commit
    git add dist/index.js
    git commit --amend -C HEAD --no-verify
fi
exit
