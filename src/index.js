const Verify = require('laravel-mix/src/Verify');
const edge = require('edge.js');
const path = require('path');
const glob = require('glob');

function main(src, dest, options, edgeOptions) {
  Verify.dependency('edge.js', ['edge.js'], true);

  let files = glob.sync(path.join(src, '*.edge'));
  let MixEdgeTask = require('./MixEdgeTask');

  edge.configure(edgeOptions);
  edge.registerViews(src);

  if (options && options.presenters) {
    edge.registerPresenters(options.presenters);
  }

  if (options.global) {
    Object.keys(options.global).forEach(name =>
      edge.global(name, options.global[name])
    );
  }

  Mix.addTask(
    new MixEdgeTask({ files, dest, options })
  );

  return this;
}

main.global = edge.global;

module.exports = main;
