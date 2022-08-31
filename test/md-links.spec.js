const { mdLinks, existPath, isAbsolutePath, checkPath, extractMd, extensionPath, readDir, joinPathDir, extractLinks, readPath, validateLink, axios } = require('../index.js');

// axios = jest.fn(() => {get()});
// jest.mock('axios', () => jest.fn(() => {get()}))

describe('mdLinks', () => {

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
    expect(checkPath(path)).toBe('No existe la ruta.');
  });

  // belongs to 2

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

  // belongs to 3

  it('should return the content of the md file', () => {
    const path = '/Users/jannerybriceno/Documents/Laboratoria/Proyectos/Proyecto 4/LIM018-md-links/prueba.md';
    const text = "[Markdown](https://es.wikipedia.org/wiki/Markdown) es un lenguaje de marcado ligero muy popular entre developers. Es usado en muchísimas plataformas que manejan texto plano (GitHub, foros, blogs, ...) y es muy común encontrar varios archivos en ese formato en cualquier tipo de repositorio (empezando por el tradicional `README.md`). Dentro de una comunidad de código abierto, nos han propuesto crear una herramienta usando [Node.js](https://nodejs.org/), que lea y analice archivos en formato `Markdown`, para verificar los links que contengan y reportar algunas estadísticas."
    expect(readPath(path)).toBe(text);
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

  // belongs to 4

  it('should return an object with two extra keys: status and ok', () => {
    const linkObject = {
      href: 'https://es.wikipedia.org/wiki/Markdown',
      text: 'Markdown',
      file: '/Users/jannerybriceno/Documents/Laboratoria/Proyectos/Proyecto 4/LIM018-md-links/prueba.md'
    };

    const result = {
      "file": "/Users/jannerybriceno/Documents/Laboratoria/Proyectos/Proyecto 4/LIM018-md-links/prueba.md",
      "href": "https://es.wikipedia.org/wiki/Markdown",
      "ok": "OK",
      "status": 200,
      "text": "Markdown",
      };
    expect(validateLink(linkObject)).toBe(result);
  });

});
