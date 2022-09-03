#!/usr/bin/env node

const { mdLinks } = require('./index.js');
const process = require('node:process');
const chalk = require('chalk');

const path = process.argv[2];
const command = process.argv;

if(command.length == 3) {
  mdLinks(path, {validate: false})
    .then((result) => {
      console.log(result);
    })
    .catch(err => console.log(err))
}

if(command.length == 4 && command[3] == '--validate') {
  mdLinks(path, {validate: true})
    .then((result) => {
      console.log(result);
    })
    .catch(err => console.log(err))
}

if(command.length == 4 && command[3] == '--stats') {
  mdLinks(path, {stats: true})
    .then((result) => {
      console.log(`
         ${chalk.bgGreen('*** TOTAL ***')}
               ${result.total}
    
         ${chalk.bgCyanBright('*** UNIQUE ***')}
               ${result.unique}
       `);
    })
    .catch(err => console.log(err))
}

if(command.length == 5 && command[3] == '--stats' && command[4] == '--validate') {
  mdLinks(path, {stats: false})
    .then((result) => {
      console.log(`
      ${chalk.bgGreen('*** TOTAL ***')}
            ${result.total}
 
      ${chalk.bgCyanBright('*** UNIQUE ***')}
            ${result.unique}

      ${chalk.bgRed('*** BROKEN ***')}
            ${result.broken}
    `);
    })
    .catch(err => console.log(err))
}

if(command.length == 2) {
  console.log(`Need help? Run ${chalk.bgGreen('--help')} for details`);
}

if(command.length == 3 && command[2] == '--help') {
  console.log(`
    ${chalk.green(`
          Need help? There you go:

                        Input                        ║                          Output                             
          ║══════════════════════════════════════════║═════════════════════════════════════════════════════════════════║
            md-links  path                           ║  md-links with their path and text            
          ║══════════════════════════════════════════║═════════════════════════════════════════════════════════════════║
            md-links  path  --validate               ║  md-links with their path, text, status, and err no                            
          ║══════════════════════════════════════════║═════════════════════════════════════════════════════════════════║
            md-links  path  --stats                  ║  how many links are total and unique                                
          ║══════════════════════════════════════════║═════════════════════════════════════════════════════════════════║
            md-links  path  --stats --validate       ║  how many links are total, unique and broken                  
          ║══════════════════════════════════════════║═════════════════════════════════════════════════════════════════║
    `)}  
  `)
}

