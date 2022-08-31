#!/usr/bin/env node

const { mdLinks } = require('./index.js');
const process = require('node:process');

const path = process.argv[2];
const command = process.argv;

if(command.length == 3) {
  mdLinks(path, {validate: false})
    .then((result) => {
      console.log(result);
    })
}

if(command.length == 4 && command[3] == '--validate') {
  mdLinks(path, {validate: true})
    .then((result) => {
      console.log(result);
    })
}

if(command.length == 4 && command[3] == '--stats') {
  mdLinks(path, {stats: true})
    .then((result) => {
      console.log(result);
    })
}

if(command.length == 5 && command[3] == '--stats' && command[4] == '--validate') {
  mdLinks(path, {stats: false})
    .then((result) => {
      console.log(result);
    })
}

