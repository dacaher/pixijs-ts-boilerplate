# pixijs-ts-boilerplate

Just another PixiJS Typescript Boilerplate

## Getting Started

Another boilerplate to speed up project setup for developing typescript apps with PixiJS.
Ready to compile code for dev and production env.
Provides a helper class (PixiAppWrapper) to manage resizing (full size, keeping aspect ratio or no resize at all),
alignment of the stage within the canvas view, toggle [fullscreen](https://github.com/sindresorhus/screenfull.js/),
display some media info and a [fps-meter](https://github.com/darsain/fpsmeter).

Versions:
- [Typescript](https://www.typescriptlang.org/) 2.7.1
- [Webpack](https://webpack.js.org/) 3.10.0
- [PixiJS](http://www.pixijs.com/) 4.7.0

Note: Starting from v2 non-dev dependencies are kept inside the src/scripts/vendor folder (impl) and src/types (definitions).
This means that those deps will have to be manually managed. Some companies do not want to heavily rely on npm repos.

### Included PixiJS plugins
- pixi-layers (former [pixi-display](https://github.com/pixijs/pixi-display) : 8c14aa9a8c842c028e97e353eb5eb7d4663ebee1)
- [pixi-particles](https://github.com/pixijs/pixi-particles) 3.0.0
- [pixi-filters](https://github.com/pixijs/pixi-filters) 2.6.0
- [pixi-spine](https://github.com/pixijs/pixi-spine) (296c7039c107520e4bc0e0e4a3cc62545f970fca) ***

*** PLEASE NOTE THAT IN ORDER TO USE THE SPINE RUNTIME YOU MUST OWN A VALID [SPINE LICENSE](https://esotericsoftware.com/spine-purchase).

### Other 3rd party libs
- [fullscreen](https://github.com/sindresorhus/screenfull.js/) 3.3.2
- [fps-meter](https://github.com/darsain/fpsmeter) 0.3.1
- [eventemitter3](https://github.com/primus/eventemitter3) 3.0.1
- [gsap](https://github.com/greensock/GreenSock-JS) 1.20.4
- [howler](https://github.com/goldfire/howler.js) 2.0.9

### Prerequisites

Install Node & NPM from [here](https://www.npmjs.com/get-npm) or using [NVM](https://github.com/creationix/nvm)

### Installing

Choose one of the following options:

* Export the project with svn

```
svn export https://github.com/dacaher/pixijs-ts-boilerplate/trunk/
```

* Download it as [ZIP](https://github.com/dacaher/pixijs-ts-boilerplate/archive/master.zip)

* Clone the git repo — `git clone https://github.com/dacaher/pixijs-ts-boilerplate.git` and checkout the
[tagged release](https://github.com/dacaher/pixijs-ts-boilerplate/releases) you'd like to use.


Edit package.json to change project details.

Install NPM dependencies by running.

```
npm install
```
 
## Initial Steps

- Test it by running and browsing to [localhost:9000](http://localhost:9000/) 

```
npm run build && npm run serve
```
You should see a sample app with a fps-meter and a div containing some display info.

- See src/scripts/app for a showcase.
- Edit src/html/index.html, src/scripts/index.ts and src/styles/style.css as desired.
Index.ts is the entry point for bundling the application.
- Instantiate App with parameters width, height, align, resize and a canvas view container if desired.
- Optionally add/remove custom linter rules from tslint.json.
- Finally remove folder src/scripts/app and assets/gfx/* when not needed.

Note that pixi.js is kept as a external dependency and it is not bundled within the application.
Not really sure if I should bundle it as well.

## NPM scripts

- clean - [removes](https://github.com/isaacs/rimraf) dev, dist and doc dirs
- build - compiles and copy all the assets to dev dir
- build:release - compiles and [uglifies](https://github.com/webpack-contrib/uglifyjs-webpack-plugin) to dist dir
- rebuild:all - cleans and rebuilds dev, dist and doc. 
- serve - serves (0.0.0.0:9000) dev dir with Hot Module Replacement enabled through [webpack-dev-server](https://github.com/webpack/webpack-dev-server)
- serve:release - serves (0.0.0.0:9999) dist dir through [http-server](https://github.com/indexzero/http-server) to test production bundle
- test - does nothing right now
- doc - generate app doc with [typedoc](http://typedoc.org/)
- start - runs build & serve

## Contributing

As a fairly new developer with Typescript (and javascript ecosystems in general) any suggestion, bug report or improvement submitted would be very much appreciated.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/dacaher/pixijs-ts-boilerplate/tags). 

## Authors

* **David C.** - *Initial work* - [dacaher](https://github.com/dacaher)

See also the list of [contributors](https://github.com/dacaher/pixijs-ts-boilerplate/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.