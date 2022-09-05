const { mdLinks, existPath, isAbsolutePath, checkPath, extractMd, extensionPath, readDir, joinPathDir, extractLinks, readPath, validateLink, axios, obtainingArray, stats1, stats2 } = require('../index.js');

// axios = jest.fn(() => {get()});
// jest.mock('axios', () => jest.fn(() => {get()}))
jest.mock('axios');

describe('checkPath', () => {

  it('should be a function', () => {
    expect(typeof mdLinks).toBe('function');
  });

  // belongs to 1

  it('should check if path exists', () => {
    const path = 'prueba.md';
    expect(existPath(path)).toBe(true);
  });

  it('should check if path does not exist', () => {
    const path = 'pruebaa.md';
    expect(existPath(path)).toBe(false);
  });

  it('should return an absolute path', () => {
    const path = 'prueba.md';
    const absolutePath = '/Users/jannerybriceno/Documents/Laboratoria/Proyectos/Proyecto 4/LIM018-md-links/prueba.md'
    expect(isAbsolutePath(path)).toBe(absolutePath);
  });

  it('should return the absolute path of the input given', () => {
    const path = 'prueba.md';
    const absolutePath = '/Users/jannerybriceno/Documents/Laboratoria/Proyectos/Proyecto 4/LIM018-md-links/prueba.md'
    expect(checkPath(path)).toBe(absolutePath);
  });

  it('should return "No existe la ruta."', () => {
    const path = 'pruebaaa.md';
    expect(checkPath(path)).toBe('No such file or directory');
  });

});

  // belongs to 2
describe('extractMd', () => {

  it('should check if path is an md', () => {
    const path = 'prueba.md';
    expect(extensionPath(path)).toBe(true);
  });

  it('should return an array with the path', () => {
    const path = checkPath('prueba.md');
    expect(extractMd(path)).toContain('/Users/jannerybriceno/Documents/Laboratoria/Proyectos/Proyecto 4/LIM018-md-links/prueba.md');
  });

  it('should return an array with all files within', () => {
    const path = checkPath('./pruebita');
    expect(readDir(path)).toContain('otraprueba.md')
  })

  it('should join the dir path and the file path', () => {
    const path1 = checkPath('./pruebita');
    const path2 = 'otraprueba.md';
    const result = '/Users/jannerybriceno/Documents/Laboratoria/Proyectos/Proyecto 4/LIM018-md-links/pruebita/otraprueba.md';
    expect(joinPathDir(path1, path2)).toBe(result)
  })

  it('should return an array with all the paths from the dir', () => {
    const path = checkPath('./pruebita');
    const result = '/Users/jannerybriceno/Documents/Laboratoria/Proyectos/Proyecto 4/LIM018-md-links/pruebita/otraprueba.md';
    expect(extractMd(path)).toContain(result);
  });
});

  // belongs to 3
describe('extractLinks', () => {

  it('should return the content of the md file', () => {
    const path = '/Users/jannerybriceno/Documents/Laboratoria/Proyectos/Proyecto 4/LIM018-md-links/prueba.md';
    const text = "[Markdown](https://es.wikipedia.org/wiki/Markdown) es un lenguaje de marcado ligero muy popular entre developers. Es usado en muchísimas plataformas que manejan texto plano (GitHub, foros, blogs, ...) y es muy común encontrar varios archivos en ese formato en cualquier tipo de repositorio (empezando por el tradicional `README.md`)."
    expect(readPath(path)).toBe(text);
  })

  it('should return 50-character text', () => {
    const mdFiles = ['/Users/jannerybriceno/Documents/Laboratoria/Proyectos/Proyecto 4/LIM018-md-links/prueba2.md'];
    const result = {
      href: 'https://es.wikipedia.org/wiki/Markdown',
      text: 'hellohellohellohellohellohellohellohellohellohello',
      file: '/Users/jannerybriceno/Documents/Laboratoria/Proyectos/Proyecto 4/LIM018-md-links/prueba2.md'
    };
    expect(extractLinks(mdFiles)).toContainEqual(result);
  })

  it('should return an array with objects href, text, file', () => {
    const mdFiles = ['/Users/jannerybriceno/Documents/Laboratoria/Proyectos/Proyecto 4/LIM018-md-links/prueba.md'];
    const result = {
      href: 'https://es.wikipedia.org/wiki/Markdown',
      text: 'Markdown',
      file: '/Users/jannerybriceno/Documents/Laboratoria/Proyectos/Proyecto 4/LIM018-md-links/prueba.md'
    };
    expect(extractLinks(mdFiles)).toContainEqual(result);
  });
});

  // belongs to 4
