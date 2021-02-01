<p align="center">
  <p align="center">
    <img src="https://avatars3.githubusercontent.com/u/53176002?s=200&v=4" height="100" alt="Blockcore" />
  </p>
  <h3 align="center">
    About Blockcore Explorer
  </h3>
  <p align="center">
    Cross-Chain Multi-Chain Block Explorer
  </p>
  <p align="center">
      <a href="https://github.com/block-core/blockcore-explorer/actions"><img src="https://github.com/block-core/blockcore-explorer/workflows/Build%20and%20Release%20Binaries/badge.svg" /></a>
      <a href="https://github.com/block-core/blockcore-explorer/actions"><img src="https://github.com/block-core/blockcore-explorer/workflows/Build%20and%20Release%20Docker%20Image/badge.svg" /></a>
  </p>
  <p align="center"><em>"This explorer is ... amazing man. So fast (by far the fastest for me) and complete" - buta</em></p>
</p>

# Blockcore Explorer

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