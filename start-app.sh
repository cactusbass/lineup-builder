#!/bin/bash
cd /Users/chadkimner/t and colineup-builder
echo "Starting Lineup Builder from: $(pwd)"
echo "Package name: $(cat package.json | grep '"name"' | cut -d'"' -f4)"
npm run dev -- --port 4000