describe('validate and stats', () => {
  it('should return an object with status and ok', () => {
    axios.get.mockImplementation(() => Promise.resolve({status: 200, statusText: 'OK'}))
    return validateLink({
      href: 'https://es.wikipedia.org/wiki/Markdown',
      text: 'Markdown',
      file: '/Users/jannerybriceno/Documents/Laboratoria/Proyectos/Proyecto 4/LIM018-md-links/prueba.md'}).then(response => {expect(response).toEqual({
        href: 'https://es.wikipedia.org/wiki/Markdown',
        text: 'Markdown',
        file: '/Users/jannerybriceno/Documents/Laboratoria/Proyectos/Proyecto 4/LIM018-md-links/prueba.md',
        status: 200,
        ok: 'OK'
      })})
  })

  it('should return an object with status 404 and fail', () => {
    axios.get.mockImplementation(() => Promise.reject({}))
    return validateLink({
      href: 'https://es.wikipedi.org/wiki/Markdown',
      text: 'Markdown',
      file: '/Users/jannerybriceno/Documents/Laboratoria/Proyectos/Proyecto 4/LIM018-md-links/prueba.md'}).catch(response => {expect(response).toEqual({
        href: 'https://es.wikipedi.org/wiki/Markdown',
        text: 'Markdown',
        file: '/Users/jannerybriceno/Documents/Laboratoria/Proyectos/Proyecto 4/LIM018-md-links/prueba.md',
        status: 404,
        ok: 'FAIL'
      })})
  })

  it('should return an array with links validated', async() => {
    axios.get.mockImplementation(() => Promise.resolve({status: 200, statusText: 'OK'}))
    const path = '/Users/jannerybriceno/Documents/Laboratoria/Proyectos/Proyecto 4/LIM018-md-links/prueba.md';
    const data = await(obtainingArray(path));
    expect(data).toContainEqual({
      href: 'https://es.wikipedia.org/wiki/Markdown',
      text: 'Markdown',
      file: '/Users/jannerybriceno/Documents/Laboratoria/Proyectos/Proyecto 4/LIM018-md-links/prueba.md',
      status: 200,
      ok: 'OK'
    })
  })

  it('should return an object with total and unique', () => {
    const links = [{
      href: 'https://es.wikipedia.org/wiki/Markdown',
      text: 'Markdown',
      file: '/Users/jannerybriceno/Documents/Laboratoria/Proyectos/Proyecto 4/LIM018-md-links/prueba.md',
      status: 200,
      ok: 'OK'
    }];

    expect(stats1(links)).toEqual({total: 1, unique: 1});
  })

  it('should return an object with broken', () => {
    const links = [{
      href: 'https://es.wikipedia.org/wiki/Markdown',
      text: 'Markdown',
      file: '/Users/jannerybriceno/Documents/Laboratoria/Proyectos/Proyecto 4/LIM018-md-links/prueba.md',
      status: 200,
      ok: 'OK'
    }];

    expect(stats2(links)).toEqual({broken: 0});
  })
});

  // belongs to 5
describe('mdLinks', () => {
  it('should return path --validate', () => {
    axios.get.mockImplementation(() => Promise.resolve({status: 200, statusText: 'OK'}))
    return expect(mdLinks('prueba.md', {validate: true})).resolves.toContainEqual({
      href: 'https://es.wikipedia.org/wiki/Markdown',
      text: 'Markdown',
      file: '/Users/jannerybriceno/Documents/Laboratoria/Proyectos/Proyecto 4/LIM018-md-links/prueba.md',
      status: 200,
      ok: 'OK'})
  })

  it('should return just path ', () => {
    return expect(mdLinks('prueba.md', {validate: false})).resolves.toContainEqual({
      href: 'https://es.wikipedia.org/wiki/Markdown',
      text: 'Markdown',
      file: '/Users/jannerybriceno/Documents/Laboratoria/Proyectos/Proyecto 4/LIM018-md-links/prueba.md'})
  })

  it('should return path --stats', () => {
    axios.get.mockImplementation(() => Promise.resolve({status: 200, statusText: 'OK'}))
    const path = '/Users/jannerybriceno/Documents/Laboratoria/Proyectos/Proyecto 4/LIM018-md-links/prueba.md';
    return expect(mdLinks(path, {stats: true})).resolves.toEqual({total: 1, unique: 1})
  })
});

//duda: por qué si solo ingreso una ruta, recorre todos los archivos md? tiene que ver con los mocks?
