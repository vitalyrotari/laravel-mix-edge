const fs = require('fs');
const glob = require('glob');
const yaml = require('js-yaml');
const foldero = require('foldero');

const YAML_RE = /^.ya?ml$/;

class EdgeSeeder {
  constructor(path) {
    this.path = path;
    this.files = path ? glob.sync(path + '/**/*.+(json|yaml|yml)') : [];
    this.locals = {
      seed: path ? this.parse(path) : null,
    };
  }

  /**
   * Parses all json|yaml files in the seed folder
   * and assigns them to locals object.
   *
   * @param {string} seedPath Path to directory with seed files
   */
  parse(seedPath) {
    if (!fs.existsSync(seedPath)) {
      return;
    }

    return foldero(seedPath, {
      recurse: true,
      whitelist: '(.*/)*.+\.(json|ya?ml)$',
      loader: this.parseFile,
    });
  }

  /**
   * Parses a single seed file and
   * returns a representative object.
   *
   * @param {string} file path to seed file for parsing
   */
  parseFile(file) {
    let json = {};

    try {
      let fileContent = fs.readFileSync(file, 'utf8');

      if (path.extname(file).match(YAML_RE)) {
        json = yaml.safeLoad(fileContent);
      } else {
        json = JSON.parse(fileContent);
      }
    } catch (e) {
      console.log(`Error Parsing DATA file: ${file}\n`);
      console.log('==== Details Below ====' + `\n${e.message}`);

      if (Mix.isUsing('notifications')) {
        notifier.notify({
          title: 'Laravel Mix',
          subtitle: 'Edge Compilation Failed',
          message: e.message,
          contentImage: 'node_modules/laravel-mix-edge/logo.png'
        });
      }
    }

    return json;
  }

  /**
   * Extends locals object with passed in object
   *
   * @param {object} data
   */
  extend(data) {
    this.locals = Object.assign(this.locals, data);
    return this;
  }
}

module.exports = EdgeSeeder;
