"use strict";

const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');
const recursive = require('recursive-readdir');

const ROOT_DIR = process.cwd();


class FileExtRenamer {
  constructor (fromExt, toExt) {
    console.log('starting...', fromExt, toExt);
    console.log('looking in ', ROOT_DIR);
    this.fromExt = fromExt;
    this.toExt = toExt;
    this.getArgs();
    this.processFiles();
  }

  getArgs () {
    //The first 2 objects in the array are the env, and script...we don't need those
    let args = process.argv.splice(2);

    //major, minor, buildNumber
    args.forEach((obj) => {
      let keyVal = obj.split('=');
      let key = keyVal[0].replace('--', '');
      let val = keyVal[1];
      this[key] = val;
    });

    if (this.src) {
      console.log(chalk.magenta('setting source directory to', this.src));
    } else {
      this.src = 'src';
      console.log(chalk.red('no ARGs setting source directory to', this.src));
    }

  }

  processFiles () {

    recursive(ROOT_DIR + '/' + this.src, (err, files) => {
      if (err) {
        console.log(chalk.red('File read error'));
        return;
      }

      console.log(chalk.green('Found: '), files);

      files.forEach((file) => {
        let regexStr = '\.'+this.fromExt+'$';
        let regexPattern = new RegExp(regexStr);
        let newName = file.replace(regexPattern, '.'+this.toExt);
        console.log('renameing', file, 'to', newName);
        fs.move(file, newName, (err) => {
          console.log(chalk.green(file, 'renamed to ', newName));
        })
      });

    });


  }
}

new FileExtRenamer('js', 'ts');