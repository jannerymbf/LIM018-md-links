const { existsSync, readFileSync, link } = require('node:fs');
const { isAbsolute, resolve, extname } = require('node:path');
const MarkdownIt = require('markdown-it'), md = new MarkdownIt();
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const axios = require('axios');

const existPath = (path) => existsSync(path);
const isAbsolutePath = (path) => isAbsolute(path)?path:resolve(path);
const extensionPath = (path) => extname(path) === '.md';
const readPath = (path) => readFileSync(path, 'utf-8');

const checkPath = (path) => {
  if(existPath(path)){
    const absolutePath = isAbsolutePath(path);
    if(extensionPath(absolutePath)){
      return absolutePath;
    }
  } else {
    console.log('Error alerta');
  }
}

const extractLinks = (path) => {
  const regex = /\[([^\[]+)\](\(.*\))/gm;
  let foundLinks = readPath(checkPath(path)).match(regex);
  let linkArray = [];
  
  foundLinks.forEach(linkMd => {
    const result = md.render(linkMd); // result: string with HTML elements
    const frag = JSDOM.fragment(result); 

    const resultObject = {
      href: frag.querySelector('a').getAttribute('href'),
      text: frag.querySelector('a').textContent,
      file: path
    }

    // validateLink(frag.querySelector('a').getAttribute('href'));
    linkArray.push(resultObject);
  })

  return linkArray;
}

const validateLink = (link) => axios.get(link);

const mdLinks = (path, options) => {
  const linksPromise = new Promise((resolve, reject) => {
    const resolving = () => {
      if(options.validate == true) {
        extractLinks(path).forEach(e => {
          validateLink(e.href)
            .then(response => {
              let statusCode = response.status;
              let statusText = response.statusText;
              e.status = statusCode;
              e.ok = statusText;
              console.log(e);
            })
            .catch(error => {
              if (error.hasOwnProperty('errno')) {
                e.status = error.errno;
                e.ok = 'FAIL';
                console.log(e);
              } else if (error.hasOwnProperty('response')) {
                e.status = error.response.status;
                e.ok = 'FAIL';
                console.log(e);
              } else {
                e.status = 404;
                e.ok = 'FAIL';
                console.log(e);
              }
              
            });
        })
      } else { 
        console.log(extractLinks(path));
      }
    };
    resolve(resolving());
    // reject(console.log('Error error error')); // why was this in the result?
  })

  return linksPromise;
}

mdLinks('README.md', {validate: false})
  .then((result) => {
    // console.log(result);
  })
  // .catch((err) => {
  //   console.log(err);
  // })


//console.log(extractLinks('README.md'));

