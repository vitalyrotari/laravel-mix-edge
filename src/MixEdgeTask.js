const FileCollection = require('laravel-mix/src/FileCollection');
const File = require('laravel-mix/src/File');
const Task = require('laravel-mix/src/tasks/Task');
const EdgeSeeder = require('./EdgeSeeder');

const notifier = require('node-notifier');
const glob = require('glob');
const path = require('path');
const edge = require('edge.js');
const fs = require('fs');

class MixEdgeTask extends Task {
  /**
   * Run the edge compiler.
   */
  run() {
    let {
      files,
      dest,
      options,
    } = this.data;

    options = Object.assign({}, {
      seeds: null,
      locals: {},
      outputExtension: '.html',
      excludePath: null,
    }, options || {});

    // Set destination folder
    this.dest = dest;

    // Setup template seeder
    this.seedPath = options.seeds;
    this.locals = options.locals || {};
    this.extension = options.outputExtension || '.html';
    this.excludePath = options.excludePath || null;

    this.seeder = this.createSeeder();

    // Prepare Template Files
    this.templates = files;

    // We'll be watching for changes on all pug files
    // in case a layout, mixin or partial changes and
    // all seed files included.
    this.files = new FileCollection(
      glob.sync('**/*.edge', {ignore: 'node_modules/**/*'}).concat(this.seeder.files)
    );

    // Preprare destination assets
    this.assets = files.map(asset => this.prepareAssets(asset));
    this.compile();
  }

  /**
   * Compiles a collection of Pug templates.
   *
   */
  compile() {
    this.templates.forEach((template, index) =>
      this.compileTemplate(template, index)
    );
    return this;
  }

  /**
   * Compiles a single edge template
   *
   * @param {string} src Path to the edge source file
   * @param {number} index
   */
  compileTemplate(src, index) {
    let file = new File(src);
    let output = this.assets[index];

    try {
      let template = edge.share(this.seeder.locals.seed);
      let html = template.render(file.nameWithoutExtension(), this.seeder.local);

      fs.writeFileSync(output.path(), html);
      this.onSuccess();
    } catch (e) {
      this.onFail(e.name + ': ' + e.message);
    }
  }

  /**
   * Updates seeder with changed data files
   *
   */
  createSeeder() {
    const seeder = new EdgeSeeder(this.seedPath);
    return seeder.extend(this.locals);
  }

  /**
   * Recompile on change when using watch
   *
   * @param {string} updatedFile
   */
  onChange(updatedFile) {
    this.seeder = this.createSeeder();
    this.compile();
  }

  /**
   * Handle successful compilation.
   */
  onSuccess() {
    if (!Config.notifications.onSuccess) {
      return;
    }

    notifier.notify({
      title: 'Laravel Mix',
      message: 'Edge Compilation Successful',
      contentImage: 'node_modules/laravel-mix-edge/src/logo.png'
    });
  }

  /**
   * Handle failed compilation.
   *
   * @param {string} message
   */
  onFail(message) {
    console.log("\n");
    console.log('Edge Compilation Failed!');
    console.log();
    console.log(message);

    if (!Mix.isUsing('notifications')) {
      return;
    }

    notifier.notify({
      title: 'Laravel Mix',
      subtitle: 'Edge Compilation Failed',
      message: message,
      contentImage: 'node_modules/laravel-mix-edge/src/logo.png'
    });
  }

  prepareAssets(src) {
    let file = new File(src);
    let baseDir = Config.publicPath || this.dest;

    if (!File.exists(baseDir)) {
      new File(baseDir).makeDirectories();
    }

    let output = path.join(baseDir, file.nameWithoutExtension() + this.extension);
    let asset = new File(output);

    Mix.addAsset(asset);

    return asset;
  }
}

module.exports = MixEdgeTask;
