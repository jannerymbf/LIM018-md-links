# Markdown Links

## :one: Descripción del package

Es una línea de comando (CLI) que te permitirá identificar todos los links en los
archivos  con extensión .md encontrados a partir de una ruta dada.

## :two: Instalación

Podrás instalar el paquete mediante: npm i @jannerybf/md-links

## :three: Consideraciones generales para utilizar el paquete

* Instalar la librería con el comando proporcionado en el punto 2.

* Si quieres obtener el listado de links con el texto encontrado y la ruta, ingresa:
  md-links path

* Si quieres obtener el listado de links con el texto encontrado, la ruta y si se encuentra
  funcionando o no, ingresa:
  md-links path --validate

* Si quieres obtener el número total de links encontrados y aquellos que son únicos, ingresa:
  md-links path --stats

* Si quieres obtener el número total de links encontrados, aquellos que son únicos y cuáles
  están rotos, ingresa:
  md-links path --stats --validate

* Si quieres recibir orientación, ingresa:
  md-links --help
