#!/bin/bash
yarn build
cd dist && zip -r Auto-post-into-group-random-1.0.1.zip . && cd ..
mv dist/Auto-post-into-group-random-1.0.1.zip ./
