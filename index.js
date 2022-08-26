const { existsSync, readFileSync, readdirSync, statSync } = require('node:fs');
const { isAbsolute, resolve, extname, join } = require('node:path');
const MarkdownIt = require('markdown-it'), md = new MarkdownIt();
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const axios = require('axios');
const { link } = require('node:fs/promises');

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

//Obtener nuevo array con objetos con status y ok

const obtainingArray = async (path) => {
  const links = extractLinks(extractMd(path));
  const promisesArray = links.map(linkObject => validateLink(linkObject));
  const values = await Promise.all(promisesArray);
  return values; 
}

// Obtener estadísticas

const stats = (links) => {
  let statsObject = {};
  // TOTAL
  statsObject.total = links.length;
  // UNIQUE
  let justLinks = links.map(obj => obj.href);
  const linksArray = new Set(justLinks);
  let result = [...linksArray]
  statsObject.unique = result.length;
  // BROKEN
  const brokenLinks = links.filter(link => link.ok === 'FAIL');
  statsObject.broken = brokenLinks.length;

  return statsObject;
}


// 5. Crear función md links que retornará una promesa


const mdLinks = (path, options) => {
  return new Promise ((resolve, reject) => {
    if(options.validate) {
      // const links = extractLinks(extractMd(path));
      // const promisesArray = links.map(linkObject => validateLink(linkObject));
      // Promise.all(promisesArray)
      //   .then(values => {
      //     resolve(statistics(values));
      //   });
      resolve(obtainingArray(path));
    } else if(options.validate === false){
      resolve(extractLinks(extractMd(path)))
    } else if(options.stats) {
      obtainingArray(path)
        .then(values => resolve(stats(values))); // utilicé then para capturar los valores retornados de la funcion asincrona obtainingArray
    }
  })
}

mdLinks('prueba.md', {stats: true}) 
  .then((result) => {
    console.log(result);
  })
  .catch((err) => {
    console.log(err);
  })