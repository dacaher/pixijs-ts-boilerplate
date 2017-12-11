# pixijs-ts-boilerplate

Just another PixiJS Typescript Boilerplate

## Getting Started

Another boilerplate to speed up project setup for developing typescript apps with PixiJS.
Ready to compile code in dev and production mode. 
Provides a helper App class to manage resizing and alignment of the canvas view.

Versions:
- PixiJS 4.5.6
- Typescript 2.6.1
- Webpack 3.8.1

### Prerequisites

Install Node & NPM from [here](https://www.npmjs.com/get-npm) or using [NVM](https://github.com/creationix/nvm)

### Installing

- Export the project with svn

```
svn export https://github.com/dacaher/pixijs-ts-boilerplate/trunk/
```

or Download it as [ZIP](https://github.com/dacaher/pixijs-ts-boilerplate/archive/master.zip)

- Edit package.json to change project details.

- Install NPM dependencies by running

```
npm install
```
 
## Initial Steps

- Test it by running and browsing to [localhost:9000](http://localhost:9000/) 
```
npm run build && npm run serve
```
You should see a rotating explorer and a square in the middle of the screen.

- Remove src/test-app.ts and assets/gfx/explorer.png
- Edit src/index.html, src/index.ts and assets/css/styles.css as desired. Index.ts is the entry point to bundle the application
- Instantiate App with optional parameters (including alignment and resize strategy) and a parent container if required
- Optionally add/remove custom linter rules from tslint.json 

Note that pixi.js is kept as a external dependency and it is not bundled within the application.

## NPM scripts

- clean - [removes](https://github.com/isaacs/rimraf) dev and dist dir
- build - compiles and copy all the assets to dev dir
- build:release - compiles and [uglifies](https://github.com/webpack-contrib/uglifyjs-webpack-plugin) to dist dir
- serve - serves (0.0.0.0:9000) dev dir with Hot Module Replacement enabled through [webpack-dev-server](https://github.com/webpack/webpack-dev-server)
- serve:dash - same as serve with a fancy interface thanks to [webpack-dashboard](https://github.com/FormidableLabs/webpack-dashboard)
- serve:release - serves (0.0.0.0:9999) dist dir through [http-server](https://github.com/indexzero/http-server) to test production bundle
- test: does nothing yet

## TODO List

- [ ] Add some ts testing lib/framework
- [ ] Replace npm with yarn?
- [ ] Bundle (s)css styles within the app?
- [ ] Avoid using 2 http servers to serve dev & dist

## Contributing

As a fairly new developer with Typescript (and javascript ecosystems in general) any suggestion, bug report or improvement submitted would be very much appreciated.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/dacaher/pixijs-ts-boilerplate/tags). 

## Authors

* **David Cañizares** - *Initial work* - [dacaher](https://github.com/dacaher)

See also the list of [contributors](https://github.com/dacaher/pixijs-ts-boilerplate/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.