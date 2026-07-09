#!/usr/bin/env bash
set -e
corepack enable
pnpm install
echo "Generated pnpm-lock.yaml"
