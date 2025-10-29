#!/bin/bash
grep -rl '../../' frontend/src/ | while read file; do
  sed -i 's|../../|../|g' "$file"
done
