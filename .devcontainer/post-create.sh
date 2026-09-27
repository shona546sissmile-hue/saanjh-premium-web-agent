#!/usr/bin/env bash
# Provisions the toolchain for a fresh Codespace / devcontainer.
set -euo pipefail

KTX_VERSION="4.4.2"
KTX_DEB="KTX-Software-${KTX_VERSION}-Linux-x86_64.deb"
KTX_SHA256="ca635ed489d8bf54fac8d7687056c651193de0740830a7738cc034adc63e3027"

# KTX-Software provides the `ktx` encoder used for KTX2 texture compression
# (pnpm optimize:3d). It is a native binary and not available from npm.
if ! command -v ktx >/dev/null 2>&1; then
  tmp="$(mktemp -d)"
  curl -fsSL -o "${tmp}/${KTX_DEB}" \
    "https://github.com/KhronosGroup/KTX-Software/releases/download/v${KTX_VERSION}/${KTX_DEB}"
  echo "${KTX_SHA256}  ${tmp}/${KTX_DEB}" | sha256sum -c -
  sudo apt-get update
  sudo apt-get install -y "${tmp}/${KTX_DEB}"
  rm -rf "${tmp}"
fi

pnpm install --frozen-lockfile
pnpm exec playwright install --with-deps chromium
