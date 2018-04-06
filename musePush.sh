#!/bin/bash

cd "${0%/*}"

cd common/src/muse

git add -A
git commit -m "$1"
git push

cd ../../../

git add -A
git commit -m "$1"
git push
