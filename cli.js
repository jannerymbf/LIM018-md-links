#!/usr/bin/env node
const { mdLinks } = require('./index.js');
const process = require('node:process');

const path = process.argv[2];
const options = process.argv;

if(options.length == 3) {
  mdLinks(path, {validate: false})
    .then((result) => {
      console.log(result);
    })
}

if(options.length == 4 && options[3] == '--validate') {
  mdLinks(path, {validate: true})
    .then((result) => {
      console.log(result);
    })
}

if(options.length == 4 && options[3] == '--stats') {
  mdLinks(path, {stats: true})
    .then((result) => {
      console.log(result);
    })
}

if(options.length == 5 && options[3] == '--stats' && options[4] == '--validate') {
  mdLinks(path, {stats: false})
    .then((result) => {
      console.log(result);
    })
}

