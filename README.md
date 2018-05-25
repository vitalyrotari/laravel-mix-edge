# laravel-mix-edge
Laravel Mix Plugin for compiling [Edge](https://edge.adonisjs.com/) templates.

<p align="center">
<a href="https://www.npmjs.com/package/laravel-mix-edge"><img src="https://img.shields.io/npm/v/laravel-mix-edge.svg" alt="NPM"></a>
<a href="https://www.npmjs.com/package/laravel-mix-edge"><img src="https://img.shields.io/npm/dt/laravel-mix-edge.svg" alt="NPM"></a>
<a href="https://www.npmjs.com/package/laravel-mix-edge"><img src="https://img.shields.io/npm/l/laravel-mix-edge.svg" alt="NPM"></a>
</p>

## Introduction

This package provides a plugin for Laravel Mix to compile [Edge](https://edge.adonisjs.com/) templates. `laravel-mix-edge` requires Laravel Mix to work. Please follow the instructions on how to use it on the package [repository](https://github.com/JeffreyWay/laravel-mix).

## Usage

Install this package into your project:

```
npm install laravel-mix-edge --save-dev
```
Head over to your `webpack.mix.js` and register it on the Laravel Mix API:

```js
let mix = require('laravel-mix');
mix.edge = require('laravel-mix-edge');

mix.js('src/app.js', 'dist')
   .sass('src/app.scss', 'dist')
   .edge('src/views', 'dist')
   .setPublicPath('dist');
```

## Options
You can also pass in a third optional parameter: *options* object. It accepts two options:

### seeds
This is a path to a folder with seed files. Files can be of type `json` or `yaml`. They will be parsed and provided in your Edge template locals under the seed file name and then contents.

```js
mix.edge('src/views', 'dist', {
  seeds:'src/seeds'
});
```

And if you have a file `demo.yml` in there all the content will be available in your template under

```blade
<a href="{{ demo.anchor.link }}">
    {{ demo.anchor.name }}
</a>
```

### locals
It's possible to pass in an object which will be added to locals in your Edge templates:

```js
mix.edge('src/view', 'dist', {
  excludePath: 'src/views',
  locals: {
    config: { baseUrl: 'http://my-template.dev/' }
  }
});
```

and in your edge file:

```blade
<link rel="stylesheet" href="{{ config.baseUrl }}css/main.css">
<script src="{{ config.baseUrl }}js/main.js"></script>
```

### outputExtension
It is possible to change to output file extension.

```js
mix.edge('src/views', 'dist', {
  outputExtension: '.blade.php',
});
````

### global
Globals are key/value pairs available to all of your templates. Edge ships with a bunch of commonly used globals. Also, you can add your own globals to the edge instance.
[More info](https://edge.adonisjs.com/docs/globals)

```js
mix.edge('src/views', 'dist', {
  global: {
    'json': data => JSON.stringify(data),
  }
});
````

### presenters
View Presenter is a way to encapsulate complex logic inside a dedicated class, instead of writing it inside your template files. Also, it is very important to understand the philosophy behind a Presenter before you can really empower it.
[More info](https://edge.adonisjs.com/docs/presenters)

```js
let path = require('path');

mix.edge('src/views', 'dist', {
  presenters: path.join(__dirname, 'src/presenters')
});
````

## License

Laravel Mix Edge is open-sourced software licensed under the [MIT license](http://opensource.org/licenses/MIT).