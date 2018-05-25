const edge = require('edge.js');
const path = require('path');
const glob = require('glob');
const EdgeTask = require('./EdgeTask');

class Edge {
  name() {
    return ['edge'];
  }

  dependencies() {
    return ['edge.js'];
  }

  /**
   * @param {String} sourcePath
   * @param {String} [outputPath]
   * @param {Object} [loaderOptions]
   * @param {Object} [pluginOptions]
   */
  register(sourcePath, outputPath, loaderOptions, pluginOptions) {
    outputPath = path.join(Config.publicPath, typeof outputPath === 'undefined' ? '' : outputPath);

    loaderOptions = Object.assign({}, Config.edge.loaderOptions, loaderOptions || {});
    pluginOptions = Object.assign({}, Config.edge.pluginOptions, pluginOptions || {});
    
    this.files = glob.sync(path.join(sourcePath, '*' + loaderOptions.sourceExtension));
    this.config = {
      path: path.resolve(Mix.paths.rootPath, sourcePath),
      loaderOptions: Object.assign({}, loaderOptions, { outputPath }),
      pluginOptions,
    };

    edge.configure(pluginOptions.edge);
    edge.registerViews(this.config.path);

    if (loaderOptions.presenters) {
      edge.registerPresenters(path.join(Mix.paths.rootPath, loaderOptions.presenters));
    }

    if (pluginOptions.global) {
      Object
        .keys(pluginOptions.global)
        .forEach(name => edge.global(name, pluginOptions.global[name]));
    }

    Mix.addTask(
      new EdgeTask({
        files: this.files,
        config: this.config,
      })
    );
  }
}

module.exports = Edge;
