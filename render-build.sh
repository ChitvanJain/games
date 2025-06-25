#!/usr/bin/env bash
set -e

cd frontend
npm install
npm run build
cd ../landing
npm install
npm run css-build
