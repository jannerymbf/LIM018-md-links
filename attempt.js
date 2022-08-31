const { existsSync, readFileSync, readdirSync, statSync } = require('node:fs');
const { isAbsolute, resolve, extname, join } = require('node:path');
const MarkdownIt = require('markdown-it'), md = new MarkdownIt();
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const axios = require('axios');

const existPath = (path) => existsSync(path);
const isAbsolutePath = (path) => isAbsolute(path)?path:resolve(path);
const extensionPath = (path) => extname(path) === '.md';
const readPath = (path) => readFileSync(path, 'utf-8');
const readDir = (path) => readdirSync(path); // only reads kinda absolute paths --> accepts ../path
const joinPathDir = (path1, path2) => join(path1, path2);

// ** momentary?
const checkDir = (path) => {
  if(existPath(path)){
    const absolutePath = isAbsolutePath(path);
    console.log(absolutePath);
    return absolutePath; 
  } else {
    console.log('Error alerta');
  }
}
// **

console.log(isAbsolutePath('prueba.md'));

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
  const regex = /\[([^\[]+)\](\(https:.*\))/gm; // *** add HTTP so  the titles don't appear in the response!!!!!!!
  let foundLinks = readPath(checkPath(path)).match(regex);
  let linkArray = [];
  
  foundLinks.forEach(linkMd => {
    const result = md.render(linkMd); // result: string with HTML elements
    const frag = JSDOM.fragment(result); 

    const resultObject = {
      href: frag.querySelector('a').getAttribute('href'),
      text: frag.querySelector('a').textContent,
      file: isAbsolutePath(path)
    }

    // validateLink(frag.querySelector('a').getAttribute('href'));
    linkArray.push(resultObject);
  })

  return linkArray;
}

let fileArray = [];
const workingWithDir = (pathDir) => {
  readDir(pathDir).forEach(e => {
    const path = joinPathDir(pathDir, e);
    if(statSync(path).isDirectory()){
      // workingWithDir(path);
      fileArray = [...workingWithDir(path)]; // adds what is found to same array, doesn't create array within array
    } else {
      if(extensionPath(path)){
        fileArray.push(path);
        // fileArray.push(extractLinks(path));
      };
    };
  })  
  return fileArray;                      
}
// console.log(statSync('coverage').isDirectory());
console.log(workingWithDir(checkDir('pruebita'))); // output from lim018-md-links: empty array... why???

// ******** we're close ---> create a new function that identifies if the path entered is a dir or a simple one, then do the rest

const validateLink = (link) => axios.get(link);

// ** primer intento

// const mdLinks = (path, options) => {
//   const linksPromise = new Promise((resolve, reject) => {
//     const resolving = () => {
//       if(options.validate == true) {
//         extractLinks(path).forEach(e => {
//           validateLink(e.href)
//             .then(response => {
//               let statusCode = response.status;
//               let statusText = response.statusText;
//               e.status = statusCode;
//               e.ok = statusText;
//               console.log(e);
//             })
//             .catch(error => {
//               if (error.hasOwnProperty('errno')) {
//                 e.status = error.errno;
//                 e.ok = 'FAIL';
//                 console.log(e);
//               } else if (error.hasOwnProperty('response')) {
//                 e.status = error.response.status;
//                 e.ok = 'FAIL';
//                 console.log(e);
//               } else {
//                 e.status = 404;
//                 e.ok = 'FAIL';
//                 console.log(e);
//               }
              
//             });
//         })
//       } else { 
//         console.log(extractLinks(path));
//       }
//     };
//     resolve(resolving());
//     // reject(console.log('Error error error')); // why was this in the result?
//   })

//   return linksPromise;
// }

// ** hasta acá

const mdLinks = (path, options) => {
  return new Promise((resolve, reject) => {
    if(options.validate == true) {
      const mdElements = extractLinks(path)
      const promiseArr = mdElements.map(e => validateLink(e.href))

      Promise.all(promiseArr).then(values => {
        /*
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
         */

        resolve(values)
      })
    };
  })
}

mdLinks('pruebita/otraprueba.md', {validate: true}) // what if the user just types 'otraprueba.md'?
  .then((result) => {
    console.log(result); // undefined
  })
  .catch((err) => {
    console.log(err);
  })


//console.log(extractLinks('README.md'));

