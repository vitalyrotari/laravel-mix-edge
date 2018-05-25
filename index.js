const mix = require('laravel-mix');
const config = require('./config');
const Edge = require('./src/Edge');

let name = 'edge';

Config.merge({
  [name]: config,
});

mix.extend(name, new Edge());
