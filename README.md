# Silhouettes
[Live Demo](https://silhouettes.now.sh/)

[![Product Name Screen Shot][preview-screenshot]](https://silhouettes.now.sh/)

Silhouettes is a prototype for animating point system morphing smoothly. It is being rendered using WebGL and uses GSAP for animations, this is the result after playing around with three.js over a few weeks. The scene will cycle through some selected geometry shapes and a few custom geometries at the end, you can also upload a simple `.obj` for the system to morph into.

### Built With
* WebGL (three.js)
* Typescript
* GSAP
* Webpack



<!-- GETTING STARTED -->
## Running it

Running this project is very simple, it only requires npm.

1. Install dependencies
```sh
npm i
```
2. Run the project
```sh
npm start
```
Your browser should be automatically opened with the project running.

## Usage

Point system will automatically shuffle between shapes, to load your custom model click on the button on the bottom right corner and upload your `.obj` file.
You can also move around the scene freely using default mouse controls like dragging, right-click dragging, mouse wheel dragging, etc.

## Acknowledgements
* [ThreeTS Template](https://github.com/marquizzo/three.ts-template)
* [Three Webpack Plugin](https://github.com/wildpeaks/package-three-webpack-plugin)

Inspiration taken from [Aidentity's website](https://www.aidentity.sg/).\
Example objects taken from [Jarlan Perez](https://poly.google.com/user/4lZfAdz3x3X).

[preview-screenshot]: web/images/example.png