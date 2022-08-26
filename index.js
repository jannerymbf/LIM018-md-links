const { existsSync, readFileSync, readdirSync, statSync } = require('node:fs');
const { isAbsolute, resolve, extname, join } = require('node:path');
const MarkdownIt = require('markdown-it'), md = new MarkdownIt();
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const axios = require('axios');
const { Console } = require('node:console');

const existPath = (path) => existsSync(path);
const isAbsolutePath = (path) => isAbsolute(path)?path:resolve(path);
const extensionPath = (path) => extname(path) === '.md';
const readPath = (path) => readFileSync(path, 'utf-8');
const readDir = (path) => readdirSync(path); // only reads kinda absolute paths --> accepts ../path
const joinPathDir = (path1, path2) => join(path1, path2);

// 1. Chequear si existe path y convertirlo en ruta absoluta ya sea directorio o archivo

const checkPath = (path) => {
  if(existPath(path)){
    return isAbsolutePath(path);
  }else{
    console.log('No existe la ruta.');
  }
}

// 2. Es un directorio o un archivo? Comprobar y extraer archivos md

let mdArray = [];
const extractMd = (path) => {
  const checkedPath = checkPath(path);
  if(extensionPath(checkedPath)) {
    mdArray.push(checkedPath);
  } else if(statSync(checkedPath).isDirectory()) {
    readDir(checkedPath).forEach(file => {
      const joinedPath = joinPathDir(checkedPath, file);
      // console.log(joinedPath);
      mdArray = [...extractMd(joinedPath)]; 
    })
  } // else {
  //   console.log('No es un archivo md, ni un directorio');
  // }
  return mdArray;
}

// 3. Extraer links de los archivos md

const extractLinks = (mdFiles) => {
  const regex = /\[([^\[]+)\](\(https:.*\))/gm;
  let linksArray = [];

  mdFiles.forEach(mdFile => {
    let foundLinks = readPath(mdFile).match(regex);

    foundLinks.forEach(linkMd => {
      const result = md.render(linkMd); // result: string with HTML elements
      const frag = JSDOM.fragment(result); 
  
      const resultObject = {
        href: frag.querySelector('a').getAttribute('href'),
        text: frag.querySelector('a').textContent,
        file: mdFile
      }
  
      linksArray.push(resultObject);
    })
  })
  return linksArray;
}

// 4. Validar los links

const validateLink = (linkObject) => {
  return axios.get(linkObject.href)
    .then((response) => {
      let statusCode = response.status;
      let statusText = response.statusText;
      linkObject.status = statusCode;
      linkObject.ok = statusText;
      return linkObject;
    })
    .catch((error) => {
      linkObject.status = 404;
      linkObject.ok = 'FAIL';
      return linkObject;
      // return {status: 404, ok: 'FAIL'};
    })
}

// 5. Crear función md links que retornará una promesa

const mdLinks = (path, options) => {
  return new Promise ((resolve, reject) => {
    if(options.validate) {
      const links = extractLinks(extractMd(path));
      const promisesArray = links.map(linkObject => validateLink(linkObject));

      Promise.all(promisesArray)
        .then(values => resolve(values));
    } else {
      resolve(extractLinks(extractMd(path)))
    }
  })
}

mdLinks('pruebita', {validate: true}) // what if the user just types 'otraprueba.md'?
  .then((result) => {
    console.log(result); // undefined
  })
  .catch((err) => {
    console.log(err);
  })