#!/usr/bin/env bash
set -eux;

# Make JS compatible with Clouflare
# sed -i.bak 's|scriptDirectory\\s?=\\s?self.location.href|scriptDirectory="/"|' php-worker.mjs;
# sed -i.bak2 's|var wasmMemory;|var wasmMemory, wasmExports = {};|' php-worker.mjs;
# rm php-worker.mjs.bak2;
# sed -i.bak2 's|var wasmExports = createWasm();|Object.assign(wasmExports, createWasm());|' php-worker.mjs;
# rm php-worker.mjs.bak2;

# Compress WASM
rm -f php-worker.mjs.wasm.gz php-worker.mjs.wasm.br;
gzip -9 < php-worker.mjs.wasm > php-worker.mjs.wasm.gz;
brotli -9 php-worker.mjs.wasm;
