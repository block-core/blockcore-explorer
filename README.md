# Blockcore Explorer | Cross-Chain Multi-Chain Block Explorer

[1]: https://github.com/block-core/blockcore-explorer/actions
[2]: https://github.com/block-core/blockcore-explorer/workflows/Build%20and%20Release%20Binaries/badge.svg
[3]: https://github.com/block-core/blockcore-explorer/workflows/Build%20and%20Release%20Docker%20Image/badge.svg

[![Build Status][2]][1] [![Release Status][3]][1]

## Introduction

The Blockcore Explorer is a cross-chain block explorer that can also run in a multi-chain mode. Individual chains that builds on Blockcore, can run this explorer for their own chain, without the multi-chain capability.

## Screenshots

Home screen:

![Home screen](/doc/blockcore-home-screenshot.png?raw=true "Blockcore Explorer Home screenshot")

Explorer screen:

![Alt text](doc/blockcore-explorer-screenshot.png?raw=true "Blockcore Explorer screenshot")

## Technologies

This block explorer support multiple blockchains in the same running instance, or can be run with only a single blockchain. It is built on Angular and runs an Single Page Application.

## Legacy Explorer

Our previous Block Explorer was built on ASP.NET Razor technology and the repo has been moved
to [blockcore-explorer-legacy](https://github.com/block-core/blockcore-explorer-legacy) repository.

If you want to use and deploy the legacy explorer, make sure you run version 0.0.X of the docker images.

From version 0.1.X, the docker images will be our new explorer.