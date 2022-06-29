# Webpack 5 VidaNr calculator

[![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

Webpack 5 VidaNr NacionalRe Calculator

### Installation

```sh
npm install
```

### Start Dev Server

http://localhost:8080/

```sh
npm start
```



### Build Prod Version

Building local

```sh
npm run build
```

Building NacionalRe (see package.json)

```sh
npm run build:nacionalRe
```

### Languages:Spanish and English.

Default language is Spanish.

```sh
http://localhost:8080/?lang=es
```

```sh
http://localhost:8080/?lang=en
```

On server:

```sh
https://www.botsoul.com/pruebas/nacionalRe-vidaNr/build/?lang=es
```

```sh
https://www.botsoul.com/pruebas/nacionalRe-vidaNr/build/?lang=en
```




### Features:

- ES6 Support via [babel](https://babeljs.io/) (v7)
- JavaScript Linting via [eslint](https://eslint.org/)
- SASS Support via [sass-loader](https://github.com/jtangelder/sass-loader)
- Autoprefixing of browserspecific CSS rules via [postcss](https://postcss.org/) and [postcss-preset-env](https://github.com/csstools/postcss-preset-env)
- Style Linting via [stylelint](https://stylelint.io/)

When you run `npm run build` we use the [mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin) to move the css to a separate file. The css file gets included in the head of the `index.html`.
