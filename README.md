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

## Development

Blockcore Explorer is an Angular app that is hosted by the .NET runtime with an Visual Studio C# project.

When the Angular App first runs, it will make an HTTP request to a single REST API that is hosted on the Visual Studio C# project. This REST API will return which blockchain the explorer should display.

It can either run in multi-chain mode and list all blockchains that exists in the [public JSON file](https://chains.blockcore.net/CHAINS.json).
Or it can run in one specific chain mode, e.g. "City Chain".

If you run from console/terminal using Node.js and Angular CLI, you do NOT get this functionality. You will always get multi-chain mode when running without the Visual Studio C# project.

To run the explorer in an auto-reload mode with Angular, WITHOUT needing .NET at all, you must navigate to the following folder:

"blockcore-explorer/src/Blockcore.Explorer/ClientApp"

Then run: `npm install` and `npm start`.

This will host an web server on: http://localhost:4200/

The other alternative is to open the Blockcore.Indexer.sln using Visual Studio 2022 and clicking F5 (start debugging). This will run the explorer on the following URL: http://localhost:9911/

Out of the box, the explorer will connect to locally running indexer. If you are not running your own indexer, you must do a minor configuration change so you rely on the public indexers that is hosted by the Blockcore team.

Edit this file and change the `useLocalIndexer: true` to `useLocalIndexer: false`.

[src/Blockcore.Explorer/ClientApp/src/environments/environment.ts](src/Blockcore.Explorer/ClientApp/src/environments/environment.ts)

## Legacy Explorer

Our previous Block Explorer was built on ASP.NET Razor technology and the repo has been moved
to [blockcore-explorer-legacy](https://github.com/block-core/blockcore-explorer-legacy) repository.

If you want to use and deploy the legacy explorer, make sure you run version 0.0.X of the docker images.

From version 0.1.X, the docker images will be our new explorer.