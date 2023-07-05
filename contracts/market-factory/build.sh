#!/bin/bash
RUSTFLAGS='-C link-arg=-s' cargo build --target wasm32-unknown-unknown --release
wasm-opt -Oz --signext-lowering ./target/wasm32-unknown-unknown/release/market_factory.wasm -o ./target/wasm32-unknown-unknown/release/market_factory.wasm
cp ./target/wasm32-unknown-unknown/release/market_factory.wasm res/
